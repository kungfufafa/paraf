import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, MoreHorizontal, PenLine, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader, type Boot } from "@/components/app-shell";
import { DeskEmpty } from "@/components/empty-art";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Menu, MenuContent, MenuItem, MenuSep, MenuTrigger } from "@/components/ui/dropdown";
import { SignPad } from "@/components/sign-pad";
import { bulkSignDocs, listDocuments, mutateDocument } from "@/lib/api";
import { canSign, progress, signingLink } from "@/lib/doc-helpers";
import { useT, useLang } from "@/lib/lang";
import { STATUS_LABEL, type DocumentRow } from "@/lib/types";
import { relativeId } from "@/lib/utils";

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
  const showOverview = folder === "all-inbox" || folder === "need-to-sign" || folder === "waiting-for-others" || folder === "completed" || folder === "expiring-soon";
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
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(q);
  useEffect(() => {
    setQuery(q);
  }, [q]);

  const filtered = useMemo(() => {
    let list = docs;
    if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
    if (query.trim()) {
      const n = query.toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(n) || d.recipients.some((r) => r.name.toLowerCase().includes(n) || r.email.toLowerCase().includes(n)));
    }
    return list;
  }, [docs, statusFilter, query]);

  const insights = useMemo(() => {
    const all = allDocs.length ? allDocs : docs;
    const soon = all.filter(
      (d) => d.deadline && new Date(d.deadline).getTime() - Date.now() < 5 * 86400000 && d.status !== "completed" && d.status !== "voided",
    );
    return [
      { key: "need-to-sign", label: t.insightNeed, value: all.filter((d) => canSign(d, email)).length },
      { key: "waiting-for-others", label: t.insightPending, value: all.filter((d) => d.status === "waiting_for_others").length },
      { key: "expiring-soon", label: t.insightExpiring, value: soon.length },
      { key: "completed", label: t.insightRenew, value: all.filter((d) => d.status === "completed").length },
      { key: "all-inbox", label: t.insightDone, value: all.length },
    ];
  }, [allDocs, docs, email, t]);

  const paged = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const allIds = paged.map((d) => d.id);
  const allOn = allIds.length > 0 && allIds.every((id) => selected.includes(id));

  const subtitleMap: Record<string, string> = {
    "all-inbox": t.allInboxesSub,
  };

  return (
    <div>
      <PageHeader title={titleMap[folder] ?? t.allInbox} subtitle={subtitleMap[folder]} />
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-6">
        <Button size="sm" variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
          <Filter className="size-3.5" />
          {t.filter}
        </Button>
        {selected.length > 0 ? (
          <Button size="sm" variant="navy" onClick={() => setBulkOpen(true)}>
            {t.bulkSign} ({selected.length})
          </Button>
        ) : null}
        {filtersOpen ? (
          <select
            className="h-8 rounded-md border border-border bg-surface px-2 text-xs"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All status</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v[lang]}
              </option>
            ))}
          </select>
        ) : null}
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-subtle" />
          <input
            className="h-8 w-44 rounded-md border border-border bg-surface pr-3 pl-7 text-xs md:w-56"
            placeholder={t.searchDocuments}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>
      <div className="px-4 pb-6 md:px-6">
        {isPending ? (
          <div className="skeleton-shimmer h-48 rounded-lg" />
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface">
            <EmptyState art={<DeskEmpty />} title={t.empty} />
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-lg border border-border bg-surface md:block">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-[12px] font-medium text-muted">
                  <tr className="border-b border-border">
                    <th className="w-10 px-3 py-3">
                      <Checkbox checked={allOn} onChange={() => setSelected(allOn ? [] : allIds)} />
                    </th>
                    <th className="px-3 py-3">{t.docName}</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">{t.lastModified}</th>
                    <th className="px-3 py-3">{t.folderCol}</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paged.map((d) => (
                    <tr key={d.id} className="border-t border-border hover:bg-surface-2/60">
                      <td className="px-3 py-3">
                        <Checkbox checked={selected.includes(d.id)} onChange={() => toggle(d.id)} />
                      </td>
                      <td className="px-3 py-3">
                        <Link to="/documents/$id" params={{ id: d.id }} className="font-medium hover:text-brand">
                          {d.title}
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={d.status} label={STATUS_LABEL[d.status][lang]} />
                        <div className="mt-1 text-[11px] text-subtle">
                          {progress(d).signed}/{progress(d).total}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-muted">{relativeId(d.updatedAt)}</td>
                      <td className="px-3 py-3 text-[12px] text-muted">{d.folderName || "—"}</td>
                      <td className="px-3 py-3 text-right">
                        <RowActions doc={d} email={email} t={t} folders={boot.folders} trash={folder === "trash"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 md:hidden">
              {paged.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={selected.includes(d.id)} onChange={() => toggle(d.id)} />
                    <div className="min-w-0 flex-1">
                      <Link to="/documents/$id" params={{ id: d.id }} className="font-medium">
                        {d.title}
                      </Link>
                      <div className="mt-1">
                        <StatusBadge status={d.status} label={STATUS_LABEL[d.status][lang]} />
                      </div>
                      <div className="mt-2 text-[11px] text-muted">
                        {relativeId(d.updatedAt)} · {d.folderName || "—"}
                      </div>
                    </div>
                    <RowActions doc={d} email={email} t={t} folders={boot.folders} trash={folder === "trash"} />
                  </div>
                </div>
              ))}
            </div>
            {filtered.length > pageSize ? (
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>
                  {page * pageSize + 1}–{Math.min(filtered.length, (page + 1) * pageSize)} / {filtered.length}
                </span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
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
      </div>
      {showOverview ? (
        <div className="px-4 pb-10 md:px-6">
          <h2 className="mb-2 text-sm font-semibold">{t.overview}</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {insights.map((c) => (
              <Link
                key={c.key}
                to="/esignature/$folder"
                params={{ folder: c.key }}
                className="rounded-lg border border-border bg-surface px-4 py-3 hover:border-brand"
              >
                <div className="text-2xl font-semibold tabular-nums text-brand">{c.value}</div>
                <div className="mt-1 text-xs text-muted">{c.label}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent title={t.bulkSign}>
          <p className="mb-3 text-sm text-muted">Signature will be applied to {selected.length} selected documents.</p>
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
    mutationFn: (p: { action: "void" | "delete" | "remind" | "duplicate" | "move" | "restore" | "resend"; folderId?: string }) =>
      mutateDocument({ data: { id: doc.id, ...p } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["docs"] });
      void qc.invalidateQueries({ queryKey: ["boot"] });
    },
  });
  const signable = canSign(doc, email);
  return (
    <div className="flex items-center justify-end gap-1">
      {signable && !trash ? (
        <Button size="sm" onClick={() => nav({ to: "/documents/$id/sign", params: { id: doc.id } })}>
          <PenLine className="size-3.5" />
          {t.sign}
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => nav({ to: "/documents/$id", params: { id: doc.id } })}>
          {t.view}
        </Button>
      )}
      <Menu>
        <MenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="More">
            <MoreHorizontal className="size-4" />
          </Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={() => nav({ to: "/documents/$id", params: { id: doc.id } })}>Document info</MenuItem>
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
              if (res && "id" in res && res.id) nav({ to: "/documents/$id", params: { id: res.id as string } });
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
