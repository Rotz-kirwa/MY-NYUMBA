import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, c as Td, l as statusVariant, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./maintenance-DwCESsxJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maintenance-CqVwq044.js
var import_jsx_runtime = require_jsx_runtime();
function MaintenancePage() {
	const { tickets } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Property Operations",
		title: "Maintenance & Work Orders",
		subtitle: "Manage facility repairs, vendor dispatch, and property maintenance logs."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Work Orders Queue",
		meta: `${tickets.length} open/historical requests`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Reference",
				"Title",
				"Property ID",
				"Priority",
				"Status",
				"Vendor",
				"Cost"
			],
			children: tickets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						"font-mono": true,
						children: t.referenceNumber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: t.propertyId }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(t.priority),
						children: t.priority
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(t.status),
						children: t.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: t.assignedVendor || "—" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: t.actualCost ? KSh(t.actualCost) : "—"
					})
				]
			}, t.id))
		})
	})] });
}
//#endregion
export { MaintenancePage as component };
