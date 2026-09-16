import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentPaper, pageCount } from "@/components/document-paper";
import { PageHeader, useBoot } from "@/components/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addRecipient, getDocument, mutateDocument, setPasscode } from "@/lib/api";
import { attachmentsHtml, auditHtml, certificateHtml, downloadBlob } from "@/lib/download";
import { canSign, progress, recipientSigningLink, signingLink } from "@/lib/doc-helpers";
import { useLang, useT } from "@/lib/lang";
import { STATUS_LABEL } from "@/lib/types";
import { formatIdDate, relativeId } from "@/lib/utils";

export const Route = createFileRoute("/_app/documents/$id")({ component: DocPage });

async function copyText(text: string, ok = "Tautan disalin") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(ok);
  } catch {
    toast.message(text);
  }
}

function DocPage() {
  const { id } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSign = pathname.endsWith("/sign");
  const boot = useBoot();
  const t = useT();
  const lang = useLang((s) => s.lang);
  const nav = useNavigate();
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [fwd, setFwd] = useState(false);
  const [fname, setFname] = useState("");
  const [femail, setFemail] = useState("");
  const [pc, setPc] = useState(false);
  const [code, setCode] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["doc", id],
    queryFn: () => getDocument({ data: id }),
    enabled: !isSign,
  });
  const mut = useMutation({
    mutationFn: (action: "void" | "delete" | "remind" | "duplicate" | "resend") =>
      mutateDocument({ data: { id, action } }),
    onSuccess: () => {
      void qc.invalidateQueries();
    },
  });

  if (isSign) return <Outlet />;
  if (isPending) return <div className="p-6 skeleton-shimmer h-96 rounded-xl" />;
  if (!data?.document) return <div className="p-10 text-center text-muted">Dokumen tidak ditemukan.</div>;
  const doc = data.document;
  const pages = pageCount(doc.content, doc.fields);
  const signable = canSign(doc, boot.user.email);
  const pg = progress(doc);

  return (
    <div>
      <PageHeader
        title={doc.title}
        subtitle={`${doc.groupName} · ${doc.compliance === "psre" ? "PSrE" : "GlobalSign"}`}
        actions={
          <>
            <StatusBadge status={doc.status} label={STATUS_LABEL[doc.status][lang]} />
            {signable ? (
              <Button asChild size="sm">
                <Link to="/documents/$id/sign" params={{ id }}>{t.sign}</Link>
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                downloadBlob(`${doc.title.replace(/\s+/g, "-")}.html`, attachmentsHtml([doc]));
                downloadBlob(
                  `${doc.title.replace(/\s+/g, "-")}-audit.html`,
                  auditHtml(
                    data.audit.map((a) => ({ document_id: doc.id, actor: a.actor, action: a.action, created_at: a.createdAt })),
                    { [doc.id]: doc.title },
                  ),
                );
                if (doc.status === "completed") {
                  downloadBlob(
                    `${doc.title.replace(/\s+/g, "-")}-certificate.html`,
                    certificateHtml({
                      ...doc,
                      tsa: (data.tsa ?? []).map((t) => ({ serial: t.serial, genTime: t.token.genTime })),
                    }),
                  );
                }
                toast.success("Downloaded");
              }}
            >
              {t.download}
            </Button>
          </>
        }
      />
      <div className="grid gap-6 p-4 lg:grid-cols-[1fr_320px] md:p-6">
        <div>
          <div className="no-print mb-2 flex gap-1">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`rounded-md px-2 py-1 text-xs ${page === i ? "bg-navy text-white" : "bg-surface-2"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <DocumentPaper content={doc.content} page={page} fields={doc.fields} recipients={doc.recipients} lang={lang} />
        </div>
        <aside className="no-print space-y-4">
          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">{t.recipients}</div>
            <div className="mt-1 text-[11px] text-subtle">
              {pg.signed}/{pg.total} selesai
            </div>
            <ul className="mt-3 space-y-2">
              {doc.recipients.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted">
                    {r.email} · {r.role} · {r.status}
                    {r.signedAt ? ` · ${formatIdDate(r.signedAt, true)}` : ""}
                  </div>
                  {r.status !== "signed" && r.role !== "cc" ? (
                    <button
                      type="button"
                      className="mt-1 text-[11px] font-medium text-brand hover:underline"
                      onClick={() => void copyText(recipientSigningLink(r.inviteToken, doc.token), "Tautan undangan disalin")}
                    >
                      Salin tautan undangan
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            <Button className="mt-3 w-full" size="sm" variant="outline" onClick={() => setFwd(true)}>
              {t.forward}
            </Button>
          </section>
          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">Aksi</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void mut.mutateAsync("remind");
                  toast.success("Pengingat terkirim");
                }}
              >
                {t.remind}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await mutateDocument({ data: { id, action: "resend" } });
                  toast.success("Dikirim ulang");
                }}
              >
                Kirim ulang
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void copyText(signingLink(doc.token), "Tautan disalin")}
              >
                {t.share}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const res = await mut.mutateAsync("duplicate");
                  toast.success("Disalin ke draf");
                  if (res && "id" in res && res.id) nav({ to: "/documents/$id", params: { id: String(res.id) } });
                }}
              >
                {t.duplicate}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPc(true)}>
                {t.passcode}
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/ai" search={{ id }}>{t.ai}</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  void mut.mutateAsync("void");
                  toast.success("Dibatalkan");
                }}
              >
                {t.void}
              </Button>
            </div>
            {doc.deadline ? <p className="mt-2 text-[11px] text-muted">Tenggat {formatIdDate(doc.deadline)}</p> : null}
            {doc.declineReason ? <p className="mt-2 text-xs text-danger">{doc.declineReason}</p> : null}
          </section>
          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">Paraf Timestamp (TSA)</div>
            {data.tsa?.length ? (
              <ul className="mt-2 space-y-2 text-[12px]">
                {data.tsa.map((t) => (
                  <li key={t.serial} className="rounded-md bg-surface-2 px-2 py-1.5">
                    <Link to="/verify" search={{ serial: t.serial }} className="font-mono text-brand hover:underline">
                      {t.serial}
                    </Link>
                    <div className="text-[11px] text-muted">{t.token.genTime || t.createdAt}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Sealed when this document is sent or signed. Chain lives inside Paraf — not only the audit table.</p>
            )}
            <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
              <Link to="/proofs">Open timestamp ledger</Link>
            </Button>
          </section>
          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">{t.audit}</div>
            <ol className="mt-3 space-y-3">
              {data.audit.map((a) => (
                <li key={a.id} className="border-l-2 border-brand/40 pl-3 text-sm">
                  <div className="font-medium">{a.action}</div>
                  <div className="text-[11px] text-muted">
                    {a.actor} · {relativeId(a.createdAt)} · {a.ip}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
      <Dialog open={fwd} onOpenChange={setFwd}>
        <DialogContent title="Teruskan / tambah penerima">
          <div className="space-y-2">
            <Input placeholder="Nama" value={fname} onChange={(e) => setFname(e.target.value)} />
            <Input placeholder="Email" value={femail} onChange={(e) => setFemail(e.target.value)} />
            <Button
              className="w-full"
              onClick={async () => {
                await addRecipient({ data: { documentId: id, name: fname, email: femail } });
                toast.success("Penerima ditambah");
                setFwd(false);
                void qc.invalidateQueries({ queryKey: ["doc", id] });
              }}
            >
              Kirim
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={pc} onOpenChange={setPc}>
        <DialogContent title="Kode sandi dokumen">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6 digit" />
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              await setPasscode({ data: { id, passcode: code || null } });
              toast.success("Kode sandi disimpan");
              setPc(false);
            }}
          >
            Simpan
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
