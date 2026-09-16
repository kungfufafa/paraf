import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as formatIdDate } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, h as useT, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { l as pingWebhook, m as saveWebhook, n as emitTestEvent, r as getIntegrations } from "./integrations-api-BS8riFGh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/webhooks-B1Gz5fzM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WebhooksPage() {
	const t = useT();
	const boot = useBoot();
	const qc = useQueryClient();
	const { data, refetch } = useQuery({
		queryKey: ["integrations"],
		queryFn: () => getIntegrations()
	});
	const [url, setUrl] = (0, import_react.useState)("");
	const events = data?.events ? [...data.events] : [];
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [freshSecret, setFreshSecret] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const hooks = data?.webhooks ?? [];
	const live = hooks.filter((h) => h.active).length + (data?.envWebhook.connected ? 1 : 0);
	const last = hooks[0]?.lastStatus ?? data?.deliveries[0]?.status ?? null;
	const ready = live > 0;
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const sample = (0, import_react.useMemo)(() => JSON.stringify({
		id: "evt_demo",
		event: "document.signed",
		ts: "1710000000",
		data: {
			documentId: "doc_…",
			title: "Offer letter",
			recipientId: "rc_…"
		}
	}, null, 2), []);
	async function addHook() {
		if (!url.trim()) return;
		setBusy(true);
		try {
			const res = await saveWebhook({ data: {
				url: url.trim(),
				events: picked.length ? picked : events
			} });
			if (res.secret) {
				setFreshSecret(res.secret);
				toast.success("Webhook live. Copy the secret — shown once.");
			} else toast.success("Webhook saved");
			setUrl("");
			refetch();
			qc.invalidateQueries({ queryKey: ["boot"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Invalid URL");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t.webhooks,
			subtitle: "Paraf → your HRIS / n8n / Slack. Same plug-and-play pattern as eMeterai.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: async () => {
					await emitTestEvent();
					toast.success("Test event written to the stream");
					refetch();
				},
				children: "Send test event"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mx-4 mb-4 rounded-lg border px-4 py-3 text-sm md:mx-6 ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`,
			children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Live. ",
				live,
				" endpoint",
				live === 1 ? "" : "s",
				" receive document events with HMAC-SHA256. Stream below always records, even if a URL is down."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "No URL yet — events still land in the stream (DEMO inbox). Paste a https URL to forward them live, the same way you connect an eMeterai API." })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 px-4 md:grid-cols-3 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Endpoints",
					value: String(live),
					hint: "Active URLs + env PARAF_WEBHOOK_URL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Events captured",
					value: String(data?.stream.length ?? 0),
					hint: "Internal stream (always on)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Last delivery",
					value: last == null ? "—" : String(last),
					hint: "HTTP status of the newest POST"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pt-8 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-sm font-semibold",
				children: "How to plug in a webhook"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					{
						n: "1",
						title: "Paste a URL",
						body: "webhook.site, n8n, Zapier, Slack, or your ERP. HTTPS required."
					},
					{
						n: "2",
						title: "Pick events",
						body: "sent, signed, completed, declined, voided, reminded, approval.*"
					},
					{
						n: "3",
						title: "Send a document",
						body: "Paraf POSTs JSON with X-Paraf-Signature. Verify HMAC of timestamp.payload."
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
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-1 font-semibold",
						children: "Plug-and-play connector"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 text-sm text-muted",
						children: [
							"Env: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "PARAF_WEBHOOK_URL" }),
							" + ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "PARAF_WEBHOOK_SECRET" }),
							". Workspace URL below wins in addition to env."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "https://hooks.company.com/paraf",
						value: url,
						onChange: (e) => setUrl(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: (events.length ? events : [
							"document.sent",
							"document.signed",
							"document.completed"
						]).map((ev) => {
							const catalog = events.length ? events : [
								"document.sent",
								"document.signed",
								"document.completed"
							];
							const current = picked.length ? picked : catalog;
							const on = current.includes(ev);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPicked(on ? current.filter((x) => x !== ev) : [...current, ev]),
								className: `rounded-full border px-2.5 py-1 text-[11px] ${on ? "border-brand bg-brand-soft text-brand" : "border-border text-muted"}`,
								children: ev
							}, ev);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy || !url.trim(),
							onClick: () => void addHook(),
							children: "Connect"
						})
					}),
					freshSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all",
						children: ["Secret (once): ", freshSecret]
					}) : null,
					data?.envWebhook.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-md border border-success/40 bg-success-soft px-3 py-2 text-sm",
						children: [
							"Environment endpoint connected · ",
							data.envWebhook.urlHint,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "ml-2",
								onClick: () => void pingWebhook({ data: "env" }).then((r) => {
									toast.success(r.status ? `Env ping HTTP ${r.status}` : "Ping sent");
									refetch();
								}),
								children: "Ping"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: [hooks.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
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
						}, h.id)), !hooks.length && !data?.envWebhook.connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "No external URL yet."
						}) : null]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-1 font-semibold",
						children: "Verify a delivery"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-3 text-sm text-muted",
						children: [
							"HMAC-SHA256 of ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{timestamp}.{rawBody}" }),
							" using the endpoint secret."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto rounded-md bg-surface-2 p-3 text-[11px] leading-relaxed",
						children: sample
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] text-muted",
						children: "Headers: X-Paraf-Event, X-Paraf-Timestamp, X-Paraf-Signature: sha256=…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-[11px] text-muted",
						children: [
							"Inbound the other way (HRIS → Paraf) uses a BYOK API key at ",
							origin,
							"/api/v1/hooks"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "mt-3",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/byok",
							children: "Open BYOK"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold",
					children: "Event stream"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										children: "Event"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "When"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Payload"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data?.stream ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 3,
							className: "px-4 py-12 text-center text-sm text-muted",
							children: [
								"Send a document — or click Send test event. Workspace: ",
								boot.company.name,
								"."
							]
						}) }) : data.stream.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: e.event
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: formatIdDate(e.createdAt, true)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-[11px] text-muted break-all",
									children: e.payload.slice(0, 180)
								})
							]
						}, e.id)) })]
					})
				}),
				(data?.deliveries ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold tracking-wide text-muted uppercase",
						children: "Outbound POSTs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-[11px] text-muted",
						children: data.deliveries.slice(0, 12).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							d.event,
							" · HTTP ",
							d.status ?? "—",
							" ",
							d.error ? `· ${d.error}` : "",
							" · ",
							formatIdDate(d.createdAt, true)
						] }, d.id))
					})]
				}) : null
			]
		})
	] });
}
function Kpi({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-2xl font-semibold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted",
				children: hint
			})
		]
	});
}
//#endregion
export { WebhooksPage as component };
