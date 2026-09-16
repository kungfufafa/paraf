import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { L as saveTemplate, T as listTemplates } from "./api-BmE3vsND.mjs";
import { i as blankContent } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MenuItem, c as PageHeader, h as useT, i as MenuContent, n as EmptyState, o as MenuSep, p as useBoot, r as Menu$1, s as MenuTrigger } from "./app-shell-DNQOiwL0.mjs";
import { n as DOC_TYPE_LABEL } from "./types-DfCXKDmj.mjs";
import { i as TemplateEmpty } from "./empty-art-Cbplun_d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/templates-BS40q2HR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TemplatesPage() {
	const t = useT();
	const boot = useBoot();
	const nav = useNavigate();
	const qc = useQueryClient();
	const { data = [] } = useQuery({
		queryKey: ["templates"],
		queryFn: () => listTemplates()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [docType, setDocType] = (0, import_react.useState)("pkwt");
	const [description, setDescription] = (0, import_react.useState)("");
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const shown = data.filter((t) => !q.trim() || t.name.toLowerCase().includes(q.toLowerCase()) || t.docType.toLowerCase().includes(q.toLowerCase()));
	function startCreate() {
		setEditId(null);
		setName("");
		setDocType("pkwt");
		setDescription("");
		setOpen(true);
	}
	function startEdit(tpl) {
		setEditId(tpl.id);
		setName(tpl.name);
		setDocType(tpl.docType);
		setDescription(tpl.description);
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t.myTemplates,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: startCreate,
				children: t.newTemplate
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end px-4 md:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-8 w-56 rounded-md border border-border bg-surface px-3 text-xs",
				placeholder: t.searchTemplates,
				value: q,
				onChange: (e) => setQ(e.target.value)
			})
		}),
		shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-4 mt-3 rounded-lg border border-border bg-surface md:mx-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				art: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateEmpty, {}),
				title: t.noTemplates
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6",
			children: shown.map((tpl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold tracking-wide text-brand uppercase",
						children: DOC_TYPE_LABEL[tpl.docType] ?? tpl.docType
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-semibold",
						children: tpl.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 flex-1 text-sm text-muted",
						children: tpl.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-[11px] text-subtle",
						children: [
							tpl.uses,
							" uses · ",
							tpl.compliance === "globalsign" ? "GlobalSign" : "PSrE"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => nav({
								to: "/send",
								search: { template: tpl.id }
							}),
							children: "Create document"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								children: "Actions"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								onSelect: () => setPreview(tpl),
								children: "Preview template"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								onSelect: () => startEdit(tpl),
								children: "Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								onSelect: () => nav({
									to: "/send",
									search: { template: tpl.id }
								}),
								children: "Create document"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								onSelect: () => nav({
									to: "/bulk",
									search: { template: tpl.id }
								}),
								children: "Bulk send"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSep, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								danger: true,
								onSelect: async () => {
									await saveTemplate({ data: {
										id: tpl.id,
										name: tpl.name,
										docType: tpl.docType,
										content: tpl.content,
										remove: true
									} });
									toast.success("Template deleted");
									qc.invalidateQueries({ queryKey: ["templates"] });
								},
								children: "Delete"
							})
						] })] })]
					})
				]
			}, tpl.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: editId ? "Edit template" : "Create template",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Template name",
							value: name,
							onChange: (e) => setName(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Description",
							value: description,
							onChange: (e) => setDescription(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-10 w-full rounded-md border border-border px-3 text-sm",
							value: docType,
							onChange: (e) => setDocType(e.target.value),
							children: Object.entries(DOC_TYPE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: v
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: async () => {
								if (!name.trim()) return;
								const existing = editId ? data.find((x) => x.id === editId) : void 0;
								await saveTemplate({ data: {
									id: editId ?? void 0,
									name,
									docType,
									description: description || "Custom template · " + boot.company.name,
									content: existing?.content ?? blankContent(docType, name, boot.company.name),
									fields: existing?.fields
								} });
								toast.success(editId ? "Template updated" : "Template created");
								setOpen(false);
								setName("");
								setEditId(null);
								qc.invalidateQueries({ queryKey: ["templates"] });
							},
							children: "Save"
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(preview),
			onOpenChange: () => setPreview(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				title: preview?.name ?? "Preview",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: preview?.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-3 list-decimal space-y-1 pl-4 text-sm",
					children: preview?.content.clauses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: c.title }),
						" — ",
						c.body.slice(0, 120)
					] }, c.title))
				})]
			})
		})
	] });
}
//#endregion
export { TemplatesPage as component };
