import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookMarked,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Folder,
  Globe,
  Grid3x3,
  Headphones,
  KeyRound,
  LayoutTemplate,
  Menu as MenuIcon,
  Plus,
  Rocket,
  Search as SearchIcon,
  Settings,
  Stamp,
  Upload,
  Users,
  Webhook,
} from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ParafLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Menu, MenuContent, MenuItem, MenuSep, MenuTrigger } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { signOut } from "@/lib/auth/client";
import { hydrateLang, useLang, useT } from "@/lib/lang";
import { createFolder, exportWorkspace, type bootstrap } from "@/lib/api";
import { attachmentsHtml, auditHtml, certificateHtml, documentsHtml, downloadBlob } from "@/lib/download";
import { cn, initials } from "@/lib/utils";

export type Boot = Awaited<ReturnType<typeof bootstrap>>;
const BootCtx = createContext<Boot | null>(null);
export function useBoot() {
  const v = useContext(BootCtx);
  if (!v) throw new Error("Boot missing");
  return v;
}

const MODULES: { href: string; label: (t: ReturnType<typeof useT>) => string; icon: typeof FileText; match: (p: string) => boolean }[] = [
  { href: "/esignature/all-inbox", label: (t) => t.documents, icon: FileText, match: (p) => p.startsWith("/esignature") || p.startsWith("/send") || p.startsWith("/documents") || p.startsWith("/bulk") || p.startsWith("/proofs") },
  { href: "/approvals", label: (t) => t.approvals, icon: CheckSquare, match: (p) => p.startsWith("/approvals") },
  { href: "/contracts", label: (t) => t.contracts, icon: BookMarked, match: (p) => p.startsWith("/contracts") },
  { href: "/templates", label: (t) => t.templates, icon: LayoutTemplate, match: (p) => p.startsWith("/templates") },
  { href: "/emeterai", label: (t) => t.emeterai, icon: Stamp, match: (p) => p.startsWith("/emeterai") },
  { href: "/contacts", label: (t) => t.contacts, icon: Users, match: (p) => p.startsWith("/contacts") },
  { href: "/webhooks", label: (t) => t.developer, icon: Webhook, match: (p) => p.startsWith("/webhooks") || p.startsWith("/byok") },
  { href: "/settings", label: (t) => t.settings, icon: Settings, match: (p) => p.startsWith("/settings") || p.startsWith("/stamps") },
];

const DOC_STATUS: { key: string; label: (t: ReturnType<typeof useT>) => string }[] = [
  { key: "need-to-sign", label: (t) => t.needSign },
  { key: "waiting-for-others", label: (t) => t.waiting },
  { key: "expiring-soon", label: (t) => t.insightExpiring },
  { key: "completed", label: (t) => t.completed },
];

const SUITE = [
  { letter: "P", name: "Paraf", hint: "Digital signature", href: "/esignature/all-inbox", current: true, tone: "bg-brand" },
  { letter: "B", name: "Paraf Books", hint: "Accounting", href: "/ai", current: false, tone: "bg-success" },
  { letter: "H", name: "Paraf HR", hint: "People & payroll", href: "/ai", current: false, tone: "bg-info" },
  { letter: "C", name: "Paraf Chat", hint: "Customer inbox", href: "/ai", current: false, tone: "bg-warning" },
  { letter: "F", name: "Paraf Flex", hint: "Benefits", href: "/ai", current: false, tone: "bg-brand" },
  { letter: "T", name: "Paraf Tax", hint: "Tax filing", href: "/ai", current: false, tone: "bg-rail" },
];

export function AppShell({ boot, children }: { boot: Boot; children: React.ReactNode }) {
  const t = useT();
  const loc = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState(false);
  const [appsQ, setAppsQ] = useState("");
  const [headerQ, setHeaderQ] = useState("");
  const path = loc.pathname;
  const showDocSide = path.startsWith("/esignature") || path.startsWith("/send") || path.startsWith("/documents") || path.startsWith("/bulk") || path.startsWith("/proofs");
  const showMeteraiSide = path.startsWith("/emeterai");
  const showDevSide = path.startsWith("/webhooks") || path.startsWith("/byok");

  useEffect(() => {
    hydrateLang();
  }, []);

  useEffect(() => {
    setApps(false);
  }, [path]);

  return (
    <BootCtx.Provider value={boot}>
      <div className="min-h-screen bg-bg">
        <header className="no-print sticky top-0 z-40 grid h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-header px-3 text-surface md:grid-cols-[1fr_minmax(16rem,28rem)_1fr]">
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-md p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <MenuIcon className="size-5" />
            </button>
            <Link to="/esignature/$folder" params={{ folder: "all-inbox" }} className="flex items-center">
              <ParafLogo light />
            </Link>
          </div>
          <form
            className="relative hidden md:block"
            onSubmit={(e) => {
              e.preventDefault();
              void nav({ to: "/esignature/$folder", params: { folder: "all-inbox" }, search: { q: headerQ } });
            }}
          >
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-subtle" />
            <input
              className="h-8 w-full rounded-md border-0 bg-surface pr-3 pl-9 text-sm text-ink outline-none placeholder:text-subtle"
              placeholder={t.searchByDoc}
              value={headerQ}
              onChange={(e) => setHeaderQ(e.target.value)}
            />
          </form>
          <div className="flex items-center justify-end gap-0.5">
            <Link
              to="/esignature/$folder"
              params={{ folder: "getting-started" }}
              className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-surface hover:bg-surface/10 md:inline-flex"
            >
              {t.needHelp}
              <Headphones className="size-4" />
            </Link>
            <LangToggle />
            <div className="relative">
              <button
                type="button"
                className="rounded-md p-2 text-surface hover:bg-surface/10"
                onClick={() => setApps((v) => !v)}
                aria-label="Apps"
              >
                <Grid3x3 className="size-4" />
              </button>
              {apps ? (
                <div className="absolute right-0 z-50 mt-1 w-[420px] rounded-lg border border-border bg-surface p-4 text-ink shadow-soft">
                  <input
                    className="h-9 w-full rounded-md border border-border px-3 text-sm"
                    placeholder="Search"
                    value={appsQ}
                    onChange={(e) => setAppsQ(e.target.value)}
                  />
                  <div className="mt-3 text-[11px] font-semibold tracking-wide text-muted uppercase">All products</div>
                  <ul className="mt-2 grid grid-cols-4 gap-2">
                    {SUITE.filter((a) => !appsQ.trim() || a.name.toLowerCase().includes(appsQ.toLowerCase())).map((a) => (
                      <li key={a.name}>
                        <Link
                          to={a.href}
                          onClick={() => setApps(false)}
                          className="flex flex-col items-center gap-1 rounded-md p-2 text-center hover:bg-surface-2"
                        >
                          <span className={cn("grid size-10 place-items-center rounded-lg text-sm font-bold text-white", a.tone)}>
                            {a.letter}
                          </span>
                          <span className="text-[11px] font-medium">{a.name}</span>
                          {a.current ? <span className="text-[9px] text-brand">Current</span> : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <Menu>
              <MenuTrigger asChild>
                <button type="button" className="ml-1 grid size-8 place-items-center rounded-full bg-rail text-[11px] font-bold hover:opacity-90">
                  {initials(boot.user.name)}
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem onSelect={() => (window.location.href = "/settings")}>My account</MenuItem>
                <MenuSep />
                <MenuItem
                  onSelect={() => {
                    void signOut();
                  }}
                >
                  {t.signOut}
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-48px)]">
          <nav className="no-print hidden w-[88px] shrink-0 flex-col bg-rail pt-3 md:flex">
            {MODULES.map((m) => {
              const active = m.match(path);
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  to={m.href}
                  className={cn(
                    "mx-1.5 mb-0.5 flex flex-col items-center gap-1 rounded-md px-1 py-2.5 text-center text-[10px] leading-tight",
                    active ? "bg-rail-hover font-semibold text-surface" : "text-surface/75 hover:bg-rail-hover hover:text-surface",
                  )}
                >
                  <Icon className="size-5" />
                  {m.label(t)}
                </Link>
              );
            })}
          </nav>

          {showDocSide ? (
            <aside className="no-print hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
              <DocSidebar boot={boot} pathname={path} t={t} onNavigate={() => {}} />
            </aside>
          ) : null}

          {showMeteraiSide ? (
            <aside className="no-print hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
              <MeteraiSidebar pathname={path} t={t} />
            </aside>
          ) : null}

          {showDevSide ? (
            <aside className="no-print hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
              <DeveloperSidebar pathname={path} t={t} />
            </aside>
          ) : null}

          <main className="min-w-0 flex-1 bg-bg">{children}</main>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full">
              <nav className="w-[84px] bg-rail pt-3">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  const active = m.match(path);
                  return (
                    <Link
                      key={m.href}
                      to={m.href}
                      onClick={() => setOpen(false)}
                      className={cn("mx-1 mb-1 flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px]", active ? "bg-rail-hover text-surface" : "text-surface/80")}
                    >
                      <Icon className="size-4" />
                      {m.label(t)}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex-1 overflow-y-auto">
                {showDocSide ? <DocSidebar boot={boot} pathname={path} t={t} onNavigate={() => setOpen(false)} /> : null}
                {showMeteraiSide ? <MeteraiSidebar pathname={path} t={t} /> : null}
                {showDevSide ? <DeveloperSidebar pathname={path} t={t} /> : null}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </BootCtx.Provider>
  );
}

function DocSidebar({
  boot,
  pathname,
  t,
  onNavigate,
}: {
  boot: Boot;
  pathname: string;
  t: ReturnType<typeof useT>;
  onNavigate: () => void;
}) {
  const qc = useQueryClient();
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [inboxOpen, setInboxOpen] = useState(false);
  const allActive = pathname === "/esignature/all-inbox" || pathname.startsWith("/esignature/sent") || pathname.startsWith("/esignature/drafts") || pathname.startsWith("/esignature/trash") || pathname.startsWith("/esignature/shared") || pathname.startsWith("/esignature/scheduled");

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="grid grid-cols-2 gap-2 px-3 py-3">
        <Menu>
          <MenuTrigger asChild>
            <Button size="sm" className="w-full">
              <Upload className="size-3.5" />
              {t.upload}
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem onSelect={() => (window.location.href = "/send")}>{t.uploadDocument}</MenuItem>
            <MenuItem onSelect={() => (window.location.href = "/send?intent=emeterai")}>{t.requestEmeterai}</MenuItem>
            <MenuItem onSelect={() => (window.location.href = "/bulk")}>{t.bulkUpload}</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger asChild>
            <Button size="sm" variant="outline" className="w-full">
              <Download className="size-3.5" />
              {t.download}
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem
              onSelect={() => {
                void (async () => {
                  const pack = await exportWorkspace();
                  downloadBlob("paraf-documents.html", documentsHtml(pack.documents));
                  toast.success("Documents downloaded");
                })();
              }}
            >
              {t.downloadDocuments}
            </MenuItem>
            <MenuItem
              onSelect={() => {
                void (async () => {
                  const pack = await exportWorkspace();
                  const titles: Record<string, string> = {};
                  for (const d of pack.documents) titles[d.id] = d.title;
                  downloadBlob("paraf-audit-trail.html", auditHtml(pack.audit, titles));
                  toast.success("Audit trail downloaded");
                })();
              }}
            >
              {t.downloadAudit}
            </MenuItem>
            <MenuItem
              onSelect={() => {
                void (async () => {
                  const pack = await exportWorkspace();
                  downloadBlob("paraf-attachments.html", attachmentsHtml(pack.documents));
                  toast.success("Attachments downloaded");
                })();
              }}
            >
              {t.downloadAttachments}
            </MenuItem>
            <MenuItem
              onSelect={() => {
                void (async () => {
                  const pack = await exportWorkspace();
                  const done = pack.documents.find((d) => d.status === "completed") ?? pack.documents[0];
                  if (!done) {
                    toast.error("No documents yet");
                    return;
                  }
                  downloadBlob("paraf-certificate.html", certificateHtml(done));
                  toast.success("Certificate downloaded");
                })();
              }}
            >
              {t.downloadCert}
            </MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <div className="px-4 pb-1 text-[13px] font-semibold">{t.documents}</div>
      <nav className="flex-1 px-2 pb-2">
        <div>
          <div className="flex items-center">
            <Link
              to="/esignature/$folder"
              params={{ folder: "all-inbox" }}
              onClick={onNavigate}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
                pathname === "/esignature/all-inbox" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
              )}
            >
              {t.allInbox}
            </Link>
            <button
              type="button"
              className="rounded p-1 text-muted hover:bg-surface-2"
              onClick={() => setInboxOpen((v) => !v)}
              aria-label="More inboxes"
            >
              {inboxOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
          </div>
          {inboxOpen || (allActive && pathname !== "/esignature/all-inbox") ? (
            <div className="ml-3 border-l border-border pl-2">
              {[
                { key: "sent", label: t.sent },
                { key: "scheduled", label: t.scheduled },
                { key: "drafts", label: t.draft },
                { key: "trash", label: t.trash },
                { key: "shared", label: t.shared },
              ].map((it) => (
                <Link
                  key={it.key}
                  to="/esignature/$folder"
                  params={{ folder: it.key }}
                  onClick={onNavigate}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-[13px]",
                    pathname === `/esignature/${it.key}` ? "font-medium text-brand" : "text-ink hover:bg-surface-2",
                  )}
                >
                  {it.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {DOC_STATUS.map((it) => {
          const href = `/esignature/${it.key}`;
          const active = pathname === href;
          return (
            <Link
              key={it.key}
              to="/esignature/$folder"
              params={{ folder: it.key }}
              onClick={onNavigate}
              className={cn(
                "flex items-center rounded-md px-2 py-1.5 text-[13px]",
                active ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
              )}
            >
              {it.label(t)}
            </Link>
          );
        })}
        <div className="mt-3 flex items-center justify-between px-2 py-1 text-[13px] font-semibold">
          {t.folders}
          <button type="button" className="rounded p-0.5 hover:bg-surface-2" onClick={() => setFolderOpen(true)} aria-label="New folder">
            <Plus className="size-3.5 text-muted" />
          </button>
        </div>
        {boot.folders.map((f) => (
          <Link
            key={f.id}
            to="/esignature/$folder"
            params={{ folder: "all-inbox" }}
            search={{ folderId: f.id }}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-ink hover:bg-surface-2"
          >
            <Folder className="size-4 text-muted" />
            {f.name}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border px-2 py-2">
        <Link
          to="/proofs"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
            pathname === "/proofs" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
          )}
        >
          {t.proofs}
        </Link>
        <Link
          to="/esignature/$folder"
          params={{ folder: "getting-started" }}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
            pathname === "/esignature/getting-started" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
          )}
        >
          <Rocket className="size-4 text-muted" />
          {t.gettingStarted}
        </Link>
      </div>
      <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
        <DialogContent title="New folder">
          <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder name" />
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              if (!folderName.trim()) return;
              await createFolder({ data: folderName.trim() });
              toast.success("Folder created");
              setFolderName("");
              setFolderOpen(false);
              void qc.invalidateQueries({ queryKey: ["boot"] });
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MeteraiSidebar({ pathname, t }: { pathname: string; t: ReturnType<typeof useT> }) {
  return (
    <nav className="px-2 py-3">
      <Link
        to="/emeterai"
        className={cn(
          "block rounded-md px-2 py-1.5 text-[13px]",
          pathname === "/emeterai" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
        )}
      >
        {t.quotaUsage}
      </Link>
      <Link
        to="/emeterai"
        className={cn("mt-1 block rounded-md px-2 py-1.5 text-[13px]", "text-ink hover:bg-surface-2")}
      >
        {t.assignEmeterai}
      </Link>
    </nav>
  );
}

function DeveloperSidebar({ pathname, t }: { pathname: string; t: ReturnType<typeof useT> }) {
  return (
    <nav className="px-2 py-3">
      <Link
        to="/webhooks"
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
          pathname === "/webhooks" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
        )}
      >
        <Webhook className="size-4 text-muted" />
        {t.webhooks}
      </Link>
      <Link
        to="/byok"
        className={cn(
          "mt-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]",
          pathname === "/byok" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
        )}
      >
        <KeyRound className="size-4 text-muted" />
        {t.byok}
      </Link>
    </nav>
  );
}

function LangToggle() {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-surface hover:bg-surface/10"
      onClick={() => setLang(lang === "id" ? "en" : "id")}
    >
      <Globe className="size-4" />
      {lang.toUpperCase()}
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-bg px-4 py-4 md:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  art,
  title,
}: {
  art: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-72">{art}</div>
      <p className="mt-4 text-sm text-muted">{title}</p>
    </div>
  );
}
