import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, c as Td, l as statusVariant, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./units-CjRpJ9N2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/units-tALw_nWJ.js
var import_jsx_runtime = require_jsx_runtime();
function UnitsPage() {
	const { units } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Inventory",
		title: "Units",
		subtitle: "Full inventory of residential units across all portfolio properties."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "All Units",
		meta: `${units.length} total units`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Unit Label",
				"Property ID",
				"Type",
				"Monthly Rent",
				"Deposit Required",
				"Status"
			],
			children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: u.unitNumber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: u.propertyId }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: u.type }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: KSh(u.monthlyRent)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: KSh(u.depositAmount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(u.status),
						children: u.status
					}) })
				]
			}, u.id))
		})
	})] });
}
//#endregion
export { UnitsPage as component };
