import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { H as workspaceExtras, t as addProof } from "./api-BmE3vsND.mjs";
import { g as formatIdDate } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, f as downloadBlob } from "./app-shell-DNQOiwL0.mjs";
import { i as getTsaChain } from "./integrations-api-BS8riFGh.mjs";
import { t as Textarea } from "./textarea-nUjVbxVA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proofs-2CGBtD1f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProofsPage() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["extras"],
		queryFn: () => workspaceExtras()
	});
	const { data: chain = [] } = useQuery({
		queryKey: ["tsa-chain"],
		queryFn: () => getTsaChain()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		notary: "",
		witness: "",
		notes: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Paraf Timestamp Authority",
			subtitle: "Internal HMAC-SHA256 hash chain (policy paraf-tsa-v1). Every send, sign, void, and approval is sealed here — not only in the audit table.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => {
					downloadBlob("paraf-tsa-chain.json", JSON.stringify(chain, null, 2), "application/json");
					toast.success("Chain downloaded");
				},
				children: "Download chain"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 p-4 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Official timestamp ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Serials are verifiable on the public verify page. This is Paraf's own TSA. A licensed RFC 3161 authority can be plugged in later without changing this ledger."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2",
							children: [chain.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/verify",
										search: { serial: row.serial },
										className: "font-mono text-sm text-brand hover:underline",
										children: row.serial
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted",
										children: formatIdDate(row.createdAt, true)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[11px] text-muted",
									children: [
										"hash ",
										(row.token.hash || "").slice(0, 16),
										"… · prev ",
										(row.token.prev || "").slice(0, 8)
									]
								})]
							}, row.serial)), !chain.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-sm text-muted",
								children: "No seals yet. Send or sign a document to mint the first timestamp."
							}) : null]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Bukti notaris / saksi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setOpen(true),
						children: "Tambah bukti"
					})]
				}),
				(data?.proofs ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Notaris: ", p.notary || "—"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Saksi: ", p.witness || "—"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: p.notes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-subtle",
							children: formatIdDate(p.created_at)
						})
					]
				}, p.id))
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: "Bukti baru",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Judul",
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Notaris",
							value: form.notary,
							onChange: (e) => setForm({
								...form,
								notary: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Saksi",
							value: form.witness,
							onChange: (e) => setForm({
								...form,
								witness: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Catatan",
							value: form.notes,
							onChange: (e) => setForm({
								...form,
								notes: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: async () => {
								await addProof({ data: form });
								toast.success("Bukti disimpan");
								setOpen(false);
								qc.invalidateQueries({ queryKey: ["extras"] });
							},
							children: "Simpan"
						})
					]
				})
			})
		})
	] });
}
//#endregion
export { ProofsPage as component };
