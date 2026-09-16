import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, useBoot } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { assignEmeterai, buyEmeterai, listDocuments } from "@/lib/api";
import { useT } from "@/lib/lang";
import { formatIdDate, formatRp } from "@/lib/utils";

export const Route = createFileRoute("/_app/emeterai")({ component: EmeteraiPage });

const PACKS = [10, 20, 50, 100];

function EmeteraiPage() {
  const t = useT();
  const boot = useBoot();
  const qc = useQueryClient();
  const { data: docs = [] } = useQuery({
    queryKey: ["docs", "emeterai-recent"],
    queryFn: () => listDocuments({ data: { folder: "all-inbox" } }),
  });
  const [buyOpen, setBuyOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [qty, setQty] = useState(20);
  const [assignQty, setAssignQty] = useState(10);
  const [memberId, setMemberId] = useState("");
  const q = boot.quota;
  const team = boot.team ?? [];
  const assigned = team.reduce((s, m) => s + (Number(m.emeterai_assigned) || 0), 0);
  const pickMember = memberId || team[0]?.id || "";
  const ready = boot.emeterai?.legalReady;

  return (
    <div>
      <PageHeader title={t.quotaUsage} />
      <div className={`mx-4 mb-4 rounded-lg border px-4 py-3 text-sm md:mx-6 ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
        {ready ? (
          <>API connected. New stamps get a provider serial and are marked <strong>e-METERAI SAH</strong>.</>
        ) : (
          <>
            No Peruri/distributor API yet. You can still apply a stamp, but it is <strong>DEMO — not legally valid</strong>.{" "}
            <Link to="/settings" className="font-medium underline">
              Connect eMeterai API
            </Link>
          </>
        )}
      </div>
      <div className="grid gap-3 px-4 md:grid-cols-3 md:px-6">
        <QuotaCard
          label={t.used}
          used={q.emeteraiUsed}
          total={q.emeteraiTotal}
          hint="The remaining quota of eMeterai that can be used in the document."
          until="30/08/2026"
        />
        <QuotaCard
          label={t.remaining}
          used={Math.max(0, q.emeteraiTotal - q.emeteraiUsed)}
          total={q.emeteraiTotal}
          showUsedAsValue
          hint="The remaining quota of eMeterai that can be used in the document."
          until="30/08/2026"
        />
        <QuotaCard
          label={t.assigned}
          used={assigned}
          total={q.emeteraiTotal}
          hint="The remaining quota of eMeterai that has been assigned to the users."
        />
      </div>
      <div className="px-4 pt-8 md:px-6">
        <h2 className="mb-4 text-sm font-semibold">How to assign eMeterai</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", title: "Set up users", body: "Invite teammates who can spend eMeterai from the company quota." },
            { n: "2", title: "Assign quota", body: "Give each user a monthly allocation so stamps stay controlled." },
            { n: "3", title: "Start using eMeterai", body: "Place a stamp while sending a document — quota deducts automatically." },
          ].map((s) => (
            <article key={s.n} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">{s.n}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted">{s.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button size="sm" asChild>
            <Link to="/send" search={{ intent: "emeterai" }}>
              Use in document
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
            Assign eMeterai
          </Button>
          <Button size="sm" variant="outline" onClick={() => setBuyOpen(true)}>
            {t.buyEmeterai}
          </Button>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold">{t.recentDocuments}</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="text-left text-[12px] font-medium text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">{t.docName}</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">{t.lastModified}</th>
                <th className="px-4 py-3">{t.folderCol}</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted">
                    You don't have any documents yet.
                  </td>
                </tr>
              ) : (
                docs.slice(0, 12).map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Link to="/documents/$id" params={{ id: d.id }} className="font-medium hover:text-brand">
                        {d.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{d.docType}</td>
                    <td className="px-4 py-3 text-muted">{formatIdDate(d.updatedAt)}</td>
                    <td className="px-4 py-3 text-muted">{d.folderName || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent title="Assign eMeterai">
          <p className="mb-3 text-sm text-muted">Give a user a monthly allocation from the company quota.</p>
          <select
            className="h-10 w-full rounded-md border border-border px-3 text-sm"
            value={pickMember}
            onChange={(e) => setMemberId(e.target.value)}
          >
            {team.length === 0 ? <option value="">Invite a user in Settings first</option> : null}
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.emeterai_assigned} assigned
              </option>
            ))}
          </select>
          <input
            type="number"
            className="mt-2 h-10 w-full rounded-md border border-border px-3 text-sm"
            value={assignQty}
            onChange={(e) => setAssignQty(Number(e.target.value))}
          />
          <Button
            className="mt-3 w-full"
            disabled={!pickMember}
            onClick={async () => {
              await assignEmeterai({ data: { memberId: pickMember, qty: assignQty } });
              toast.success("Quota assigned");
              setAssignOpen(false);
              void qc.invalidateQueries({ queryKey: ["boot"] });
            }}
          >
            Assign
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={buyOpen} onOpenChange={setBuyOpen}>
        <DialogContent title={t.buyEmeterai}>
          <p className="mb-3 text-sm text-muted">Rp 10.000 per stamp. Quota is added instantly for this workspace.</p>
          <div className="flex flex-wrap gap-2">
            {PACKS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQty(n)}
                className={`rounded-md border px-3 py-2 text-sm ${qty === n ? "border-brand bg-brand-soft" : "border-border"}`}
              >
                {n} · {formatRp(n * 10000)}
              </button>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            onClick={async () => {
              await buyEmeterai({ data: qty });
              toast.success(`+${qty} eMeterai added`);
              setBuyOpen(false);
              void qc.invalidateQueries();
            }}
          >
            Pay {formatRp(qty * 10000)}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuotaCard({
  label,
  used,
  total,
  hint,
  until,
  showUsedAsValue,
}: {
  label: string;
  used: number;
  total: number;
  hint: string;
  until?: string;
  showUsedAsValue?: boolean;
}) {
  const value = used;
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="text-3xl font-semibold tabular-nums">{value.toLocaleString("en-US")}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>
      {until ? <p className="mt-3 text-xs text-muted">Valid until {until}</p> : null}
    </section>
  );
}
