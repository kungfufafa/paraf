import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as updateCompany, C as listSignatures, F as saveSignature, I as saveStamp, N as saveEmeteraiConnector, P as savePrefs, V as updateProfile, _ as inviteMember, w as listStamps, z as testEmeteraiConnector } from "./api-BmE3vsND.mjs";
import { c as cn } from "./integrations-BY7zkbKR.mjs";
import { t as authClient } from "./client-CVqXY6bk.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { A as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as useLang, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { d as saveAiConnector, h as testAiConnector, i as getTsaChain, l as pingWebhook, m as saveWebhook, p as saveOneDriveToken, r as getIntegrations, t as createApiKey, u as revokeApiKey } from "./integrations-api-BS8riFGh.mjs";
import { t as SignPad } from "./sign-pad-BMT1PYZ8.mjs";
import { t as Label } from "./label-CnjysMv8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-B0hT_v5e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: cn("relative h-5 w-9 rounded-full transition-colors", checked ? "bg-brand" : "bg-border-strong"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-4" : "translate-x-0.5") })
	});
}
var NAV = [
	{
		id: "my-account",
		label: "Account"
	},
	{
		id: "manage-user",
		label: "User management"
	},
	{
		id: "preferences",
		label: "Preferences"
	},
	{
		id: "esignature",
		label: "eSignature"
	},
	{
		id: "corporate-stamp",
		label: "Stamp"
	},
	{
		id: "notification",
		label: "Notification"
	},
	{
		id: "personalization",
		label: "Personalization"
	},
	{
		id: "manage-quota",
		label: "Quota usage"
	},
	{
		id: "emeterai-api",
		label: "eMeterai API"
	},
	{
		id: "webhooks",
		label: "Webhooks"
	},
	{
		id: "byok",
		label: "BYOK"
	},
	{
		id: "ai-review",
		label: "AI review"
	},
	{
		id: "integration",
		label: "Integrations"
	},
	{
		id: "timestamp",
		label: "Timestamp (TSA)"
	},
	{
		id: "subscription",
		label: "Subscription"
	}
];
function SettingsPage() {
	const [section, setSection] = (0, import_react.useState)("my-account");
	const title = NAV.find((i) => i.id === section)?.label ?? "Settings";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[calc(100vh-48px)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "no-print hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-surface md:flex md:flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-3 text-[13px] font-semibold",
					children: "Settings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 px-2",
					children: NAV.filter((i) => i.id !== "subscription").map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSection(it.id),
						className: cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px]", section === it.id ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
						children: [it.label, it.id === "my-account" || it.id === "manage-user" || it.id === "preferences" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 text-muted" }) : null]
					}, it.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border px-2 py-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSection("subscription"),
						className: cn("w-full rounded-md px-2 py-1.5 text-left text-[13px]", section === "subscription" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2"),
						children: "Subscription"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden",
				children: NAV.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("shrink-0 rounded-md px-2 py-1 text-xs", section === it.id ? "bg-brand-soft text-brand" : "text-muted"),
					onClick: () => setSection(it.id),
					children: it.label
				}, it.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-5 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-5 text-xl font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionBody, { section })]
			})]
		})]
	});
}
function SectionBody({ section }) {
	switch (section) {
		case "my-account": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyAccount, {});
		case "preferences": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocPolicy, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailTpl, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartAuto, {})
		] });
		case "personalization": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Personalization, {});
		case "digital-certificate": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertPanel, {});
		case "esignature": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsignPanel, {});
		case "corporate-stamp": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampPanel, {});
		case "email-setting": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailSetting, {});
		case "active-sessions": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sessions, {});
		case "downloads": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "You don't have any downloads yet."
		});
		case "manage-user": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageUser, {});
		case "access-role": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessRole, {});
		case "manage-quota": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageQuota, {});
		case "team": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamPanel, {});
		case "activity-log": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLog, {});
		case "custom-fields": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomFields, {});
		case "tags": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagsPanel, {});
		case "notification": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifPrefs, {});
		case "email-template": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailTpl, {});
		case "document-policy": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocPolicy, {});
		case "document-quality": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocQuality, {});
		case "smart-automations": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartAuto, {});
		case "integration": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Integrations, {});
		case "webhooks": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpPanel, {
			title: "Webhooks",
			href: "/webhooks",
			body: "Plug-and-play outbound events. Paste a URL, pick events, ping. Same pattern as eMeterai."
		});
		case "byok": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JumpPanel, {
			title: "BYOK",
			href: "/byok",
			body: "Bring your own signing secret, inbound API key, and AI provider key."
		});
		case "ai-review": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiReviewPanel, {});
		case "emeterai-api": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmeteraiApiPanel, {});
		case "timestamp": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TsaPanel, {});
		case "subscription": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Subscription, {});
		default: return null;
	}
}
function AccordionCard({ title, children, defaultOpen = true }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-3 overflow-hidden rounded-lg border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-center justify-between px-5 py-4 text-left font-semibold",
			onClick: () => setOpen((v) => !v),
			children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted transition-transform", open ? "rotate-180" : "") })]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border px-5 py-4",
			children
		}) : null]
	});
}
function JumpPanel({ title, href, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: body
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => window.location.href = href,
			children: [
				"Open ",
				title,
				" module"
			]
		})]
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-4 rounded-lg border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 font-semibold",
			children: title
		}), children]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1 sm:grid-cols-[180px_1fr] sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-muted",
			children: label
		}), children]
	});
}
function MyAccount() {
	const boot = useBoot();
	const qc = useQueryClient();
	const [profile, setProfile] = (0, import_react.useState)({
		name: boot.user.name,
		email: boot.user.email,
		phone: boot.prefs?.profile?.phone || boot.company.phone,
		role: "Owner",
		dob: boot.prefs?.profile?.dob || "",
		address: boot.prefs?.profile?.address || boot.company.address
	});
	const [co, setCo] = (0, import_react.useState)({
		name: boot.company.name,
		legalName: boot.company.legalName,
		npwp: boot.company.npwp,
		address: boot.company.address,
		city: boot.company.city,
		phone: boot.company.phone,
		industry: "Professional Services",
		size: "1-10",
		email: boot.user.email
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionCard, {
			title: "Account",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 text-sm font-medium",
				children: "Profile"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Photo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-12 place-items-center rounded-full bg-brand text-sm font-bold text-white",
							children: boot.user.name.slice(0, 2).toUpperCase()
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.name,
							onChange: (e) => setProfile({
								...profile,
								name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.email,
							disabled: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.phone,
							onChange: (e) => setProfile({
								...profile,
								phone: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Role",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: "User",
							disabled: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date of birth",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: profile.dob,
							onChange: (e) => setProfile({
								...profile,
								dob: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: profile.address,
							onChange: (e) => setProfile({
								...profile,
								address: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								await updateProfile({ data: {
									name: profile.name,
									phone: profile.phone,
									address: profile.address,
									dob: profile.dob
								} });
								await updateCompany({ data: {
									name: co.name,
									legalName: co.legalName || co.name,
									npwp: co.npwp,
									address: profile.address,
									city: co.city,
									phone: profile.phone
								} });
								toast.success("Account saved");
								qc.invalidateQueries({ queryKey: ["boot"] });
							},
							children: "Save"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionCard, {
			title: "Change password",
			defaultOpen: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordForm, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionCard, {
			title: "Email notifications",
			defaultOpen: false,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: [
					"Document",
					"Document expiration",
					"eMeterai",
					"WhatsApp"
				].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailNotifRow, { label }, label))
			})
		})
	] });
}
function PasswordForm() {
	const [cur, setCur] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	const [again, setAgain] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Current password",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: cur,
					onChange: (e) => setCur(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "New password",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: next,
					onChange: (e) => setNext(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Confirm new password",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					value: again,
					onChange: (e) => setAgain(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: async () => {
						if (next.length < 8) {
							toast.error("Password must be at least 8 characters");
							return;
						}
						if (next !== again) {
							toast.error("Passwords do not match");
							return;
						}
						setBusy(true);
						try {
							const res = await authClient.changePassword({
								currentPassword: cur,
								newPassword: next,
								revokeOtherSessions: false
							});
							if (res.error) toast.error(res.error.message || "Could not update password");
							else {
								toast.success("Password updated");
								setCur("");
								setNext("");
								setAgain("");
							}
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Could not update password");
						} finally {
							setBusy(false);
						}
					},
					children: "Save"
				})
			})
		]
	});
}
function EmailNotifRow({ label }) {
	const [on, setOn] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: on,
			onChange: setOn
		})]
	});
}
function CertPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Certificates",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-md border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: "PSrE Indonesia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Personal certificate for qualified electronic signatures."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success",
					children: "Active"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-md border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: "GlobalSign"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "International certificate for cross-border signing."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success",
					children: "Active"
				})]
			})]
		})
	});
}
function EsignPanel() {
	const boot = useBoot();
	const qc = useQueryClient();
	const { data: sigs = [] } = useQuery({
		queryKey: ["sigs"],
		queryFn: () => listSignatures()
	});
	const [tab, setTab] = (0, import_react.useState)("signature");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 flex gap-4 border-b border-border text-sm",
		children: [
			"signature",
			"initials",
			"stamps"
		].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("border-b-2 pb-2 capitalize", tab === k ? "border-brand font-medium text-brand" : "border-transparent text-muted"),
			onClick: () => setTab(k),
			children: k
		}, k))
	}), tab === "stamps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampPanel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: tab === "initials" ? "Create initials" : "Create eSignature",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignPad, {
			name: boot.user.name,
			onDone: async (dataUrl, kind) => {
				await saveSignature({ data: {
					kind: tab === "initials" ? "initials" : kind,
					name: boot.user.name,
					dataUrl
				} });
				toast.success("Saved");
				qc.invalidateQueries({ queryKey: ["sigs"] });
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-3 flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				defaultChecked: true
			}), " Set as default"]
		})]
	}), sigs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Saved",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2 text-sm",
			children: sigs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between rounded-md border border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					s.name,
					" · ",
					s.kind
				] }), s.is_default ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-brand",
					children: "Default"
				}) : null]
			}, s.id))
		})
	}) : null] })] });
}
function StampPanel() {
	const boot = useBoot();
	const qc = useQueryClient();
	const { data = [] } = useQuery({
		queryKey: ["stamps"],
		queryFn: () => listStamps()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Corporate stamps used on completed documents."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add stamp" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept: "image/*",
			className: "hidden",
			onChange: (e) => {
				const f = e.target.files?.[0];
				if (!f) return;
				const r = new FileReader();
				r.onload = async () => {
					await saveStamp({ data: {
						name: f.name,
						companyName: boot.company.name,
						dataUrl: String(r.result)
					} });
					toast.success("Stamp saved");
					qc.invalidateQueries({ queryKey: ["stamps"] });
				};
				r.readAsDataURL(f);
			}
		})] })]
	}), data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted",
		children: "You don't have any stamps yet."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-lg border border-border bg-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: s.data_url,
				alt: s.name,
				className: "mx-auto h-28 object-contain"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-sm font-medium",
				children: s.name
			})]
		}, s.id))
	})] });
}
function EmailSetting() {
	const boot = useBoot();
	const qc = useQueryClient();
	const [from, setFrom] = (0, import_react.useState)(boot.prefs?.email?.from || "noreply@paraf.id");
	const [fromName, setFromName] = (0, import_react.useState)(boot.prefs?.email?.fromName || "Paraf");
	const [reply, setReply] = (0, import_react.useState)(boot.prefs?.email?.reply || "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Sender",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "From name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: fromName,
						onChange: (e) => setFromName(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "From email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: from,
						onChange: (e) => setFrom(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Reply-to",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: reply,
						onChange: (e) => setReply(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: async () => {
						await savePrefs({ data: { email: {
							from,
							fromName,
							reply
						} } });
						toast.success("Email setting saved");
						qc.invalidateQueries({ queryKey: ["boot"] });
					},
					children: "Save"
				})
			]
		})
	});
}
function Sessions() {
	const boot = useBoot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "This device",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: boot.user.email
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Current session · Cirebon, ID"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-success-soft px-2 py-0.5 text-xs text-success",
				children: "Active"
			})]
		})
	});
}
function ManageUser() {
	const boot = useBoot();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		role: "Member"
	});
	const members = boot.team?.length ? boot.team : [{
		id: "me",
		name: boot.user.name,
		email: boot.user.email,
		role: "Owner",
		status: "active",
		emeterai_assigned: 0
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Users",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Role" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 font-medium",
							children: m.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: m.email }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: m.role }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "capitalize",
							children: m.status
						})
					]
				}, m.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				size: "sm",
				variant: "outline",
				onClick: () => setOpen(true),
				children: "Invite user"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Invite user",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 w-full rounded-md border border-border px-3 text-sm",
								value: form.role,
								onChange: (e) => setForm({
									...form,
									role: e.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Admin" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Member" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Viewer" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								onClick: async () => {
									if (!form.name.trim() || !form.email.trim()) return;
									await inviteMember({ data: form });
									toast.success("Invite sent");
									setOpen(false);
									setForm({
										name: "",
										email: "",
										role: "Member"
									});
									qc.invalidateQueries({ queryKey: ["boot"] });
								},
								children: "Send invite"
							})
						]
					})
				})
			})
		]
	});
}
function AccessRole() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: [
			["Owner", "Full access to workspace, billing, and users"],
			["Admin", "Manage documents, templates, and quotas"],
			["Member", "Send and sign documents"],
			["Viewer", "Read-only access"]
		].map(([n, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: n
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: d
			})]
		}, n))
	});
}
function QuotaRow({ label, used, total, hint }) {
	const unlimited = total < 0;
	const pct = unlimited ? 0 : Math.min(100, used / Math.max(1, total) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right text-sm font-medium tabular-nums",
				children: [
					used,
					"/",
					unlimited ? "∞" : total
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-brand",
				style: { width: `${pct}%` }
			})
		})]
	});
}
function ManageQuota() {
	const q = useBoot().quota;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotaRow, {
			label: "Documents",
			used: 0,
			total: 0,
			hint: "The remaining quota of documents that can be used this month."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotaRow, {
			label: "eMeterai",
			used: q.emeteraiUsed,
			total: q.emeteraiTotal,
			hint: "The remaining quota of eMeterai that can be used in documents."
		})]
	});
}
function Personalization() {
	const qc = useQueryClient();
	const setLang = useLang((s) => s.setLang);
	const lang = useLang((s) => s.lang);
	const boot = useBoot();
	const [tz, setTz] = (0, import_react.useState)(boot.prefs?.prefs?.tz || "Asia/Jakarta");
	const [fmt, setFmt] = (0, import_react.useState)(boot.prefs?.prefs?.dateFormat || "DD/MM/YYYY");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Personalization",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Language",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md border border-border px-3 text-sm",
						value: lang,
						onChange: (e) => setLang(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "en",
							children: "English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "id",
							children: "Bahasa Indonesia"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Time zone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tz,
						onChange: (e) => setTz(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date format",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md border border-border px-3 text-sm",
						value: fmt,
						onChange: (e) => setFmt(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "DD/MM/YYYY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MM/DD/YYYY" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: async () => {
						await savePrefs({ data: { prefs: {
							tz,
							dateFormat: fmt,
							lang
						} } });
						toast.success("Preferences saved");
						qc.invalidateQueries({ queryKey: ["boot"] });
					},
					children: "Save"
				})
			]
		})
	});
}
function TeamPanel() {
	const boot = useBoot();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Team",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-10 place-items-center rounded-full bg-rail text-xs font-bold text-white",
				children: boot.company.name.slice(0, 2).toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: boot.company.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: boot.company.legalName
			})] })]
		})
	});
}
function ActivityLog() {
	const boot = useBoot();
	const rows = [{
		a: "Signed in",
		t: "Just now",
		who: boot.user.email
	}, {
		a: "Workspace created",
		t: "Earlier",
		who: boot.user.email
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Recent activity",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2 text-sm",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex justify-between border-b border-border py-2 last:border-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: r.a
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [" · ", r.who]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: r.t
				})]
			}, r.a))
		})
	});
}
function CustomFields() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Available fields",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2 sm:grid-cols-2",
			children: [
				"Full name",
				"Email",
				"Company",
				"Title",
				"Date",
				"Checkbox",
				"Stamp",
				"eMeterai"
			].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "rounded-md border border-border px-3 py-2 text-sm",
				children: f
			}, f))
		})
	});
}
function TagsPanel() {
	const [tags, setTags] = (0, import_react.useState)([
		"Legal",
		"HR",
		"Finance"
	]);
	const [v, setV] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Tags",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-surface-2 px-3 py-1 text-xs",
				children: t
			}, t))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: v,
				onChange: (e) => setV(e.target.value),
				placeholder: "New tag"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => {
					if (!v.trim()) return;
					setTags((s) => [...s, v.trim()]);
					setV("");
				},
				children: "Add"
			})]
		})]
	});
}
function NotifPrefs() {
	const boot = useBoot();
	const qc = useQueryClient();
	const [n, setN] = (0, import_react.useState)({
		sign: boot.prefs?.notif?.sign !== false,
		view: boot.prefs?.notif?.view !== false,
		complete: boot.prefs?.notif?.complete !== false,
		expire: boot.prefs?.notif?.expire !== false,
		wa: boot.prefs?.notif?.wa !== false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Email & in-app",
		children: [
			["sign", "When someone signs"],
			["view", "When someone views a document"],
			["complete", "When a document is completed"],
			["expire", "When a document is expiring"],
			["wa", "WhatsApp signing updates"]
		].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border py-3 last:border-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: n[k],
				onChange: async (v) => {
					const next = {
						...n,
						[k]: v
					};
					setN(next);
					await savePrefs({ data: { notif: next } });
					qc.invalidateQueries({ queryKey: ["boot"] });
				}
			})]
		}, k))
	});
}
function EmailTpl() {
	const boot = useBoot();
	const qc = useQueryClient();
	const [subject, setSubject] = (0, import_react.useState)(boot.prefs?.email?.subject || "Please sign: {{document_name}}");
	const [body, setBody] = (0, import_react.useState)(boot.prefs?.email?.body || "Hi {{signer_name}}, please review and sign {{document_name}}.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Signing invitation",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Subject"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-1",
				value: subject,
				onChange: (e) => setSubject(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Body"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "mt-1 h-32 w-full rounded-md border border-border p-3 text-sm",
				value: body,
				onChange: (e) => setBody(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				size: "sm",
				onClick: async () => {
					await savePrefs({ data: { email: {
						...boot.prefs?.email ?? {},
						subject,
						body
					} } });
					toast.success("Template saved");
					qc.invalidateQueries({ queryKey: ["boot"] });
				},
				children: "Save"
			})
		]
	});
}
function DocPolicy() {
	const [seq, setSeq] = (0, import_react.useState)(false);
	const [login, setLogin] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Default policy",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "Require sequential signing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: seq,
				onChange: setSeq
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "Require sign-in to sign"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: login,
				onChange: setLogin
			})]
		})]
	});
}
function DocQuality() {
	const [quality, setQuality] = (0, import_react.useState)(() => typeof window !== "undefined" ? localStorage.getItem("paraf-quality") ?? "high" : "high");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Document quality",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Choose document resolution when opening files."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "h-10 w-full max-w-sm rounded-md border border-border px-3 text-sm",
			value: quality,
			onChange: (e) => {
				setQuality(e.target.value);
				localStorage.setItem("paraf-quality", e.target.value);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "standard",
				children: "Standard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "high",
				children: "Better document resolution"
			})]
		})]
	});
}
function SmartAuto() {
	const [on, setOn] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Smart automations",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: "Auto-remind signers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Send a reminder after 2 days of inactivity."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: on,
				onChange: setOn
			})]
		})
	});
}
function EmeteraiApiPanel() {
	const boot = useBoot();
	const qc = useQueryClient();
	const status = boot.emeterai;
	const [provider, setProvider] = (0, import_react.useState)(status?.provider === "mekari" ? "mekari" : status?.connected ? "generic" : "demo");
	const [baseUrl, setBaseUrl] = (0, import_react.useState)(status?.baseUrl || "https://sandbox-api.mekari.com/v2/esign/v1/documents/stamp");
	const [token, setToken] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const ready = status?.legalReady;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mb-4 rounded-lg border px-4 py-3 text-sm ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`,
			children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Connected (",
				status.source,
				"). Stamps issued through this API are treated as ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "legally valid e-Meterai" }),
				" with the provider serial."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Not connected. Apply eMeterai still works, but the stamp is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DEMO — not legally valid" }),
				". Paste a Peruri / distributor / Mekari Bearer token to go live."
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "Plug-and-play connector",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Provider",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border border-border px-3 text-sm",
							value: provider,
							onChange: (e) => setProvider(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "demo",
									children: "Demo (not legally valid)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "generic",
									children: "Generic REST (Peruri / ezMeterai / reseller)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "mekari",
									children: "Mekari eMeterai sandbox"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "API URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: baseUrl,
							onChange: (e) => setBaseUrl(e.target.value),
							placeholder: "https://…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bearer token",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: token,
							onChange: (e) => setToken(e.target.value),
							placeholder: status?.tokenHint || "Paste token"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"POST JSON: documentHash, title, amount. Expect serial / serialNumber and optional image, verifyUrl. Env plug-and-play: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "EMETERAI_API_URL" }),
							" + ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "EMETERAI_API_TOKEN" }),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: busy,
							onClick: async () => {
								setBusy(true);
								try {
									await saveEmeteraiConnector({ data: {
										provider,
										baseUrl,
										token
									} });
									const ping = await testEmeteraiConnector();
									if (ping.ok) toast.success(ping.message);
									else toast.error(ping.message);
									qc.invalidateQueries({ queryKey: ["boot"] });
								} finally {
									setBusy(false);
								}
							},
							children: "Test connection"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: async () => {
								setBusy(true);
								try {
									await saveEmeteraiConnector({ data: {
										provider,
										baseUrl,
										token
									} });
									toast.success(provider === "demo" ? "Saved as demo" : "Connector saved");
									qc.invalidateQueries({ queryKey: ["boot"] });
								} finally {
									setBusy(false);
								}
							},
							children: "Save"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "What makes a stamp legally valid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal space-y-2 pl-4 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Quota bought from Peruri or an official distributor (Rp 10.000 / stamp)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "This app calls their API with the document hash." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "They return a unique serial. That serial is what courts and scanners check — not our green icon." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Anyone can verify at the serial page or the provider URL printed on the stamp." })
				]
			})
		})
	] });
}
function AiReviewPanel() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["integrations"],
		queryFn: () => getIntegrations()
	});
	const ai = data?.ai;
	const [provider, setProvider] = (0, import_react.useState)(ai?.provider || "xai");
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [baseUrl, setBaseUrl] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!ai) return;
		setProvider(ai.provider);
		setModel(ai.model);
	}, [ai]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mb-4 rounded-lg border px-4 py-3 text-sm ${ai?.connected ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`,
			children: ai?.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Connected: ",
				ai.provider,
				" / ",
				ai.model,
				" (",
				ai.source,
				"). Review uses this key. Paste another provider key to switch."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "No key yet. xAI is used automatically if the platform injects it. Otherwise paste OpenAI, Anthropic, Google, Groq, or a custom OpenAI-compatible URL." })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "AI provider",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Provider",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border border-border px-3 text-sm",
							value: provider,
							onChange: (e) => setProvider(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "xai",
									children: "xAI Grok"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "openai",
									children: "OpenAI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "anthropic",
									children: "Anthropic Claude"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "google",
									children: "Google Gemini"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "groq",
									children: "Groq"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "custom",
									children: "Custom OpenAI-compatible"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "API key",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: apiKey,
							onChange: (e) => setApiKey(e.target.value),
							placeholder: ai?.keyHint || "sk-…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Model",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: model,
							onChange: (e) => setModel(e.target.value),
							placeholder: "grok-4.5 / gpt-4o-mini / claude-sonnet-4-5"
						})
					}),
					provider === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Base URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: baseUrl,
							onChange: (e) => setBaseUrl(e.target.value),
							placeholder: "https://api.example.com/v1/chat/completions"
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: busy,
							onClick: async () => {
								setBusy(true);
								try {
									await saveAiConnector({ data: {
										provider,
										apiKey,
										baseUrl,
										model
									} });
									const ping = await testAiConnector();
									if (ping.ok) toast.success(`AI ok — ${ping.provider} / ${ping.text.slice(0, 80)}`);
									else toast.error(ping.error || "AI test failed");
									qc.invalidateQueries({ queryKey: ["integrations"] });
								} finally {
									setBusy(false);
								}
							},
							children: "Test"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: async () => {
								setBusy(true);
								try {
									await saveAiConnector({ data: {
										provider,
										apiKey,
										baseUrl,
										model
									} });
									toast.success("AI connector saved");
									qc.invalidateQueries({ queryKey: ["integrations"] });
								} finally {
									setBusy(false);
								}
							},
							children: "Save"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "Where it runs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Open any document → Asisten AI, or Help → Analyze. The call is user-initiated and capped. Keys stay on the server."
			})
		})
	] });
}
function Integrations() {
	const { data, refetch } = useQuery({
		queryKey: ["integrations"],
		queryFn: () => getIntegrations()
	});
	const [hookUrl, setHookUrl] = (0, import_react.useState)("");
	const [keyName, setKeyName] = (0, import_react.useState)("HRIS");
	const [freshKey, setFreshKey] = (0, import_react.useState)("");
	const [odToken, setOdToken] = (0, import_react.useState)("");
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm",
			children: [
				"Webhooks and BYOK are plug-and-play modules, same as eMeterai.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "font-medium text-brand underline",
					href: "/webhooks",
					children: "Webhooks"
				}),
				" · ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "font-medium text-brand underline",
					href: "/byok",
					children: "BYOK"
				}),
				" · ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "font-medium text-brand underline",
					href: "/emeterai",
					children: "eMeterai"
				}),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Google Drive & OneDrive",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "Upload step in Send document lists files from the signed-in Grok Google Drive connector, or from a Microsoft Graph token for OneDrive. Picking a file pulls the text into the naskah."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: async () => {
							const { listCloudFiles } = await import("./integrations-api-BS8riFGh.mjs").then((n) => n.o).then((n) => n.o);
							const res = await listCloudFiles({ data: {
								source: "gdrive",
								q: "pdf"
							} });
							if ("loginRequired" in res && res.loginRequired) {
								const url = "loginUrl" in res ? res.loginUrl : void 0;
								if (url) window.open(url, "_blank");
								toast.message("error" in res && res.error || "Connect Google Drive");
								return;
							}
							if ("error" in res && res.error) {
								toast.error(res.error);
								return;
							}
							toast.success(`${"files" in res ? res.files.length : 0} Drive files reachable`);
						},
						children: "Test Google Drive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: async () => {
							const { listCloudFiles } = await import("./integrations-api-BS8riFGh.mjs").then((n) => n.o).then((n) => n.o);
							const res = await listCloudFiles({ data: {
								source: "onedrive",
								q: "pdf"
							} });
							if ("error" in res && res.error) toast.error(res.error);
							else toast.success(`${"files" in res ? res.files.length : 0} OneDrive files reachable`);
						},
						children: "Test OneDrive"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "OneDrive token",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: odToken,
						onChange: (e) => setOdToken(e.target.value),
						placeholder: data?.oneDriveHint || "Microsoft Graph bearer"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: async () => {
							await saveOneDriveToken({ data: { token: odToken } });
							toast.success("OneDrive connected");
							refetch();
						},
						children: "Save OneDrive"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "HRIS / ERP webhooks (Paraf → your system)",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-sm text-muted",
					children: [
						"Dedicated module is plug-and-play like eMeterai.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "font-medium text-brand underline",
							href: "/webhooks",
							children: "Open Webhooks"
						}),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "font-medium text-brand underline",
							href: "/byok",
							children: "Open BYOK"
						}),
						". We POST JSON on document events with headers X-Paraf-Event, X-Paraf-Timestamp, X-Paraf-Signature (sha256=HMAC of timestamp.payload)."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-[12px] text-muted",
					children: ["Events: ", (data?.events ?? []).join(", ")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "https://erp.company.com/hooks/paraf",
						value: hookUrl,
						onChange: (e) => setHookUrl(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							if (!hookUrl.trim()) return;
							try {
								const res = await saveWebhook({ data: {
									url: hookUrl.trim(),
									events: ["*"]
								} });
								toast.success(res.secret ? `Webhook saved. Secret: ${res.secret}` : "Webhook saved");
								setHookUrl("");
								refetch();
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Invalid URL");
							}
						},
						children: "Add"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: (data?.webhooks ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: h.url
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted",
								children: [
									h.events.join(", "),
									" · last ",
									h.lastStatus ?? "—",
									" ",
									h.lastError ? `· ${h.lastError}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => void pingWebhook({ data: h.id }).then((r) => {
									toast.success(r.status ? `Ping HTTP ${r.status}` : "Ping sent");
									refetch();
								}),
								children: "Ping"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => void saveWebhook({ data: {
									id: h.id,
									url: h.url,
									remove: true
								} }).then(() => refetch()),
								children: "Delete"
							})]
						})]
					}, h.id))
				}),
				(data?.deliveries ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Recent deliveries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-[11px] text-muted",
						children: data.deliveries.slice(0, 8).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							d.event,
							" · ",
							d.status ?? "—",
							" ",
							d.error ? `· ${d.error}` : "",
							" · ",
							d.createdAt
						] }, d.id))
					})]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Inbound REST (HRIS → Paraf)",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm text-muted",
					children: "Create an API key, then call these endpoints with Authorization Bearer paraf_live_…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mb-3 list-disc space-y-1 pl-5 font-mono text-[12px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/me"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/documents"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"POST ",
							origin,
							"/api/v1/documents — JSON title, recipients, send"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/documents/:id"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"POST ",
							origin,
							"/api/v1/documents/:id — JSON action=void|remind"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/events"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/tsa"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/tsa/:serial (public)"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"GET ",
							origin,
							"/api/v1/openapi"
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: keyName,
						onChange: (e) => setKeyName(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							const res = await createApiKey({ data: { name: keyName } });
							setFreshKey(res.key);
							toast.success("Copy this key now — it is shown once");
							refetch();
						},
						children: "Create API key"
					})]
				}),
				freshKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all",
					children: freshKey
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm",
					children: (data?.apiKeys ?? []).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-md border border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							k.name,
							" · ",
							k.key_prefix
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => void revokeApiKey({ data: k.id }).then(() => refetch()),
							children: "Revoke"
						})]
					}, k.id))
				})
			]
		})
	] });
}
function TsaPanel() {
	const { data } = useQuery({
		queryKey: ["integrations"],
		queryFn: () => getIntegrations()
	});
	const { data: chain = [] } = useQuery({
		queryKey: ["tsa-chain"],
		queryFn: () => getTsaChain()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm",
			children: [
				"Paraf TSA is an internal HMAC-SHA256 hash chain (policy paraf-tsa-v1). Head ",
				(data?.tsa.head ?? "genesis").slice(0, 16),
				"… · ",
				data?.tsa.count ?? 0,
				" tokens. Serial ",
				data?.tsa.serial ?? "—",
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "How it works",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal space-y-2 pl-4 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Send, sign, void, remind, or decide an approval." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Paraf hashes the event, links it to the previous head, and HMAC-signs the token with a workspace secret." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The serial is printed on the document, the completion certificate, and the public verify page." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Anyone with the serial can check integrity without logging in." })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				size: "sm",
				variant: "outline",
				onClick: () => window.location.href = "/proofs",
				children: "Open full ledger"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			title: "Recent seals",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm",
				children: [chain.slice(0, 12).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md border border-border px-3 py-2 font-mono text-[12px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "text-brand hover:underline",
						href: `/verify?serial=${encodeURIComponent(row.serial)}`,
						children: row.serial
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted",
						children: row.token.genTime || row.createdAt
					})]
				}, row.serial)), !chain.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: "No seals yet."
				}) : null]
			})
		})
	] });
}
function Subscription() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Current plan",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg font-semibold",
					children: "Free"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success",
					children: "Active"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Start sending documents and collecting signatures."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				children: "Upgrade"
			})]
		})
	}) });
}
//#endregion
export { SettingsPage as component };
