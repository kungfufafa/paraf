import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookMarked,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
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
import {
  attachmentsHtml,
  auditHtml,
  certificateHtml,
  documentsHtml,
  downloadBlob,
} from "@/lib/download";
import { cn, initials } from "@/lib/utils";

export type Boot = Awaited<ReturnType<typeof bootstrap>>;
const BootCtx = createContext<Boot | null>(null);
export function useBoot() {
  const v = useContext(BootCtx);
  if (!v) throw new Error("Boot missing");
  return v;
}

type T = ReturnType<typeof useT>;

const MODULES: {
  href: string;
  label: (t: T) => string;
  icon: typeof FileText;
  match: (p: string) => boolean;
}[] = [
  {
    href: "/esignature/all-inbox",
    label: (t) => t.documents,
    icon: FileText,
    match: (p) =>
      p.startsWith("/esignature") ||
      p.startsWith("/send") ||
      p.startsWith("/documents") ||
      p.startsWith("/bulk") ||
      p.startsWith("/proofs"),
  },
  {
    href: "/approvals",
    label: (t) => t.approvals,
    icon: CheckSquare,
    match: (p) => p.startsWith("/approvals"),
  },
  {
    href: "/contracts",
    label: (t) => t.contracts,
    icon: BookMarked,
    match: (p) => p.startsWith("/contracts"),
  },
  {
    href: "/templates",
    label: (t) => t.templates,
    icon: LayoutTemplate,
    match: (p) => p.startsWith("/templates"),
  },
  {
    href: "/emeterai",
    label: (t) => t.emeterai,
    icon: Stamp,
    match: (p) => p.startsWith("/emeterai"),
  },
  {
    href: "/contacts",
    label: (t) => t.contacts,
    icon: Users,
    match: (p) => p.startsWith("/contacts"),
  },
  {
    href: "/webhooks",
    label: (t) => t.developer,
    icon: Webhook,
    match: (p) => p.startsWith("/webhooks") || p.startsWith("/byok"),
  },
  {
    href: "/settings",
    label: (t) => t.settings,
    icon: Settings,
    match: (p) => p.startsWith("/settings") || p.startsWith("/stamps"),
  },
];

const SUITE = [
  {
    letter: "P",
    name: "Paraf",
    hint: "Digital signature",
    href: "/esignature/all-inbox",
    current: true,
    tone: "bg-brand",
  },
  {
    letter: "B",
    name: "Paraf Books",
    hint: "Accounting",
    href: "/ai",
    current: false,
    tone: "bg-success",
  },
  {
    letter: "H",
    name: "Paraf HR",
    hint: "People & payroll",
    href: "/ai",
    current: false,
    tone: "bg-info",
  },
  {
    letter: "C",
    name: "Paraf Chat",
    hint: "Customer inbox",
    href: "/ai",
    current: false,
    tone: "bg-warning",
  },
  {
    letter: "F",
    name: "Paraf Flex",
    hint: "Benefits",
    href: "/ai",
    current: false,
    tone: "bg-brand",
  },
  {
    letter: "T",
    name: "Paraf Tax",
    hint: "Tax filing",
    href: "/ai",
    current: false,
    tone: "bg-rail",
  },
];

/** Top-level sidebar row (module). */
const rowCls = (active: boolean) =>
  cn(
    "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors",
    active
      ? "bg-surface-2 font-medium text-ink"
      : "text-muted hover:bg-surface-2/70 hover:text-ink",
  );

/** Nested sidebar row (folder / sub-page). */
const subCls = (active: boolean) =>
  cn(
    "flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] transition-colors",
    active
      ? "bg-surface-2 font-medium text-ink"
      : "text-muted hover:bg-surface-2/70 hover:text-ink",
  );

export function AppShell({ boot, children }: { boot: Boot; children: React.ReactNode }) {
  const t = useT();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const path = loc.pathname;

  useEffect(() => {
    hydrateLang();
  }, []);

  return (
    <BootCtx.Provider value={boot}>
      <div className="flex min-h-screen bg-bg">
        <aside className="no-print sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-border bg-surface md:block">
          <Sidebar boot={boot} path={path} t={t} onNavigate={() => {}} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface px-3 md:hidden">
            <button
              type="button"
              className="rounded-lg p-2 text-ink hover:bg-surface-2"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              <MenuIcon className="size-5" />
            </button>
            <Link
              to="/esignature/$folder"
              params={{ folder: "all-inbox" }}
              className="flex items-center"
            >
              <ParafLogo />
            </Link>
            <span className="ml-auto grid size-8 place-items-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
              {initials(boot.user.name)}
            </span>
          </header>
          <main className="min-w-0 flex-1">{children}</main>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <Sidebar boot={boot} path={path} t={t} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </BootCtx.Provider>
  );
}

function Sidebar({
  boot,
  path,
  t,
  onNavigate,
}: {
  boot: Boot;
  path: string;
  t: T;
  onNavigate: () => void;
}) {
  const nav = useNavigate();
  const [q, setQ] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <Link
          to="/esignature/$folder"
          params={{ folder: "all-inbox" }}
          onClick={onNavigate}
          className="flex items-center"
        >
          <ParafLogo />
        </Link>
        <AppsMenu path={path} />
      </div>

      <div className="shrink-0 space-y-2 px-3">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            onNavigate();
            void nav({ to: "/esignature/$folder", params: { folder: "all-inbox" }, search: { q } });
          }}
        >
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" />
          <input
            className="h-9 w-full rounded-lg border border-border bg-surface pr-3 pl-8 text-[13px] text-ink outline-none placeholder:text-subtle focus:border-border-strong"
            placeholder={t.searchDocuments}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <Menu>
          <MenuTrigger asChild>
            <Button size="sm" className="h-9 w-full text-[13px]">
              <Upload className="size-3.5" />
              {t.upload}
            </Button>
          </MenuTrigger>
          <MenuContent align="start" className="w-[224px]">
            <MenuItem onSelect={() => (window.location.href = "/send")}>
              {t.uploadDocument}
            </MenuItem>
            <MenuItem onSelect={() => (window.location.href = "/send?intent=emeterai")}>
              {t.requestEmeterai}
            </MenuItem>
            <MenuItem onSelect={() => (window.location.href = "/bulk")}>{t.bulkUpload}</MenuItem>
          </MenuContent>
        </Menu>
      </div>

      <nav className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]">
        <div className="space-y-0.5">
          {MODULES.map((m) => {
            const active = m.match(path);
            const Icon = m.icon;
            return (
              <div key={m.href}>
                <Link to={m.href} onClick={onNavigate} className={rowCls(active)}>
                  <Icon className={cn("size-4", active ? "text-ink" : "text-subtle")} />
                  {m.label(t)}
                </Link>
                {active && m.href.startsWith("/esignature") ? (
                  <DocSubnav boot={boot} path={path} t={t} onNavigate={onNavigate} />
                ) : null}
                {active && m.href === "/webhooks" ? (
                  <DevSubnav path={path} t={t} onNavigate={onNavigate} />
                ) : null}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 space-y-0.5 border-t border-border p-3">
        <Link
          to="/esignature/$folder"
          params={{ folder: "getting-started" }}
          onClick={onNavigate}
          className={rowCls(path === "/esignature/getting-started")}
        >
          <Headphones className="size-4 text-subtle" />
          {t.needHelp}
        </Link>
        <UserMenu boot={boot} t={t} />
      </div>
    </div>
  );
}

function AppsMenu({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => {
    setOpen(false);
  }, [path]);
  return (
    <div className="relative">
      <button
        type="button"
        className="grid size-8 place-items-center rounded-lg text-subtle hover:bg-surface-2 hover:text-ink"
        onClick={() => setOpen((v) => !v)}
        aria-label="Apps"
        aria-expanded={open}
      >
        <Grid3x3 className="size-4" />
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute top-full left-0 z-50 mt-1 w-[320px] rounded-xl border border-border bg-surface p-3 text-ink shadow-soft">
            <input
              className="h-9 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-border-strong"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="mt-3 px-1 text-[11px] font-medium text-subtle">All products</div>
            <ul className="mt-1.5 grid grid-cols-3 gap-1">
              {SUITE.filter((a) => !q.trim() || a.name.toLowerCase().includes(q.toLowerCase())).map(
                (a) => (
                  <li key={a.name}>
                    <Link
                      to={a.href}
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1 rounded-lg p-2 text-center hover:bg-surface-2"
                    >
                      <span
                        className={cn(
                          "grid size-9 place-items-center rounded-lg text-sm font-bold text-white",
                          a.tone,
                        )}
                      >
                        {a.letter}
                      </span>
                      <span className="text-[11px] font-medium">{a.name}</span>
                      {a.current ? <span className="text-[10px] text-subtle">Current</span> : null}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}

function UserMenu({ boot, t }: { boot: Boot; t: T }) {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left hover:bg-surface-2"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
            {initials(boot.user.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-ink">
              {boot.user.name}
            </span>
            <span className="block truncate text-[11px] text-subtle">{boot.user.email}</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-subtle" />
        </button>
      </MenuTrigger>
      <MenuContent align="start" className="w-[224px]">
        <MenuItem onSelect={() => (window.location.href = "/settings")}>My account</MenuItem>
        <MenuItem onSelect={() => setLang(lang === "id" ? "en" : "id")}>
          <Globe className="size-3.5 text-subtle" />
          {lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
        </MenuItem>
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
  );
}

function DocSubnav({
  boot,
  path,
  t,
  onNavigate,
}: {
  boot: Boot;
  path: string;
  t: T;
  onNavigate: () => void;
}) {
  const qc = useQueryClient();
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [inboxOpen, setInboxOpen] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const SUB_INBOX = ["sent", "scheduled", "drafts", "trash", "shared"];
  const inSubInbox = SUB_INBOX.some((k) => path === `/esignature/${k}`);

  return (
    <div className="mt-0.5 mb-2 ml-[18px] space-y-0.5 border-l border-border pl-2">
      <div className="flex items-center">
        <Link
          to="/esignature/$folder"
          params={{ folder: "all-inbox" }}
          onClick={onNavigate}
          className={cn(subCls(path === "/esignature/all-inbox"), "flex-1")}
        >
          {t.allInbox}
        </Link>
        <button
          type="button"
          className="grid size-7 place-items-center rounded-md text-subtle hover:bg-surface-2 hover:text-ink"
          onClick={() => setInboxOpen((v) => !v)}
          aria-label="More inboxes"
          aria-expanded={inboxOpen || inSubInbox}
        >
          {inboxOpen || inSubInbox ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>
      </div>
      {inboxOpen || inSubInbox ? (
        <div className="space-y-0.5 pl-3">
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
              className={subCls(path === `/esignature/${it.key}`)}
            >
              {it.label}
            </Link>
          ))}
        </div>
      ) : null}
      <Link to="/proofs" onClick={onNavigate} className={subCls(path === "/proofs")}>
        {t.proofs}
      </Link>

      <div className="flex items-center">
        <button
          type="button"
          className={cn(subCls(false), "flex-1 text-left")}
          onClick={() => setFoldersOpen((v) => !v)}
          aria-expanded={foldersOpen}
        >
          {t.folders}
          {foldersOpen ? (
            <ChevronDown className="ml-auto size-3.5 text-subtle" />
          ) : (
            <ChevronRight className="ml-auto size-3.5 text-subtle" />
          )}
        </button>
        <button
          type="button"
          className="grid size-7 place-items-center rounded-md text-subtle hover:bg-surface-2 hover:text-ink"
          onClick={() => setFolderOpen(true)}
          aria-label="New folder"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      {foldersOpen ? (
        <div className="space-y-0.5 pl-3">
          {boot.folders.map((f) => (
            <Link
              key={f.id}
              to="/esignature/$folder"
              params={{ folder: "all-inbox" }}
              search={{ folderId: f.id }}
              onClick={onNavigate}
              className={subCls(false)}
            >
              <Folder className="size-3.5 text-subtle" />
              <span className="truncate">{f.name}</span>
            </Link>
          ))}
        </div>
      ) : null}

      <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
        <DialogContent title="New folder">
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
          />
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

function DevSubnav({ path, t, onNavigate }: { path: string; t: T; onNavigate: () => void }) {
  return (
    <div className="mt-0.5 mb-2 ml-[18px] space-y-0.5 border-l border-border pl-2">
      <Link to="/webhooks" onClick={onNavigate} className={subCls(path === "/webhooks")}>
        <Webhook className="size-3.5 text-subtle" />
        {t.webhooks}
      </Link>
      <Link to="/byok" onClick={onNavigate} className={subCls(path === "/byok")}>
        <KeyRound className="size-3.5 text-subtle" />
        {t.byok}
      </Link>
    </div>
  );
}

/** Workspace export menu (documents, audit trail, attachments, certificate). */
export function DownloadMenu() {
  const t = useT();
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button size="sm" variant="outline">
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
              const done =
                pack.documents.find((d) => d.status === "completed") ?? pack.documents[0];
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
    <div className="no-print flex flex-wrap items-end justify-between gap-3 px-4 pt-6 pb-5 md:px-6 md:pt-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-[28px]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ art, title }: { art: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-72">{art}</div>
      <p className="mt-4 text-sm text-muted">{title}</p>
    </div>
  );
}
