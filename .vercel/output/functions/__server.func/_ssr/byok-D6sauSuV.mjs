import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, h as useT, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { d as saveAiConnector, f as saveByok, g as testByok, h as testAiConnector, r as getIntegrations, t as createApiKey, u as revokeApiKey } from "./integrations-api-BS8riFGh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/byok-D6sauSuV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ByokPage() {
	const t = useT();
	const boot = useBoot();
	const qc = useQueryClient();
	const { data, refetch } = useQuery({
		queryKey: ["integrations"],
		queryFn: () => getIntegrations()
	});
	const [secret, setSecret] = (0, import_react.useState)("");
	const [pem, setPem] = (0, import_react.useState)("");
	const [shown, setShown] = (0, import_react.useState)("");
	const [keyName, setKeyName] = (0, import_react.useState)("HRIS");
	const [freshKey, setFreshKey] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("xai");
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)(data?.ai.model || "");
	const [baseUrl, setBaseUrl] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setProvider(data.ai.provider);
		setModel(data.ai.model);
	}, [data]);
	const signing = data?.byok.legalReady;
	const inbound = (data?.apiKeys.length ?? 0) > 0;
	const ai = data?.ai.connected;
	const ready = Boolean(signing || inbound || ai);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: t.byok,
			subtitle: "Bring your own signing key, inbound API key, and AI key. Same connector pattern as eMeterai."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mx-4 mb-4 rounded-lg border px-4 py-3 text-sm md:mx-6 ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`,
			children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Connected. TSA seals with ",
				signing ? "your HMAC key" : "the platform key",
				" · inbound REST ",
				inbound ? "on" : "off",
				" · AI",
				" ",
				ai ? `${data?.ai.provider}/${data?.ai.model}` : "local scan",
				"."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Nothing plugged in yet. Generate a signing key (or paste one), mint an inbound ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "paraf_live_" }),
				" key, and/or paste an AI provider key. Until then TSA still seals with the platform secret — DEMO for your own key."
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 px-4 md:grid-cols-3 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Signing key",
					value: signing ? "Live" : "Demo",
					hint: data?.byok.keyHint || "Platform HMAC until you paste a key"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Inbound keys",
					value: String(data?.apiKeys.length ?? 0),
					hint: "HRIS → Paraf Bearer paraf_live_…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "AI review",
					value: ai ? data.ai.provider : "Off",
					hint: data?.ai.keyHint || "Paste OpenAI / xAI / Claude / Groq"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pt-8 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-sm font-semibold",
				children: "How to bring your own key"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					{
						n: "1",
						title: "Signing secret",
						body: "Generate or paste an HMAC secret. Every send/sign/void seals a TSA token with it."
					},
					{
						n: "2",
						title: "Inbound API key",
						body: "Mint paraf_live_… and POST documents from payroll / HRIS / n8n."
					},
					{
						n: "3",
						title: "AI key",
						body: "Paste a provider key. Contract review on Help uses it automatically."
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
			className: "grid gap-4 p-4 md:grid-cols-2 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Signing key (TSA)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 mb-3 text-sm text-muted",
							children: [
								"Env plug-and-play: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "PARAF_BYOK_SECRET" }),
								". Optional PEM is stored as a fingerprint on the workspace."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs text-muted",
							children: "HMAC secret"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: secret,
							onChange: (e) => setSecret(e.target.value),
							placeholder: data?.byok.keyHint || "paraf_byok_…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 mb-1 block text-xs text-muted",
							children: "PEM certificate (optional)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "h-24 w-full rounded-md border border-border px-3 py-2 font-mono text-xs",
							value: pem,
							onChange: (e) => setPem(e.target.value),
							placeholder: "-----BEGIN CERTIFICATE-----\n…"
						}),
						data?.byok.pemHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted",
							children: [
								data.byok.pemHint,
								" ",
								data.byok.fingerprint ? `· fp ${data.byok.fingerprint}` : ""
							]
						}) : null,
						shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all",
							children: ["Generated (once): ", shown]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap justify-end gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: busy,
									onClick: async () => {
										setBusy(true);
										try {
											const res = await saveByok({ data: { generate: true } });
											if (res.secret) setShown(res.secret);
											toast.success("Workspace key generated");
											refetch();
											qc.invalidateQueries({ queryKey: ["boot"] });
										} finally {
											setBusy(false);
										}
									},
									children: "Generate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: busy,
									onClick: async () => {
										setBusy(true);
										try {
											const ping = await testByok();
											if (ping.ok) toast.success(ping.message);
											else toast.error(ping.message);
											refetch();
										} finally {
											setBusy(false);
										}
									},
									children: "Test connection"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: busy,
									onClick: async () => {
										setBusy(true);
										try {
											await saveByok({ data: {
												secret,
												pem
											} });
											toast.success("BYOK saved");
											setSecret("");
											refetch();
											qc.invalidateQueries({ queryKey: ["boot"] });
										} finally {
											setBusy(false);
										}
									},
									children: "Save"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Inbound REST (HRIS → Paraf)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 mb-3 text-sm text-muted",
							children: [
								"Authorization: Bearer paraf_live_… Workspace ",
								boot.company.name,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mb-3 list-disc space-y-1 pl-5 font-mono text-[12px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"POST ",
									origin,
									"/api/v1/hooks"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"POST ",
									origin,
									"/api/v1/documents"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"GET ",
									origin,
									"/api/v1/documents"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"GET ",
									origin,
									"/api/v1/events"
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
									toast.success("Copy this key now — shown once");
									refetch();
								},
								children: "Create key"
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-surface p-5 md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "AI provider key"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 mb-3 text-sm text-muted",
							children: "Used by Help → Analyze. Switch provider without leaving this page."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-10 rounded-md border border-border px-3 text-sm",
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: apiKey,
									onChange: (e) => setApiKey(e.target.value),
									placeholder: data?.ai.keyHint || "sk-…"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: model,
									onChange: (e) => setModel(e.target.value),
									placeholder: "model"
								})
							]
						}),
						provider === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-3",
							value: baseUrl,
							onChange: (e) => setBaseUrl(e.target.value),
							placeholder: "https://api.example.com/v1/chat/completions"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
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
										refetch();
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
										toast.success("AI key saved");
										refetch();
									} finally {
										setBusy(false);
									}
								},
								children: "Save"
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "px-4 pb-8 text-sm text-muted md:px-6",
			children: [
				"Outbound events live on",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/webhooks",
					className: "font-medium text-brand underline",
					children: "Webhooks"
				}),
				". eMeterai distributor token is still under Settings → eMeterai API."
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
export { ByokPage as component };
