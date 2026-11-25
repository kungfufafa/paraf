import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PenLine, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, startOfDay, subDays } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { DownloadMenu, EmptyState, PageHeader, type Boot } from "@/components/app-shell";
import { DeskEmpty } from "@/components/empty-art";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Menu, MenuContent, MenuItem, MenuSep, MenuTrigger } from "@/components/ui/dropdown";
import { SignPad } from "@/components/sign-pad";
import { bulkSignDocs, listDocuments, mutateDocument } from "@/lib/api";
import { canSign, signingLink } from "@/lib/doc-helpers";
import { useT, useLang } from "@/lib/lang";
import { STATUS_LABEL, type DocStatus, type DocumentRow } from "@/lib/types";
import { cn, relativeId } from "@/lib/utils";

type T = ReturnType<typeof useT>;

export function InboxView({
  folder,
  q,
  folderId,
  boot,
}: {
  folder: string;
  q: string;
  folderId: string;
  boot: Boot;
}) {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const titleMap: Record<string, string> = {
    "all-inbox": t.allInbox,
    sent: t.sent,
    scheduled: t.scheduled,
    drafts: t.draft,
    trash: t.trash,
    shared: t.shared,
    "need-to-sign": t.needSign,
    "waiting-for-others": t.waiting,
    "expiring-soon": t.insightExpiring,
    completed: t.completed,
    draft: t.draft,
    declined: t.declined,
    expired: t.expired,
    voided: t.voided,
    "pending-approval": t.pending,
  };
  const email = boot.user.email;
  const qc = useQueryClient();
  const nav = useNavigate();
  const showOverview =
    folder === "all-inbox" ||
    folder === "need-to-sign" ||
    folder === "waiting-for-others" ||
    folder === "completed" ||
    folder === "expiring-soon";
  const showCharts = folder === "all-inbox";
  const { data: docs = [], isPending } = useQuery({
    queryKey: ["docs", folder, q, folderId],
    queryFn: () => listDocuments({ data: { folder, q, folderId: folderId || undefined } }),
  });
  const { data: allDocs = [] } = useQuery({
    queryKey: ["docs", "all-inbox", "", ""],
    queryFn: () => listDocuments({ data: { folder: "all-inbox" } }),
    enabled: showOverview,
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize] = useState(20);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState(q);
  useEffect(() => {
    setQuery(q);
  }, [q]);

  const filtered = useMemo(() => {
    let list = docs;
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    if (query.trim()) {
      const n = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(n) ||
          d.recipients.some(
            (r) => r.name.toLowerCase().includes(n) || r.email.toLowerCase().includes(n),
          ),
      );
    }
    return list;
  }, [docs, statusFilter, query]);

  const overviewDocs = allDocs.length ? allDocs : docs;

  const insights = useMemo(() => {
    const all = overviewDocs;
    const soon = all.filter(
      (d) =>
        d.deadline &&
        new Date(d.deadline).getTime() - Date.now() < 5 * 86400000 &&
        d.status !== "completed" &&
        d.status !== "voided",
    );
    return [
      {
        key: "need-to-sign",
        label: t.insightNeed,
        value: all.filter((d) => canSign(d, email)).length,
        accent: true,
      },
      {
        key: "waiting-for-others",
        label: t.insightPending,
        value: all.filter((d) => d.status === "waiting_for_others").length,
        accent: false,
      },
      { key: "expiring-soon", label: t.insightExpiring, value: soon.length, accent: false },
      {
        key: "completed",
        label: t.insightRenew,
        value: all.filter((d) => d.status === "completed").length,
        accent: false,
      },
    ];
  }, [overviewDocs, email, t]);

  const paged = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const allIds = paged.map((d) => d.id);
  const allOn = allIds.length > 0 && allIds.every((id) => selected.includes(id));

  return (
    <div className="pb-10">
      <PageHeader
        title={titleMap[folder] ?? t.allInbox}
        actions={
          <>
            {selected.length > 0 ? (
              <Button size="sm" onClick={() => setBulkOpen(true)}>
                <PenLine className="size-3.5" />
                {t.bulkSign} ({selected.length})
              </Button>
            ) : null}
            <DownloadMenu />
          </>
        }
      />

      <div className="space-y-3 px-4 md:px-6">
        {showOverview ? (
          <section aria-label={t.overview} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {insights.map((c) => (
              <KpiCard
                key={c.key}
                to={c.key}
                label={c.label}
                value={c.value}
                accent={c.accent}
                active={folder === c.key}
              />
            ))}
          </section>
        ) : null}

        {showCharts && overviewDocs.length > 0 ? (
          <section className="grid gap-3 lg:grid-cols-3">
            <ActivityCard docs={overviewDocs} t={t} lang={lang} />
            <StatusCard docs={overviewDocs} t={t} lang={lang} />
          </section>
        ) : null}

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">{t.docsTable}</h2>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted tabular-nums">
              {filtered.length}
            </span>
            <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
              <select
                className="h-8 rounded-lg border border-border bg-surface px-2 text-xs text-ink outline-none focus:border-border-strong"
                value={statusFilter}
                aria-label={t.filter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">{t.allStatus}</option>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v[lang]}
                  </option>
                ))}
              </select>
              <div className="relative flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" />
                <input
                  className="h-8 w-full rounded-lg border border-border bg-surface pr-3 pl-8 text-xs text-ink outline-none placeholder:text-subtle focus:border-border-strong sm:w-56"
                  placeholder={t.searchDocuments}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>
          </div>

          {isPending ? (
            <div className="p-4">
              <div className="skeleton-shimmer h-48 rounded-lg" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState art={<DeskEmpty />} title={t.empty} />
          ) : (
            <>
              <table className="hidden w-full text-sm md:table">
                <thead className="bg-surface-2/50 text-left text-[12px] font-medium text-subtle">
                  <tr className="border-b border-border">
                    <th className="w-10 py-2.5 pr-2 pl-4 font-medium">
                      <Checkbox checked={allOn} onChange={() => setSelected(allOn ? [] : allIds)} />
                    </th>
                    <th className="px-3 py-2.5 font-medium">{t.docName}</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">{t.lastModified}</th>
                    <th className="py-2.5 pr-4 pl-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paged.map((d) => {
                    const { name, code } = splitTitle(d.title);
                    return (
                      <tr
                        key={d.id}
                        className="cursor-pointer transition-colors hover:bg-surface-2/50"
                        onClick={() => void nav({ to: "/documents/$id", params: { id: d.id } })}
                      >
                        <td className="py-3.5 pr-2 pl-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selected.includes(d.id)}
                            onChange={() => toggle(d.id)}
                          />
                        </td>
                        <td className="max-w-[460px] px-3 py-3.5">
                          <Link
                            to="/documents/$id"
                            params={{ id: d.id }}
                            className="block truncate font-medium text-ink"
                          >
                            {name}
                          </Link>
                          {code ? (
                            <span className="mt-0.5 block truncate text-[11px] text-subtle">
                              {code}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-3.5">
                          <StatusBadge status={d.status} label={STATUS_LABEL[d.status][lang]} />
                        </td>
                        <td className="px-3 py-3.5 text-[12px] whitespace-nowrap text-muted">
                          {relativeId(d.updatedAt)}
                        </td>
                        <td
                          className="py-3.5 pr-4 pl-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RowActions
                            doc={d}
                            email={email}
                            t={t}
                            folders={boot.folders}
                            trash={folder === "trash"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <ul className="divide-y divide-border md:hidden">
                {paged.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-3.5">
                    <Checkbox checked={selected.includes(d.id)} onChange={() => toggle(d.id)} />
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/documents/$id"
                        params={{ id: d.id }}
                        className="block truncate text-sm font-medium text-ink"
                      >
                        {splitTitle(d.title).name}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-subtle">
                        <StatusBadge status={d.status} label={STATUS_LABEL[d.status][lang]} />
                        <span className="truncate">{relativeId(d.updatedAt)}</span>
                      </div>
                    </div>
                    <RowActions
                      doc={d}
                      email={email}
                      t={t}
                      folders={boot.folders}
                      trash={folder === "trash"}
                    />
                  </li>
                ))}
              </ul>
              {filtered.length > pageSize ? (
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted">
                  <span className="tabular-nums">
                    {page * pageSize + 1}–{Math.min(filtered.length, (page + 1) * pageSize)} /{" "}
                    {filtered.length}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={(page + 1) * pageSize >= filtered.length}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent title={t.bulkSign}>
          <p className="mb-3 text-sm text-muted">
            Signature will be applied to {selected.length} selected documents.
          </p>
          <SignPad
            name={boot.user.name}
            onDone={async (dataUrl) => {
              await bulkSignDocs({ data: { ids: selected, signatureData: dataUrl } });
              toast.success("Documents signed");
              setBulkOpen(false);
              setSelected([]);
              void qc.invalidateQueries({ queryKey: ["docs"] });
              void qc.invalidateQueries({ queryKey: ["boot"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Seed titles look like "NDA-2026/LGL-008 · Perjanjian …": show the name, demote the code. */
function splitTitle(title: string): { name: string; code: string } {
  const i = title.indexOf(" · ");
  return i > 0 ? { code: title.slice(0, i), name: title.slice(i + 3) } : { code: "", name: title };
}

function KpiCard({
  to,
  label,
  value,
  accent,
  active,
}: {
  to: string;
  label: string;
  value: number;
  accent: boolean;
  active: boolean;
}) {
  const highlight = accent && value > 0;
  return (
    <Link
      to="/esignature/$folder"
      params={{ folder: to }}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-surface p-5 shadow-card transition-colors",
        active ? "border-ink/25" : "border-border hover:border-border-strong",
      )}
    >
      <span className="flex items-center gap-2 text-[13px] leading-tight text-muted">
        {highlight ? (
          <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
        ) : null}
        {label}
      </span>
      <span className="text-[32px] leading-none font-semibold tracking-tight text-ink tabular-nums">
        {value.toLocaleString()}
      </span>
    </Link>
  );
}

function ActivityCard({ docs, t, lang }: { docs: DocumentRow[]; t: T; lang: "id" | "en" }) {
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 30 }, (_, i) => subDays(today, 29 - i));
    const counts = new Map<number, number>();
    for (const d of docs) {
      const k = startOfDay(new Date(d.createdAt)).getTime();
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const locale = lang === "id" ? idLocale : enUS;
    return days.map((day) => ({
      label: format(day, "d MMM", { locale }),
      value: counts.get(day.getTime()) ?? 0,
    }));
  }, [docs, lang]);
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card lg:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">{t.newDocsTitle}</h2>
        <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
          {t.last30}
        </span>
      </div>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="22%"
          >
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={6}
              tick={{ fontSize: 11, fill: "var(--color-subtle)" }}
              dy={6}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, (dataMax: number) => Math.max(4, dataMax + 1)]}
              tickLine={false}
              axisLine={false}
              width={24}
              tick={{ fontSize: 11, fill: "var(--color-subtle)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface-2)" }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs shadow-soft">
                    <div className="text-subtle">{label}</div>
                    <div className="font-semibold text-ink tabular-nums">
                      {payload[0]!.value as number}
                    </div>
                  </div>
                ) : null
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-ink)"
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
              maxBarSize={10}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatusCard({ docs, t, lang }: { docs: DocumentRow[]; t: T; lang: "id" | "en" }) {
  const rows = useMemo(() => {
    const counts = new Map<DocStatus, number>();
    for (const d of docs) counts.set(d.status, (counts.get(d.status) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const top: { key: string; label: string; value: number; done: boolean }[] = sorted
      .slice(0, 4)
      .map(([status, value]) => ({
        key: status,
        label: STATUS_LABEL[status][lang],
        value,
        done: status === "completed",
      }));
    const rest = sorted.slice(4).reduce((s, [, v]) => s + v, 0);
    if (rest > 0) top.push({ key: "other", label: t.other, value: rest, done: false });
    return top;
  }, [docs, lang, t]);
  const completed = docs.filter((d) => d.status === "completed").length;
  const rate = docs.length ? Math.round((completed / docs.length) * 100) : 0;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-ink">{t.completionRate}</h2>
      <div className="mt-4 text-[40px] leading-none font-semibold tracking-tight text-ink tabular-nums">
        {rate}%
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-success" style={{ width: `${rate}%` }} />
      </div>
      <ul className="mt-5 space-y-2.5 text-[13px]">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2">
            <span
              className={cn("size-2 rounded-full", r.done ? "bg-success" : "bg-border-strong")}
              aria-hidden
            />
            <span className="text-muted">{r.label}</span>
            <span className="ml-auto font-medium text-ink tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RowActions({
  doc,
  email,
  t,
  folders,
  trash,
}: {
  doc: DocumentRow;
  email: string;
  t: ReturnType<typeof useT>;
  folders: { id: string; name: string }[];
  trash: boolean;
}) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: (p: {
      action: "void" | "delete" | "remind" | "duplicate" | "move" | "restore" | "resend";
      folderId?: string;
    }) => mutateDocument({ data: { id: doc.id, ...p } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["docs"] });
      void qc.invalidateQueries({ queryKey: ["boot"] });
    },
  });
  const signable = canSign(doc, email);
  return (
    <div className="flex items-center justify-end gap-1">
      {signable && !trash ? (
        <Button
          size="sm"
          onClick={() => nav({ to: "/documents/$id/sign", params: { id: doc.id } })}
        >
          <PenLine className="size-3.5" />
          {t.sign}
        </Button>
      ) : null}
      <Menu>
        <MenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="More">
            <MoreHorizontal className="size-4" />
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={() => nav({ to: "/documents/$id", params: { id: doc.id } })}>
            Document info
          </MenuItem>
          <MenuItem
            onSelect={() => {
              const href = signingLink(doc.token);
              void navigator.clipboard.writeText(href).then(
                () => toast.success("Link copied"),
                () => toast.message(href),
              );
            }}
          >
            Share
          </MenuItem>
          <MenuItem
            onSelect={() => {
              void mut.mutateAsync({ action: "resend" });
              toast.success("Resent");
            }}
          >
            Resend
          </MenuItem>
          <MenuItem
            onSelect={() => {
              void mut.mutateAsync({ action: "remind" });
              toast.success("Reminder sent");
            }}
          >
            {t.remind}
          </MenuItem>
          <MenuItem
            onSelect={async () => {
              const res = await mut.mutateAsync({ action: "duplicate" });
              toast.success("Draft copy created");
              if (res && "id" in res && res.id)
                nav({ to: "/documents/$id", params: { id: res.id as string } });
            }}
          >
            {t.duplicate}
          </MenuItem>
          {folders.map((f) => (
            <MenuItem
              key={f.id}
              onSelect={() => {
                void mut.mutateAsync({ action: "move", folderId: f.id });
                toast.success("Moved to " + f.name);
              }}
            >
              Move to {f.name}
            </MenuItem>
          ))}
          <MenuSep />
          {trash ? (
            <MenuItem
              onSelect={() => {
                void mut.mutateAsync({ action: "restore" });
                toast.success("Restored");
              }}
            >
              Restore
            </MenuItem>
          ) : (
            <MenuItem
              onSelect={() => {
                void mut.mutateAsync({ action: "void" });
                toast.success("Document voided");
              }}
            >
              {t.void}
            </MenuItem>
          )}
          <MenuItem
            danger
            onSelect={() => {
              void mut.mutateAsync({ action: "delete" });
              toast.success(trash ? "Deleted permanently" : "Moved to trash");
            }}
          >
            {t.delete}
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}
