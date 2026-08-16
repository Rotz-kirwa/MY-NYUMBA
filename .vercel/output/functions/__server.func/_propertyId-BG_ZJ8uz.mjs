import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { t as Route } from "./_propertyId-BoYVxe1V.mjs";
import { a as PageHeader, c as Td, i as Metric, n as Badge, o as Panel, s as Table, t as AppShell } from "./_ssr/Bits-IW5hBAFw.mjs";
import { t as KSh } from "./_ssr/mynyumba-BQUr4Ve-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_propertyId-BG_ZJ8uz.js
var import_jsx_runtime = require_jsx_runtime();
function PropertyDetailPage() {
	const { prop, units } = Route.useLoaderData();
	if (!prop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-bold",
			children: "Property not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/properties",
			className: "mt-4 inline-block text-primary hover:underline",
			children: "← Back to properties"
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: `Property Detail · ${prop.area}`,
			title: prop.name,
			subtitle: `Caretaker: ${prop.caretakerName} (${prop.caretakerPhone}) · Built ${prop.yearBuilt}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-3 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Total Units",
					value: prop.totalUnits,
					note: `${prop.occupiedUnits} occupied`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Tier",
					value: prop.tier,
					note: "Neighborhood Standard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Occupancy Rate",
					value: `${Math.round(prop.occupiedUnits / prop.totalUnits * 100)}%`,
					accent: "success"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `Units in ${prop.name}`,
			meta: `${units.length} units registered`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
				head: [
					"Unit No.",
					"Type",
					"Monthly Rent",
					"Status"
				],
				children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: u.unitNumber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: u.type }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: KSh(u.monthlyRent)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: u.status === "Occupied" ? "paid" : "overdue",
						children: u.status
					}) })
				] }, u.id))
			})
		})
	] });
}
//#endregion
export { PropertyDetailPage as component };
