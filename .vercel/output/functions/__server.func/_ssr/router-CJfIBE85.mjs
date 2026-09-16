import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, _ as createFileRoute, g as lazyRouteComponent, h as Outlet, l as Scripts, m as createRouter, u as HeadContent, v as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { bn as union, gn as object, hn as number, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { B as verifyTsa, C as listTsa, R as uid, S as issueWorkspaceTsa, f as ensureIntegrationTables, i as blankContent, u as dispatchWebhook, w as listWebhookDeliveries, y as getSql, z as userIdFromApiKey } from "./integrations-BY7zkbKR.mjs";
import { s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as DEFAULT_SETTINGS } from "./types-DfCXKDmj.mjs";
import { n as auth } from "./server-BEl3GeX9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CJfIBE85.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 15e3,
	retry: 1,
	refetchOnWindowFocus: false
} } });
var styles_default = "/assets/styles-Cf7i-oNY.css";
var APP_NAME = "Paraf";
var Route$33 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#E85D04"
			},
			{
				name: "description",
				content: "Tanda tangan digital tersertifikasi PSrE dan e-Meterai resmi."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "id",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
				client: queryClient,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-right",
					richColors: true
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$23 = () => import("./routes-BSAySs9H.mjs");
var Route$32 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("../_app-BqnJP3W0.mjs");
var Route$31 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./coba-Z1Gwh-GL.mjs");
var Route$30 = createFileRoute("/coba")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./login-BiMITh3B.mjs");
var Route$29 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./verify-OjC0uS6C.mjs");
var Route$28 = createFileRoute("/verify")({
	validateSearch: (s) => ({
		serial: typeof s.serial === "string" ? s.serial : void 0,
		token: typeof s.token === "string" ? s.token : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./ai-D2DZLMDw.mjs");
var Route$27 = createFileRoute("/_app/ai")({
	validateSearch: (s) => ({ id: typeof s.id === "string" ? s.id : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./approvals-SL03P1N-.mjs");
var Route$26 = createFileRoute("/_app/approvals")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./bulk-D6_jxuTE.mjs");
var Route$25 = createFileRoute("/_app/bulk")({
	validateSearch: (s) => ({ template: typeof s.template === "string" ? s.template : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./byok-D6sauSuV.mjs");
var Route$24 = createFileRoute("/_app/byok")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./contacts-NQmjnXhs.mjs");
var Route$23 = createFileRoute("/_app/contacts")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./contracts-DC1R-cqJ.mjs");
var Route$22 = createFileRoute("/_app/contracts")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./emeterai-DyYSRq_1.mjs");
var Route$21 = createFileRoute("/_app/emeterai")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./insight-DTaMxqrw.mjs");
var Route$20 = createFileRoute("/_app/insight")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./proofs-2CGBtD1f.mjs");
var Route$19 = createFileRoute("/_app/proofs")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./send-DEk-8Ygv.mjs");
var Route$18 = createFileRoute("/_app/send")({
	validateSearch: (s) => ({
		intent: s.intent === "emeterai" ? "emeterai" : void 0,
		template: typeof s.template === "string" ? s.template : void 0,
		toEmail: typeof s.toEmail === "string" ? s.toEmail : void 0,
		toName: typeof s.toName === "string" ? s.toName : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./settings-B0hT_v5e.mjs");
var Route$17 = createFileRoute("/_app/settings")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./stamps-p8Wbvi6F.mjs");
var Route$16 = createFileRoute("/_app/stamps")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./templates-BS40q2HR.mjs");
var Route$15 = createFileRoute("/_app/templates")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./webhooks-B1Gz5fzM.mjs");
var Route$14 = createFileRoute("/_app/webhooks")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./s._token-DXxKDDug.mjs");
var Route$13 = createFileRoute("/s/$token")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./documents._id-8CoNJaS7.mjs");
var Route$12 = createFileRoute("/_app/documents/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./esignature.index-DEwlOQRd.mjs");
var Route$11 = createFileRoute("/_app/esignature/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./esignature._folder-Czaega6P.mjs");
var Route$10 = createFileRoute("/_app/esignature/$folder")({
	validateSearch: (s) => ({
		q: typeof s.q === "string" ? s.q : void 0,
		folderId: typeof s.folderId === "string" ? s.folderId : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Route$9 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
async function requireApiUser(request) {
	const userId = await userIdFromApiKey(request.headers.get("authorization"));
	if (!userId) return {
		userId: null,
		error: Response.json({ error: "Unauthorized. Use Authorization: Bearer paraf_live_…" }, { status: 401 })
	};
	return {
		userId,
		error: null
	};
}
async function readJson(req) {
	try {
		return await req.json();
	} catch {
		return {};
	}
}
var Route$8 = createFileRoute("/api/v1/documents")({ server: { handlers: {
	GET: async ({ request }) => {
		const { userId, error } = await requireApiUser(request);
		if (error || !userId) return error;
		const rows = await (await getSql())`
          select id, title, status, token, updated_at from documents where user_id = ${userId} order by updated_at desc limit 50
        `;
		return Response.json({ documents: rows.map((r) => ({
			...r,
			signingUrl: `/s/${r.token}`
		})) });
	},
	POST: async ({ request }) => {
		const { userId, error } = await requireApiUser(request);
		if (error || !userId) return error;
		const body = await readJson(request);
		const title = String(body.title || "Untitled");
		const send = Boolean(body.send);
		const docType = String(body.docType || "other");
		const recipients = Array.isArray(body.recipients) ? body.recipients : [];
		if (!recipients.length) return Response.json({ error: "recipients required" }, { status: 400 });
		await ensureIntegrationTables();
		const sql = await getSql();
		const id = uid("doc");
		const token = uid("tok");
		const content = body.content && typeof body.content === "object" ? body.content : blankContent(docType, title, String(body.company || "HRIS"));
		await sql`
          insert into documents (
            id, user_id, title, doc_type, status, compliance, group_name, content_json, fields_json, settings_json, token, sent_at
          ) values (
            ${id}, ${userId}, ${title}, ${docType}, ${send ? "waiting_for_others" : "draft"}, ${"psre"}, ${"API"},
            ${JSON.stringify(content)}, ${"[]"}, ${JSON.stringify(DEFAULT_SETTINGS)}, ${token}, ${send ? (/* @__PURE__ */ new Date()).toISOString() : null}
          )
        `;
		for (const [i, r] of recipients.entries()) await sql`
            insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, invite_token)
            values (${uid("rc")}, ${userId}, ${id}, ${r.name || r.email}, ${r.email}, ${"signer"}, ${"needs_to_sign"}, ${"waiting"}, ${i + 1}, ${uid("inv")})
          `;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${send ? "Dokumen dikirim via API" : "Draf dibuat via API"})`;
		if (send) {
			await issueWorkspaceTsa(userId, id, "document.sent", { source: "api" });
			dispatchWebhook(userId, "document.sent", {
				documentId: id,
				title,
				source: "hris",
				token
			});
		}
		const recs = await sql`
          select email, name, invite_token from recipients where document_id = ${id} order by order_index
        `;
		return Response.json({
			id,
			token,
			signingUrl: `/s/${token}`,
			recipients: recs.map((r) => ({
				name: r.name,
				email: r.email,
				signingUrl: `/s/${r.invite_token || token}`
			}))
		}, { status: 201 });
	}
} } });
var Route$7 = createFileRoute("/api/v1/events")({ server: { handlers: { GET: async ({ request }) => {
	const { userId, error } = await requireApiUser(request);
	if (error || !userId) return error;
	const rows = await listWebhookDeliveries(userId);
	return Response.json({ events: rows.map((r) => ({
		id: r.id,
		event: r.event,
		status: r.status,
		error: r.error,
		createdAt: r.created_at
	})) });
} } } });
var Route$6 = createFileRoute("/api/v1/hooks")({ server: { handlers: {
	GET: async ({ request }) => {
		const { userId, error } = await requireApiUser(request);
		if (error || !userId) return error;
		return Response.json({
			ok: true,
			inbound: "POST JSON { event, data } with Authorization: Bearer paraf_live_…",
			events: [
				"document.create",
				"document.sent",
				"document.void",
				"document.remind"
			]
		});
	},
	POST: async ({ request }) => {
		const { userId, error } = await requireApiUser(request);
		if (error || !userId) return error;
		const body = await readJson(request);
		const event = String(body.event || body.type || "document.create");
		const data = body.data && typeof body.data === "object" ? body.data : body;
		await ensureIntegrationTables();
		const sql = await getSql();
		if (event === "document.void" || event === "document.voided") {
			const id = String(data.documentId || data.id || "");
			if (!id) return Response.json({ error: "documentId required" }, { status: 400 });
			await sql`update documents set status = ${"voided"} where id = ${id} and user_id = ${userId}`;
			await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${"Dokumen dibatalkan via webhook"})`;
			await issueWorkspaceTsa(userId, id, "document.voided", { source: "hook" });
			dispatchWebhook(userId, "document.voided", {
				documentId: id,
				source: "hook"
			});
			return Response.json({
				ok: true,
				documentId: id,
				event: "document.voided"
			});
		}
		if (event === "document.remind" || event === "document.reminded") {
			const id = String(data.documentId || data.id || "");
			if (!id) return Response.json({ error: "documentId required" }, { status: 400 });
			await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${"Pengingat via webhook"})`;
			await issueWorkspaceTsa(userId, id, "document.reminded", { source: "hook" });
			dispatchWebhook(userId, "document.reminded", {
				documentId: id,
				source: "hook"
			});
			return Response.json({
				ok: true,
				documentId: id,
				event: "document.reminded"
			});
		}
		const title = String(data.title || "Untitled");
		const send = Boolean(data.send) || event === "document.sent";
		const docType = String(data.docType || "other");
		const recipients = Array.isArray(data.recipients) ? data.recipients : [];
		if (!recipients.length) return Response.json({ error: "recipients required" }, { status: 400 });
		const id = uid("doc");
		const token = uid("tok");
		const content = data.content && typeof data.content === "object" ? data.content : blankContent(docType, title, String(data.company || "HRIS"));
		await sql`
          insert into documents (
            id, user_id, title, doc_type, status, compliance, group_name, content_json, fields_json, settings_json, token, sent_at
          ) values (
            ${id}, ${userId}, ${title}, ${docType}, ${send ? "waiting_for_others" : "draft"}, ${"psre"}, ${"API"},
            ${JSON.stringify(content)}, ${"[]"}, ${JSON.stringify(DEFAULT_SETTINGS)}, ${token}, ${send ? (/* @__PURE__ */ new Date()).toISOString() : null}
          )
        `;
		for (const [i, r] of recipients.entries()) await sql`
            insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, invite_token)
            values (${uid("rc")}, ${userId}, ${id}, ${r.name || r.email}, ${r.email}, ${"signer"}, ${"needs_to_sign"}, ${"waiting"}, ${i + 1}, ${uid("inv")})
          `;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${send ? "Dokumen dikirim via webhook" : "Draf dibuat via webhook"})`;
		if (send) {
			await issueWorkspaceTsa(userId, id, "document.sent", { source: "hook" });
			dispatchWebhook(userId, "document.sent", {
				documentId: id,
				title,
				source: "hook",
				token
			});
		}
		const recs = await sql`
          select email, name, invite_token from recipients where document_id = ${id} order by order_index
        `;
		return Response.json({
			id,
			token,
			signingUrl: `/s/${token}`,
			recipients: recs.map((r) => ({
				name: r.name,
				email: r.email,
				signingUrl: `/s/${r.invite_token || token}`
			})),
			event: send ? "document.sent" : "document.create"
		}, { status: 201 });
	}
} } });
var Route$5 = createFileRoute("/api/v1/me")({ server: { handlers: { GET: async ({ request }) => {
	const { userId, error } = await requireApiUser(request);
	if (error || !userId) return error;
	const sql = await getSql();
	const user = (await sql`select email, name from "user" where id = ${userId} limit 1`)[0];
	const company = (await sql`select name, plan from companies where user_id = ${userId} limit 1`)[0];
	return Response.json({
		ok: true,
		email: user?.email,
		name: user?.name,
		company: company?.name,
		plan: company?.plan
	});
} } } });
var SPEC = {
	openapi: "3.0.3",
	info: {
		title: "Paraf HRIS/ERP API",
		version: "1.0.0",
		description: "Inbound REST for HRIS/ERP. Auth: Bearer paraf_live_…"
	},
	security: [{ bearer: [] }],
	components: { securitySchemes: { bearer: {
		type: "http",
		scheme: "bearer",
		bearerFormat: "paraf_live"
	} } },
	paths: {
		"/api/v1/me": { get: { summary: "Workspace identity" } },
		"/api/v1/documents": {
			get: { summary: "List documents" },
			post: {
				summary: "Create (and optionally send) a document",
				requestBody: { content: { "application/json": { schema: {
					type: "object",
					required: ["title", "recipients"],
					properties: {
						title: { type: "string" },
						docType: { type: "string" },
						send: { type: "boolean" },
						recipients: {
							type: "array",
							items: {
								type: "object",
								properties: {
									name: { type: "string" },
									email: { type: "string" }
								}
							}
						}
					}
				} } } }
			}
		},
		"/api/v1/documents/{id}": {
			get: { summary: "Get one document + TSA serials" },
			post: { summary: "action=void | remind" }
		},
		"/api/v1/events": { get: { summary: "Outbound webhook delivery log" } },
		"/api/v1/hooks": {
			get: { summary: "Inbound hook contract (auth required)" },
			post: {
				summary: "HRIS → Paraf: document.create | document.sent | document.void | document.remind",
				requestBody: { content: { "application/json": { schema: {
					type: "object",
					required: ["event"],
					properties: {
						event: { type: "string" },
						data: { type: "object" }
					}
				} } } }
			}
		},
		"/api/v1/tsa": { get: { summary: "Workspace timestamp chain" } },
		"/api/v1/tsa/{serial}": { get: { summary: "Public verify a Paraf TSA serial (no auth)" } }
	}
};
var Route$4 = createFileRoute("/api/v1/openapi")({ server: { handlers: { GET: async () => Response.json(SPEC) } } });
var Route$3 = createFileRoute("/api/v1/tsa")({ server: { handlers: { GET: async ({ request }) => {
	const { userId, error } = await requireApiUser(request);
	if (error || !userId) return error;
	const documentId = new URL(request.url).searchParams.get("documentId") || void 0;
	const rows = await listTsa(userId, documentId);
	return Response.json({ tokens: rows.map((r) => ({
		serial: r.serial,
		createdAt: r.created_at,
		documentId: r.document_id,
		token: JSON.parse(r.token_json)
	})) });
} } } });
var $$splitComponentImporter = () => import("./documents._id.sign-BAz4R3ZY.mjs");
var Route$2 = createFileRoute("/_app/documents/$id/sign")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$1 = createFileRoute("/api/v1/documents/$id")({ server: { handlers: {
	GET: async ({ request, params }) => {
		const { userId, error } = await requireApiUser(request);
		if (error || !userId) return error;
		const sql = await getSql();
		const row = (await sql`
            select id, title, status, token, updated_at from documents where id = ${params.id} and user_id = ${userId} limit 1
          `)[0];
		if (!row) return Response.json({ error: "Not found" }, { status: 404 });
		const recs = await sql`
          select name, email, status, role from recipients where document_id = ${params.id}
        `;
		const tsa = await listTsa(userId, params.id);
		return Response.json({
			...row,
			recipients: recs,
			signingUrl: `/s/${row.token}`,
			tsa: tsa.map((t) => ({
				serial: t.serial,
				createdAt: t.created_at
			}))
		});
	},
	POST: async ({ request, params }) => {
		const { userId, error } = await requireApiUser(request);
		if (error || !userId) return error;
		const body = await readJson(request);
		const action = String(body.action || "");
		const sql = await getSql();
		if (!(await sql`select id from documents where id = ${params.id} and user_id = ${userId} limit 1`)[0]) return Response.json({ error: "Not found" }, { status: 404 });
		if (action === "void") {
			await sql`update documents set status = 'voided', voided_at = now(), updated_at = now() where id = ${params.id} and user_id = ${userId}`;
			await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${params.id}, ${"HRIS/ERP"}, ${"Dokumen dibatalkan via API"})`;
			await issueWorkspaceTsa(userId, params.id, "document.voided", { source: "api" });
			dispatchWebhook(userId, "document.voided", {
				documentId: params.id,
				source: "hris"
			});
			return Response.json({
				ok: true,
				status: "voided"
			});
		}
		if (action === "remind") {
			await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${params.id}, ${"HRIS/ERP"}, ${"Pengingat via API"})`;
			await issueWorkspaceTsa(userId, params.id, "document.reminded", { source: "api" });
			dispatchWebhook(userId, "document.reminded", {
				documentId: params.id,
				source: "hris"
			});
			return Response.json({ ok: true });
		}
		return Response.json({ error: "action must be void or remind" }, { status: 400 });
	}
} } });
var Route = createFileRoute("/api/v1/tsa/$serial")({ server: { handlers: { GET: async ({ params }) => {
	await ensureIntegrationTables();
	const sql = await getSql();
	const row = (await sql`
            select serial, token_json, document_id, created_at, user_id from tsa_tokens where serial = ${params.serial} limit 1
          `)[0];
	if (!row) return Response.json({ error: "Not found" }, { status: 404 });
	const token = JSON.parse(row.token_json);
	const valid = await verifyTsa(row.user_id, token);
	let title = "";
	if (row.document_id) title = (await sql`select title from documents where id = ${row.document_id}`)[0]?.title ?? "";
	return Response.json({
		serial: row.serial,
		valid,
		title,
		createdAt: row.created_at,
		token
	});
} } } });
var IndexRoute = Route$32.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$33
});
var AppRoute = Route$31.update({
	id: "/_app",
	getParentRoute: () => Route$33
});
var CobaRoute = Route$30.update({
	id: "/coba",
	path: "/coba",
	getParentRoute: () => Route$33
});
var LoginRoute = Route$29.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$33
});
var VerifyRoute = Route$28.update({
	id: "/verify",
	path: "/verify",
	getParentRoute: () => Route$33
});
var AppAiRoute = Route$27.update({
	id: "/ai",
	path: "/ai",
	getParentRoute: () => AppRoute
});
var AppApprovalsRoute = Route$26.update({
	id: "/approvals",
	path: "/approvals",
	getParentRoute: () => AppRoute
});
var AppBulkRoute = Route$25.update({
	id: "/bulk",
	path: "/bulk",
	getParentRoute: () => AppRoute
});
var AppByokRoute = Route$24.update({
	id: "/byok",
	path: "/byok",
	getParentRoute: () => AppRoute
});
var AppContactsRoute = Route$23.update({
	id: "/contacts",
	path: "/contacts",
	getParentRoute: () => AppRoute
});
var AppContractsRoute = Route$22.update({
	id: "/contracts",
	path: "/contracts",
	getParentRoute: () => AppRoute
});
var AppEmeteraiRoute = Route$21.update({
	id: "/emeterai",
	path: "/emeterai",
	getParentRoute: () => AppRoute
});
var AppInsightRoute = Route$20.update({
	id: "/insight",
	path: "/insight",
	getParentRoute: () => AppRoute
});
var AppProofsRoute = Route$19.update({
	id: "/proofs",
	path: "/proofs",
	getParentRoute: () => AppRoute
});
var AppSendRoute = Route$18.update({
	id: "/send",
	path: "/send",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$17.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppStampsRoute = Route$16.update({
	id: "/stamps",
	path: "/stamps",
	getParentRoute: () => AppRoute
});
var AppTemplatesRoute = Route$15.update({
	id: "/templates",
	path: "/templates",
	getParentRoute: () => AppRoute
});
var AppWebhooksRoute = Route$14.update({
	id: "/webhooks",
	path: "/webhooks",
	getParentRoute: () => AppRoute
});
var STokenRoute = Route$13.update({
	id: "/s/$token",
	path: "/s/$token",
	getParentRoute: () => Route$33
});
var AppDocumentsIdRoute = Route$12.update({
	id: "/documents/$id",
	path: "/documents/$id",
	getParentRoute: () => AppRoute
});
var AppEsignatureIndexRoute = Route$11.update({
	id: "/esignature/",
	path: "/esignature/",
	getParentRoute: () => AppRoute
});
var AppEsignatureFolderRoute = Route$10.update({
	id: "/esignature/$folder",
	path: "/esignature/$folder",
	getParentRoute: () => AppRoute
});
var ApiAuthSplatRoute = Route$9.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$33
});
var ApiV1DocumentsRoute = Route$8.update({
	id: "/api/v1/documents",
	path: "/api/v1/documents",
	getParentRoute: () => Route$33
});
var ApiV1EventsRoute = Route$7.update({
	id: "/api/v1/events",
	path: "/api/v1/events",
	getParentRoute: () => Route$33
});
var ApiV1HooksRoute = Route$6.update({
	id: "/api/v1/hooks",
	path: "/api/v1/hooks",
	getParentRoute: () => Route$33
});
var ApiV1MeRoute = Route$5.update({
	id: "/api/v1/me",
	path: "/api/v1/me",
	getParentRoute: () => Route$33
});
var ApiV1OpenapiRoute = Route$4.update({
	id: "/api/v1/openapi",
	path: "/api/v1/openapi",
	getParentRoute: () => Route$33
});
var ApiV1TsaRoute = Route$3.update({
	id: "/api/v1/tsa",
	path: "/api/v1/tsa",
	getParentRoute: () => Route$33
});
var AppDocumentsIdSignRoute = Route$2.update({
	id: "/sign",
	path: "/sign",
	getParentRoute: () => AppDocumentsIdRoute
});
var ApiV1DocumentsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiV1DocumentsRoute
});
var ApiV1TsaSerialRoute = Route.update({
	id: "/$serial",
	path: "/$serial",
	getParentRoute: () => ApiV1TsaRoute
});
var AppDocumentsIdRouteChildren = { AppDocumentsIdSignRoute };
var AppRouteChildren = {
	AppAiRoute,
	AppApprovalsRoute,
	AppBulkRoute,
	AppByokRoute,
	AppContactsRoute,
	AppContractsRoute,
	AppEmeteraiRoute,
	AppInsightRoute,
	AppProofsRoute,
	AppSendRoute,
	AppSettingsRoute,
	AppStampsRoute,
	AppTemplatesRoute,
	AppWebhooksRoute,
	AppDocumentsIdRoute: AppDocumentsIdRoute._addFileChildren(AppDocumentsIdRouteChildren),
	AppEsignatureFolderRoute,
	AppEsignatureIndexRoute
};
var AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
var ApiV1DocumentsRouteChildren = { ApiV1DocumentsIdRoute };
var ApiV1DocumentsRouteWithChildren = ApiV1DocumentsRoute._addFileChildren(ApiV1DocumentsRouteChildren);
var ApiV1TsaRouteChildren = { ApiV1TsaSerialRoute };
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRouteWithChildren,
	CobaRoute,
	LoginRoute,
	VerifyRoute,
	STokenRoute,
	ApiAuthSplatRoute,
	ApiV1DocumentsRoute: ApiV1DocumentsRouteWithChildren,
	ApiV1EventsRoute,
	ApiV1HooksRoute,
	ApiV1MeRoute,
	ApiV1OpenapiRoute,
	ApiV1TsaRoute: ApiV1TsaRoute._addFileChildren(ApiV1TsaRouteChildren)
};
var routeTree = Route$33._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$13 as a, Route$27 as c, Route$12 as i, Route$28 as l, Route$2 as n, Route$18 as o, Route$10 as r, Route$25 as s, router_exports as t };
