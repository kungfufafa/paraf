import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { listContacts, listTemplates, saveDocument } from "@/lib/api";
import { blankContent, contentFromImportedFile, recipientSigningLink } from "@/lib/doc-helpers";
import { importCloudFile, listCloudFiles } from "@/lib/integrations-api";
import { DEFAULT_SETTINGS, DOC_TYPE_LABEL, type DocContent, type DocField, type DocSettings } from "@/lib/types";
import { uid } from "@/lib/utils";

const STEPS = ["Naskah", "Penerima", "Kolom", "Kirim"];

type RecDraft = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "signer" | "cc" | "approver" | "witness";
  orderIndex: number;
  companyName: string;
};

export function SendWizard({
  companyName,
  userName,
  userEmail,
  folders,
  intent,
  templateId,
  toEmail,
  toName,
}: {
  companyName: string;
  userName: string;
  userEmail: string;
  folders: { id: string; name: string }[];
  intent?: "emeterai";
  templateId?: string;
  toEmail?: string;
  toName?: string;
}) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const templates = useQuery({ queryKey: ["templates"], queryFn: () => listTemplates() });
  const contactPack = useQuery({ queryKey: ["contacts"], queryFn: () => listContacts() });
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(intent === "emeterai" ? "Permohonan e-Meterai" : "Perjanjian Kerja Sama");
  const [docType, setDocType] = useState("kerjasama");
  const [compliance, setCompliance] = useState<"psre" | "globalsign">("psre");
  const [folderId, setFolderId] = useState<string | null>(folders[0]?.id ?? null);
  const [groupName, setGroupName] = useState("");
  const [content, setContent] = useState<DocContent>(() => blankContent("kerjasama", "Perjanjian Kerja Sama", companyName));
  const [settings, setSettings] = useState<DocSettings>({
    ...DEFAULT_SETTINGS,
    emeteraiBy: intent === "emeterai" ? "maker" : "none",
  });
  const [recipients, setRecipients] = useState<RecDraft[]>(() => [
    {
      id: uid("rc"),
      name: userName,
      email: userEmail,
      phone: "",
      role: "signer",
      orderIndex: 1,
      companyName,
    },
    {
      id: uid("rc"),
      name: toName || "Pihak Kedua",
      email: toEmail || "",
      phone: "",
      role: "signer",
      orderIndex: 2,
      companyName: "",
    },
  ]);
  const [fields, setFields] = useState<DocField[]>([]);
  const [deadline, setDeadline] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [sent, setSent] = useState<{
    id: string;
    token: string;
    invites?: { id: string; name: string; email: string; token: string }[];
  } | null>(null);
  const [importedName, setImportedName] = useState("");
  const [cloudOpen, setCloudOpen] = useState(false);
  const [cloudSource, setCloudSource] = useState<"gdrive" | "onedrive">("gdrive");
  const [cloudFiles, setCloudFiles] = useState<{ id: string; name: string }[]>([]);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudErr, setCloudErr] = useState("");
  const [cloudQ, setCloudQ] = useState("");

  useEffect(() => {
    const tpl = templates.data?.find((t) => t.id === templateId);
    if (!tpl) return;
    setTitle(tpl.name);
    setDocType(tpl.docType);
    setContent(tpl.content);
    setFields(tpl.fields);
    if (tpl.compliance === "globalsign" || tpl.compliance === "psre") setCompliance(tpl.compliance);
  }, [templateId, templates.data]);

  function addRecipient() {
    setRecipients((rs) => [
      ...rs,
      {
        id: uid("rc"),
        name: "",
        email: "",
        phone: "",
        role: "signer",
        orderIndex: rs.length + 1,
        companyName: "",
      },
    ]);
  }

  function placeDefaultFields() {
    const signers = recipients.filter((r) => r.role !== "cc");
    setFields(
      signers.flatMap((r, i) => [
        {
          id: uid("f"),
          type: "signature" as const,
          page: 0,
          x: 12 + i * 40,
          y: 78,
          w: 32,
          h: 12,
          recipientId: r.id,
          required: true,
        },
        {
          id: uid("f"),
          type: "date" as const,
          page: 0,
          x: 12 + i * 40,
          y: 91,
          w: 24,
          h: 6,
          recipientId: r.id,
          required: false,
        },
      ]),
    );
  }

  async function applyImported(name: string, text: string) {
    const pack = contentFromImportedFile(name, text, companyName);
    setTitle(name.replace(/\.[^.]+$/, ""));
    setDocType("other");
    setContent(pack);
    setImportedName(name);
    toast.success(`Naskah disiapkan dari ${name}`);
  }

  async function openCloud(source: "gdrive" | "onedrive") {
    setCloudSource(source);
    setCloudOpen(true);
    setCloudBusy(true);
    setCloudErr("");
    try {
      const res = (await listCloudFiles({ data: { source, q: cloudQ || "pdf" } })) as {
        files?: { id: string; name: string }[];
        error?: string;
        loginRequired?: boolean;
        loginUrl?: string;
      };
      if (res.loginRequired && res.loginUrl) {
        window.open(res.loginUrl, "_blank", "noopener");
        setCloudErr("Sign in to Google Drive in the new tab, then search again.");
      }
      setCloudFiles(res.files ?? []);
      if (res.error) setCloudErr(res.error);
    } catch (e) {
      setCloudErr(e instanceof Error ? e.message : "Cloud search failed");
    } finally {
      setCloudBusy(false);
    }
  }

  async function pickCloud(file: { id: string; name: string }) {
    setCloudBusy(true);
    try {
      const res = (await importCloudFile({ data: { source: cloudSource, id: file.id, name: file.name } })) as {
        ok: boolean;
        name?: string;
        content?: DocContent;
        preview?: string;
        loginRequired?: boolean;
        loginUrl?: string;
      };
      if (!res.ok || !res.content || !res.name) {
        if (res.loginRequired && res.loginUrl) {
          window.open(res.loginUrl, "_blank", "noopener");
        }
        toast.error(res.preview || "Import failed");
        return;
      }
      setTitle(res.name.replace(/\.[^.]+$/, ""));
      setDocType("other");
      setContent(res.content);
      setImportedName(res.name);
      setCloudOpen(false);
      toast.success(res.preview || `Imported ${res.name}`);
    } finally {
      setCloudBusy(false);
    }
  }

  async function submit(send: boolean) {
    const ready = recipients.filter((r) => r.name.trim() && r.email.trim());
    if (!title.trim() || ready.length < 1) {
      toast.error("Judul dan minimal satu penerima wajib diisi");
      return;
    }
    setBusy(true);
    try {
      const placed = fields.length ? fields : signersFields(ready);
      const res = await saveDocument({
        data: {
          title,
          docType,
          compliance,
          groupName,
          folderId,
          content,
          fields: placed,
          settings,
          recipients: ready.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            role: r.role,
            action: r.role === "cc" ? "receives_copy" : "needs_to_sign",
            orderIndex: r.orderIndex,
            companyName: r.companyName,
          })),
          deadline: deadline || null,
          effectiveDate: effectiveDate || null,
          expiresAt: expiresAt || null,
          send,
        },
      });
      toast.success(send ? "Dokumen dikirim" : "Draf disimpan");
      void qc.invalidateQueries();
      if (send) {
        setSent({ id: res.id, token: res.token, invites: res.invites });
        return;
      }
      nav({ to: "/documents/$id", params: { id: res.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  }

  const contacts = contactPack.data?.contacts ?? [];
  const makerSigns = recipients.some((r) => r.email.toLowerCase() === userEmail.toLowerCase() && r.role !== "cc");

  if (sent) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-success text-xl font-bold text-white">✓</div>
        <h2 className="mt-4 text-xl font-semibold">Dokumen terkirim</h2>
        <p className="mt-2 text-sm text-muted">
          Setiap pihak mendapat tautan unik. Tanpa akun — buka, setuju, paraf.
          {makerSigns ? " Anda masih perlu menandatangani." : ""}
        </p>
        <ul className="mt-6 w-full space-y-2 text-left">
          {(sent.invites ?? []).map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{inv.name}</p>
                <p className="truncate text-xs text-muted">{inv.email}</p>
              </div>
              <div className="flex shrink-0 gap-1">
              <Button
                size="sm"
                variant="outline"
                asChild
              >
                <a href={recipientSigningLink(inv.token, sent.token)} target="_blank" rel="noreferrer">
                  Buka tautan
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const href = recipientSigningLink(inv.token, sent.token);
                  try {
                    await navigator.clipboard.writeText(href);
                    toast.success("Tautan disalin");
                  } catch {
                    toast.message(href);
                  }
                }}
              >
                Salin tautan
              </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {makerSigns ? (
            <Button onClick={() => nav({ to: "/documents/$id/sign", params: { id: sent.id } })}>Tandatangani sekarang</Button>
          ) : null}
          <Button variant="outline" onClick={() => nav({ to: "/esignature/$folder", params: { folder: "all-inbox" } })}>
            Ke kotak masuk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <ol className="mb-6 flex flex-wrap gap-1">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`min-h-9 rounded-full px-3 text-xs font-medium ${i === step ? "bg-navy text-white" : "bg-surface-2 text-muted"}`}
            >
              {i + 1}. {s}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Judul
            <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="text-sm">
            Jenis
            <select
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
              value={docType}
              onChange={(e) => {
                setDocType(e.target.value);
                setContent(blankContent(e.target.value, title, companyName));
              }}
            >
              {Object.entries(DOC_TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Folder
            <select
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
              value={folderId ?? ""}
              onChange={(e) => setFolderId(e.target.value || null)}
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Sertifikasi
            <select
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
              value={compliance}
              onChange={(e) => setCompliance(e.target.value as "psre" | "globalsign")}
            >
              <option value="psre">PSrE Indonesia</option>
              <option value="globalsign">GlobalSign</option>
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            Perihal
            <Input
              className="mt-1"
              value={content.subject ?? ""}
              onChange={(e) => setContent({ ...content, subject: e.target.value })}
            />
          </label>
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center text-sm text-muted md:col-span-2">
            Unggah PDF / Word / teks — isi jadi naskah
            {importedName ? <span className="mt-1 text-xs font-medium text-brand">{importedName}</span> : null}
            <input
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx,.html,.csv"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const text = await f.text();
                await applyImported(f.name, text);
              }}
            />
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button type="button" size="sm" variant="outline" onClick={() => void openCloud("gdrive")}>
              Google Drive
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => void openCloud("onedrive")}>
              OneDrive
            </Button>
            <span className="self-center text-xs text-muted">Plug-and-play — sign in or paste a token in Settings.</span>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-3">
          {recipients.map((r, i) => (
            <div key={r.id} className="grid gap-2 rounded-lg border border-border bg-surface p-3 md:grid-cols-12">
              <Input className="md:col-span-3" placeholder="Nama" value={r.name} onChange={(e) => setRecipients(patch(recipients, i, { name: e.target.value }))} />
              <Input className="md:col-span-3" placeholder="Email" value={r.email} onChange={(e) => setRecipients(patch(recipients, i, { email: e.target.value }))} />
              <Input className="md:col-span-2" placeholder="Perusahaan" value={r.companyName} onChange={(e) => setRecipients(patch(recipients, i, { companyName: e.target.value }))} />
              <select
                className="h-11 rounded-md border border-border bg-surface px-2 text-sm md:col-span-2"
                value={r.role}
                onChange={(e) => setRecipients(patch(recipients, i, { role: e.target.value as RecDraft["role"] }))}
              >
                <option value="signer">Penandatangan</option>
                <option value="approver">Approver</option>
                <option value="witness">Saksi</option>
                <option value="cc">CC</option>
              </select>
              <Button type="button" variant="ghost" className="md:col-span-2" onClick={() => setRecipients(recipients.filter((_, j) => j !== i))}>
                Hapus
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={addRecipient}>
              Tambah pihak
            </Button>
            {contacts.slice(0, 6).map((c) => (
              <Button
                key={c.id}
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setRecipients((rs) => [
                    ...rs,
                    { id: uid("rc"), name: c.name, email: c.email, phone: c.phone, role: "signer", orderIndex: rs.length + 1, companyName: c.company },
                  ])
                }
              >
                + {c.name}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.sequential}
              onChange={(e) => setSettings({ ...settings, sequential: e.target.checked })}
            />
            Tanda tangan berurutan
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">Kolom paraf diletakkan otomatis per penandatangan. Bisa diubah nanti di editor.</p>
          <Button type="button" variant="outline" onClick={placeDefaultFields}>
            Letakkan kolom paraf
          </Button>
          <p className="text-xs text-muted">{fields.length} kolom siap.</p>
          <label className="flex items-center gap-2 text-sm">
            e-Meterai
            <select
              className="h-11 rounded-md border border-border bg-surface px-2 text-sm"
              value={settings.emeteraiBy}
              onChange={(e) => setSettings({ ...settings, emeteraiBy: e.target.value as DocSettings["emeteraiBy"] })}
            >
              <option value="none">Tidak</option>
              <option value="maker">Pengirim</option>
              <option value="signer">Penandatangan</option>
            </select>
          </label>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Tenggat
            <Input type="date" className="mt-1" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </label>
          <label className="text-sm">
            Berlaku mulai
            <Input type="date" className="mt-1" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
          </label>
          <label className="text-sm md:col-span-2">
            Pesan undangan
            <Input className="mt-1" value={settings.message} onChange={(e) => setSettings({ ...settings, message: e.target.value })} />
          </label>
          <p className="text-sm text-muted md:col-span-2">
            {recipients.filter((r) => r.email).length} tautan unik akan dibuat — plug and play, pihak lain tidak perlu daftar.
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-between gap-2">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Kembali
        </Button>
        <div className="flex gap-2">
          {step < 3 ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)}>
              Lanjut
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" disabled={busy} onClick={() => void submit(false)}>
                Simpan draf
              </Button>
              <Button type="button" disabled={busy} onClick={() => void submit(true)}>
                Kirim undangan
              </Button>
            </>
          )}
        </div>
      </div>
      <Dialog open={cloudOpen} onOpenChange={setCloudOpen}>
        <DialogContent title={cloudSource === "gdrive" ? "Google Drive" : "OneDrive"}>
          <div className="flex gap-2">
            <Input
              placeholder="Search files"
              value={cloudQ}
              onChange={(e) => setCloudQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void openCloud(cloudSource);
              }}
            />
            <Button size="sm" disabled={cloudBusy} onClick={() => void openCloud(cloudSource)}>
              Search
            </Button>
          </div>
          {cloudErr ? <p className="mt-2 text-sm text-danger">{cloudErr}</p> : null}
          <ul className="mt-3 max-h-64 space-y-1 overflow-auto text-sm">
            {cloudBusy && !cloudFiles.length ? <li className="text-muted">Mencari…</li> : null}
            {!cloudBusy && !cloudFiles.length ? <li className="text-muted">No files yet. Search, or connect in Settings.</li> : null}
            {cloudFiles.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className="w-full rounded-md px-2 py-1.5 text-left hover:bg-surface-2"
                  disabled={cloudBusy}
                  onClick={() => void pickCloud(f)}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function patch(list: RecDraft[], i: number, p: Partial<RecDraft>) {
  return list.map((r, j) => (j === i ? { ...r, ...p } : r));
}

function signersFields(ready: RecDraft[]): DocField[] {
  return ready
    .filter((r) => r.role !== "cc")
    .flatMap((r, i) => [
      {
        id: uid("f"),
        type: "signature" as const,
        page: 0,
        x: 12 + (i % 2) * 44,
        y: 78,
        w: 32,
        h: 12,
        recipientId: r.id,
        required: true,
      },
    ]);
}
