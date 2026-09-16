import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as lookupEmeterai, g as getPublicDocument } from "./api-BmE3vsND.mjs";
import { g as formatIdDate } from "./integrations-BY7zkbKR.mjs";
import { n as ParafLogo, t as Button } from "./button-CZaJ7tF_.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { c as lookupTsa } from "./integrations-api-BS8riFGh.mjs";
import { a as STATUS_LABEL } from "./types-DfCXKDmj.mjs";
import { l as Route$28 } from "./router-CJfIBE85.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-OjC0uS6C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const search = Route$28.useSearch();
	const [token, setToken] = (0, import_react.useState)(search.token ?? "");
	const [serial, setSerial] = (0, import_react.useState)(search.serial ?? "");
	const [msg, setMsg] = (0, import_react.useState)("");
	const [info, setInfo] = (0, import_react.useState)(null);
	const [stamp, setStamp] = (0, import_react.useState)(null);
	const [tsa, setTsa] = (0, import_react.useState)(null);
	async function checkSerial(sn) {
		setMsg("");
		setStamp(null);
		setTsa(null);
		const [row, tok] = await Promise.all([lookupEmeterai({ data: sn.trim() }), lookupTsa({ data: sn.trim() })]);
		if (row) setStamp(row);
		if (tok) setTsa(tok);
		if (!row && !tok) setMsg("Serial not found.");
	}
	(0, import_react.useEffect)(() => {
		if (search.serial) checkSerial(search.serial);
		if (search.token) getPublicDocument({ data: search.token }).then((doc) => {
			if (!doc) return;
			setInfo({
				title: doc.title,
				status: STATUS_LABEL[doc.status].id,
				completed: doc.completedAt,
				parties: doc.recipients.map((r) => r.name).join(", ")
			});
		});
	}, [search.serial, search.token]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-surface px-5 py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-lg px-5 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "Verify document / e-Meterai / TSA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Paste a signing token, an e-Meterai serial, or a Paraf TSA serial."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: token,
							onChange: (e) => setToken(e.target.value),
							placeholder: "tok_… signing token"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								setMsg("");
								setInfo(null);
								const doc = await getPublicDocument({ data: token.trim() });
								if (!doc) {
									setMsg("Token not found.");
									return;
								}
								setInfo({
									title: doc.title,
									status: STATUS_LABEL[doc.status].id,
									completed: doc.completedAt,
									parties: doc.recipients.map((r) => r.name).join(", ")
								});
							},
							children: "Check"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: serial,
							onChange: (e) => setSerial(e.target.value),
							placeholder: "e-Meterai or TSA-… serial"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void checkSerial(serial),
							children: "Serial"
						})]
					})]
				}),
				msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-danger",
					children: msg
				}) : null,
				info ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold tracking-wide text-success uppercase",
							children: "Found in Paraf ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-semibold",
							children: info.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: ["Status: ", info.status]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Parties: ", info.parties]
						}),
						info.completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: ["Locked ", formatIdDate(info.completed, true)]
						}) : null
					]
				}) : null,
				stamp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-6 rounded-xl border p-5 ${stamp.legal ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold tracking-wide uppercase",
							children: stamp.legal ? "Legally valid e-Meterai serial" : "DEMO stamp — not legally valid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-semibold",
							children: stamp.serial
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: stamp.title || "Document"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Provider: ",
								stamp.provider,
								" · Hash ",
								stamp.hash.slice(0, 16),
								"… · ",
								stamp.createdAt
							]
						})
					]
				}) : null,
				tsa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-6 rounded-xl border p-5 ${tsa.valid === false ? "border-danger/40 bg-danger-soft" : "border-success/40 bg-success-soft"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold tracking-wide uppercase",
							children: tsa.valid === false ? "TSA token failed HMAC check" : "Paraf TSA token — chain intact"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-semibold font-mono text-sm",
							children: tsa.serial
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: tsa.title || "Event sealed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								String(tsa.token.genTime ?? ""),
								" · hash ",
								String(tsa.token.hash || "").slice(0, 16),
								"… · prev ",
								String(tsa.token.prev || "").slice(0, 8)
							]
						})
					]
				}) : null
			]
		})]
	});
}
//#endregion
export { VerifyPage as component };
