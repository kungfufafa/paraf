import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as mutateDocument, x as listContracts } from "./api-BmE3vsND.mjs";
import { g as formatIdDate, m as exportDocsCsv } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MenuItem, c as PageHeader, h as useT, i as MenuContent, m as useLang, r as Menu$1, s as MenuTrigger } from "./app-shell-DNQOiwL0.mjs";
import { a as STATUS_LABEL, n as DOC_TYPE_LABEL } from "./types-DfCXKDmj.mjs";
import { r as Onboarding } from "./empty-art-Cbplun_d.mjs";
import { t as StatusBadge } from "./badge-DBlCBSWv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contracts-DC1R-cqJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function classify(d, now) {
	const exp = d.expiresAt ? new Date(d.expiresAt).getTime() : 0;
	if (d.status === "need_to_sign" || d.status === "waiting_for_others" || d.status === "pending_approval") return "upcoming";
	if (exp && exp < now) return "expired";
	if (exp && exp - now < 5184e6) return "expiring";
	return "active";
}
function ContractsPage() {
	const t = useT();
	const lang = useLang((s) => s.lang);
	const qc = useQueryClient();
	const nav = useNavigate();
	const { data = [] } = useQuery({
		queryKey: ["contracts"],
		queryFn: () => listContracts()
	});
	const [started, setStarted] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [type, setType] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const now = Date.now();
	const kpis = (0, import_react.useMemo)(() => {
		return {
			upcoming: data.filter((d) => classify(d, now) === "upcoming").length,
			active: data.filter((d) => classify(d, now) === "active").length,
			expiring: data.filter((d) => classify(d, now) === "expiring").length,
			expired: data.filter((d) => classify(d, now) === "expired").length,
			total: data.length
		};
	}, [data, now]);
	const rows = data.filter((d) => {
		if (tab !== "all" && classify(d, now) !== tab) return false;
		if (type !== "all" && d.docType !== type) return false;
		if (q && !d.title.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	});
	if (!started && data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {
		steps: [
			{
				n: "1",
				title: "Manage your contract",
				body: "Keep every signed agreement in one repository with dates and owners."
			},
			{
				n: "2",
				title: "Get notified",
				body: "Alerts before renewal so nothing expires quietly."
			},
			{
				n: "3",
				title: "Share your insights",
				body: "Export status, value, and upcoming renewals for the team."
			},
			{
				n: "4",
				title: "Analyze your contract",
				body: "See what’s active, expiring, and overdue at a glance."
			}
		],
		onStart: () => nav({ to: "/send" }),
		startLabel: t.uploadContract,
		learnLabel: t.learnMore
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t.contracts,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => exportDocsCsv(rows),
				children: "CSV"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/send",
					children: "Upload"
				})
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 px-4 py-4 md:grid-cols-5 md:px-6",
			children: [
				[
					"upcoming",
					"Upcoming",
					kpis.upcoming
				],
				[
					"active",
					"Active",
					kpis.active
				],
				[
					"expiring",
					"Expiring",
					kpis.expiring
				],
				[
					"expired",
					"Expired",
					kpis.expired
				],
				[
					"all",
					"All contracts",
					kpis.total
				]
			].map(([k, label, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab(k),
				className: `rounded-lg border px-3 py-3 text-left ${tab === k ? "border-brand bg-brand-soft" : "border-border bg-surface"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xl font-semibold tabular-nums text-brand",
					children: n
				})]
			}, k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 px-4 pb-3 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "h-9 rounded-md border border-border bg-surface px-3 text-sm",
				placeholder: "Search",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-9 rounded-md border border-border bg-surface px-2 text-sm",
				value: type,
				onChange: (e) => setType(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All types"
				}), Object.entries(DOC_TYPE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: k,
					children: v
				}, k))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto px-4 pb-10 md:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] overflow-hidden rounded-lg border border-border bg-surface text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface text-left text-[12px] font-medium text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Contract"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Effective"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Expires"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((d) => {
					const exp = d.expiresAt ? new Date(d.expiresAt).getTime() : 0;
					const soon = exp && exp - now < 5184e6 && exp > now;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/documents/$id",
									params: { id: d.id },
									className: "font-medium hover:text-brand",
									children: d.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted",
									children: d.groupName
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted",
								children: DOC_TYPE_LABEL[d.docType] ?? d.docType
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: formatIdDate(d.effectiveDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `px-3 py-3 ${soon ? "font-medium text-warning" : ""}`,
								children: formatIdDate(d.expiresAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: d.status,
									label: STATUS_LABEL[d.status][lang]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										children: "Actions"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onSelect: () => window.location.href = `/documents/${d.id}`,
										children: "View"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										onSelect: () => void exportDocsCsv([d]),
										children: "CSV"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
										danger: true,
										onSelect: async () => {
											await mutateDocument({ data: {
												id: d.id,
												action: "delete"
											} });
											toast.success("Moved out of contracts");
											qc.invalidateQueries({ queryKey: ["contracts"] });
										},
										children: "Remove"
									})
								] })] })
							})
						]
					}, d.id);
				}) })]
			})
		})
	] });
}
//#endregion
export { ContractsPage as component };
