import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as saveApprovalTemplate, S as listDocuments, d as decideApproval, k as requestApproval, y as listApprovals } from "./api-BmE3vsND.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, h as useT } from "./app-shell-DNQOiwL0.mjs";
import { r as Onboarding } from "./empty-art-Cbplun_d.mjs";
import { t as Textarea } from "./textarea-nUjVbxVA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/approvals-SL03P1N-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApprovalsPage() {
	const t = useT();
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["approvals"],
		queryFn: () => listApprovals()
	});
	const { data: docs = [] } = useQuery({
		queryKey: ["docs", "all"],
		queryFn: () => listDocuments({ data: { folder: "all-inbox" } })
	});
	const has = (data?.approvals ?? []).length > 0;
	const [started, setStarted] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("requests");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		documentId: "",
		name: "Document approval",
		approverName: "",
		approverEmail: "",
		mode: "all",
		message: ""
	});
	const [tplName, setTplName] = (0, import_react.useState)("");
	const [tplLayers, setTplLayers] = (0, import_react.useState)("Legal, Finance, Direksi");
	const [tplMode, setTplMode] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		if (!form.documentId && docs[0]) setForm((f) => ({
			...f,
			documentId: docs[0].id
		}));
	}, [docs, form.documentId]);
	if (!started && !has) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {
		steps: [
			{
				n: "1",
				title: "Set up approval flow",
				body: "Choose who must approve before a document is sent."
			},
			{
				n: "2",
				title: "Set up approval template",
				body: "Reuse layers so every contract follows the same path."
			},
			{
				n: "3",
				title: "Set up approval request",
				body: "Send a request and track each decision in one place."
			}
		],
		onStart: () => {
			setStarted(true);
			setOpen(true);
		},
		startLabel: t.startNow,
		learnLabel: t.learnMore
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t.approvals,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => setOpen(true),
				children: "Request approval"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1 border-b border-border px-4 md:px-6",
			children: ["requests", "settings"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `border-b-2 px-3 py-2 text-sm ${tab === k ? "border-brand font-medium text-brand" : "border-transparent text-muted"}`,
				onClick: () => setTab(k),
				children: k === "requests" ? "Requests" : "Settings"
			}, k))
		}),
		tab === "requests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 lg:grid-cols-2 md:p-6",
			children: [(data?.approvals ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted",
						children: [
							"Layer ",
							a.layer,
							" · ",
							a.mode === "all" ? "All must approve" : "Any can approve"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: a.documentTitle || a.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							a.approverName,
							" · ",
							a.approverEmail,
							" · ",
							a.status
						]
					}),
					a.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: a.note
					}) : null,
					a.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: async () => {
								await decideApproval({ data: {
									id: a.id,
									status: "approved"
								} });
								toast.success("Approved");
								qc.invalidateQueries();
							},
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "danger",
							onClick: async () => {
								await decideApproval({ data: {
									id: a.id,
									status: "rejected",
									note: "Rejected from dashboard"
								} });
								toast.success("Rejected");
								qc.invalidateQueries();
							},
							children: "Reject"
						})]
					}) : null
				]
			}, a.id)), (data?.approvals ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No approval requests yet."
			}) : null]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Flow templates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Pick a template when uploading — all must approve, or any user can approve."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1fr_1fr_auto_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Template name",
							value: tplName,
							onChange: (e) => setTplName(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Layers, comma-separated",
							value: tplLayers,
							onChange: (e) => setTplLayers(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 rounded-md border border-border px-2 text-sm",
							value: tplMode,
							onChange: (e) => setTplMode(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All must approve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "any",
								children: "Any can approve"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								if (!tplName.trim()) return;
								const layers = tplLayers.split(",").map((s) => s.trim()).filter(Boolean).map((name, i) => ({
									layer: i + 1,
									name,
									mode: tplMode
								}));
								await saveApprovalTemplate({ data: {
									name: tplName.trim(),
									layers
								} });
								toast.success("Template saved");
								setTplName("");
								qc.invalidateQueries({ queryKey: ["approvals"] });
							},
							children: "Save template"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: (data?.templates ?? []).map((tpl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: tpl.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-1 text-xs text-muted",
							children: tpl.layers.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								l.layer,
								". ",
								l.name,
								" (",
								l.mode === "all" ? "all" : "any",
								")"
							] }, l.layer))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: async () => {
								await saveApprovalTemplate({ data: {
									id: tpl.id,
									name: tpl.name,
									remove: true
								} });
								toast.success("Template deleted");
								qc.invalidateQueries({ queryKey: ["approvals"] });
							},
							children: "Delete"
						})]
					}, tpl.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: "Request approval",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border border-border px-3 text-sm",
							value: form.documentId,
							onChange: (e) => setForm({
								...form,
								documentId: e.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "No document"
							}), docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.title
							}, d.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Request name",
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Approver name",
							value: form.approverName,
							onChange: (e) => setForm({
								...form,
								approverName: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Approver email",
							value: form.approverEmail,
							onChange: (e) => setForm({
								...form,
								approverEmail: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border border-border px-3 text-sm",
							value: form.mode,
							onChange: (e) => setForm({
								...form,
								mode: e.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All user(s) must approve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "any",
								children: "Any user can approve"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Message",
							value: form.message,
							onChange: (e) => setForm({
								...form,
								message: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: async () => {
								if (!form.approverName || !form.approverEmail) return;
								await requestApproval({ data: {
									documentId: form.documentId || void 0,
									name: form.name,
									approverName: form.approverName,
									approverEmail: form.approverEmail,
									mode: form.mode,
									message: form.message
								} });
								toast.success("Request sent");
								setOpen(false);
								qc.invalidateQueries();
							},
							children: "Send"
						})
					]
				})
			})
		})
	] });
}
//#endregion
export { ApprovalsPage as component };
