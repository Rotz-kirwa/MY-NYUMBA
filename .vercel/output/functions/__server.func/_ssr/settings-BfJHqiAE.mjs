import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, n as Badge, o as Panel, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as Route } from "./settings-DXq7kXQ-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BfJHqiAE.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { session } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "System Configuration",
		title: "Settings & Organization",
		subtitle: "Manage tenant isolation, team RBAC roles, and Daraja M-Pesa API integration credentials."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Active Organization Details",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-caption",
						children: "Organization Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-base",
						children: "My Nyumba Properties Ltd"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-caption",
						children: "Organization ID (Tenant Boundary)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm text-primary",
						children: session.organizationId
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-caption",
						children: "Active Session User"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							session.name,
							" (",
							session.email,
							") — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "paid",
								children: session.role
							})
						]
					})] })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "M-Pesa Daraja Integration Secrets",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 space-y-4 max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold mb-1",
					children: "Business ShortCode (Paybill / Till)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					readOnly: true,
					value: "174379",
					className: "w-full rounded-xs border border-border bg-muted px-3 py-2 text-sm font-mono"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold mb-1",
					children: "Passkey"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					readOnly: true,
					value: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
					className: "w-full rounded-xs border border-border bg-muted px-3 py-2 text-sm font-mono"
				})] })]
			})
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
