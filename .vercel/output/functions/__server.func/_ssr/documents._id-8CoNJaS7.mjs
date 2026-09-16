import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as useRouterState, h as Outlet, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as mutateDocument, R as setPasscode, m as getDocument, n as addRecipient } from "./api-BmE3vsND.mjs";
import { I as signingLink, M as relativeId, O as progress, g as formatIdDate, j as recipientSigningLink, s as canSign } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, d as certificateHtml, f as downloadBlob, h as useT, l as attachmentsHtml, m as useLang, p as useBoot, u as auditHtml } from "./app-shell-DNQOiwL0.mjs";
import { a as STATUS_LABEL } from "./types-DfCXKDmj.mjs";
import { i as Route$12 } from "./router-CJfIBE85.mjs";
import { t as StatusBadge } from "./badge-DBlCBSWv.mjs";
import { n as pageCount, t as DocumentPaper } from "./document-paper-D9pt28Ur.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents._id-8CoNJaS7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function copyText(text, ok = "Tautan disalin") {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(ok);
	} catch {
		toast.message(text);
	}
}
function DocPage() {
	const { id } = Route$12.useParams();
	const isSign = useRouterState({ select: (s) => s.location.pathname }).endsWith("/sign");
	const boot = useBoot();
	const t = useT();
	const lang = useLang((s) => s.lang);
	const nav = useNavigate();
	const qc = useQueryClient();
	const [page, setPage] = (0, import_react.useState)(0);
	const [fwd, setFwd] = (0, import_react.useState)(false);
	const [fname, setFname] = (0, import_react.useState)("");
	const [femail, setFemail] = (0, import_react.useState)("");
	const [pc, setPc] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const { data, isPending } = useQuery({
		queryKey: ["doc", id],
		queryFn: () => getDocument({ data: id }),
		enabled: !isSign
	});
	const mut = useMutation({
		mutationFn: (action) => mutateDocument({ data: {
			id,
			action
		} }),
		onSuccess: () => {
			qc.invalidateQueries();
		}
	});
	if (isSign) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-6 skeleton-shimmer h-96 rounded-xl" });
	if (!data?.document) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-center text-muted",
		children: "Dokumen tidak ditemukan."
	});
	const doc = data.document;
	const pages = pageCount(doc.content, doc.fields);
	const signable = canSign(doc, boot.user.email);
	const pg = progress(doc);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: doc.title,
			subtitle: `${doc.groupName} · ${doc.compliance === "psre" ? "PSrE" : "GlobalSign"}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status: doc.status,
					label: STATUS_LABEL[doc.status][lang]
				}),
				signable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/documents/$id/sign",
						params: { id },
						children: t.sign
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => {
						downloadBlob(`${doc.title.replace(/\s+/g, "-")}.html`, attachmentsHtml([doc]));
						downloadBlob(`${doc.title.replace(/\s+/g, "-")}-audit.html`, auditHtml(data.audit.map((a) => ({
							document_id: doc.id,
							actor: a.actor,
							action: a.action,
							created_at: a.createdAt
						})), { [doc.id]: doc.title }));
						if (doc.status === "completed") downloadBlob(`${doc.title.replace(/\s+/g, "-")}-certificate.html`, certificateHtml({
							...doc,
							tsa: (data.tsa ?? []).map((t) => ({
								serial: t.serial,
								genTime: t.token.genTime
							}))
						}));
						toast.success("Downloaded");
					},
					children: t.download
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 p-4 lg:grid-cols-[1fr_320px] md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-print mb-2 flex gap-1",
				children: Array.from({ length: pages }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPage(i),
					className: `rounded-md px-2 py-1 text-xs ${page === i ? "bg-navy text-white" : "bg-surface-2"}`,
					children: i + 1
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPaper, {
				content: doc.content,
				page,
				fields: doc.fields,
				recipients: doc.recipients,
				lang
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "no-print space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-muted uppercase",
								children: t.recipients
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-[11px] text-subtle",
								children: [
									pg.signed,
									"/",
									pg.total,
									" selesai"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: doc.recipients.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: r.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted",
											children: [
												r.email,
												" · ",
												r.role,
												" · ",
												r.status,
												r.signedAt ? ` · ${formatIdDate(r.signedAt, true)}` : ""
											]
										}),
										r.status !== "signed" && r.role !== "cc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "mt-1 text-[11px] font-medium text-brand hover:underline",
											onClick: () => void copyText(recipientSigningLink(r.inviteToken, doc.token), "Tautan undangan disalin"),
											children: "Salin tautan undangan"
										}) : null
									]
								}, r.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3 w-full",
								size: "sm",
								variant: "outline",
								onClick: () => setFwd(true),
								children: t.forward
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Aksi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											mut.mutateAsync("remind");
											toast.success("Pengingat terkirim");
										},
										children: t.remind
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: async () => {
											await mutateDocument({ data: {
												id,
												action: "resend"
											} });
											toast.success("Dikirim ulang");
										},
										children: "Kirim ulang"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => void copyText(signingLink(doc.token), "Tautan disalin"),
										children: t.share
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: async () => {
											const res = await mut.mutateAsync("duplicate");
											toast.success("Disalin ke draf");
											if (res && "id" in res && res.id) nav({
												to: "/documents/$id",
												params: { id: String(res.id) }
											});
										},
										children: t.duplicate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => setPc(true),
										children: t.passcode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/ai",
											search: { id },
											children: t.ai
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => {
											mut.mutateAsync("void");
											toast.success("Dibatalkan");
										},
										children: t.void
									})
								]
							}),
							doc.deadline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[11px] text-muted",
								children: ["Tenggat ", formatIdDate(doc.deadline)]
							}) : null,
							doc.declineReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-danger",
								children: doc.declineReason
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Paraf Timestamp (TSA)"
							}),
							data.tsa?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2 text-[12px]",
								children: data.tsa.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md bg-surface-2 px-2 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/verify",
										search: { serial: t.serial },
										className: "font-mono text-brand hover:underline",
										children: t.serial
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted",
										children: t.token.genTime || t.createdAt
									})]
								}, t.serial))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Sealed when this document is sent or signed. Chain lives inside Paraf — not only the audit table."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "mt-3 w-full",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/proofs",
									children: "Open timestamp ledger"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold tracking-wide text-muted uppercase",
							children: t.audit
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 space-y-3",
							children: data.audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-l-2 border-brand/40 pl-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: a.action
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted",
									children: [
										a.actor,
										" · ",
										relativeId(a.createdAt),
										" · ",
										a.ip
									]
								})]
							}, a.id))
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: fwd,
			onOpenChange: setFwd,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: "Teruskan / tambah penerima",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Nama",
							value: fname,
							onChange: (e) => setFname(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Email",
							value: femail,
							onChange: (e) => setFemail(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: async () => {
								await addRecipient({ data: {
									documentId: id,
									name: fname,
									email: femail
								} });
								toast.success("Penerima ditambah");
								setFwd(false);
								qc.invalidateQueries({ queryKey: ["doc", id] });
							},
							children: "Kirim"
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: pc,
			onOpenChange: setPc,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				title: "Kode sandi dokumen",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: code,
					onChange: (e) => setCode(e.target.value),
					placeholder: "6 digit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					onClick: async () => {
						await setPasscode({ data: {
							id,
							passcode: code || null
						} });
						toast.success("Kode sandi disimpan");
						setPc(false);
					},
					children: "Simpan"
				})]
			})
		})
	] });
}
//#endregion
export { DocPage as component };
