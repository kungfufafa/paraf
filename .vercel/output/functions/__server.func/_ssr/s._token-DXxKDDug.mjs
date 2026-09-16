import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { O as publicSign, g as getPublicDocument } from "./api-BmE3vsND.mjs";
import { n as ParafLogo, t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as Route$13 } from "./router-CJfIBE85.mjs";
import { n as pageCount, t as DocumentPaper } from "./document-paper-D9pt28Ur.mjs";
import { t as SignPad } from "./sign-pad-BMT1PYZ8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/s._token-DXxKDDug.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicSign() {
	const { token } = Route$13.useParams();
	const { data: doc, isPending, refetch } = useQuery({
		queryKey: ["pub", token],
		queryFn: () => getPublicDocument({ data: token })
	});
	const [page, setPage] = (0, import_react.useState)(0);
	const [fields, setFields] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [agreed, setAgreed] = (0, import_react.useState)(false);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const rec = (0, import_react.useMemo)(() => {
		if (!doc) return void 0;
		if (doc.lockRecipientId) return doc.recipients.find((r) => r.id === doc.lockRecipientId);
		return doc.recipients.find((r) => r.status !== "signed" && r.role !== "cc");
	}, [doc]);
	const live = fields ?? doc?.fields ?? [];
	const pages = doc ? pageCount(doc.content, live) : 1;
	const myTurn = (0, import_react.useMemo)(() => {
		if (!doc || !rec) return false;
		if ([
			"completed",
			"declined",
			"expired",
			"voided"
		].includes(doc.status)) return false;
		if (rec.status === "signed" || rec.status === "declined") return false;
		if (doc.settings.sequential) {
			if (doc.recipients.filter((r) => r.orderIndex < rec.orderIndex && r.role !== "cc").some((r) => r.status !== "signed")) return false;
		}
		return rec.role !== "cc";
	}, [doc, rec]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg",
		children: "Memuat undangan…"
	});
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted",
				children: "Tautan undangan tidak valid atau sudah kedaluwarsa."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4",
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Kembali"
				})
			})
		] })
	});
	if (doc.passcode && !unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm",
					children: "Dokumen dilindungi kode sandi. Minta kode ke pengirim."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-3",
					value: code,
					onChange: (e) => setCode(e.target.value),
					placeholder: "Kode sandi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					onClick: () => setUnlocked(code === doc.passcode),
					children: "Buka dokumen"
				})
			]
		})
	});
	if (done || rec?.status === "signed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-6 grid size-14 place-items-center rounded-full bg-success text-xl font-bold text-white",
				children: "✓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-xl font-semibold",
				children: "Sudah ditandatangani"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Terima kasih, ",
					rec?.name,
					". Jejak audit dan stempel waktu tercatat di Paraf."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/verify",
					children: "Verifikasi keaslian"
				})
			})
		] })
	});
	async function applyAndMaybeFinish(dataUrl, complete) {
		if (!rec || !doc) return;
		const next = live.map((f) => f.recipientId === rec.id && (f.type === "signature" || f.type === "initials") ? {
			...f,
			value: dataUrl
		} : f.recipientId === rec.id && f.type === "date" ? {
			...f,
			value: new Intl.DateTimeFormat("id-ID").format(/* @__PURE__ */ new Date())
		} : f.recipientId === rec.id && f.type === "name" ? {
			...f,
			value: rec.name
		} : f);
		setFields(next);
		setOpen(false);
		if (!complete) return;
		setBusy(true);
		setError(null);
		try {
			if (!(await publicSign({ data: {
				token,
				recipientId: rec.id,
				fields: next,
				signatureData: dataUrl
			} })).ok) {
				setError("Gagal menyimpan tanda tangan. Periksa tautan undangan.");
				return;
			}
			setDone(true);
			refetch();
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 truncate text-sm text-muted",
						children: doc.title
					}),
					started && myTurn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: busy,
						onClick: () => setOpen(true),
						children: "Bubuhkan paraf"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !agreed || !rec || !myTurn,
						onClick: () => setStarted(true),
						children: "Mulai tanda tangan"
					})
				]
			}),
			!agreed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-4 flex max-w-5xl flex-col items-start justify-between gap-3 rounded-lg border border-brand/30 bg-brand-soft px-4 py-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-start gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "mt-1 size-4",
						checked: agreed,
						onChange: (e) => setAgreed(e.target.checked)
					}), "Saya setuju menggunakan tanda tangan elektronik Paraf (UU ITE & PSrE)."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => setAgreed(true),
					children: "Saya setuju"
				})]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-3 max-w-5xl px-4 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-5xl gap-4 p-4 lg:grid-cols-[1fr_260px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex gap-1",
					children: Array.from({ length: pages }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPage(i),
						className: `min-h-9 rounded-md px-3 text-xs ${page === i ? "bg-navy text-white" : "bg-surface-2"}`,
						children: i + 1
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPaper, {
					content: doc.content,
					page,
					fields: live,
					recipients: doc.recipients,
					lang: "id",
					interactive: started && myTurn,
					onSelectField: (fid) => {
						const f = live.find((x) => x.id === fid);
						if (f && (f.type === "signature" || f.type === "initials")) setOpen(true);
					}
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold tracking-wide text-muted uppercase",
								children: "Anda menandatangani sebagai"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-medium",
								children: rec?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: rec?.email
							}),
							!myTurn && rec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-warning",
								children: "Belum giliran Anda. Pihak sebelumnya harus menandatangani dulu."
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold tracking-wide text-muted uppercase",
							children: "Pihak lain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm",
							children: doc.recipients.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: r.status === "signed" ? "Selesai" : "Menunggu"
								})]
							}, r.id))
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Bubuhkan paraf",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignPad, {
						name: rec?.name ?? "",
						onDone: (dataUrl) => void applyAndMaybeFinish(dataUrl, true)
					})
				})
			})
		]
	});
}
//#endregion
export { PublicSign as component };
