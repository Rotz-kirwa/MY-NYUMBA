import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Plus, j as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { a as PageHeader, c as Td, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as Route } from "./properties-BW-wqIKm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-D06aYqb9.js
var import_jsx_runtime = require_jsx_runtime();
function PropertiesPage() {
	const { props } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Portfolio management",
		title: "Properties",
		subtitle: "Manage Nairobi real estate assets, caretakers, and occupancy distribution.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), " Add property"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "All Properties",
		meta: `${props.length} total properties`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Property Code",
				"Name",
				"Neighborhood",
				"Tier",
				"Occupancy",
				"Caretaker",
				"Actions"
			],
			children: props.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: p.propertyCode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/properties/$propertyId",
						params: { propertyId: p.id },
						className: "font-semibold text-primary hover:underline",
						children: p.name
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.area }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "neutral",
						children: p.tier
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						num: true,
						children: [
							p.occupiedUnits,
							" / ",
							p.totalUnits,
							" units"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-medium",
						children: p.caretakerName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: p.caretakerPhone
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						right: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/properties/$propertyId",
							params: { propertyId: p.id },
							className: "inline-flex items-center gap-1 text-xs font-semibold text-primary",
							children: ["Details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 13 })]
						})
					})
				]
			}, p.id))
		})
	})] });
}
//#endregion
export { PropertiesPage as component };
