import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as listContacts, j as saveContact } from "./api-BmE3vsND.mjs";
import { c as cn } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { D as Ellipsis, f as Search } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as MenuItem, c as PageHeader, h as useT, i as MenuContent, n as EmptyState, r as Menu$1, s as MenuTrigger } from "./app-shell-DNQOiwL0.mjs";
import { t as ContactEmpty } from "./empty-art-Cbplun_d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacts-NQmjnXhs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactsPage() {
	const t = useT();
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["contacts"],
		queryFn: () => listContacts()
	});
	const [tab, setTab] = (0, import_react.useState)("personal");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		company: "",
		groupName: "Personal"
	});
	const contacts = data?.contacts ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		const n = q.toLowerCase();
		return contacts.filter((c) => !n || c.name.toLowerCase().includes(n) || c.email.toLowerCase().includes(n) || c.company.toLowerCase().includes(n));
	}, [contacts, q]);
	const companies = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const c of filtered) {
			const k = c.company || "—";
			map.set(k, (map.get(k) ?? 0) + 1);
		}
		return [...map.entries()];
	}, [filtered]);
	function parseCsv(text) {
		return text.split(/\r?\n/).filter(Boolean).slice(1).map((line) => {
			const [name, email, phone, company] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
			return {
				name: name || "",
				email: email || "",
				phone: phone || "",
				company: company || ""
			};
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t.contacts,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.import })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: ".csv,text/csv",
				className: "hidden",
				onChange: async (e) => {
					const f = e.target.files?.[0];
					if (!f) return;
					const rows = parseCsv(await f.text());
					for (const r of rows) if (r.email) await saveContact({ data: {
						...r,
						groupName: "Imported"
					} });
					toast.success("Contacts imported");
					qc.invalidateQueries({ queryKey: ["contacts"] });
				}
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => setOpen(true),
				children: t.inviteContact
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 px-4 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-md border border-border bg-surface p-0.5 text-xs",
				children: ["personal", "company"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("rounded-sm px-3 py-1.5", tab === k ? "bg-navy text-white" : "text-muted"),
					onClick: () => setTab(k),
					children: k === "personal" ? t.contacts : t.groups
				}, k))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative ml-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-8 w-52 rounded-md border border-border bg-surface pr-3 pl-7 text-xs",
					placeholder: t.searchContacts,
					value: q,
					onChange: (e) => setQ(e.target.value)
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 md:p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-lg border border-border bg-surface",
				children: tab === "personal" ? filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					art: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactEmpty, {}),
					title: t.noContacts
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-[12px] font-medium text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: t.lastActivity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: t.companyTab
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: t.action
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: c.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: c.company || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										"aria-label": "Actions",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									onSelect: () => {
										window.location.href = `/send?toEmail=${encodeURIComponent(c.email)}&toName=${encodeURIComponent(c.name)}`;
									},
									children: "Send document"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
									danger: true,
									onSelect: async () => {
										await saveContact({ data: {
											id: c.id,
											name: c.name,
											email: c.email,
											remove: true
										} });
										toast.success("Deleted");
										qc.invalidateQueries({ queryKey: ["contacts"] });
									},
									children: "Delete"
								})] })] })
							})
						]
					}, c.id)) })]
				}) : companies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					art: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactEmpty, {}),
					title: t.noContacts
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-[12px] font-medium text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: t.companyTab
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Contacts"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: companies.map(([name, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-medium",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: n
						})]
					}, name)) })]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: t.addContact,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Name",
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Phone",
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Company",
							value: form.company,
							onChange: (e) => setForm({
								...form,
								company: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: async () => {
								if (!form.name || !form.email) return;
								await saveContact({ data: form });
								toast.success("Contact saved");
								setOpen(false);
								setForm({
									name: "",
									email: "",
									phone: "",
									company: "",
									groupName: "Personal"
								});
								qc.invalidateQueries({ queryKey: ["contacts"] });
							},
							children: "Save"
						})
					]
				})
			})
		})
	] });
}
//#endregion
export { ContactsPage as component };
