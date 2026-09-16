import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as listSignatures, i as applySignature, m as getDocument, v as issueEmeterai, w as listStamps } from "./api-BmE3vsND.mjs";
import { D as myRecipient } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, m as useLang, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { n as Route$2 } from "./router-CJfIBE85.mjs";
import { t as Textarea } from "./textarea-nUjVbxVA.mjs";
import { n as pageCount, t as DocumentPaper } from "./document-paper-D9pt28Ur.mjs";
import { t as SignPad } from "./sign-pad-BMT1PYZ8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents._id.sign-BAz4R3ZY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignPage() {
	const { id } = Route$2.useParams();
	const boot = useBoot();
	const lang = useLang((s) => s.lang);
	const nav = useNavigate();
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["doc", id],
		queryFn: () => getDocument({ data: id })
	});
	const { data: stamps } = useQuery({
		queryKey: ["stamps"],
		queryFn: () => listStamps()
	});
	const { data: sigs = [] } = useQuery({
		queryKey: ["sigs"],
		queryFn: () => listSignatures()
	});
	const [page, setPage] = (0, import_react.useState)(0);
	const [fields, setFields] = (0, import_react.useState)(null);
	const [sig, setSig] = (0, import_react.useState)();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [decline, setDecline] = (0, import_react.useState)(false);
	const [reason, setReason] = (0, import_react.useState)("");
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [activeField, setActiveField] = (0, import_react.useState)();
	const doc = data?.document;
	const mine = doc ? myRecipient(doc, boot.user.email) : void 0;
	const live = fields ?? doc?.fields ?? [];
	const nextEmpty = (0, import_react.useMemo)(() => live.filter((f) => !mine || f.recipientId === mine.id), [live, mine]).find((f) => f.required && !f.value);
	const pages = doc ? pageCount(doc.content, live) : 1;
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-center text-muted",
		children: "Memuat dokumen…"
	});
	function fillAuto(list, dataUrl) {
		const url = dataUrl ?? sig;
		return list.map((f) => {
			if (mine && f.recipientId !== mine.id) return f;
			if ((f.type === "signature" || f.type === "initials") && url) return {
				...f,
				value: url
			};
			if (f.type === "date") return {
				...f,
				value: new Intl.DateTimeFormat("id-ID").format(/* @__PURE__ */ new Date())
			};
			if (f.type === "name") return {
				...f,
				value: boot.user.name
			};
			if (f.type === "email") return {
				...f,
				value: boot.user.email
			};
			return f;
		});
	}
	function applySig(dataUrl) {
		setSig(dataUrl);
		setFields(fillAuto(live, dataUrl));
		setOpen(false);
		setActiveField(void 0);
	}
	function startSigning() {
		setStarted(true);
		const first = live.find((f) => (!mine || f.recipientId === mine.id) && f.required && !f.value);
		if (first) setPage(Math.min(first.page, Math.max(0, pages - 1)));
		const def = sigs.find((s) => s.is_default) ?? sigs[0];
		if (def?.data_url) {
			applySig(def.data_url);
			return;
		}
		applySig(typedSignature(boot.user.name));
	}
	function activateField(fieldId) {
		if (!started) {
			if (!agreed) return;
			startSigning();
		}
		const f = live.find((x) => x.id === fieldId);
		if (!f || mine && f.recipientId !== mine.id) return;
		setActiveField(fieldId);
		if (f.page !== page) setPage(Math.min(f.page, pages - 1));
		if (f.type === "signature" || f.type === "initials") {
			applySig(sig || (sigs.find((s) => s.is_default) ?? sigs[0])?.data_url || typedSignature(boot.user.name));
			return;
		}
		if (f.type === "date" || f.type === "name" || f.type === "email" || f.type === "title" || f.type === "company") setFields(live.map((x) => x.id !== fieldId ? x : {
			...x,
			value: f.type === "date" ? new Intl.DateTimeFormat("id-ID").format(/* @__PURE__ */ new Date()) : f.type === "email" ? boot.user.email : f.type === "company" ? boot.company.name : boot.user.name
		}));
		if (f.type === "emeterai") applyMeterai();
	}
	function applyStamp(url) {
		if (!mine) return;
		setFields(live.map((f) => f.recipientId === mine.id && f.type === "stamp" ? {
			...f,
			value: url
		} : f));
	}
	async function applyMeterai() {
		if (!mine) return;
		const res = await issueEmeterai({ data: { documentId: id } });
		setFields(live.map((f) => f.recipientId === mine.id && f.type === "emeterai" ? {
			...f,
			value: res.serial
		} : f));
		if (res.legal) toast.success("e-Meterai sah dibubuhkan · " + res.serial);
		else toast.message("error" in res && res.error || "Demo stamp only — not legally valid. Connect Peruri API in Settings.");
	}
	async function finish(asDecline = false) {
		if (!mine) return;
		if (!asDecline && !sig && !live.some((f) => f.type === "signature" && f.value)) {
			toast.error("Bubuhkan tanda tangan dulu");
			setOpen(true);
			return;
		}
		await applySignature({ data: {
			id,
			recipientId: mine.id,
			fields: live,
			signatureData: sig ?? "",
			emeterai: live.some((f) => f.recipientId === mine.id && f.type === "emeterai" && f.value),
			decline: asDecline,
			reason
		} });
		qc.invalidateQueries();
		if (asDecline) {
			toast.success("Dokumen ditolak");
			nav({
				to: "/documents/$id",
				params: { id }
			});
			return;
		}
		setDone(true);
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[calc(100vh-48px)] flex-col items-center justify-center px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-14 place-items-center rounded-full bg-success text-xl font-bold text-white",
				children: "✓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-xl font-semibold",
				children: "Document signed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted",
				children: "Your signature is locked to this document. Other parties will be notified if they still need to sign."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/esignature/$folder",
						params: { folder: "all-inbox" },
						children: "Back to inbox"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/documents/$id",
						params: { id },
						children: "View document"
					})
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: doc.title,
			subtitle: "Review & sign",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setDecline(true),
				children: "Decline"
			}), !started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => {
					setAgreed(true);
					startSigning();
				},
				children: "Start signing"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "navy",
				onClick: () => void finish(false),
				"data-testid": "finish-sign",
				children: "Finish"
			})] })
		}),
		!agreed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 md:mx-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "mt-1",
					checked: agreed,
					onChange: (e) => setAgreed(e.target.checked)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I agree to the Paraf electronic signature terms. This signature is legally binding (PSrE / GlobalSign)." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: () => setAgreed(true),
				children: "I agree"
			})]
		}) : null,
		agreed && started && nextEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 mt-3 rounded-md border border-border bg-surface px-4 py-2 text-sm md:mx-6",
			children: [
				"Next field: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: nextEmpty.type }),
				" — click it on the document, or pick a saved eSignature."
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 lg:grid-cols-[1fr_260px] md:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex gap-1",
				children: Array.from({ length: pages }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPage(i),
					className: `rounded-md px-2 py-1 text-xs ${page === i ? "bg-navy text-white" : "bg-surface-2"}`,
					children: i + 1
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPaper, {
				content: doc.content,
				page,
				fields: live,
				recipients: doc.recipients,
				lang,
				interactive: agreed,
				selectedId: activeField ?? nextEmpty?.id,
				onSelectField: activateField
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4 text-sm",
						children: [
							"You are signing as ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mine?.name }),
							". After Finish, the certificate is locked to this document."
						]
					}),
					started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [sigs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: "Saved eSignature"
						}), sigs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 block w-full rounded-md border border-border p-2 hover:border-brand",
							onClick: () => applySig(s.data_url),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.data_url,
								alt: s.name,
								className: "mx-auto h-12 object-contain"
							})
						}, s.id))]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						size: "sm",
						onClick: () => setOpen(true),
						children: "Create / pick eSignature"
					})] }) : null,
					stamps?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: "Stamp"
						}), stamps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 block",
							onClick: () => applyStamp(s.data_url),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.data_url,
								alt: s.name,
								className: "h-16 object-contain"
							})
						}, s.id))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						size: "sm",
						onClick: applyMeterai,
						children: "Apply eMeterai"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				title: "Sign",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignPad, {
					name: boot.user.name,
					onDone: (d) => applySig(d)
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: decline,
			onOpenChange: setDecline,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				title: "Decline document",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					placeholder: "Reason",
					value: reason,
					onChange: (e) => setReason(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					variant: "danger",
					onClick: () => void finish(true),
					children: "Decline"
				})]
			})
		})
	] });
}
function typedSignature(name) {
	const c = document.createElement("canvas");
	c.width = 640;
	c.height = 180;
	const ctx = c.getContext("2d");
	if (!ctx) return "";
	ctx.fillStyle = "#1b2430";
	ctx.font = "72px 'Great Vibes', Georgia, cursive";
	ctx.textBaseline = "middle";
	ctx.fillText(name || "Paraf", 24, 100);
	return c.toDataURL("image/png");
}
//#endregion
export { SignPage as component };
