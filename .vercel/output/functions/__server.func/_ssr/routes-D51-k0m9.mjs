import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, p as seedDatabase, t as createServerRpc } from "./auth-D2dtPKyA.mjs";
import { t as PropertyService } from "./property.service-C8Okba0i.mjs";
import { t as OperationsService } from "./operations.service-Bxd5MeOb.mjs";
import { t as FinancialService } from "./financial.service-AggW2llV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D51-k0m9.js
var getDashboardData_createServerFn_handler = createServerRpc({
	id: "114c006b287821f2aa841eeafcd341531ca53f9ed9d20295b3b653dcb1e76c32",
	name: "getDashboardData",
	filename: "src/routes/index.tsx"
}, (opts) => getDashboardData.__executeServer(opts));
var getDashboardData = createServerFn({ method: "GET" }).handler(getDashboardData_createServerFn_handler, async () => {
	await seedDatabase();
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
