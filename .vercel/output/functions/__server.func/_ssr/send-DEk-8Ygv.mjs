import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as saveDocument, T as listTemplates, b as listContacts } from "./api-BmE3vsND.mjs";
import { R as uid, i as blankContent, j as recipientSigningLink, l as contentFromImportedFile } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-B_1IKi7T.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, h as useT, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { a as importCloudFile, s as listCloudFiles } from "./integrations-api-BS8riFGh.mjs";
import { n as DOC_TYPE_LABEL, t as DEFAULT_SETTINGS } from "./types-DfCXKDmj.mjs";
import { o as Route$18 } from "./router-CJfIBE85.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/send-DEk-8Ygv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"Naskah",
	"Penerima",
	"Kolom",
	"Kirim"
];
function SendWizard({ companyName, userName, userEmail, folders, intent, templateId, toEmail, toName }) {
	const nav = useNavigate();
	const qc = useQueryClient();
	const templates = useQuery({
		queryKey: ["templates"],
		queryFn: () => listTemplates()
	});
	const contactPack = useQuery({
		queryKey: ["contacts"],
		queryFn: () => listContacts()
	});
	const [step, setStep] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)(intent === "emeterai" ? "Permohonan e-Meterai" : "Perjanjian Kerja Sama");
	const [docType, setDocType] = (0, import_react.useState)("kerjasama");
	const [compliance, setCompliance] = (0, import_react.useState)("psre");
	const [folderId, setFolderId] = (0, import_react.useState)(folders[0]?.id ?? null);
	const [groupName, setGroupName] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)(() => blankContent("kerjasama", "Perjanjian Kerja Sama", companyName));
	const [settings, setSettings] = (0, import_react.useState)({
		...DEFAULT_SETTINGS,
		emeteraiBy: intent === "emeterai" ? "maker" : "none"
	});
	const [recipients, setRecipients] = (0, import_react.useState)(() => [{
		id: uid("rc"),
		name: userName,
		email: userEmail,
		phone: "",
		role: "signer",
		orderIndex: 1,
		companyName
	}, {
		id: uid("rc"),
		name: toName || "Pihak Kedua",
		email: toEmail || "",
		phone: "",
		role: "signer",
		orderIndex: 2,
		companyName: ""
	}]);
	const [fields, setFields] = (0, import_react.useState)([]);
	const [deadline, setDeadline] = (0, import_react.useState)("");
	const [effectiveDate, setEffectiveDate] = (0, import_react.useState)("");
	const [expiresAt, setExpiresAt] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(null);
	const [importedName, setImportedName] = (0, import_react.useState)("");
	const [cloudOpen, setCloudOpen] = (0, import_react.useState)(false);
	const [cloudSource, setCloudSource] = (0, import_react.useState)("gdrive");
	const [cloudFiles, setCloudFiles] = (0, import_react.useState)([]);
	const [cloudBusy, setCloudBusy] = (0, import_react.useState)(false);
	const [cloudErr, setCloudErr] = (0, import_react.useState)("");
	const [cloudQ, setCloudQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const tpl = templates.data?.find((t) => t.id === templateId);
		if (!tpl) return;
		setTitle(tpl.name);
		setDocType(tpl.docType);
		setContent(tpl.content);
		setFields(tpl.fields);
		if (tpl.compliance === "globalsign" || tpl.compliance === "psre") setCompliance(tpl.compliance);
	}, [templateId, templates.data]);
	function addRecipient() {
		setRecipients((rs) => [...rs, {
			id: uid("rc"),
			name: "",
			email: "",
			phone: "",
			role: "signer",
			orderIndex: rs.length + 1,
			companyName: ""
		}]);
	}
	function placeDefaultFields() {
		const signers = recipients.filter((r) => r.role !== "cc");
		setFields(signers.flatMap((r, i) => [{
			id: uid("f"),
			type: "signature",
			page: 0,
			x: 12 + i * 40,
			y: 78,
			w: 32,
			h: 12,
			recipientId: r.id,
			required: true
		}, {
			id: uid("f"),
			type: "date",
			page: 0,
			x: 12 + i * 40,
			y: 91,
			w: 24,
			h: 6,
			recipientId: r.id,
			required: false
		}]));
	}
	async function applyImported(name, text) {
		const pack = contentFromImportedFile(name, text, companyName);
		setTitle(name.replace(/\.[^.]+$/, ""));
		setDocType("other");
		setContent(pack);
		setImportedName(name);
		toast.success(`Naskah disiapkan dari ${name}`);
	}
	async function openCloud(source) {
		setCloudSource(source);
		setCloudOpen(true);
		setCloudBusy(true);
		setCloudErr("");
		try {
			const res = await listCloudFiles({ data: {
				source,
				q: cloudQ || "pdf"
			} });
			if (res.loginRequired && res.loginUrl) {
				window.open(res.loginUrl, "_blank", "noopener");
				setCloudErr("Sign in to Google Drive in the new tab, then search again.");
			}
			setCloudFiles(res.files ?? []);
			if (res.error) setCloudErr(res.error);
		} catch (e) {
			setCloudErr(e instanceof Error ? e.message : "Cloud search failed");
		} finally {
			setCloudBusy(false);
		}
	}
	async function pickCloud(file) {
		setCloudBusy(true);
		try {
			const res = await importCloudFile({ data: {
				source: cloudSource,
				id: file.id,
				name: file.name
			} });
			if (!res.ok || !res.content || !res.name) {
				if (res.loginRequired && res.loginUrl) window.open(res.loginUrl, "_blank", "noopener");
				toast.error(res.preview || "Import failed");
				return;
			}
			setTitle(res.name.replace(/\.[^.]+$/, ""));
			setDocType("other");
			setContent(res.content);
			setImportedName(res.name);
			setCloudOpen(false);
			toast.success(res.preview || `Imported ${res.name}`);
		} finally {
			setCloudBusy(false);
		}
	}
	async function submit(send) {
		const ready = recipients.filter((r) => r.name.trim() && r.email.trim());
		if (!title.trim() || ready.length < 1) {
			toast.error("Judul dan minimal satu penerima wajib diisi");
			return;
		}
		setBusy(true);
		try {
			const placed = fields.length ? fields : signersFields(ready);
			const res = await saveDocument({ data: {
				title,
				docType,
				compliance,
				groupName,
				folderId,
				content,
				fields: placed,
				settings,
				recipients: ready.map((r) => ({
					id: r.id,
					name: r.name,
					email: r.email,
					phone: r.phone,
					role: r.role,
					action: r.role === "cc" ? "receives_copy" : "needs_to_sign",
					orderIndex: r.orderIndex,
					companyName: r.companyName
				})),
				deadline: deadline || null,
				effectiveDate: effectiveDate || null,
				expiresAt: expiresAt || null,
				send
			} });
			toast.success(send ? "Dokumen dikirim" : "Draf disimpan");
			qc.invalidateQueries();
			if (send) {
				setSent({
					id: res.id,
					token: res.token,
					invites: res.invites
				});
				return;
			}
			nav({
				to: "/documents/$id",
				params: { id: res.id }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
		} finally {
			setBusy(false);
		}
	}
	const contacts = contactPack.data?.contacts ?? [];
	const makerSigns = recipients.some((r) => r.email.toLowerCase() === userEmail.toLowerCase() && r.role !== "cc");
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-14 place-items-center rounded-full bg-success text-xl font-bold text-white",
				children: "✓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-xl font-semibold",
				children: "Dokumen terkirim"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: ["Setiap pihak mendapat tautan unik. Tanpa akun — buka, setuju, paraf.", makerSigns ? " Anda masih perlu menandatangani." : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 w-full space-y-2 text-left",
				children: (sent.invites ?? []).map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: inv.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted",
							children: inv.email
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: recipientSigningLink(inv.token, sent.token),
								target: "_blank",
								rel: "noreferrer",
								children: "Buka tautan"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: async () => {
								const href = recipientSigningLink(inv.token, sent.token);
								try {
									await navigator.clipboard.writeText(href);
									toast.success("Tautan disalin");
								} catch {
									toast.message(href);
								}
							},
							children: "Salin tautan"
						})]
					})]
				}, inv.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap justify-center gap-2",
				children: [makerSigns ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => nav({
						to: "/documents/$id/sign",
						params: { id: sent.id }
					}),
					children: "Tandatangani sekarang"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => nav({
						to: "/esignature/$folder",
						params: { folder: "all-inbox" }
					}),
					children: "Ke kotak masuk"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-6 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mb-6 flex flex-wrap gap-1",
				children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStep(i),
					className: `min-h-9 rounded-full px-3 text-xs font-medium ${i === step ? "bg-navy text-white" : "bg-surface-2 text-muted"}`,
					children: [
						i + 1,
						". ",
						s
					]
				}) }, s))
			}),
			step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Judul", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Jenis", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
							value: docType,
							onChange: (e) => {
								setDocType(e.target.value);
								setContent(blankContent(e.target.value, title, companyName));
							},
							children: Object.entries(DOC_TYPE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: v
							}, k))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Folder", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
							value: folderId ?? "",
							onChange: (e) => setFolderId(e.target.value || null),
							children: folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: f.id,
								children: f.name
							}, f.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Sertifikasi", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
							value: compliance,
							onChange: (e) => setCompliance(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "psre",
								children: "PSrE Indonesia"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "globalsign",
								children: "GlobalSign"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm md:col-span-2",
						children: ["Perihal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: content.subject ?? "",
							onChange: (e) => setContent({
								...content,
								subject: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center text-sm text-muted md:col-span-2",
						children: [
							"Unggah PDF / Word / teks — isi jadi naskah",
							importedName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-xs font-medium text-brand",
								children: importedName
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".pdf,.txt,.md,.doc,.docx,.html,.csv",
								className: "hidden",
								onChange: async (e) => {
									const f = e.target.files?.[0];
									if (!f) return;
									const text = await f.text();
									await applyImported(f.name, text);
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 md:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => void openCloud("gdrive"),
								children: "Google Drive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => void openCloud("onedrive"),
								children: "OneDrive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "self-center text-xs text-muted",
								children: "Plug-and-play — sign in or paste a token in Settings."
							})
						]
					})
				]
			}) : null,
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					recipients.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 rounded-lg border border-border bg-surface p-3 md:grid-cols-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "md:col-span-3",
								placeholder: "Nama",
								value: r.name,
								onChange: (e) => setRecipients(patch(recipients, i, { name: e.target.value }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "md:col-span-3",
								placeholder: "Email",
								value: r.email,
								onChange: (e) => setRecipients(patch(recipients, i, { email: e.target.value }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "md:col-span-2",
								placeholder: "Perusahaan",
								value: r.companyName,
								onChange: (e) => setRecipients(patch(recipients, i, { companyName: e.target.value }))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 rounded-md border border-border bg-surface px-2 text-sm md:col-span-2",
								value: r.role,
								onChange: (e) => setRecipients(patch(recipients, i, { role: e.target.value })),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "signer",
										children: "Penandatangan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "approver",
										children: "Approver"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "witness",
										children: "Saksi"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cc",
										children: "CC"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								className: "md:col-span-2",
								onClick: () => setRecipients(recipients.filter((_, j) => j !== i)),
								children: "Hapus"
							})
						]
					}, r.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: addRecipient,
							children: "Tambah pihak"
						}), contacts.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => setRecipients((rs) => [...rs, {
								id: uid("rc"),
								name: c.name,
								email: c.email,
								phone: c.phone,
								role: "signer",
								orderIndex: rs.length + 1,
								companyName: c.company
							}]),
							children: ["+ ", c.name]
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: settings.sequential,
							onChange: (e) => setSettings({
								...settings,
								sequential: e.target.checked
							})
						}), "Tanda tangan berurutan"]
					})
				]
			}) : null,
			step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Kolom paraf diletakkan otomatis per penandatangan. Bisa diubah nanti di editor."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: placeDefaultFields,
						children: "Letakkan kolom paraf"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [fields.length, " kolom siap."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: ["e-Meterai", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-md border border-border bg-surface px-2 text-sm",
							value: settings.emeteraiBy,
							onChange: (e) => setSettings({
								...settings,
								emeteraiBy: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "none",
									children: "Tidak"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "maker",
									children: "Pengirim"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "signer",
									children: "Penandatangan"
								})
							]
						})]
					})
				]
			}) : null,
			step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Tenggat", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							className: "mt-1",
							value: deadline,
							onChange: (e) => setDeadline(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Berlaku mulai", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							className: "mt-1",
							value: effectiveDate,
							onChange: (e) => setEffectiveDate(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm md:col-span-2",
						children: ["Pesan undangan", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: settings.message,
							onChange: (e) => setSettings({
								...settings,
								message: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted md:col-span-2",
						children: [recipients.filter((r) => r.email).length, " tautan unik akan dibuat — plug and play, pihak lain tidak perlu daftar."]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					disabled: step === 0,
					onClick: () => setStep((s) => s - 1),
					children: "Kembali"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => setStep((s) => s + 1),
						children: "Lanjut"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy,
						onClick: () => void submit(false),
						children: "Simpan draf"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						disabled: busy,
						onClick: () => void submit(true),
						children: "Kirim undangan"
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: cloudOpen,
				onOpenChange: setCloudOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: cloudSource === "gdrive" ? "Google Drive" : "OneDrive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search files",
								value: cloudQ,
								onChange: (e) => setCloudQ(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") openCloud(cloudSource);
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: cloudBusy,
								onClick: () => void openCloud(cloudSource),
								children: "Search"
							})]
						}),
						cloudErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-danger",
							children: cloudErr
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 max-h-64 space-y-1 overflow-auto text-sm",
							children: [
								cloudBusy && !cloudFiles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-muted",
									children: "Mencari…"
								}) : null,
								!cloudBusy && !cloudFiles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-muted",
									children: "No files yet. Search, or connect in Settings."
								}) : null,
								cloudFiles.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "w-full rounded-md px-2 py-1.5 text-left hover:bg-surface-2",
									disabled: cloudBusy,
									onClick: () => void pickCloud(f),
									children: f.name
								}) }, f.id))
							]
						})
					]
				})
			})
		]
	});
}
function patch(list, i, p) {
	return list.map((r, j) => j === i ? {
		...r,
		...p
	} : r);
}
function signersFields(ready) {
	return ready.filter((r) => r.role !== "cc").flatMap((r, i) => [{
		id: uid("f"),
		type: "signature",
		page: 0,
		x: 12 + i % 2 * 44,
		y: 78,
		w: 32,
		h: 12,
		recipientId: r.id,
		required: true
	}]);
}
function SendPage() {
	const t = useT();
	const boot = useBoot();
	const search = Route$18.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: search.intent === "emeterai" ? t.requestEmeterai : t.upload,
		subtitle: search.intent === "emeterai" ? "Place eMeterai, add signers, then send." : "Prepare the file, recipients, fields, then send."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendWizard, {
		companyName: boot.company.name,
		userName: boot.user.name,
		userEmail: boot.user.email,
		folders: boot.folders,
		intent: search.intent,
		templateId: search.template,
		toEmail: search.toEmail,
		toName: search.toName
	})] });
}
//#endregion
export { SendPage as component };
