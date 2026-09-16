import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as listDocuments, a as assignEmeterai, c as buyEmeterai } from "./api-BmE3vsND.mjs";
import { _ as formatRp, g as formatIdDate } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, h as useT, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/emeterai-DyYSRq_1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PACKS = [
	10,
	20,
	50,
	100
];
function EmeteraiPage() {
	const t = useT();
	const boot = useBoot();
	const qc = useQueryClient();
	const { data: docs = [] } = useQuery({
		queryKey: ["docs", "emeterai-recent"],
		queryFn: () => listDocuments({ data: { folder: "all-inbox" } })
	});
	const [buyOpen, setBuyOpen] = (0, import_react.useState)(false);
	const [assignOpen, setAssignOpen] = (0, import_react.useState)(false);
	const [qty, setQty] = (0, import_react.useState)(20);
	const [assignQty, setAssignQty] = (0, import_react.useState)(10);
	const [memberId, setMemberId] = (0, import_react.useState)("");
	const q = boot.quota;
	const team = boot.team ?? [];
	const assigned = team.reduce((s, m) => s + (Number(m.emeterai_assigned) || 0), 0);
	const pickMember = memberId || team[0]?.id || "";
	const ready = boot.emeterai?.legalReady;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { title: t.quotaUsage }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mx-4 mb-4 rounded-lg border px-4 py-3 text-sm md:mx-6 ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`,
			children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"API connected. New stamps get a provider serial and are marked ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "e-METERAI SAH" }),
				"."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"No Peruri/distributor API yet. You can still apply a stamp, but it is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DEMO — not legally valid" }),
				".",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					className: "font-medium underline",
					children: "Connect eMeterai API"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 px-4 md:grid-cols-3 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotaCard, {
					label: t.used,
					used: q.emeteraiUsed,
					total: q.emeteraiTotal,
					hint: "The remaining quota of eMeterai that can be used in the document.",
					until: "30/08/2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotaCard, {
					label: t.remaining,
					used: Math.max(0, q.emeteraiTotal - q.emeteraiUsed),
					total: q.emeteraiTotal,
					showUsedAsValue: true,
					hint: "The remaining quota of eMeterai that can be used in the document.",
					until: "30/08/2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotaCard, {
					label: t.assigned,
					used: assigned,
					total: q.emeteraiTotal,
					hint: "The remaining quota of eMeterai that has been assigned to the users."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pt-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-semibold",
					children: "How to assign eMeterai"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [
						{
							n: "1",
							title: "Set up users",
							body: "Invite teammates who can spend eMeterai from the company quota."
						},
						{
							n: "2",
							title: "Assign quota",
							body: "Give each user a monthly allocation so stamps stay controlled."
						},
						{
							n: "3",
							title: "Start using eMeterai",
							body: "Place a stamp while sending a document — quota deducts automatically."
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white",
								children: s.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: s.body
							})
						]
					}, s.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/send",
								search: { intent: "emeterai" },
								children: "Use in document"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setAssignOpen(true),
							children: "Assign eMeterai"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setBuyOpen(true),
							children: t.buyEmeterai
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-semibold",
				children: t.recentDocuments
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-lg border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-[12px] font-medium text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: t.docName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: t.lastModified
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: t.folderCol
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 4,
						className: "px-4 py-12 text-center text-sm text-muted",
						children: "You don't have any documents yet."
					}) }) : docs.slice(0, 12).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/documents/$id",
									params: { id: d.id },
									className: "font-medium hover:text-brand",
									children: d.title
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: d.docType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: formatIdDate(d.updatedAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: d.folderName || "—"
							})
						]
					}, d.id)) })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: assignOpen,
			onOpenChange: setAssignOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				title: "Assign eMeterai",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Give a user a monthly allocation from the company quota."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 w-full rounded-md border border-border px-3 text-sm",
						value: pickMember,
						onChange: (e) => setMemberId(e.target.value),
						children: [team.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Invite a user in Settings first"
						}) : null, team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: m.id,
							children: [
								m.name,
								" · ",
								m.emeterai_assigned,
								" assigned"
							]
						}, m.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "mt-2 h-10 w-full rounded-md border border-border px-3 text-sm",
						value: assignQty,
						onChange: (e) => setAssignQty(Number(e.target.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						disabled: !pickMember,
						onClick: async () => {
							await assignEmeterai({ data: {
								memberId: pickMember,
								qty: assignQty
							} });
							toast.success("Quota assigned");
							setAssignOpen(false);
							qc.invalidateQueries({ queryKey: ["boot"] });
						},
						children: "Assign"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: buyOpen,
			onOpenChange: setBuyOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				title: t.buyEmeterai,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Rp 10.000 per stamp. Quota is added instantly for this workspace."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: PACKS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setQty(n),
							className: `rounded-md border px-3 py-2 text-sm ${qty === n ? "border-brand bg-brand-soft" : "border-border"}`,
							children: [
								n,
								" · ",
								formatRp(n * 1e4)
							]
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4 w-full",
						onClick: async () => {
							await buyEmeterai({ data: qty });
							toast.success(`+${qty} eMeterai added`);
							setBuyOpen(false);
							qc.invalidateQueries();
						},
						children: ["Pay ", formatRp(qty * 1e4)]
					})
				]
			})
		})
	] });
}
function QuotaCard({ label, used, total, hint, until, showUsedAsValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-3xl font-semibold tabular-nums",
				children: used.toLocaleString("en-US")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: hint
			}),
			until ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: ["Valid until ", until]
			}) : null
		]
	});
}
//#endregion
export { EmeteraiPage as component };
