import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, c as Td, l as statusVariant, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./leases-BhejX0__.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leases-B_ojYq8c.js
var import_jsx_runtime = require_jsx_runtime();
function LeasesPage() {
	const { leases } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Agreements",
		title: "Leases",
		subtitle: "Active lease contracts, expiry schedules, monthly rent rolls, and security deposit terms."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Lease Registry",
		meta: `${leases.length} registered leases`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Lease ID",
				"Tenant ID",
				"Unit ID",
				"Start Date",
				"End Date",
				"Monthly Rent",
				"Security Deposit",
				"Status"
			],
			children: leases.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: l.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.tenantId }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: l.unitId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: l.startDate
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: l.endDate
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: KSh(l.monthlyRent)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: KSh(l.depositAmount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: statusVariant(l.status),
						children: l.status
					}) })
				]
			}, l.id))
		})
	})] });
}
//#endregion
export { LeasesPage as component };
