import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Plus } from "../_libs/lucide-react.mjs";
import { a as PageHeader, c as Td, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as Route } from "./tenants-jgX3jun_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-CE7gVyNo.js
var import_jsx_runtime = require_jsx_runtime();
function TenantsPage() {
	const { tenants } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Portfolio Directory",
		title: "Tenants",
		subtitle: "Manage active tenants, contact credentials, national IDs, and payment performance history.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), " Add tenant"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Active Tenants",
		meta: `${tenants.length} tenants registered`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Tenant Name",
				"Phone",
				"Email",
				"National ID",
				"Payment Score",
				"Status",
				""
			],
			children: tenants.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tenants/$tenantId",
						params: { tenantId: t.id },
						className: "font-semibold text-primary hover:underline",
						children: t.fullName
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: t.phone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: t.email }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: t.nationalId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-bold ${t.score > 85 ? "text-success" : t.score > 70 ? "text-warning" : "text-danger"}`,
							children: [t.score, " / 100"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: t.status === "Active" ? "paid" : "neutral",
						children: t.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						right: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tenants/$tenantId",
							params: { tenantId: t.id },
							className: "text-xs font-semibold text-primary",
							children: "View Profile →"
						})
					})
				]
			}, t.id))
		})
	})] });
}
//#endregion
export { TenantsPage as component };
