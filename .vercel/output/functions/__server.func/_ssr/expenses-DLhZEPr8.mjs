import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, c as Td, l as statusVariant, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./expenses-CpI5w-qX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-DLhZEPr8.js
var import_jsx_runtime = require_jsx_runtime();
function ExpensesPage() {
	const { exp } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Financial Operations",
		title: "Operating Expenses",
		subtitle: "Track utilities, security, maintenance repairs, and municipal levies across your portfolio."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Property Expenses",
		meta: `${exp.length} total records`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Date",
				"Vendor",
				"Category",
				"Property ID",
				"Amount",
				"Status"
			],
			children: exp.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: e.expenseDate
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium",
						children: e.vendorName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "neutral",
						children: e.category
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: e.propertyId }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						className: "font-semibold text-danger",
						children: KSh(e.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(e.status),
						children: e.status
					}) })
				]
			}, e.id))
		})
	})] });
}
//#endregion
export { ExpensesPage as component };
