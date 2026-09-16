import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as cn } from "./integrations-BY7zkbKR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DBlCBSWv.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", className),
		children
	});
}
var STATUS_CLASS = {
	draft: "bg-surface-2 text-muted",
	need_to_sign: "bg-brand-soft text-brand",
	waiting_for_others: "bg-info-soft text-info",
	pending_approval: "bg-warning-soft text-warning",
	scheduled: "bg-info-soft text-info",
	completed: "bg-success-soft text-success",
	declined: "bg-danger-soft text-danger",
	expired: "bg-surface-2 text-muted",
	voided: "bg-surface-2 text-subtle line-through"
};
function StatusBadge({ status, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: STATUS_CLASS[status],
		children: label
	});
}
//#endregion
export { StatusBadge as t };
