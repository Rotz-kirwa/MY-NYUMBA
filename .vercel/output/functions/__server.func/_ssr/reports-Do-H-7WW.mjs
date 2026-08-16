import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, i as Metric, o as Panel, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./reports-lJJnY7PZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-Do-H-7WW.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { summary } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Financial Intelligence",
			title: "Reports & Analytics",
			subtitle: "Server-aggregated rent collection rates, arrears aging, and portfolio yield reports."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-4 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Total Billed",
					value: KSh(summary.billed)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Total Collected",
					value: KSh(summary.collected),
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Collection Rate",
					value: `${summary.collectionRate}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Outstanding Arrears",
					value: KSh(summary.arrearsCarried),
					accent: "danger"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Arrears Aging Distribution",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 grid gap-4 sm:grid-cols-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-4 rounded-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-caption",
							children: "Current (1–30 Days)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-display-md mt-2 text-warning",
							children: KSh(386e3)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-4 rounded-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-caption",
							children: "31–60 Days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-display-md mt-2 text-warning",
							children: KSh(148e3)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-4 rounded-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-caption",
							children: "61–90 Days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-display-md mt-2 text-danger",
							children: KSh(78e3)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-4 rounded-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-caption",
							children: "90+ Days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-display-md mt-2 text-danger",
							children: KSh(0)
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { ReportsPage as component };
