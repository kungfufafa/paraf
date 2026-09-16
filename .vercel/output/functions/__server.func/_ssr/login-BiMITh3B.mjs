import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { n as ParafLogo, t as Button } from "./button-CZaJ7tF_.mjs";
import { t as Input } from "./input-C5dgwtTM.mjs";
import { t as useCurrentUserState } from "./use-current-user-C6bKIWJk.mjs";
import { t as GROK_PROVIDERS } from "./server-BEl3GeX9.mjs";
import { t as Label } from "./label-CnjysMv8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BiMITh3B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const dest = "/esignature/all-inbox";
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/esignature/$folder",
		params: { folder: "all-inbox" }
	});
	async function submit(e) {
		e.preventDefault();
		setErr("");
		setBusy(true);
		try {
			if (mode === "up") {
				const { error } = await authClient.signUp.email({
					name: name || email.split("@")[0],
					email,
					password
				});
				if (error) throw new Error(error.message);
			}
			const { error } = await authClient.signIn.email({
				email,
				password,
				callbackURL: dest
			});
			if (error) throw new Error(error.message);
			window.location.href = dest;
		} catch (ex) {
			setErr(ex instanceof Error ? ex.message : "Could not sign in");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "px-6 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParafLogo, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex flex-1 items-start justify-center px-4 pb-16 pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-center text-2xl font-semibold",
					children: mode === "in" ? "Welcome to Paraf" : "Create your Paraf account"
				}), !mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-48 skeleton-shimmer rounded-lg" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-2",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full",
							onClick: () => void signIn(p.providerId, { callbackURL: dest }),
							children: ["Continue with ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => void submit(e),
						className: "mt-5 space-y-3",
						children: [
							mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 8
							})] }),
							err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								children: err
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								disabled: busy,
								type: "submit",
								children: mode === "in" ? "Log in" : "Sign up"
							})
						]
					}),
					mode === "in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-brand hover:underline",
							onClick: () => toastHint(),
							children: "Forgot password?"
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted",
						children: [mode === "in" ? "Don't have an account? " : "Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "font-medium text-brand hover:underline",
							onClick: () => setMode(mode === "in" ? "up" : "in"),
							children: mode === "in" ? "Sign up" : "Log in"
						})]
					})
				] })]
			})
		})]
	});
}
function toastHint() {
	window.alert("Ask your workspace owner to reset the password, or sign up with a new email.");
}
//#endregion
export { Login as component };
