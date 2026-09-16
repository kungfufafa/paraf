import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as mutateDocument, S as listDocuments, s as bulkSignDocs } from "./api-BmE3vsND.mjs";
import { I as signingLink, M as relativeId, O as progress, c as cn, s as canSign } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { C as Funnel, D as Ellipsis, f as Search, g as PenLine } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MenuItem, c as PageHeader, h as useT, i as MenuContent, m as useLang, n as EmptyState, o as MenuSep, p as useBoot, r as Menu$1, s as MenuTrigger } from "./app-shell-DNQOiwL0.mjs";
import { a as STATUS_LABEL } from "./types-DfCXKDmj.mjs";
import { r as Route$10 } from "./router-CJfIBE85.mjs";
import { n as DeskEmpty } from "./empty-art-Cbplun_d.mjs";
import { t as StatusBadge } from "./badge-DBlCBSWv.mjs";
import { t as SignPad } from "./sign-pad-BMT1PYZ8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/esignature._folder-Czaega6P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkbox({ checked, onChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": checked,
		onClick: () => onChange?.(!checked),
		className: cn("grid size-4 shrink-0 place-items-center rounded-xs border transition-colors", checked ? "border-brand bg-brand text-white" : "border-border-strong bg-surface", className),
		children: checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 12 12",
			className: "size-3",
			fill: "none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M2 6.2 4.6 9 10 3",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})
		}) : null
	});
}
function InboxView({ folder, q, folderId, boot }) {
	const t = useT();
	const lang = useLang((s) => s.lang);
	const titleMap = {
		"all-inbox": t.allInbox,
		sent: t.sent,
		scheduled: t.scheduled,
		drafts: t.draft,
		trash: t.trash,
		shared: t.shared,
		"need-to-sign": t.needSign,
		"waiting-for-others": t.waiting,
		"expiring-soon": t.insightExpiring,
		completed: t.completed,
		draft: t.draft,
		declined: t.declined,
		expired: t.expired,
		voided: t.voided,
		"pending-approval": t.pending
	};
	const email = boot.user.email;
	const qc = useQueryClient();
	const showOverview = folder === "all-inbox" || folder === "need-to-sign" || folder === "waiting-for-others" || folder === "completed" || folder === "expiring-soon";
	const { data: docs = [], isPending } = useQuery({
		queryKey: [
			"docs",
			folder,
			q,
			folderId
		],
		queryFn: () => listDocuments({ data: {
			folder,
			q,
			folderId: folderId || void 0
		} })
	});
	const { data: allDocs = [] } = useQuery({
		queryKey: [
			"docs",
			"all-inbox",
			"",
			""
		],
		queryFn: () => listDocuments({ data: { folder: "all-inbox" } }),
		enabled: showOverview
	});
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [bulkOpen, setBulkOpen] = (0, import_react.useState)(false);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [pageSize, setPageSize] = (0, import_react.useState)(20);
	const [page, setPage] = (0, import_react.useState)(0);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)(q);
	(0, import_react.useEffect)(() => {
		setQuery(q);
	}, [q]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = docs;
		if (statusFilter !== "all") list = list.filter((d) => d.status === statusFilter);
		if (query.trim()) {
			const n = query.toLowerCase();
			list = list.filter((d) => d.title.toLowerCase().includes(n) || d.recipients.some((r) => r.name.toLowerCase().includes(n) || r.email.toLowerCase().includes(n)));
		}
		return list;
	}, [
		docs,
		statusFilter,
		query
	]);
	const insights = (0, import_react.useMemo)(() => {
		const all = allDocs.length ? allDocs : docs;
		const soon = all.filter((d) => d.deadline && new Date(d.deadline).getTime() - Date.now() < 432e6 && d.status !== "completed" && d.status !== "voided");
		return [
			{
				key: "need-to-sign",
				label: t.insightNeed,
				value: all.filter((d) => canSign(d, email)).length
			},
			{
				key: "waiting-for-others",
				label: t.insightPending,
				value: all.filter((d) => d.status === "waiting_for_others").length
			},
			{
				key: "expiring-soon",
				label: t.insightExpiring,
				value: soon.length
			},
			{
				key: "completed",
				label: t.insightRenew,
				value: all.filter((d) => d.status === "completed").length
			},
			{
				key: "all-inbox",
				label: t.insightDone,
				value: all.length
			}
		];
	}, [
		allDocs,
		docs,
		email,
		t
	]);
	const paged = filtered.slice(page * pageSize, page * pageSize + pageSize);
	const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	const allIds = paged.map((d) => d.id);
	const allOn = allIds.length > 0 && allIds.every((id) => selected.includes(id));
	const subtitleMap = { "all-inbox": t.allInboxesSub };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: titleMap[folder] ?? t.allInbox,
			subtitle: subtitleMap[folder]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 px-4 pb-3 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => setFiltersOpen((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5" }), t.filter]
				}),
				selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "navy",
					onClick: () => setBulkOpen(true),
					children: [
						t.bulkSign,
						" (",
						selected.length,
						")"
					]
				}) : null,
				filtersOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-8 rounded-md border border-border bg-surface px-2 text-xs",
					value: statusFilter,
					onChange: (e) => {
						setStatusFilter(e.target.value);
						setPage(0);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All status"
					}), Object.entries(STATUS_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: k,
						children: v[lang]
					}, k))]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative ml-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-8 w-44 rounded-md border border-border bg-surface pr-3 pl-7 text-xs md:w-56",
						placeholder: t.searchDocuments,
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setPage(0);
						}
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-6 md:px-6",
			children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton-shimmer h-48 rounded-lg" }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					art: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskEmpty, {}),
					title: t.empty
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden overflow-hidden rounded-lg border border-border bg-surface md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-surface text-left text-[12px] font-medium text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-10 px-3 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: allOn,
											onChange: () => setSelected(allOn ? [] : allIds)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: t.docName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: t.lastModified
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: t.folderCol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-3" })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: paged.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-surface-2/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: selected.includes(d.id),
										onChange: () => toggle(d.id)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/documents/$id",
										params: { id: d.id },
										className: "font-medium hover:text-brand",
										children: d.title
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
										status: d.status,
										label: STATUS_LABEL[d.status][lang]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-[11px] text-subtle",
										children: [
											progress(d).signed,
											"/",
											progress(d).total
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-[12px] text-muted",
									children: relativeId(d.updatedAt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-[12px] text-muted",
									children: d.folderName || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowActions, {
										doc: d,
										email,
										t,
										folders: boot.folders,
										trash: folder === "trash"
									})
								})
							]
						}, d.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 md:hidden",
					children: paged.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: selected.includes(d.id),
									onChange: () => toggle(d.id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/documents/$id",
											params: { id: d.id },
											className: "font-medium",
											children: d.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
												status: d.status,
												label: STATUS_LABEL[d.status][lang]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 text-[11px] text-muted",
											children: [
												relativeId(d.updatedAt),
												" · ",
												d.folderName || "—"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowActions, {
									doc: d,
									email,
									t,
									folders: boot.folders,
									trash: folder === "trash"
								})
							]
						})
					}, d.id))
				}),
				filtered.length > pageSize ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						page * pageSize + 1,
						"–",
						Math.min(filtered.length, (page + 1) * pageSize),
						" / ",
						filtered.length
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: page === 0,
							onClick: () => setPage((p) => p - 1),
							children: "Prev"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: (page + 1) * pageSize >= filtered.length,
							onClick: () => setPage((p) => p + 1),
							children: "Next"
						})]
					})]
				}) : null
			] })
		}),
		showOverview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-10 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold",
				children: t.overview
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 md:grid-cols-5",
				children: insights.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/esignature/$folder",
					params: { folder: c.key },
					className: "rounded-lg border border-border bg-surface px-4 py-3 hover:border-brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-semibold tabular-nums text-brand",
						children: c.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted",
						children: c.label
					})]
				}, c.key))
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: bulkOpen,
			onOpenChange: setBulkOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				title: t.bulkSign,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-sm text-muted",
					children: [
						"Signature will be applied to ",
						selected.length,
						" selected documents."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignPad, {
					name: boot.user.name,
					onDone: async (dataUrl) => {
						await bulkSignDocs({ data: {
							ids: selected,
							signatureData: dataUrl
						} });
						toast.success("Documents signed");
						setBulkOpen(false);
						setSelected([]);
						qc.invalidateQueries({ queryKey: ["docs"] });
						qc.invalidateQueries({ queryKey: ["boot"] });
					}
				})]
			})
		})
	] });
}
function RowActions({ doc, email, t, folders, trash }) {
	const nav = useNavigate();
	const qc = useQueryClient();
	const mut = useMutation({
		mutationFn: (p) => mutateDocument({ data: {
			id: doc.id,
			...p
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["docs"] });
			qc.invalidateQueries({ queryKey: ["boot"] });
		}
	});
	const signable = canSign(doc, email);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-end gap-1",
		children: [signable && !trash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: () => nav({
				to: "/documents/$id/sign",
				params: { id: doc.id }
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3.5" }), t.sign]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => nav({
				to: "/documents/$id",
				params: { id: doc.id }
			}),
			children: t.view
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				"aria-label": "More",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: () => nav({
					to: "/documents/$id",
					params: { id: doc.id }
				}),
				children: "Document info"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: () => {
					const href = signingLink(doc.token);
					navigator.clipboard.writeText(href).then(() => toast.success("Link copied"), () => toast.message(href));
				},
				children: "Share"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: () => {
					mut.mutateAsync({ action: "resend" });
					toast.success("Resent");
				},
				children: "Resend"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: () => {
					mut.mutateAsync({ action: "remind" });
					toast.success("Reminder sent");
				},
				children: t.remind
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: async () => {
					const res = await mut.mutateAsync({ action: "duplicate" });
					toast.success("Draft copy created");
					if (res && "id" in res && res.id) nav({
						to: "/documents/$id",
						params: { id: res.id }
					});
				},
				children: t.duplicate
			}),
			folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuItem, {
				onSelect: () => {
					mut.mutateAsync({
						action: "move",
						folderId: f.id
					});
					toast.success("Moved to " + f.name);
				},
				children: ["Move to ", f.name]
			}, f.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSep, {}),
			trash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: () => {
					mut.mutateAsync({ action: "restore" });
					toast.success("Restored");
				},
				children: "Restore"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				onSelect: () => {
					mut.mutateAsync({ action: "void" });
					toast.success("Document voided");
				},
				children: t.void
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
				danger: true,
				onSelect: () => {
					mut.mutateAsync({ action: "delete" });
					toast.success(trash ? "Deleted permanently" : "Moved to trash");
				},
				children: t.delete
			})
		] })] })]
	});
}
function WelcomeArt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 280 180",
		className: "h-40 w-auto",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "28",
				width: "120",
				height: "88",
				rx: "10",
				fill: "var(--color-surface)",
				stroke: "var(--color-border-strong)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "30",
				y: "44",
				width: "96",
				height: "8",
				rx: "4",
				fill: "var(--color-brand)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "30",
				y: "62",
				width: "72",
				height: "5",
				rx: "2",
				fill: "var(--color-border-strong)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "30",
				y: "74",
				width: "84",
				height: "5",
				rx: "2",
				fill: "var(--color-border)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "30",
				y: "86",
				width: "52",
				height: "5",
				rx: "2",
				fill: "var(--color-border)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "196",
				cy: "64",
				r: "22",
				fill: "var(--color-brand-soft)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "196",
				cy: "58",
				r: "12",
				fill: "var(--color-rail)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M168 148c8-36 16-48 28-48s20 12 28 48",
				fill: "var(--color-rail)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "188",
				y: "92",
				width: "22",
				height: "36",
				rx: "4",
				fill: "var(--color-ink)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "192",
				y: "96",
				width: "14",
				height: "22",
				rx: "2",
				fill: "var(--color-surface)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "86",
				cy: "148",
				r: "10",
				fill: "var(--color-info-soft)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "118",
				cy: "140",
				r: "8",
				fill: "var(--color-warning-soft)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "248",
				cy: "40",
				r: "12",
				fill: "var(--color-success-soft)"
			})
		]
	});
}
function GettingStarted() {
	const t = useT();
	const boot = useBoot();
	const remain = Math.max(0, boot.quota.emeteraiTotal - boot.quota.emeteraiUsed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-5 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col items-center gap-6 rounded-lg border border-border bg-surface px-6 py-8 md:flex-row md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: t.welcomeParaf
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: t.welcomeBody
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/send",
									children: t.startUsing
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/esignature/$folder",
									params: { folder: "getting-started" },
									children: t.learnMore
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeArt, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-brand uppercase",
								children: "eSign"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-semibold",
								children: "Send, track, and sign documents"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Upload a file, place fields, and collect legally binding signatures."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "mt-4",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/send",
									children: t.startNow
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-brand uppercase",
								children: "eMeterai"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-semibold",
								children: "Buy and attach legally-valid stamps"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									"Quota remaining ",
									remain.toLocaleString("en-US"),
									" eMeterai."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "mt-4",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/emeterai",
									children: t.startNow
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-brand uppercase",
								children: "PSrE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-semibold",
								children: "Verify identity for qualified signing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Issue a PSrE or GlobalSign certificate from Settings."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "mt-4",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/settings",
									children: t.startNow
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 mb-3 text-sm font-semibold",
				children: t.learnHow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					{
						title: "How to send a document",
						href: "/send"
					},
					{
						title: "How to request eMeterai",
						href: "/send?intent=emeterai"
					},
					{
						title: "How to set up your eSignature",
						href: "/settings"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: item.href,
					className: "overflow-hidden rounded-lg border border-border bg-surface hover:border-brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-32 place-items-center bg-rail text-surface/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center rounded-full bg-surface/15 text-lg",
							children: "▶"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 text-sm font-medium",
						children: item.title
					})]
				}, item.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 mb-6 text-center text-sm text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/ai",
					className: "font-medium text-brand hover:underline",
					children: t.chatWithUs
				})
			})
		]
	});
}
function FolderPage() {
	const { folder } = Route$10.useParams();
	const { q, folderId } = Route$10.useSearch();
	const boot = useBoot();
	if (folder === "getting-started") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GettingStarted, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxView, {
		folder,
		q: q ?? "",
		folderId: folderId ?? "",
		boot
	});
}
//#endregion
export { FolderPage as component };
