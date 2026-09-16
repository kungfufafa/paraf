import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DocumentPaper, pageCount } from "@/components/document-paper";
import { PageHeader, useBoot } from "@/components/app-shell";
import { SignPad } from "@/components/sign-pad";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { applySignature, getDocument, issueEmeterai, listSignatures, listStamps } from "@/lib/api";
import { myRecipient } from "@/lib/doc-helpers";
import { useLang } from "@/lib/lang";
import type { DocField } from "@/lib/types";

export const Route = createFileRoute("/_app/documents/$id/sign")({ component: SignPage });

function SignPage() {
  const { id } = Route.useParams();
  const boot = useBoot();
  const lang = useLang((s) => s.lang);
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["doc", id], queryFn: () => getDocument({ data: id }) });
  const { data: stamps } = useQuery({ queryKey: ["stamps"], queryFn: () => listStamps() });
  const { data: sigs = [] } = useQuery({ queryKey: ["sigs"], queryFn: () => listSignatures() });
  const [page, setPage] = useState(0);
  const [fields, setFields] = useState<DocField[] | null>(null);
  const [sig, setSig] = useState<string>();
  const [open, setOpen] = useState(false);
  const [decline, setDecline] = useState(false);
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [activeField, setActiveField] = useState<string>();

  const doc = data?.document;
  const mine = doc ? myRecipient(doc, boot.user.email) : undefined;
  const live = fields ?? doc?.fields ?? [];
  const myFields = useMemo(
    () => live.filter((f) => !mine || f.recipientId === mine.id),
    [live, mine],
  );
  const nextEmpty = myFields.find((f) => f.required && !f.value);
  const pages = doc ? pageCount(doc.content, live) : 1;

  if (!doc) return <div className="p-10 text-center text-muted">Memuat dokumen…</div>;

  function fillAuto(list: DocField[], dataUrl?: string) {
    const url = dataUrl ?? sig;
    return list.map((f) => {
      if (mine && f.recipientId !== mine.id) return f;
      if ((f.type === "signature" || f.type === "initials") && url) return { ...f, value: url };
      if (f.type === "date") return { ...f, value: new Intl.DateTimeFormat("id-ID").format(new Date()) };
      if (f.type === "name") return { ...f, value: boot.user.name };
      if (f.type === "email") return { ...f, value: boot.user.email };
      return f;
    });
  }

  function applySig(dataUrl: string) {
    setSig(dataUrl);
    setFields(fillAuto(live, dataUrl));
    setOpen(false);
    setActiveField(undefined);
  }

  function startSigning() {
    setStarted(true);
    const first = live.find((f) => (!mine || f.recipientId === mine.id) && f.required && !f.value);
    if (first) setPage(Math.min(first.page, Math.max(0, pages - 1)));
    const def = sigs.find((s) => s.is_default) ?? sigs[0];
    if (def?.data_url) {
      applySig(def.data_url);
      return;
    }
    applySig(typedSignature(boot.user.name));
  }

  function activateField(fieldId: string) {
    if (!started) {
      if (!agreed) return;
      startSigning();
    }
    const f = live.find((x) => x.id === fieldId);
    if (!f || (mine && f.recipientId !== mine.id)) return;
    setActiveField(fieldId);
    if (f.page !== page) setPage(Math.min(f.page, pages - 1));
    if (f.type === "signature" || f.type === "initials") {
      const url = sig || (sigs.find((s) => s.is_default) ?? sigs[0])?.data_url || typedSignature(boot.user.name);
      applySig(url);
      return;
    }
    if (f.type === "date" || f.type === "name" || f.type === "email" || f.type === "title" || f.type === "company") {
      setFields(
        live.map((x) =>
          x.id !== fieldId
            ? x
            : {
                ...x,
                value:
                  f.type === "date"
                    ? new Intl.DateTimeFormat("id-ID").format(new Date())
                    : f.type === "email"
                      ? boot.user.email
                      : f.type === "company"
                        ? boot.company.name
                        : boot.user.name,
              },
        ),
      );
    }
    if (f.type === "emeterai") applyMeterai();
  }

  function applyStamp(url: string) {
    if (!mine) return;
    setFields(live.map((f) => (f.recipientId === mine.id && f.type === "stamp" ? { ...f, value: url } : f)));
  }

  async function applyMeterai() {
    if (!mine) return;
    const res = await issueEmeterai({ data: { documentId: id } });
    setFields(live.map((f) => (f.recipientId === mine.id && f.type === "emeterai" ? { ...f, value: res.serial } : f)));
    if (res.legal) toast.success("e-Meterai sah dibubuhkan · " + res.serial);
    else toast.message(("error" in res && res.error) || "Demo stamp only — not legally valid. Connect Peruri API in Settings.");
  }

  async function finish(asDecline = false) {
    if (!mine) return;
    if (!asDecline && !sig && !live.some((f) => f.type === "signature" && f.value)) {
      toast.error("Bubuhkan tanda tangan dulu");
      setOpen(true);
      return;
    }
    await applySignature({
      data: {
        id,
        recipientId: mine.id,
        fields: live,
        signatureData: sig ?? "",
        emeterai: live.some((f) => f.recipientId === mine.id && f.type === "emeterai" && f.value),
        decline: asDecline,
        reason,
      },
    });
    void qc.invalidateQueries();
    if (asDecline) {
      toast.success("Dokumen ditolak");
      nav({ to: "/documents/$id", params: { id } });
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center px-6 text-center">
        <div className="grid size-14 place-items-center rounded-full bg-success text-xl font-bold text-white">✓</div>
        <h1 className="mt-4 text-xl font-semibold">Document signed</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Your signature is locked to this document. Other parties will be notified if they still need to sign.
        </p>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link to="/esignature/$folder" params={{ folder: "all-inbox" }}>
              Back to inbox
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/documents/$id" params={{ id }}>
              View document
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={doc.title}
        subtitle="Review & sign"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setDecline(true)}>
              Decline
            </Button>
            {!started ? (
              <Button
                size="sm"
                onClick={() => {
                  setAgreed(true);
                  startSigning();
                }}
              >
                Start signing
              </Button>
            ) : (
              <Button size="sm" variant="navy" onClick={() => void finish(false)} data-testid="finish-sign">
                Finish
              </Button>
            )}
          </>
        }
      />
      {!agreed ? (
        <div className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 md:mx-6">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I agree to the Paraf electronic signature terms. This signature is legally binding (PSrE / GlobalSign).</span>
          </label>
          <Button size="sm" onClick={() => setAgreed(true)}>
            I agree
          </Button>
        </div>
      ) : null}
      {agreed && started && nextEmpty ? (
        <div className="mx-4 mt-3 rounded-md border border-border bg-surface px-4 py-2 text-sm md:mx-6">
          Next field: <strong>{nextEmpty.type}</strong> — click it on the document, or pick a saved eSignature.
        </div>
      ) : null}
      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_260px] md:p-6">
        <div>
          <div className="mb-2 flex gap-1">
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
          <DocumentPaper
            content={doc.content}
            page={page}
            fields={live}
            recipients={doc.recipients}
            lang={lang}
            interactive={agreed}
            selectedId={activeField ?? nextEmpty?.id}
            onSelectField={activateField}
          />
        </div>
        <aside className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            You are signing as <strong>{mine?.name}</strong>. After Finish, the certificate is locked to this document.
          </div>
          {started ? (
            <>
              {sigs.length ? (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="text-xs font-semibold">Saved eSignature</div>
                  {sigs.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="mt-2 block w-full rounded-md border border-border p-2 hover:border-brand"
                      onClick={() => applySig(s.data_url)}
                    >
                      <img src={s.data_url} alt={s.name} className="mx-auto h-12 object-contain" />
                    </button>
                  ))}
                </div>
              ) : null}
              <Button className="w-full" size="sm" onClick={() => setOpen(true)}>
                Create / pick eSignature
              </Button>
            </>
          ) : null}
          {stamps?.length ? (
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-xs font-semibold">Stamp</div>
              {stamps.map((s) => (
                <button key={s.id} type="button" className="mt-2 block" onClick={() => applyStamp(s.data_url)}>
                  <img src={s.data_url} alt={s.name} className="h-16 object-contain" />
                </button>
              ))}
            </div>
          ) : null}
          <Button variant="outline" className="w-full" size="sm" onClick={applyMeterai}>
            Apply eMeterai
          </Button>
        </aside>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Sign">
          <SignPad name={boot.user.name} onDone={(d) => applySig(d)} />
        </DialogContent>
      </Dialog>
      <Dialog open={decline} onOpenChange={setDecline}>
        <DialogContent title="Decline document">
          <Textarea placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          <Button className="mt-3 w-full" variant="danger" onClick={() => void finish(true)}>
            Decline
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function typedSignature(name: string) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 180;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = "#1b2430";
  ctx.font = "72px 'Great Vibes', Georgia, cursive";
  ctx.textBaseline = "middle";
  ctx.fillText(name || "Paraf", 24, 100);
  return c.toDataURL("image/png");
}
