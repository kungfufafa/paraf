import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/dropdown";
import { listContracts, mutateDocument } from "@/lib/api";
import { exportDocsCsv } from "@/lib/doc-helpers";
import { useLang, useT } from "@/lib/lang";
import { DOC_TYPE_LABEL, STATUS_LABEL, type DocumentRow } from "@/lib/types";
import { formatIdDate } from "@/lib/utils";
import { Onboarding } from "@/components/empty-art";

export const Route = createFileRoute("/_app/contracts")({ component: ContractsPage });

type Tab = "all" | "upcoming" | "active" | "expiring" | "expired";

function classify(d: DocumentRow, now: number): Tab {
  const exp = d.expiresAt ? new Date(d.expiresAt).getTime() : 0;
  if (d.status === "need_to_sign" || d.status === "waiting_for_others" || d.status === "pending_approval") return "upcoming";
  if (exp && exp < now) return "expired";
  if (exp && exp - now < 60 * 86400000) return "expiring";
  return "active";
}

function ContractsPage() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data = [] } = useQuery({ queryKey: ["contracts"], queryFn: () => listContracts() });
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");
  const now = Date.now();

  const kpis = useMemo(() => {
    const upcoming = data.filter((d) => classify(d, now) === "upcoming").length;
    const active = data.filter((d) => classify(d, now) === "active").length;
    const expiring = data.filter((d) => classify(d, now) === "expiring").length;
    const expired = data.filter((d) => classify(d, now) === "expired").length;
    return { upcoming, active, expiring, expired, total: data.length };
  }, [data, now]);

  const rows = data.filter((d) => {
    if (tab !== "all" && classify(d, now) !== tab) return false;
    if (type !== "all" && d.docType !== type) return false;
    if (q && !d.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  if (!started && data.length === 0) {
    return (
      <Onboarding
        steps={[
          { n: "1", title: "Manage your contract", body: "Keep every signed agreement in one repository with dates and owners." },
          { n: "2", title: "Get notified", body: "Alerts before renewal so nothing expires quietly." },
          { n: "3", title: "Share your insights", body: "Export status, value, and upcoming renewals for the team." },
          { n: "4", title: "Analyze your contract", body: "See what’s active, expiring, and overdue at a glance." },
        ]}
        onStart={() => nav({ to: "/send" })}
        startLabel={t.uploadContract}
        learnLabel={t.learnMore}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={t.contracts}
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => exportDocsCsv(rows)}>
              CSV
            </Button>
            <Button size="sm" asChild>
              <Link to="/send">Upload</Link>
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-2 px-4 py-4 md:grid-cols-5 md:px-6">
        {(
          [
            ["upcoming", "Upcoming", kpis.upcoming],
            ["active", "Active", kpis.active],
            ["expiring", "Expiring", kpis.expiring],
            ["expired", "Expired", kpis.expired],
            ["all", "All contracts", kpis.total],
          ] as [Tab, string, number][]
        ).map(([k, label, n]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-lg border px-3 py-3 text-left ${tab === k ? "border-brand bg-brand-soft" : "border-border bg-surface"}`}
          >
            <div className="text-[11px] text-muted">{label}</div>
            <div className="mt-1 text-xl font-semibold tabular-nums text-brand">{n}</div>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-3 md:px-6">
        <input
          className="h-9 rounded-md border border-border bg-surface px-3 text-sm"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="h-9 rounded-md border border-border bg-surface px-2 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All types</option>
          {Object.entries(DOC_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto px-4 pb-10 md:px-6">
        <table className="w-full min-w-[720px] overflow-hidden rounded-lg border border-border bg-surface text-sm">
          <thead className="bg-surface text-left text-[12px] font-medium text-muted">
            <tr>
              <th className="px-3 py-3">Contract</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Effective</th>
              <th className="px-3 py-3">Expires</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const exp = d.expiresAt ? new Date(d.expiresAt).getTime() : 0;
              const soon = exp && exp - now < 60 * 86400000 && exp > now;
              return (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-3 py-3">
                    <Link to="/documents/$id" params={{ id: d.id }} className="font-medium hover:text-brand">
                      {d.title}
                    </Link>
                    <div className="text-[11px] text-muted">{d.groupName}</div>
                  </td>
                  <td className="px-3 py-3 text-muted">{DOC_TYPE_LABEL[d.docType] ?? d.docType}</td>
                  <td className="px-3 py-3">{formatIdDate(d.effectiveDate)}</td>
                  <td className={`px-3 py-3 ${soon ? "font-medium text-warning" : ""}`}>{formatIdDate(d.expiresAt)}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={d.status} label={STATUS_LABEL[d.status][lang]} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Menu>
                      <MenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          Actions
                        </Button>
                      </MenuTrigger>
                      <MenuContent>
                        <MenuItem onSelect={() => (window.location.href = `/documents/${d.id}`)}>View</MenuItem>
                        <MenuItem onSelect={() => void exportDocsCsv([d])}>CSV</MenuItem>
                        <MenuItem
                          danger
                          onSelect={async () => {
                            await mutateDocument({ data: { id: d.id, action: "delete" } });
                            toast.success("Moved out of contracts");
                            void qc.invalidateQueries({ queryKey: ["contracts"] });
                          }}
                        >
                          Remove
                        </MenuItem>
                      </MenuContent>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
