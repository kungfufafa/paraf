import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as listDocuments, m as getDocument, r as analyzeDocument } from "./api-BmE3vsND.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as PageHeader, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { r as getIntegrations } from "./integrations-api-BS8riFGh.mjs";
import { c as Route$27 } from "./router-CJfIBE85.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-D2DZLMDw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GUIDES = [
	{
		title: "Send a document",
		body: "Upload → add recipients → place signature fields → send. Recipients get a signing link.",
		to: "/send",
		cta: "Upload now"
	},
	{
		title: "Sign a document",
		body: "Open Need to sign, click Sign, agree to the terms, Start signing, pick an eSignature, then Finish.",
		folder: "need-to-sign",
		cta: "Go to Need to sign"
	},
	{
		title: "Request eMeterai",
		body: "Place a stamp while sending. Quota deducts from this workspace.",
		to: "/send?intent=emeterai",
		cta: "Request eMeterai"
	},
	{
		title: "Approvals",
		body: "Send a request before a document goes out. Approvers can approve or reject from the dashboard.",
		to: "/approvals",
		cta: "Open Approvals"
	},
	{
		title: "Templates",
		body: "Reuse a template, then Create document to jump into the send wizard with fields already placed.",
		to: "/templates",
		cta: "Open Templates"
	},
	{
		title: "eSignature settings",
		body: "Draw, type, or upload a signature once. It appears when you sign documents.",
		to: "/settings",
		cta: "Open Settings"
	},
	{
		title: "Webhooks",
		body: "Paste your HRIS / n8n URL. Send, sign, and void events POST out with HMAC — same plug-and-play as eMeterai.",
		to: "/webhooks",
		cta: "Connect webhook"
	},
	{
		title: "BYOK",
		body: "Bring your own signing secret, inbound API key, and AI provider key. Test, then every document uses them.",
		to: "/byok",
		cta: "Connect BYOK"
	}
];
function HelpPage() {
	const { id } = Route$27.useSearch();
	const boot = useBoot();
	const nav = useNavigate();
	const { data: docs = [] } = useQuery({
		queryKey: ["docs", "all"],
		queryFn: () => listDocuments({ data: { folder: "all-inbox" } })
	});
	const { data: integ } = useQuery({
		queryKey: ["integrations"],
		queryFn: () => getIntegrations()
	});
	const [picked, setPicked] = (0, import_react.useState)(id);
	const [out, setOut] = (0, import_react.useState)("");
	const [local, setLocal] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("");
	async function run() {
		const target = picked || docs[0]?.id;
		if (!target) return;
		setBusy(true);
		setOut("");
		setLocal(null);
		setErr("");
		try {
			const packed = await getDocument({ data: target });
			if (!packed?.document) return;
			const res = await analyzeDocument({ data: {
				title: packed.document.title,
				content: packed.document.content
			} });
			setProvider(res.provider);
			if (!res.ok && res.error && res.error !== "unavailable") setErr(res.error);
			const pack = res.local ?? {
				summary: res.text ?? "",
				findings: []
			};
			setLocal(pack);
			setOut(pack.summary || res.text || "");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Help",
			subtitle: `Hi ${boot.user.name.split(" ")[0]} — pick a flow and run it.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6",
			children: GUIDES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: g.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 flex-1 text-sm text-muted",
						children: g.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "mt-4",
						onClick: () => {
							if (g.folder) nav({
								to: "/esignature/$folder",
								params: { folder: g.folder }
							});
							else window.location.href = g.to;
						},
						children: g.cta
					})
				]
			}, g.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 mb-8 rounded-lg border border-border bg-surface p-4 md:mx-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "AI contract review"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: integ?.ai.connected ? `Using ${integ.ai.provider} / ${integ.ai.model}. Switch keys in Settings → AI review.` : "No remote key — local clause scan still runs. Plug xAI, OpenAI, Anthropic, Gemini, Groq, or a custom URL in Settings → AI review."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 min-w-56 rounded-md border border-border px-2 text-sm",
							value: picked ?? "",
							onChange: (e) => setPicked(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Pick a document"
							}), docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.title
							}, d.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: busy || !docs.length,
							onClick: () => void run(),
							children: busy ? "Analyzing…" : "Analyze"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/esignature/$folder",
								params: { folder: "all-inbox" },
								children: "Back to inbox"
							})
						})
					]
				}),
				err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: err
				}) : null,
				provider ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[11px] text-muted",
					children: ["Provider: ", provider]
				}) : null,
				out ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm whitespace-pre-wrap",
					children: out
				}) : null,
				local?.findings?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1 text-sm",
					children: local.findings.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: f.level }),
						" — ",
						f.title,
						": ",
						f.detail
					] }, f.title + f.detail.slice(0, 24)))
				}) : null
			]
		})
	] });
}
//#endregion
export { HelpPage as component };
