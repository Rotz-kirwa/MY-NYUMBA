import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
import { t as PropertyService } from "./property.service-I1Y7v9aa.mjs";
import { t as OperationsService } from "./operations.service-NmsSXWtm.mjs";
import { t as FinancialService } from "./financial.service-CP9WcEAr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B95s9eEi.js
var getDashboardData_createServerFn_handler = createServerRpc({
	id: "114c006b287821f2aa841eeafcd341531ca53f9ed9d20295b3b653dcb1e76c32",
	name: "getDashboardData",
	filename: "src/routes/index.tsx"
}, (opts) => getDashboardData.__executeServer(opts));
var getDashboardData = createServerFn({ method: "GET" }).handler(getDashboardData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	const props = await PropertyService.getAllProperties(session.organizationId, session.role);
	const finSummary = await FinancialService.getFinancialSummary(session.organizationId, session.role);
	const payments = await FinancialService.getPayments(session.organizationId, session.role);
	const rentCharges = await FinancialService.getRentCharges(session.organizationId, session.role);
	const tickets = await OperationsService.getMaintenanceRequests(session.organizationId, session.role);
	const totalUnits = props.reduce((s, p) => s + p.totalUnits, 0);
	const occupiedUnits = props.reduce((s, p) => s + p.occupiedUnits, 0);
	return {
		props,
		finSummary,
		payments,
		rentCharges,
		tickets,
		totalUnits,
		occupiedUnits,
		vacantUnits: totalUnits - occupiedUnits,
		arrears: rentCharges.filter((c) => c.status !== "PAID")
	};
});
//#endregion
export { getDashboardData_createServerFn_handler };
