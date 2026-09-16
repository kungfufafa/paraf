import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, useBoot } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listTemplates, saveDocument } from "@/lib/api";
import { blankContent, contentFromImportedFile } from "@/lib/doc-helpers";
import { DOC_TYPE_LABEL, DEFAULT_SETTINGS, type DocContent } from "@/lib/types";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/_app/bulk")({
  validateSearch: (s: Record<string, unknown>): { template?: string } => ({
    template: typeof s.template === "string" ? s.template : undefined,
  }),
  component: BulkPage,
});

function BulkPage() {
  const boot = useBoot();
  const nav = useNavigate();
  const search = Route.useSearch();
  const templates = useQuery({ queryKey: ["templates"], queryFn: () => listTemplates() });
  const tpl = useMemo(
    () => templates.data?.find((t) => t.id === search.template),
    [templates.data, search.template],
  );
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [merge, setMerge] = useState<"separate" | "merge">("separate");
  const [compliance, setCompliance] = useState<"psre" | "globalsign">("psre");
  const [csv, setCsv] = useState("");

  function parseRecipients() {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const out: { name: string; email: string }[] = [];
    for (const line of lines) {
      const [a, b] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      if (b && b.includes("@")) out.push({ name: a || b.split("@")[0]!, email: b });
      else if (a && a.includes("@")) out.push({ name: a.split("@")[0]!, email: a });
    }
    return out;
  }

  async function contentOf(f: File): Promise<DocContent> {
    const text = await f.text();
    return contentFromImportedFile(f.name, text, boot.company.name);
  }

  async function createAll() {
    const recs = parseRecipients();
    if (!files.length && !tpl) return;
    setBusy(true);
    try {
      if (tpl && recs.length) {
        let n = 0;
        for (const r of recs) {
          const recId = uid("rc");
          await saveDocument({
            data: {
              title: `${tpl.name} · ${r.name}`,
              docType: tpl.docType,
              compliance: (tpl.compliance as "psre" | "globalsign") || compliance,
              groupName: "Massal",
              folderId: boot.folders[0]?.id ?? null,
              content: tpl.content,
              fields: tpl.fields.length
                ? tpl.fields.map((f) => ({ ...f, id: uid("f"), recipientId: recId, value: undefined }))
                : [
                    {
                      id: uid("f"),
                      type: "signature",
                      page: 0,
                      x: 14,
                      y: 72,
                      w: 28,
                      h: 10,
                      recipientId: recId,
                      required: true,
                    },
                  ],
              settings: DEFAULT_SETTINGS,
              recipients: [{ id: recId, name: r.name, email: r.email, role: "signer", companyName: "", orderIndex: 1 }],
              send: true,
            },
          });
          n += 1;
        }
        toast.success(`${n} undangan dikirim dari template`);
        nav({ to: "/esignature/$folder", params: { folder: "sent" } });
        return;
      }

      if (merge === "merge" && files.length) {
        const recId = uid("rc");
        const contents = await Promise.all(files.map((f) => contentOf(f)));
        const merged: DocContent = {
          ...contents[0]!,
          subject: files.map((f) => f.name.replace(/\.[^.]+$/, "")).join(" + "),
          clauses: contents.flatMap((c) => c.clauses),
        };
        await saveDocument({
          data: {
            title: merged.subject || "Gabungan massal",
            docType: "other",
            compliance,
            groupName: "Massal",
            folderId: boot.folders[0]?.id ?? null,
            content: merged,
            fields: [
              {
                id: uid("f"),
                type: "signature",
                page: 0,
                x: 14,
                y: 72,
                w: 28,
                h: 10,
                recipientId: recId,
                required: true,
              },
            ],
            settings: DEFAULT_SETTINGS,
            recipients: [
              {
                id: recId,
                name: recs[0]?.name || boot.user.name,
                email: recs[0]?.email || boot.user.email,
                role: "signer",
                companyName: boot.company.name,
                orderIndex: 1,
              },
            ],
            send: false,
          },
        });
        toast.success("1 draf gabungan dibuat");
        nav({ to: "/esignature/$folder", params: { folder: "drafts" } });
        return;
      }

      const pack = files.length ? files : tpl ? [new File(["template"], `${tpl.name}.txt`, { type: "text/plain" })] : [];
      for (const f of pack) {
        const title = f.name.replace(/\.[^.]+$/, "");
        const recId = uid("rc");
        const content = tpl ? tpl.content : await contentOf(f);
        await saveDocument({
          data: {
            title: tpl ? tpl.name : title,
            docType: tpl?.docType ?? "other",
            compliance,
            groupName: "Massal",
            folderId: boot.folders[0]?.id ?? null,
            content,
            fields: [
              {
                id: uid("f"),
                type: "signature",
                page: 0,
                x: 14,
                y: 72,
                w: 28,
                h: 10,
                recipientId: recId,
                required: true,
              },
            ],
            settings: DEFAULT_SETTINGS,
            recipients: [
              {
                id: recId,
                name: recs[0]?.name || boot.user.name,
                email: recs[0]?.email || boot.user.email,
                role: "signer",
                companyName: boot.company.name,
                orderIndex: 1,
              },
            ],
            send: false,
          },
        });
      }
      toast.success(`${pack.length} draf dibuat`);
      nav({ to: "/esignature/$folder", params: { folder: "drafts" } });
    } finally {
      setBusy(false);
    }
  }

  const canGo = files.length > 0 || Boolean(tpl);

  return (
    <div>
      <PageHeader
        title={tpl ? `Kirim massal · ${tpl.name}` : "Unggah massal"}
        subtitle={
          tpl
            ? "Tempel daftar penerima (nama,email) lalu kirim dari template ini."
            : "Buat banyak draf sekaligus, lalu taruh kolom dan kirim."
        }
      />
      <div className="mx-auto max-w-xl p-4 md:p-6">
        {tpl ? (
          <div className="mb-4 rounded-lg border border-brand/30 bg-brand-soft p-3 text-sm">
            Template: <strong>{tpl.name}</strong> · {DOC_TYPE_LABEL[tpl.docType] ?? tpl.docType}
          </div>
        ) : null}
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center text-sm text-muted">
          Pilih beberapa PDF / gambar / dokumen
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>
        {files.length ? (
          <ul className="mt-4 space-y-1 text-sm">
            {files.map((f) => (
              <li key={f.name}>{f.name}</li>
            ))}
          </ul>
        ) : null}
        <label className="mt-4 block text-sm font-medium">
          Penerima (satu per baris: nama,email)
          <Textarea
            className="mt-1"
            rows={5}
            placeholder={"Dewi,dewi@co.id\nBudi,budi@co.id"}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
          />
        </label>
        <div className="mt-4 space-y-2 text-sm">
          <div className="font-medium">Opsi gabung</div>
          <label className="flex items-center gap-2">
            <input type="radio" checked={merge === "separate"} onChange={() => setMerge("separate")} />
            Pisahkan dokumen (email terpisah)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={merge === "merge"} onChange={() => setMerge("merge")} />
            Gabungkan jadi satu berkas
          </label>
          <div className="pt-2 font-medium">Kepatuhan</div>
          <label className="flex items-center gap-2">
            <input type="radio" checked={compliance === "psre"} onChange={() => setCompliance("psre")} />
            PSrE
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={compliance === "globalsign"} onChange={() => setCompliance("globalsign")} />
            GlobalSign
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">
          Maks. 15 dokumen, 25 MB. Tipe default: {DOC_TYPE_LABEL.other}. Draf masuk folder {boot.folders[0]?.name}.
          {merge === "merge" ? " Penggabungan diterapkan sebagai satu dokumen." : ""}
        </p>
        <Button className="mt-4" disabled={!canGo || busy} onClick={() => void createAll()}>
          {tpl && parseRecipients().length ? `Kirim ke ${parseRecipients().length} penerima` : `Buat ${files.length || (tpl ? 1 : "")} draf`}
        </Button>
        <Button
          className="mt-2 w-full"
          variant="outline"
          disabled={busy}
          onClick={() => {
            const fake = ["PKS-Distribusi.pdf", "NDA-Vendor.pdf", "Invoice-Q3.pdf"].map(
              (name) => new File(["Pasal 1\n\nDemo bulk naskah untuk " + name], name, { type: "application/pdf" }),
            );
            setFiles(fake);
            toast.success("3 sample files attached — create drafts to continue");
          }}
        >
          Use sample files
        </Button>
      </div>
    </div>
  );
}
