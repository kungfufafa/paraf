import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { I as saveStamp, w as listStamps } from "./api-BmE3vsND.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as PageHeader, p as useBoot } from "./app-shell-DNQOiwL0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stamps-p8Wbvi6F.js
var import_jsx_runtime = require_jsx_runtime();
function StampsPage() {
	const boot = useBoot();
	const qc = useQueryClient();
	const { data = [] } = useQuery({
		queryKey: ["stamps"],
		queryFn: () => listStamps()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Stempel elektronik",
		subtitle: "Stempel perusahaan untuk halaman tanda tangan.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "inline-flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unggah stempel" })
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
						toast.success("Stempel disimpan");
						qc.invalidateQueries({ queryKey: ["stamps"] });
					};
					r.readAsDataURL(f);
				}
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6",
		children: data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl border border-border bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: s.data_url,
					alt: s.name,
					className: "mx-auto h-32 object-contain"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-sm font-medium",
					children: s.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted",
					children: s.company_name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					size: "sm",
					variant: "ghost",
					onClick: async () => {
						await saveStamp({ data: {
							id: s.id,
							name: s.name,
							dataUrl: "",
							remove: true
						} });
						toast.success("Dihapus");
						qc.invalidateQueries({ queryKey: ["stamps"] });
					},
					children: "Hapus"
				})
			]
		}, s.id))
	})] });
}
//#endregion
export { StampsPage as component };
