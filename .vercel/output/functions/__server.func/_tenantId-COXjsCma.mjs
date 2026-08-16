import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, i as Metric, n as Badge, o as Panel, t as AppShell } from "./_ssr/Bits-IW5hBAFw.mjs";
import { t as Route } from "./_tenantId-CN-fgAH-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_tenantId-COXjsCma.js
var import_jsx_runtime = require_jsx_runtime();
function TenantDetailPage() {
	const { tenant, leases } = Route.useLoaderData();
	if (!tenant) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Tenant record not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/tenants",
			className: "mt-4 inline-block text-primary hover:underline",
			children: "← Back to tenants"
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Tenant Profile",
			title: tenant.fullName,
			subtitle: `Phone: ${tenant.phone} · Email: ${tenant.email} · National ID: ${tenant.nationalId}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-3 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Payment Score",
					value: `${tenant.score} / 100`,
					accent: tenant.score > 85 ? "success" : "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Status",
					value: tenant.status,
					note: "Active in portfolio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Lease Records",
					value: leases.length,
					note: "Active & Historical"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Active Leases",
			meta: `${leases.length} leases on file`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 divide-y divide-border",
				children: leases.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-3 flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold text-sm",
						children: [
							"Lease ",
							l.id,
							" (Unit ",
							l.unitId,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Start: ",
							l.startDate,
							" · End: ",
							l.endDate
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: l.status === "Active" ? "paid" : "neutral",
						children: l.status
					})]
				}, l.id))
			})
		})
	] });
}
//#endregion
export { TenantDetailPage as component };
