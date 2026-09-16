import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useLocation, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as exportWorkspace, l as createFolder } from "./api-BmE3vsND.mjs";
import { c as cn, x as initials } from "./integrations-BY7zkbKR.mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { n as ParafLogo, t as Button } from "./button-CZaJ7tF_.mjs";
import { A as ChevronDown, O as Download, S as Globe, T as FileText, _ as Menu, a as Users, b as Headphones, c as Stamp, d as Settings, f as Search, h as Plus, j as BookMarked, k as ChevronRight, l as SquareCheckBig, o as Upload, p as Rocket, r as Webhook, v as LayoutTemplate, w as Folder, x as Grid3x3, y as KeyRound } from "../_libs/lucide-react.mjs";
import { a as DialogPortal, i as DialogOverlay, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as DialogContent$1, t as Dialog$1 } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Separator2, i as Root2, n as Item2, o as Trigger, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-DNQOiwL0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Menu$1 = Root2;
var MenuTrigger = Trigger;
function MenuContent({ className, children, align = "end" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		align,
		sideOffset: 6,
		className: cn("z-50 min-w-44 rounded-md border border-border bg-surface p-1 shadow-soft", className),
		children
	}) });
}
function MenuItem({ children, onSelect, danger, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		disabled,
		onSelect,
		className: cn("flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none", danger ? "text-danger hover:bg-danger-soft" : "text-ink hover:bg-surface-2", disabled && "opacity-40"),
		children
	});
}
function MenuSep() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: "my-1 h-px bg-border" });
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "left" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed inset-y-0 z-50 w-[min(300px,90vw)] bg-surface shadow-soft outline-none", side === "left" ? "left-0" : "right-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
			className: "sr-only",
			children: "Menu"
		}), children]
	})] });
}
var copy = {
	id: {
		app: "Paraf",
		tagline: "Tanda tangan digital & eMeterai",
		allInbox: "Semua kotak masuk",
		needSign: "Perlu ditandatangani",
		waiting: "Menunggu orang lain",
		completed: "Selesai",
		draft: "Draf",
		declined: "Ditolak",
		expired: "Kedaluwarsa",
		voided: "Dibatalkan",
		pending: "Menunggu persetujuan",
		documents: "Dokumen",
		templates: "Template",
		emeterai: "eMeterai",
		contracts: "Kontrak",
		approvals: "Persetujuan",
		contacts: "Kontak",
		stamps: "Stempel",
		proofs: "Bukti tanda tangan",
		settings: "Pengaturan",
		developer: "Developer",
		webhooks: "Webhooks",
		byok: "BYOK",
		upload: "Unggah",
		bulkUpload: "Kirim massal",
		bulkSign: "Tanda tangan massal",
		search: "Cari",
		sign: "Tandatangani",
		send: "Kirim dokumen",
		review: "Tinjau & tanda tangani",
		folders: "Folder",
		ai: "Asisten AI",
		sent: "Terkirim",
		scheduled: "Terjadwal",
		trash: "Sampah",
		shared: "Dibagikan ke saya",
		groups: "Grup dokumen",
		export: "Ekspor CSV",
		filter: "Filter",
		remind: "Ingatkan",
		void: "Batalkan",
		duplicate: "Duplikasi",
		download: "Unduh",
		share: "Salin tautan",
		forward: "Teruskan",
		move: "Pindahkan",
		delete: "Hapus",
		view: "Lihat",
		saveDraft: "Simpan draf",
		recipients: "Penerima",
		audit: "Jejak audit",
		company: "Perusahaan",
		quota: "Kuota",
		language: "Bahasa",
		notifications: "Notifikasi",
		signIn: "Masuk",
		signOut: "Keluar",
		empty: "Anda belum punya dokumen.",
		emptyHint: "",
		insightNeed: "Need to sign",
		insightPending: "Waiting for others",
		insightExpiring: "Expiring soon",
		insightRenew: "Completed",
		insightDone: "All inboxes",
		stepDoc: "Dokumen",
		stepRecipients: "Penerima",
		stepFields: "Kolom tanda tangan",
		stepSettings: "Pengaturan",
		stepReview: "Tinjau",
		sequential: "Berurutan",
		parallel: "Paralel",
		whatsapp: "Kirim via WhatsApp",
		reminder: "Pengingat otomatis",
		showQr: "Tampilkan kode QR",
		passcode: "Kode sandi dokumen",
		compliance: "Kepatuhan",
		psre: "PSrE Indonesia",
		global: "GlobalSign (internasional)",
		gettingStarted: "Getting started",
		verifyEmail: "Verify email",
		verifyIdentity: "Verify identity",
		createEsign: "Create eSignature",
		whatsNew: "what's new",
		allDocuments: "Semua dokumen",
		overview: "Overview",
		update: "Update",
		lastModified: "Terakhir diubah",
		folderCol: "Folder",
		docName: "Nama dokumen",
		teams: "Tim",
		myTemplates: "Template saya",
		create: "Buat",
		noTemplates: "Anda belum punya template.",
		import: "Impor",
		addContact: "Tambah kontak",
		personal: "Personal",
		companyTab: "Perusahaan",
		lastActivity: "Aktivitas terakhir",
		action: "Aksi",
		noContacts: "Anda belum punya kontak.",
		buyEmeterai: "Beli eMeterai",
		useEmeterai: "Pakai eMeterai",
		recentDocuments: "Dokumen terbaru",
		startNow: "Mulai sekarang",
		learnMore: "Pelajari lebih lanjut",
		csvReport: "Laporan CSV",
		summary: "Ringkasan",
		signingInsights: "Signing Insights",
		bulkSend: "Kirim massal — kirim ke banyak penerima dari template",
		allInboxesSub: "Semua dokumen dari semua kotak masuk",
		searchByDoc: "Cari berdasarkan nama dokumen",
		searchDocuments: "Cari dokumen",
		needHelp: "Butuh bantuan?",
		uploadDocument: "Unggah dokumen",
		requestEmeterai: "Ajukan eMeterai",
		downloadDocuments: "Unduh dokumen",
		downloadAudit: "Unduh jejak audit",
		downloadAttachments: "Unduh lampiran",
		downloadCert: "Unduh sertifikat penyelesaian",
		planLocked: "Fitur ini belum tersedia di paket Anda saat ini.",
		newTemplate: "Template baru",
		inviteContact: "Undang kontak",
		searchContacts: "Cari kontak",
		searchTemplates: "Cari template",
		welcomeParaf: "Selamat datang di Paraf",
		welcomeBody: "Mulai kirim, lacak, dan tandatangani dokumen. Pakai eMeterai sah, atau verifikasi identitas lewat PSrE.",
		startUsing: "Mulai pakai Paraf",
		learnHow: "Belajar memakai Paraf",
		chatWithUs: "Butuh bantuan? Chat dengan kami",
		quotaUsage: "Pemakaian kuota",
		assignEmeterai: "Tetapkan eMeterai",
		used: "Terpakai",
		remaining: "Sisa",
		assigned: "Ditugaskan",
		validUntil: "Berlaku sampai",
		owner: "Pemilik",
		lastUpdated: "Terakhir diperbarui",
		uploadContract: "Unggah kontrak"
	},
	en: {
		app: "Paraf",
		tagline: "Digital signature & eMeterai",
		allInbox: "All inboxes",
		needSign: "Need to sign",
		waiting: "Waiting for others",
		completed: "Completed",
		draft: "Drafts",
		declined: "Declined",
		expired: "Expired",
		voided: "Voided",
		pending: "Pending approval",
		documents: "Documents",
		templates: "Templates",
		emeterai: "eMeterai",
		contracts: "Contracts",
		approvals: "Approvals",
		contacts: "Contacts",
		stamps: "Stamps",
		proofs: "Signing proof",
		settings: "Settings",
		developer: "Developer",
		webhooks: "Webhooks",
		byok: "BYOK",
		upload: "Upload",
		bulkUpload: "Bulk send",
		bulkSign: "Bulk sign",
		search: "Search",
		sign: "Sign",
		send: "Send document",
		review: "Review & sign",
		folders: "Folders",
		ai: "AI assistant",
		sent: "Sent",
		scheduled: "Scheduled",
		trash: "Trash",
		shared: "Shared with me",
		groups: "Document groups",
		export: "Export CSV",
		filter: "Filters",
		remind: "Remind",
		void: "Void",
		duplicate: "Duplicate",
		download: "Download",
		share: "Copy link",
		forward: "Forward",
		move: "Move",
		delete: "Delete",
		view: "View",
		saveDraft: "Save draft",
		recipients: "Recipients",
		audit: "Audit trail",
		company: "Company",
		quota: "Quota",
		language: "Language",
		notifications: "Notifications",
		signIn: "Log in",
		signOut: "Sign out",
		empty: "You don't have any documents yet.",
		emptyHint: "",
		insightNeed: "Need to sign",
		insightPending: "Waiting for others",
		insightExpiring: "Expiring soon",
		insightRenew: "Completed",
		insightDone: "All inboxes",
		stepDoc: "Document",
		stepRecipients: "Recipients",
		stepFields: "Signature fields",
		stepSettings: "Settings",
		stepReview: "Review",
		sequential: "Sequential",
		parallel: "Parallel",
		whatsapp: "Send via WhatsApp",
		reminder: "Automatic reminder",
		showQr: "Show QR code",
		passcode: "Document passcode",
		compliance: "Compliance",
		psre: "Indonesia PSrE",
		global: "GlobalSign (international)",
		gettingStarted: "Getting started",
		verifyEmail: "Verify email",
		verifyIdentity: "Verify identity",
		createEsign: "Create eSignature",
		whatsNew: "what's new",
		allDocuments: "All documents",
		overview: "Overview",
		update: "Update",
		lastModified: "Last modified",
		folderCol: "Folder",
		docName: "Document name",
		teams: "Teams",
		myTemplates: "My templates",
		create: "Create",
		noTemplates: "You don't have any templates yet.",
		import: "Import",
		addContact: "Add contact",
		personal: "Personal",
		companyTab: "Company",
		lastActivity: "Last activity",
		action: "Action",
		noContacts: "You don't have any contacts yet.",
		buyEmeterai: "Buy eMeterai",
		useEmeterai: "Use eMeterai",
		recentDocuments: "Recent documents",
		startNow: "Start now",
		learnMore: "Learn more",
		csvReport: "CSV Report",
		summary: "Summary",
		signingInsights: "Signing Insights",
		bulkSend: "Bulk send — send to many recipients from a template",
		allInboxesSub: "All documents from all inboxes",
		searchByDoc: "Search by document name",
		searchDocuments: "Search documents",
		needHelp: "Need help?",
		uploadDocument: "Upload document",
		requestEmeterai: "Request eMeterai",
		downloadDocuments: "Download documents",
		downloadAudit: "Download audit trail",
		downloadAttachments: "Download attachments",
		downloadCert: "Download completion certificate",
		planLocked: "This feature is not available for your current plan.",
		newTemplate: "New template",
		inviteContact: "Invite contact",
		searchContacts: "Search contacts",
		searchTemplates: "Search templates",
		welcomeParaf: "Welcome to Paraf",
		welcomeBody: "Let's get started with sending, tracking, and signing documents. Use legally-valid eMeterai, or verify identity with PSrE.",
		startUsing: "Start using Paraf",
		learnHow: "Learn how to use Paraf",
		chatWithUs: "Need help? Chat with us",
		quotaUsage: "Quota usage",
		assignEmeterai: "Assign eMeterai",
		used: "Used",
		remaining: "Remaining",
		assigned: "Assigned",
		validUntil: "Valid until",
		owner: "Owner",
		lastUpdated: "Last updated",
		uploadContract: "Upload contract"
	}
};
function readLang() {
	if (typeof window === "undefined") return "en";
	try {
		return window.localStorage.getItem("paraf-lang") === "id" ? "id" : "en";
	} catch {
		return "en";
	}
}
var useLang = create((set) => ({
	lang: "en",
	t: copy.en,
	setLang: (lang) => {
		try {
			window.localStorage.setItem("paraf-lang", lang);
		} catch {}
		set({
			lang,
			t: copy[lang]
		});
	}
}));
function hydrateLang() {
	const lang = readLang();
	useLang.setState({
		lang,
		t: copy[lang]
	});
}
function useT() {
	return useLang((s) => s.t);
}
function downloadBlob(filename, content, mime = "text/html;charset=utf-8") {
	const blob = new Blob([content], { type: mime });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	a.click();
	URL.revokeObjectURL(a.href);
}
function esc(s) {
	return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function documentsHtml(docs) {
	const rows = docs.map((d) => `<tr><td>${esc(d.title)}</td><td>${esc(d.status)}</td><td>${esc(d.groupName ?? "")}</td><td>${d.recipients.map((r) => esc(r.name)).join(", ")}</td></tr>`).join("");
	return `<!doctype html><html><head><meta charset="utf-8"><title>Paraf documents</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px;color:#1b2430}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f6f7f8}</style></head>
  <body><h1>Paraf — Documents</h1><p>${docs.length} documents</p><table><thead><tr><th>Title</th><th>Status</th><th>Group</th><th>Recipients</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}
function auditHtml(rows, titles) {
	return `<!doctype html><html><head><meta charset="utf-8"><title>Paraf audit trail</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f6f7f8}</style></head>
  <body><h1>Audit trail</h1><table><thead><tr><th>Time</th><th>Document</th><th>Actor</th><th>Action</th></tr></thead><tbody>${rows.map((a) => `<tr><td>${esc(a.created_at)}</td><td>${esc(titles[a.document_id] ?? a.document_id)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td></tr>`).join("")}</tbody></table></body></html>`;
}
function certificateHtml(doc) {
	const signers = doc.recipients.filter((r) => r.status === "signed").map((r) => `<li>${esc(r.name)} (${esc(r.email)}) — ${esc(r.signedAt ?? "signed")}</li>`).join("");
	const stamps = (doc.tsa ?? []).map((t) => `<li><code>${esc(t.serial)}</code> ${esc(t.genTime ?? "")}</li>`).join("");
	return `<!doctype html><html><head><meta charset="utf-8"><title>Completion certificate</title>
  <style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:32px;border:2px solid #e85d04;color:#1b2430}
  h1{color:#e85d04;letter-spacing:.08em;font-size:18px;text-transform:uppercase} .seal{margin-top:24px;font-size:12px;color:#555}</style></head>
  <body>
    <h1>Certificate of completion</h1>
    <p>This certifies that <strong>${esc(doc.title)}</strong> was signed electronically via Paraf (${esc(doc.compliance.toUpperCase())}).</p>
    <p>Completed: ${esc(doc.completedAt ?? "in progress")}</p>
    <p>Verification token: <code>${esc(doc.token)}</code></p>
    <h2>Signers</h2>
    <ul>${signers || "<li>No signatures yet</li>"}</ul>
    <h2>Paraf Timestamp Authority</h2>
    <ul>${stamps || "<li>No TSA serial yet — send or sign to seal the chain.</li>"}</ul>
    <p class="seal">Paraf TSA policy paraf-tsa-v1 (HMAC-SHA256 hash chain). Verify a serial at /verify. This is an internal Paraf timestamp, not a government-accredited RFC 3161 TSA unless a licensed TSA URL is later connected.</p>
  </body></html>`;
}
function attachmentsHtml(docs) {
	return `<!doctype html><html><head><meta charset="utf-8"><title>Paraf attachments</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px;max-width:800px;margin:auto}</style></head>
  <body><h1>Document attachments</h1>${docs.map((d) => `<article><h2>${esc(d.title)}</h2>${d.content.clauses.map((c) => `<h3>${esc(c.title)}</h3><p>${esc(c.body)}</p>`).join("")}</article>`).join("<hr/>")}</body></html>`;
}
var BootCtx = (0, import_react.createContext)(null);
function useBoot() {
	const v = (0, import_react.useContext)(BootCtx);
	if (!v) throw new Error("Boot missing");
	return v;
}
var MODULES = [
	{
		href: "/esignature/all-inbox",
		label: (t) => t.documents,
		icon: FileText,
		match: (p) => p.startsWith("/esignature") || p.startsWith("/send") || p.startsWith("/documents") || p.startsWith("/bulk") || p.startsWith("/proofs")
	},
	{
		href: "/approvals",
		label: (t) => t.approvals,
		icon: SquareCheckBig,
		match: (p) => p.startsWith("/approvals")
	},
	{
		href: "/contracts",
		label: (t) => t.contracts,
		icon: BookMarked,
		match: (p) => p.startsWith("/contracts")
	},
	{
		href: "/templates",
		label: (t) => t.templates,
		icon: LayoutTemplate,
		match: (p) => p.startsWith("/templates")
	},
	{
		href: "/emeterai",
		label: (t) => t.emeterai,
		icon: Stamp,
		match: (p) => p.startsWith("/emeterai")
	},
	{
		href: "/contacts",
		label: (t) => t.contacts,
		icon: Users,
		match: (p) => p.startsWith("/contacts")
	},
	{
		href: "/webhooks",
		label: (t) => t.developer,
		icon: Webhook,
		match: (p) => p.startsWith("/webhooks") || p.startsWith("/byok")
	},
	{
		href: "/settings",
		label: (t) => t.settings,
		icon: Settings,
		match: (p) => p.startsWith("/settings") || p.startsWith("/stamps")
	}
];
var DOC_STATUS = [
	{
		key: "need-to-sign",
		label: (t) => t.needSign
	},
	{
		key: "waiting-for-others",
		label: (t) => t.waiting
	},
	{
		key: "expiring-soon",
		label: (t) => t.insightExpiring
	},
	{
		key: "completed",
		label: (t) => t.completed
	}
];
var SUITE = [
	{
		letter: "P",
		name: "Paraf",
		hint: "Digital signature",
		href: "/esignature/all-inbox",
		current: true,
		tone: "bg-brand"
	},
	{
		letter: "B",
		name: "Paraf Books",
		hint: "Accounting",
		href: "/ai",
		current: false,
		tone: "bg-success"
	},
	{
		letter: "H",
		name: "Paraf HR",
		hint: "People & payroll",
		href: "/ai",
		current: false,
		tone: "bg-info"
	},
	{
		letter: "C",
		name: "Paraf Chat",
		hint: "Customer inbox",
		href: "/ai",
		current: false,
		tone: "bg-warning"
	},
	{
		letter: "F",
		name: "Paraf Flex",
		hint: "Benefits",
		href: "/ai",
		current: false,
		tone: "bg-brand"
	},
	{
		letter: "T",
		name: "Paraf Tax",
		hint: "Tax filing",
		href: "/ai",
		current: false,
		tone: "bg-rail"
	}
];
function AppShell({ boot, children }) {
	const t = useT();
	const loc = useLocation();
	const nav = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [apps, setApps] = (0, import_react.useState)(false);
	const [appsQ, setAppsQ] = (0, import_react.useState)("");
	const [headerQ, setHeaderQ] = (0, import_react.useState)("");
	const path = loc.pathname;
	const showDocSide = path.startsWith("/esignature") || path.startsWith("/send") || path.startsWith("/documents") || path.startsWith("/bulk") || path.startsWith("/proofs");
	const showMeteraiSide = path.startsWith("/emeterai");
	const showDevSide = path.startsWith("/webhooks") || path.startsWith("/byok");
	(0, import_react.useEffect)(() => {
		hydrateLang();
	}, []);
	(0, import_react.useEffect)(() => {
		setApps(false);
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootCtx.Provider, {
		value: boot,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-bg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "no-print sticky top-0 z-40 grid h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-header px-3 text-surface md:grid-cols-[1fr_minmax(16rem,28rem)_1fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md p-2 md:hidden",
								onClick: () => setOpen(true),
								"aria-label": "Menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/esignature/$folder",
								params: { folder: "all-inbox" },
								className: "flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, { light: true })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "relative hidden md:block",
							onSubmit: (e) => {
								e.preventDefault();
								nav({
									to: "/esignature/$folder",
									params: { folder: "all-inbox" },
									search: { q: headerQ }
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "h-8 w-full rounded-md border-0 bg-surface pr-3 pl-9 text-sm text-ink outline-none placeholder:text-subtle",
								placeholder: t.searchByDoc,
								value: headerQ,
								onChange: (e) => setHeaderQ(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/esignature/$folder",
									params: { folder: "getting-started" },
									className: "hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-surface hover:bg-surface/10 md:inline-flex",
									children: [t.needHelp, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "rounded-md p-2 text-surface hover:bg-surface/10",
										onClick: () => setApps((v) => !v),
										"aria-label": "Apps",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "size-4" })
									}), apps ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 z-50 mt-1 w-[420px] rounded-lg border border-border bg-surface p-4 text-ink shadow-soft",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "h-9 w-full rounded-md border border-border px-3 text-sm",
												placeholder: "Search",
												value: appsQ,
												onChange: (e) => setAppsQ(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 text-[11px] font-semibold tracking-wide text-muted uppercase",
												children: "All products"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "mt-2 grid grid-cols-4 gap-2",
												children: SUITE.filter((a) => !appsQ.trim() || a.name.toLowerCase().includes(appsQ.toLowerCase())).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: a.href,
													onClick: () => setApps(false),
													className: "flex flex-col items-center gap-1 rounded-md p-2 text-center hover:bg-surface-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("grid size-10 place-items-center rounded-lg text-sm font-bold text-white", a.tone),
															children: a.letter
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[11px] font-medium",
															children: a.name
														}),
														a.current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[9px] text-brand",
															children: "Current"
														}) : null
													]
												}) }, a.name))
											})
										]
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ml-1 grid size-8 place-items-center rounded-full bg-rail text-[11px] font-bold hover:opacity-90",
										children: initials(boot.user.name)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onSelect: () => window.location.href = "/settings",
										children: "My account"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSep, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onSelect: () => {
											signOut();
										},
										children: t.signOut
									})
								] })] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-[calc(100vh-48px)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "no-print hidden w-[88px] shrink-0 flex-col bg-rail pt-3 md:flex",
							children: MODULES.map((m) => {
								const active = m.match(path);
								const Icon = m.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: m.href,
									className: cn("mx-1.5 mb-0.5 flex flex-col items-center gap-1 rounded-md px-1 py-2.5 text-center text-[10px] leading-tight", active ? "bg-rail-hover font-semibold text-surface" : "text-surface/75 hover:bg-rail-hover hover:text-surface"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), m.label(t)]
								}, m.href);
							})
						}),
						showDocSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "no-print hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocSidebar, {
								boot,
								pathname: path,
								t,
								onNavigate: () => {}
							})
						}) : null,
						showMeteraiSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "no-print hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeteraiSidebar, {
								pathname: path,
								t
							})
						}) : null,
						showDevSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "no-print hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeveloperSidebar, {
								pathname: path,
								t
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							className: "min-w-0 flex-1 bg-bg",
							children
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "left",
						className: "w-72 p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "w-[84px] bg-rail pt-3",
								children: MODULES.map((m) => {
									const Icon = m.icon;
									const active = m.match(path);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: m.href,
										onClick: () => setOpen(false),
										className: cn("mx-1 mb-1 flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px]", active ? "bg-rail-hover text-surface" : "text-surface/80"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), m.label(t)]
									}, m.href);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 overflow-y-auto",
								children: [
									showDocSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocSidebar, {
										boot,
										pathname: path,
										t,
										onNavigate: () => setOpen(false)
									}) : null,
									showMeteraiSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeteraiSidebar, {
										pathname: path,
										t
									}) : null,
									showDevSide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeveloperSidebar, {
										pathname: path,
										t
									}) : null
								]
							})]
						})
					})
				})
			]
		})
	});
}
function DocSidebar({ boot, pathname, t, onNavigate }) {
	const qc = useQueryClient();
	const [folderOpen, setFolderOpen] = (0, import_react.useState)(false);
	const [folderName, setFolderName] = (0, import_react.useState)("");
	const [inboxOpen, setInboxOpen] = (0, import_react.useState)(false);
	const allActive = pathname === "/esignature/all-inbox" || pathname.startsWith("/esignature/sent") || pathname.startsWith("/esignature/drafts") || pathname.startsWith("/esignature/trash") || pathname.startsWith("/esignature/shared") || pathname.startsWith("/esignature/scheduled");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), t.upload]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => window.location.href = "/send",
						children: t.uploadDocument
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => window.location.href = "/send?intent=emeterai",
						children: t.requestEmeterai
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => window.location.href = "/bulk",
						children: t.bulkUpload
					})
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), t.download]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => {
							(async () => {
								downloadBlob("paraf-documents.html", documentsHtml((await exportWorkspace()).documents));
								toast.success("Documents downloaded");
							})();
						},
						children: t.downloadDocuments
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => {
							(async () => {
								const pack = await exportWorkspace();
								const titles = {};
								for (const d of pack.documents) titles[d.id] = d.title;
								downloadBlob("paraf-audit-trail.html", auditHtml(pack.audit, titles));
								toast.success("Audit trail downloaded");
							})();
						},
						children: t.downloadAudit
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => {
							(async () => {
								downloadBlob("paraf-attachments.html", attachmentsHtml((await exportWorkspace()).documents));
								toast.success("Attachments downloaded");
							})();
						},
						children: t.downloadAttachments
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
						onSelect: () => {
							(async () => {
								const pack = await exportWorkspace();
								const done = pack.documents.find((d) => d.status === "completed") ?? pack.documents[0];
								if (!done) {
									toast.error("No documents yet");
									return;
								}
								downloadBlob("paraf-certificate.html", certificateHtml(done));
								toast.success("Certificate downloaded");
							})();
						},
						children: t.downloadCert
					})
				] })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-1 text-[13px] font-semibold",
				children: t.documents
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 px-2 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/esignature/$folder",
							params: { folder: "all-inbox" },
							onClick: onNavigate,
							className: cn("flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", pathname === "/esignature/all-inbox" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
							children: t.allInbox
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded p-1 text-muted hover:bg-surface-2",
							onClick: () => setInboxOpen((v) => !v),
							"aria-label": "More inboxes",
							children: inboxOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })
						})]
					}), inboxOpen || allActive && pathname !== "/esignature/all-inbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-3 border-l border-border pl-2",
						children: [
							{
								key: "sent",
								label: t.sent
							},
							{
								key: "scheduled",
								label: t.scheduled
							},
							{
								key: "drafts",
								label: t.draft
							},
							{
								key: "trash",
								label: t.trash
							},
							{
								key: "shared",
								label: t.shared
							}
						].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/esignature/$folder",
							params: { folder: it.key },
							onClick: onNavigate,
							className: cn("block rounded-md px-2 py-1.5 text-[13px]", pathname === `/esignature/${it.key}` ? "font-medium text-brand" : "text-ink hover:bg-surface-2"),
							children: it.label
						}, it.key))
					}) : null] }),
					DOC_STATUS.map((it) => {
						const active = pathname === `/esignature/${it.key}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/esignature/$folder",
							params: { folder: it.key },
							onClick: onNavigate,
							className: cn("flex items-center rounded-md px-2 py-1.5 text-[13px]", active ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
							children: it.label(t)
						}, it.key);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between px-2 py-1 text-[13px] font-semibold",
						children: [t.folders, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded p-0.5 hover:bg-surface-2",
							onClick: () => setFolderOpen(true),
							"aria-label": "New folder",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5 text-muted" })
						})]
					}),
					boot.folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/esignature/$folder",
						params: { folder: "all-inbox" },
						search: { folderId: f.id },
						onClick: onNavigate,
						className: "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-ink hover:bg-surface-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4 text-muted" }), f.name]
					}, f.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-2 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/proofs",
					onClick: onNavigate,
					className: cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", pathname === "/proofs" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
					children: t.proofs
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/esignature/$folder",
					params: { folder: "getting-started" },
					onClick: onNavigate,
					className: cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", pathname === "/esignature/getting-started" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "size-4 text-muted" }), t.gettingStarted]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
				open: folderOpen,
				onOpenChange: setFolderOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
					title: "New folder",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: folderName,
						onChange: (e) => setFolderName(e.target.value),
						placeholder: "Folder name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: async () => {
							if (!folderName.trim()) return;
							await createFolder({ data: folderName.trim() });
							toast.success("Folder created");
							setFolderName("");
							setFolderOpen(false);
							qc.invalidateQueries({ queryKey: ["boot"] });
						},
						children: "Save"
					})]
				})
			})
		]
	});
}
function MeteraiSidebar({ pathname, t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "px-2 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/emeterai",
			className: cn("block rounded-md px-2 py-1.5 text-[13px]", pathname === "/emeterai" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
			children: t.quotaUsage
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/emeterai",
			className: cn("mt-1 block rounded-md px-2 py-1.5 text-[13px]", "text-ink hover:bg-surface-2"),
			children: t.assignEmeterai
		})]
	});
}
function DeveloperSidebar({ pathname, t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "px-2 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/webhooks",
			className: cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", pathname === "/webhooks" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Webhook, { className: "size-4 text-muted" }), t.webhooks]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/byok",
			className: cn("mt-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px]", pathname === "/byok" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4 text-muted" }), t.byok]
		})]
	});
}
function LangToggle() {
	const lang = useLang((s) => s.lang);
	const setLang = useLang((s) => s.setLang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-surface hover:bg-surface/10",
		onClick: () => setLang(lang === "id" ? "en" : "id"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4" }), lang.toUpperCase()]
	});
}
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "no-print flex flex-wrap items-center justify-between gap-3 bg-bg px-4 py-4 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold tracking-tight",
			children: title
		}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-sm text-muted",
			children: subtitle
		}) : null] }), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		}) : null]
	});
}
function EmptyState({ art, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-72",
			children: art
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: title
		})]
	});
}
//#endregion
export { MenuItem as a, PageHeader as c, certificateHtml as d, downloadBlob as f, useT as h, MenuContent as i, attachmentsHtml as l, useLang as m, EmptyState as n, MenuSep as o, useBoot as p, Menu$1 as r, MenuTrigger as s, AppShell as t, auditHtml as u };
