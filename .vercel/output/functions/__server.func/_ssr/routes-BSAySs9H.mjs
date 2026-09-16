import { b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ParafLogo, t as Button } from "./button-CZaJ7tF_.mjs";
import { E as FileCheck2, c as Stamp, i as WandSparkles, m as QrCode, n as Workflow, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as useCurrentUserState } from "./use-current-user-C6bKIWJk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BSAySs9H.js
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		icon: FileCheck2,
		title: "Tanda tangan PSrE",
		body: "Sah di Indonesia, dilengkapi sertifikat, stempel waktu, dan jejak audit."
	},
	{
		icon: Stamp,
		title: "e-Meterai resmi",
		body: "Bubuhkan meterai elektronik, kelola kuota, dan lacak nomor seri."
	},
	{
		icon: Workflow,
		title: "Alur berurutan",
		body: "Signer, approver, saksi, dan CC — paralel atau bergiliran."
	},
	{
		icon: ShieldCheck,
		title: "Persetujuan bertingkat",
		body: "Template Legal → Finance → Direksi sebelum dokumen dikirim."
	},
	{
		icon: QrCode,
		title: "QR & verifikasi publik",
		body: "Siapa pun bisa cek keaslian dokumen lewat tautan atau kode QR."
	},
	{
		icon: WandSparkles,
		title: "Asisten AI kontrak",
		body: "Ringkas risiko pasal, klausul hilang, dan rekomendasi revisi."
	}
];
function Home() {
	const { user, isPending } = useCurrentUserState();
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/esignature/$folder",
		params: { folder: "all-inbox" }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Masuk"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Mulai"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-[0.2em] text-brand uppercase",
						children: "PSrE · e-Meterai · Jejak audit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-4xl font-semibold tracking-tight md:text-5xl",
						children: "Ruang kerja tanda tangan digital untuk perusahaan Indonesia."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-lg text-muted leading-relaxed",
						children: "Unggah kontrak, taruh kolom paraf, kirim lewat email atau WhatsApp, dan kunci dokumen begitu semua pihak menandatangani. Tanpa print-scan-sign."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "Masuk ke kotak masuk"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/coba",
									children: "Tanda tangani sebagai mitra"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/verify",
									children: "Verifikasi dokumen"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-10 grid grid-cols-3 gap-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-2xl font-semibold tabular-nums",
								children: "PSrE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: "Tersertifikasi"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-2xl font-semibold tabular-nums",
								children: "7×"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: "Lebih cepat"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-2xl font-semibold tabular-nums",
								children: "ISO"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: "27001 ready"
							})] })
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-4 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inbox · Perlu ditandatangani" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand",
							children: "2 menunggu"
						})]
					}), [
						"PKS Distribusi Q3",
						"NDA Vendor Cloud",
						"PKWT Account Executive"
					].map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-border py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted",
							children: i === 2 ? "Menunggu orang lain" : "Perlu tanda tangan Anda"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-brand",
							children: "Tinjau"
						})]
					}, n))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-surface py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-3",
					children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5 text-brand" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-semibold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: f.body
							})
						]
					}, f.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "px-5 py-8 text-center text-xs text-subtle",
				children: "Paraf — tanda tangan digital & e-Meterai."
			})
		]
	});
}
//#endregion
export { Home as component };
