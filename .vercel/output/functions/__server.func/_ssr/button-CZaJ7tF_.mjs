import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as cn } from "./integrations-BY7zkbKR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CZaJ7tF_.js
var import_jsx_runtime = require_jsx_runtime();
function ParafMark({ className, light }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "6",
			fill: light ? "#fff" : "#E85D04"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M9 23 V9 h8.2 c3.3 0 5.4 1.9 5.4 4.7 0 2.9-2.1 4.8-5.5 4.8H13.2",
			fill: "none",
			stroke: light ? "#E85D04" : "#fff",
			strokeWidth: "2.4",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})]
	});
}
function ParafLogo({ compact, light }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafMark, { light }), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-[17px] font-semibold tracking-tight ${light ? "text-surface" : "text-ink"}`,
			children: "Paraf"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-(--motion-quick,150ms) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-brand text-white hover:bg-brand-hover shadow-sm",
			secondary: "bg-surface-2 text-ink hover:bg-border",
			outline: "border border-border-strong bg-surface text-ink hover:bg-surface-2",
			ghost: "text-ink hover:bg-surface-2",
			danger: "bg-danger text-white hover:bg-danger/90",
			navy: "bg-navy text-white hover:bg-navy-2",
			link: "text-brand underline-offset-4 hover:underline px-0"
		},
		size: {
			default: "h-10 rounded-md px-4 text-sm",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 rounded-md px-5 text-sm",
			icon: "size-9 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { ParafLogo as n, Button as t };
