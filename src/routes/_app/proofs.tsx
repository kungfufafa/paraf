import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addProof, workspaceExtras } from "@/lib/api";
import { getTsaChain } from "@/lib/integrations-api";
import { downloadBlob } from "@/lib/download";
import { formatIdDate } from "@/lib/utils";

export const Route = createFileRoute("/_app/proofs")({ component: ProofsPage });

function ProofsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["extras"], queryFn: () => workspaceExtras() });
  const { data: chain = [] } = useQuery({ queryKey: ["tsa-chain"], queryFn: () => getTsaChain() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", notary: "", witness: "", notes: "" });
  return (
    <div>
      <PageHeader
        title="Paraf Timestamp Authority"
        subtitle="Internal HMAC-SHA256 hash chain (policy paraf-tsa-v1). Every send, sign, void, and approval is sealed here — not only in the audit table."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              downloadBlob("paraf-tsa-chain.json", JSON.stringify(chain, null, 2), "application/json");
              toast.success("Chain downloaded");
            }}
          >
            Download chain
          </Button>
        }
      />
      <div className="grid gap-3 p-4 md:p-6">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="font-semibold">Official timestamp ledger</h2>
          <p className="mt-1 text-sm text-muted">
            Serials are verifiable on the public verify page. This is Paraf's own TSA. A licensed RFC 3161 authority can be plugged in later without changing this ledger.
          </p>
          <ul className="mt-4 space-y-2">
            {chain.map((row) => (
              <li key={row.serial} className="rounded-lg border border-border px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link to="/verify" search={{ serial: row.serial }} className="font-mono text-sm text-brand hover:underline">
                    {row.serial}
                  </Link>
                  <span className="text-[11px] text-muted">{formatIdDate(row.createdAt, true)}</span>
                </div>
                <div className="mt-1 text-[11px] text-muted">
                  hash {(row.token.hash || "").slice(0, 16)}… · prev {(row.token.prev || "").slice(0, 8)}
                </div>
              </li>
            ))}
            {!chain.length ? <li className="text-sm text-muted">No seals yet. Send or sign a document to mint the first timestamp.</li> : null}
          </ul>
        </section>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Bukti notaris / saksi</h2>
          <Button size="sm" onClick={() => setOpen(true)}>
            Tambah bukti
          </Button>
        </div>
        {(data?.proofs ?? []).map((p) => (
          <article key={p.id} className="rounded-xl border border-border bg-surface p-4">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-muted">Notaris: {p.notary || "—"}</p>
            <p className="text-sm text-muted">Saksi: {p.witness || "—"}</p>
            <p className="mt-2 text-sm">{p.notes}</p>
            <p className="mt-2 text-[11px] text-subtle">{formatIdDate(p.created_at)}</p>
          </article>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Bukti baru">
          <div className="space-y-2">
            <Input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Notaris" value={form.notary} onChange={(e) => setForm({ ...form, notary: e.target.value })} />
            <Input placeholder="Saksi" value={form.witness} onChange={(e) => setForm({ ...form, witness: e.target.value })} />
            <Textarea placeholder="Catatan" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button
              className="w-full"
              onClick={async () => {
                await addProof({ data: form });
                toast.success("Bukti disimpan");
                setOpen(false);
                void qc.invalidateQueries({ queryKey: ["extras"] });
              }}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
