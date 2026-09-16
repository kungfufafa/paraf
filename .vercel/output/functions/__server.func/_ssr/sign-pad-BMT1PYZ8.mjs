import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as cn } from "./integrations-BY7zkbKR.mjs";
import { t as Button } from "./button-CZaJ7tF_.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sign-pad-BMT1PYZ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignPad({ name, onDone }) {
	const [tab, setTab] = (0, import_react.useState)("draw");
	const [typed, setTyped] = (0, import_react.useState)(name);
	const canvasRef = (0, import_react.useRef)(null);
	const drawing = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const w = c.clientWidth;
		const h = c.clientHeight;
		c.width = w * dpr;
		c.height = h * dpr;
		ctx.scale(dpr, dpr);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = 2.2;
		ctx.strokeStyle = "#1b2430";
	}, [tab]);
	function pos(e) {
		const r = e.target.getBoundingClientRect();
		return {
			x: e.clientX - r.left,
			y: e.clientY - r.top
		};
	}
	function clear() {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, c.width, c.height);
	}
	function commitDraw() {
		const c = canvasRef.current;
		if (!c) return;
		onDone(c.toDataURL("image/png"), "draw");
	}
	function commitType() {
		const c = document.createElement("canvas");
		c.width = 640;
		c.height = 180;
		const ctx = c.getContext("2d");
		ctx.fillStyle = "transparent";
		ctx.clearRect(0, 0, 640, 180);
		ctx.fillStyle = "#1b2430";
		ctx.font = "72px 'Great Vibes', cursive";
		ctx.textBaseline = "middle";
		ctx.fillText(typed || name, 24, 100);
		onDone(c.toDataURL("image/png"), "type");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex gap-1 rounded-md bg-surface-2 p-1",
			children: [
				"draw",
				"type",
				"upload"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(k),
				className: cn("flex-1 rounded-sm py-1.5 text-xs font-medium", tab === k ? "bg-surface text-ink shadow-sm" : "text-muted"),
				children: k === "draw" ? "Gambar" : k === "type" ? "Ketik" : "Unggah"
			}, k))
		}),
		tab === "draw" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "h-36 w-full cursor-crosshair rounded-md border border-border bg-paper",
			onPointerDown: (e) => {
				drawing.current = true;
				const ctx = canvasRef.current?.getContext("2d");
				const p = pos(e);
				ctx?.beginPath();
				ctx?.moveTo(p.x, p.y);
				e.target.setPointerCapture(e.pointerId);
			},
			onPointerMove: (e) => {
				if (!drawing.current) return;
				const ctx = canvasRef.current?.getContext("2d");
				const p = pos(e);
				ctx?.lineTo(p.x, p.y);
				ctx?.stroke();
			},
			onPointerUp: () => {
				drawing.current = false;
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				type: "button",
				onClick: clear,
				children: "Hapus"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				type: "button",
				onClick: commitDraw,
				children: "Gunakan tanda tangan"
			})]
		})] }) : null,
		tab === "type" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: typed,
				onChange: (e) => setTyped(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sign-font mt-3 flex h-28 items-center justify-center rounded-md border border-border bg-paper text-4xl",
				children: typed || name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					type: "button",
					onClick: commitType,
					children: "Gunakan tanda tangan"
				})
			})
		] }) : null,
		tab === "upload" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-paper text-sm text-muted",
			children: ["Pilih gambar PNG / JPG", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (!f) return;
					const reader = new FileReader();
					reader.onload = () => onDone(String(reader.result), "upload");
					reader.readAsDataURL(f);
				}
			})]
		}) : null
	] });
}
//#endregion
export { SignPad as t };
