import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DocumentPaper, pageCount } from "@/components/document-paper";
import { ParafLogo } from "@/components/logo";
import { SignPad } from "@/components/sign-pad";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getPublicDocument, publicSign } from "@/lib/api";
import type { DocField } from "@/lib/types";

export const Route = createFileRoute("/s/$token")({ component: PublicSign });

function PublicSign() {
  const { token } = Route.useParams();
  const { data: doc, isPending, refetch } = useQuery({
    queryKey: ["pub", token],
    queryFn: () => getPublicDocument({ data: token }),
  });
  const [page, setPage] = useState(0);
  const [fields, setFields] = useState<DocField[] | null>(null);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rec = useMemo(() => {
    if (!doc) return undefined;
    if (doc.lockRecipientId) return doc.recipients.find((r) => r.id === doc.lockRecipientId);
    return doc.recipients.find((r) => r.status !== "signed" && r.role !== "cc");
  }, [doc]);

  const live = fields ?? doc?.fields ?? [];
  const pages = doc ? pageCount(doc.content, live) : 1;

  const myTurn = useMemo(() => {
    if (!doc || !rec) return false;
    if (["completed", "declined", "expired", "voided"].includes(doc.status)) return false;
    if (rec.status === "signed" || rec.status === "declined") return false;
    if (doc.settings.sequential) {
      const prior = doc.recipients.filter((r) => r.orderIndex < rec.orderIndex && r.role !== "cc");
      if (prior.some((r) => r.status !== "signed")) return false;
    }
    return rec.role !== "cc";
  }, [doc, rec]);

  if (isPending) return <div className="grid min-h-screen place-items-center bg-bg">Memuat undangan…</div>;
  if (!doc) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-6 text-center">
        <div>
          <ParafLogo />
          <p className="mt-6 text-muted">Tautan undangan tidak valid atau sudah kedaluwarsa.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/">Kembali</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (doc.passcode && !unlocked) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-6">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
          <ParafLogo />
          <p className="mt-4 text-sm">Dokumen dilindungi kode sandi. Minta kode ke pengirim.</p>
          <Input className="mt-3" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kode sandi" />
          <Button className="mt-3 w-full" onClick={() => setUnlocked(code === doc.passcode)}>
            Buka dokumen
          </Button>
        </div>
      </div>
    );
  }

  if (done || rec?.status === "signed") {
    return (
      <div className="grid min-h-screen place-items-center bg-bg p-6 text-center">
        <div>
          <ParafLogo />
          <div className="mx-auto mt-6 grid size-14 place-items-center rounded-full bg-success text-xl font-bold text-white">✓</div>
          <h1 className="mt-4 text-xl font-semibold">Sudah ditandatangani</h1>
          <p className="mt-2 text-sm text-muted">
            Terima kasih, {rec?.name}. Jejak audit dan stempel waktu tercatat di Paraf.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/verify">Verifikasi keaslian</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function applyAndMaybeFinish(dataUrl: string, complete: boolean) {
    if (!rec || !doc) return;
    const next = live.map((f) =>
      f.recipientId === rec.id && (f.type === "signature" || f.type === "initials")
        ? { ...f, value: dataUrl }
        : f.recipientId === rec.id && f.type === "date"
          ? { ...f, value: new Intl.DateTimeFormat("id-ID").format(new Date()) }
          : f.recipientId === rec.id && f.type === "name"
            ? { ...f, value: rec.name }
            : f,
    );
    setFields(next);
    setOpen(false);
    if (!complete) return;
    setBusy(true);
    setError(null);
    try {
      const res = await publicSign({
        data: { token, recipientId: rec.id, fields: next, signatureData: dataUrl },
      });
      if (!res.ok) {
        setError("Gagal menyimpan tanda tangan. Periksa tautan undangan.");
        return;
      }
      setDone(true);
      void refetch();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <ParafLogo />
        <div className="min-w-0 truncate text-sm text-muted">{doc.title}</div>
        {started && myTurn ? (
          <Button size="sm" disabled={busy} onClick={() => setOpen(true)}>
            Bubuhkan paraf
          </Button>
        ) : (
          <Button size="sm" disabled={!agreed || !rec || !myTurn} onClick={() => setStarted(true)}>
            Mulai tanda tangan
          </Button>
        )}
      </header>
      {!agreed ? (
        <div className="mx-auto mt-4 flex max-w-5xl flex-col items-start justify-between gap-3 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 sm:flex-row sm:items-center">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 size-4" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            Saya setuju menggunakan tanda tangan elektronik Paraf (UU ITE & PSrE).
          </label>
          <Button size="sm" onClick={() => setAgreed(true)}>
            Saya setuju
          </Button>
        </div>
      ) : null}
      {error ? <p className="mx-auto mt-3 max-w-5xl px-4 text-sm text-danger">{error}</p> : null}
      <div className="mx-auto grid max-w-5xl gap-4 p-4 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-2 flex gap-1">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`min-h-9 rounded-md px-3 text-xs ${page === i ? "bg-navy text-white" : "bg-surface-2"}`}
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
            lang="id"
            interactive={started && myTurn}
            onSelectField={(fid) => {
              const f = live.find((x) => x.id === fid);
              if (f && (f.type === "signature" || f.type === "initials")) setOpen(true);
            }}
          />
        </div>
        <aside className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">Anda menandatangani sebagai</div>
            <p className="mt-2 font-medium">{rec?.name ?? "—"}</p>
            <p className="text-xs text-muted">{rec?.email}</p>
            {!myTurn && rec ? (
              <p className="mt-3 text-sm text-warning">Belum giliran Anda. Pihak sebelumnya harus menandatangani dulu.</p>
            ) : null}
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">Pihak lain</div>
            <ul className="mt-2 space-y-1 text-sm">
              {doc.recipients.map((r) => (
                <li key={r.id} className="flex justify-between gap-2">
                  <span className="truncate">{r.name}</span>
                  <span className="text-xs text-muted">{r.status === "signed" ? "Selesai" : "Menunggu"}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Bubuhkan paraf">
          <SignPad name={rec?.name ?? ""} onDone={(dataUrl) => void applyAndMaybeFinish(dataUrl, true)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
