import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as cn } from "./integrations-BY7zkbKR.mjs";
import { r as FIELD_LABEL } from "./types-DfCXKDmj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/document-paper-D9pt28Ur.js
var import_jsx_runtime = require_jsx_runtime();
function pageCount(content, fields = []) {
	const base = 1 + (content.clauses.length > 3 ? 1 : 0) + 1;
	const maxField = fields.reduce((m, f) => Math.max(m, f.page + 1), 0);
	return Math.max(base, maxField);
}
function DocumentPaper({ content, page, fields, recipients, lang, interactive, selectedId, onSelectField, onMoveField }) {
	const pages = pageCount(content, fields);
	const isCover = page === 0;
	const isSign = page === pages - 1;
	const clausePage = !isCover && !isSign;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-shadow relative mx-auto aspect-[210/297] w-full max-w-[720px] bg-paper text-ink",
		"data-page": page,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-8 top-5 flex items-start justify-between text-[9px] tracking-widest text-subtle uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Paraf PSrE · ", content.number] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					page + 1,
					"/",
					pages
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-full overflow-hidden px-10 pt-12 pb-10",
				children: [
					isCover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, { content }) : null,
					clausePage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clauses, { content }) : null,
					isSign ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignBlock, { content }) : null
				]
			}),
			fields.filter((f) => Math.min(f.page, Math.max(0, pages - 1)) === page).map((f) => {
				const rec = recipients.find((r) => r.id === f.recipientId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldChip, {
					field: f,
					recipient: rec,
					lang,
					selected: selectedId === f.id,
					interactive,
					onSelect: () => onSelectField?.(f.id),
					onMove: onMoveField
				}, f.id);
			})
		]
	});
}
function Cover({ content }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold tracking-[0.18em] text-brand uppercase",
					children: "PT Jaya Wijaya Kusuma"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-[10px] text-muted",
					children: "Cirebon · Indonesia"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-sm border border-brand/40 px-2 py-1 text-[9px] font-semibold tracking-wider text-brand uppercase",
					children: "Tersertifikasi PSrE"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center text-[17px] font-semibold tracking-wide",
				children: {
					pkwt: "PERJANJIAN KERJA WAKTU TERTENTU",
					nda: "PERJANJIAN KERAHASIAAN",
					spk: "SURAT PERINTAH KERJA",
					invoice: "FAKTUR PENJUALAN",
					mou: "NOTA KESEPAHAMAN",
					kuasa: "SURAT KUASA",
					sewa: "PERJANJIAN SEWA MENYEWA",
					addendum: "ADDENDUM PERJANJIAN",
					kerjasama: "PERJANJIAN KERJA SAMA"
				}[content.kind] ?? "DOKUMEN ELEKTRONIK"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-center text-xs text-muted",
				children: ["Nomor: ", content.number]
			}),
			content.subject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-xs text-ink",
				children: content.subject
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-5 h-px bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] leading-relaxed text-ink",
				children: [
					"Pada hari ini, ",
					content.date,
					", bertempat di ",
					content.location,
					", yang bertanda tangan di bawah ini:"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: content.parties.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-surface px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] font-semibold tracking-wider text-brand uppercase",
							children: ["Pihak ", i === 0 ? "Pertama" : "Kedua"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[12px] font-semibold",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted",
							children: [
								p.title,
								" · ",
								p.company
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-subtle",
							children: p.address
						}),
						p.npwp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] text-subtle",
							children: ["NPWP ", p.npwp]
						}) : null
					]
				}, i))
			}),
			content.amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md bg-brand-soft px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium tracking-wide text-brand uppercase",
						children: "Nilai"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: content.amount
					}),
					content.amountWords ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted italic",
						children: content.amountWords
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[11px] leading-relaxed text-ink",
				children: "Para Pihak terlebih dahulu menerangkan bahwa mereka sepakat mengikatkan diri dalam perjanjian ini dengan syarat dan ketentuan sebagai berikut."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-auto text-[9px] text-subtle",
				children: "Dokumen elektronik ini memiliki kekuatan hukum yang sama dengan dokumen basah sesuai UU ITE dan Peraturan Penyelenggara Sertifikasi Elektronik."
			})
		]
	});
}
function Clauses({ content }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-4 text-sm font-semibold tracking-wide",
		children: "KETENTUAN PERJANJIAN"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: content.clauses.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-[12px] font-semibold",
			children: c.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[11px] leading-relaxed text-ink",
			children: c.body
		})] }, i))
	})] });
}
function SignBlock({ content }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] leading-relaxed",
				children: "Demikian perjanjian ini dibuat dalam rangkap elektronik yang ditandatangani secara digital oleh Para Pihak, masing-masing mempunyai kekuatan hukum yang sama."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-[11px]",
				children: [
					"Dibuat di ",
					content.location,
					", pada tanggal ",
					content.date,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-8",
				children: content.parties.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] font-semibold tracking-wider text-muted uppercase",
							children: ["Pihak ", i === 0 ? "Pertama" : "Kedua"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[11px]",
							children: p.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-semibold underline decoration-ink/30 underline-offset-4",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted",
							children: p.title
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-auto border-t border-border pt-3 text-[9px] leading-relaxed text-subtle",
				children: "Setiap tanda tangan digital pada dokumen ini diterbitkan atas nama pemegang sertifikat PSrE Paraf, dilengkapi jejak audit, stempel waktu, dan kode QR verifikasi. Pemalsuan dikenai sanksi pidana."
			})
		]
	});
}
function FieldChip({ field, recipient, lang, selected, interactive, onSelect, onMove }) {
	const filled = Boolean(field.value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: interactive ? "button" : void 0,
		tabIndex: interactive ? 0 : void 0,
		onClick: (e) => {
			e.stopPropagation();
			onSelect?.();
		},
		onPointerDown: (e) => {
			if (!interactive || !onMove) return;
			const parent = e.currentTarget.offsetParent;
			if (!parent) return;
			const startX = e.clientX;
			const startY = e.clientY;
			const origX = field.x;
			const origY = field.y;
			const w = parent.clientWidth;
			const h = parent.clientHeight;
			const move = (ev) => {
				const nx = Math.min(92, Math.max(2, origX + (ev.clientX - startX) / w * 100));
				const ny = Math.min(92, Math.max(2, origY + (ev.clientY - startY) / h * 100));
				onMove(field.id, nx, ny);
			};
			const up = () => {
				window.removeEventListener("pointermove", move);
				window.removeEventListener("pointerup", up);
			};
			window.addEventListener("pointermove", move);
			window.addEventListener("pointerup", up);
		},
		className: cn("absolute z-10 flex items-center justify-center overflow-hidden rounded-xs border border-dashed text-[10px] leading-tight", filled ? "border-success/50 bg-success-soft/80" : "border-brand/70 bg-brand-soft/80", selected && "ring-2 ring-brand", interactive && onMove && "cursor-grab active:cursor-grabbing", interactive && !onMove && "cursor-pointer"),
		style: {
			left: `${field.x}%`,
			top: `${field.y}%`,
			width: `${field.w}%`,
			height: `${field.h}%`
		},
		children: filled && (field.type === "signature" || field.type === "initials") && field.value?.startsWith("data:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: field.value,
			alt: "",
			className: "h-full w-full object-contain"
		}) : filled && field.type === "signature" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sign-font text-lg text-ink",
			children: field.value
		}) : filled && field.type === "emeterai" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmeteraiMark, { serial: field.value ?? "EM-DEMO" }) : filled && field.type === "stamp" && field.value?.startsWith("data:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: field.value,
			alt: "",
			className: "h-full w-full object-contain"
		}) : filled && field.type === "qr" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrMark, { seed: field.value ?? field.id }) : filled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "px-1 text-[10px] font-medium",
			children: field.value
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "px-1 text-center text-[9px] font-medium text-brand",
			children: [FIELD_LABEL[field.type][lang], recipient ? ` · ${recipient.name.split(" ")[0]}` : ""]
		})
	});
}
function EmeteraiMark({ serial }) {
	const legal = Boolean(serial) && !serial.startsWith("DEMO");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex h-full w-full items-center gap-1 px-1 ${legal ? "bg-success-soft" : "bg-warning-soft"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "size-6 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "2",
				y: "2",
				width: "28",
				height: "28",
				rx: "3",
				fill: legal ? "#0F7B4B" : "#C2410C"
			}), legal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 16.5 13 21 24 10",
				stroke: "#fff",
				strokeWidth: "2.4",
				fill: "none"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "16",
				y: "20",
				textAnchor: "middle",
				fontSize: "8",
				fill: "#fff",
				fontWeight: "700",
				children: "DEMO"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `truncate text-[8px] font-bold tracking-wide ${legal ? "text-success" : "text-warning"}`,
				children: legal ? "e-METERAI SAH" : "e-METERAI DEMO"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `truncate text-[7px] ${legal ? "text-success" : "text-warning"}`,
				children: serial.slice(0, 16)
			})]
		})]
	});
}
function QrMark({ seed }) {
	const bits = Array.from({ length: 49 }, (_, i) => {
		return (seed.charCodeAt(i % seed.length) + i * 13) % 3 !== 0;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 7 7",
		className: "h-[90%] w-[90%]",
		children: bits.map((on, i) => on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: i % 7,
			y: Math.floor(i / 7),
			width: "1",
			height: "1",
			fill: "#1B2430"
		}, i) : null)
	});
}
//#endregion
export { pageCount as n, DocumentPaper as t };
