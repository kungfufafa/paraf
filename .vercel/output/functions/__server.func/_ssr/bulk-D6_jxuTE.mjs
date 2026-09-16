import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as saveDocument, T as listTemplates } from "./api-BmE3vsND.mjs";
import { R as uid, l as contentFromImportedFile } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
import { n as DOC_TYPE_LABEL, t as DEFAULT_SETTINGS } from "./types-DfCXKDmj.mjs";
import { s as Route$25 } from "./router-CJfIBE85.mjs";
import { t as Textarea } from "./textarea-nUjVbxVA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bulk-D6_jxuTE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BulkPage() {
	const boot = useBoot();
	const nav = useNavigate();
	const search = Route$25.useSearch();
	const templates = useQuery({
		queryKey: ["templates"],
		queryFn: () => listTemplates()
	});
	const tpl = (0, import_react.useMemo)(() => templates.data?.find((t) => t.id === search.template), [templates.data, search.template]);
	const [files, setFiles] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [merge, setMerge] = (0, import_react.useState)("separate");
	const [compliance, setCompliance] = (0, import_react.useState)("psre");
	const [csv, setCsv] = (0, import_react.useState)("");
	function parseRecipients() {
		const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
		const out = [];
		for (const line of lines) {
			const [a, b] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
			if (b && b.includes("@")) out.push({
				name: a || b.split("@")[0],
				email: b
			});
			else if (a && a.includes("@")) out.push({
				name: a.split("@")[0],
				email: a
			});
		}
		return out;
	}
	async function contentOf(f) {
		const text = await f.text();
		return contentFromImportedFile(f.name, text, boot.company.name);
	}
	async function createAll() {
		const recs = parseRecipients();
		if (!files.length && !tpl) return;
		setBusy(true);
		try {
			if (tpl && recs.length) {
				let n = 0;
				for (const r of recs) {
					const recId = uid("rc");
					await saveDocument({ data: {
						title: `${tpl.name} · ${r.name}`,
						docType: tpl.docType,
						compliance: tpl.compliance || compliance,
						groupName: "Massal",
						folderId: boot.folders[0]?.id ?? null,
						content: tpl.content,
						fields: tpl.fields.length ? tpl.fields.map((f) => ({
							...f,
							id: uid("f"),
							recipientId: recId,
							value: void 0
						})) : [{
							id: uid("f"),
							type: "signature",
							page: 0,
							x: 14,
							y: 72,
							w: 28,
							h: 10,
							recipientId: recId,
							required: true
						}],
						settings: DEFAULT_SETTINGS,
						recipients: [{
							id: recId,
							name: r.name,
							email: r.email,
							role: "signer",
							companyName: "",
							orderIndex: 1
						}],
						send: true
					} });
					n += 1;
				}
				toast.success(`${n} undangan dikirim dari template`);
				nav({
					to: "/esignature/$folder",
					params: { folder: "sent" }
				});
				return;
			}
			if (merge === "merge" && files.length) {
				const recId = uid("rc");
				const contents = await Promise.all(files.map((f) => contentOf(f)));
				const merged = {
					...contents[0],
					subject: files.map((f) => f.name.replace(/\.[^.]+$/, "")).join(" + "),
					clauses: contents.flatMap((c) => c.clauses)
				};
				await saveDocument({ data: {
					title: merged.subject || "Gabungan massal",
					docType: "other",
					compliance,
					groupName: "Massal",
					folderId: boot.folders[0]?.id ?? null,
					content: merged,
					fields: [{
						id: uid("f"),
						type: "signature",
						page: 0,
						x: 14,
						y: 72,
						w: 28,
						h: 10,
						recipientId: recId,
						required: true
					}],
					settings: DEFAULT_SETTINGS,
					recipients: [{
						id: recId,
						name: recs[0]?.name || boot.user.name,
						email: recs[0]?.email || boot.user.email,
						role: "signer",
						companyName: boot.company.name,
						orderIndex: 1
					}],
					send: false
				} });
				toast.success("1 draf gabungan dibuat");
				nav({
					to: "/esignature/$folder",
					params: { folder: "drafts" }
				});
				return;
			}
			const pack = files.length ? files : tpl ? [new File(["template"], `${tpl.name}.txt`, { type: "text/plain" })] : [];
			for (const f of pack) {
				const title = f.name.replace(/\.[^.]+$/, "");
				const recId = uid("rc");
				const content = tpl ? tpl.content : await contentOf(f);
				await saveDocument({ data: {
					title: tpl ? tpl.name : title,
					docType: tpl?.docType ?? "other",
					compliance,
					groupName: "Massal",
					folderId: boot.folders[0]?.id ?? null,
					content,
					fields: [{
						id: uid("f"),
						type: "signature",
						page: 0,
						x: 14,
						y: 72,
						w: 28,
						h: 10,
						recipientId: recId,
						required: true
					}],
					settings: DEFAULT_SETTINGS,
					recipients: [{
						id: recId,
						name: recs[0]?.name || boot.user.name,
						email: recs[0]?.email || boot.user.email,
						role: "signer",
						companyName: boot.company.name,
						orderIndex: 1
					}],
					send: false
				} });
			}
			toast.success(`${pack.length} draf dibuat`);
			nav({
				to: "/esignature/$folder",
				params: { folder: "drafts" }
			});
		} finally {
			setBusy(false);
		}
	}
	const canGo = files.length > 0 || Boolean(tpl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: tpl ? `Kirim massal · ${tpl.name}` : "Unggah massal",
		subtitle: tpl ? "Tempel daftar penerima (nama,email) lalu kirim dari template ini." : "Buat banyak draf sekaligus, lalu taruh kolom dan kirim."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl p-4 md:p-6",
		children: [
			tpl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-lg border border-brand/30 bg-brand-soft p-3 text-sm",
				children: [
					"Template: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tpl.name }),
					" · ",
					DOC_TYPE_LABEL[tpl.docType] ?? tpl.docType
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface p-8 text-center text-sm text-muted",
				children: ["Pilih beberapa PDF / gambar / dokumen", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					multiple: true,
					className: "hidden",
					onChange: (e) => setFiles(Array.from(e.target.files ?? []))
				})]
			}),
			files.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-1 text-sm",
				children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: f.name }, f.name))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block text-sm font-medium",
				children: ["Penerima (satu per baris: nama,email)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "mt-1",
					rows: 5,
					placeholder: "Dewi,dewi@co.id\nBudi,budi@co.id",
					value: csv,
					onChange: (e) => setCsv(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: "Opsi gabung"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: merge === "separate",
							onChange: () => setMerge("separate")
						}), "Pisahkan dokumen (email terpisah)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: merge === "merge",
							onChange: () => setMerge("merge")
						}), "Gabungkan jadi satu berkas"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 font-medium",
						children: "Kepatuhan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: compliance === "psre",
							onChange: () => setCompliance("psre")
						}), "PSrE"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: compliance === "globalsign",
							onChange: () => setCompliance("globalsign")
						}), "GlobalSign"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"Maks. 15 dokumen, 25 MB. Tipe default: ",
					DOC_TYPE_LABEL.other,
					". Draf masuk folder ",
					boot.folders[0]?.name,
					".",
					merge === "merge" ? " Penggabungan diterapkan sebagai satu dokumen." : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				disabled: !canGo || busy,
				onClick: () => void createAll(),
				children: tpl && parseRecipients().length ? `Kirim ke ${parseRecipients().length} penerima` : `Buat ${files.length || (tpl ? 1 : "")} draf`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-2 w-full",
				variant: "outline",
				disabled: busy,
				onClick: () => {
					const fake = [
						"PKS-Distribusi.pdf",
						"NDA-Vendor.pdf",
						"Invoice-Q3.pdf"
					].map((name) => new File(["Pasal 1\n\nDemo bulk naskah untuk " + name], name, { type: "application/pdf" }));
					setFiles(fake);
					toast.success("3 sample files attached — create drafts to continue");
				},
				children: "Use sample files"
			})
		]
	})] });
}
//#endregion
export { BulkPage as component };
