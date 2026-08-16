import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./auth-D2dtPKyA.mjs";
import { t as OperationsService } from "./operations.service-Bxd5MeOb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maintenance-CFG_aeod.js
var getMaintenanceData_createServerFn_handler = createServerRpc({
	id: "0c8ed591840def60e06274dab0158fcf4a7ae7cdd186a9edf86a37876b4b8d3e",
	name: "getMaintenanceData",
	filename: "src/routes/maintenance/index.tsx"
}, (opts) => getMaintenanceData.__executeServer(opts));
var getMaintenanceData = createServerFn({ method: "GET" }).handler(getMaintenanceData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { tickets: await OperationsService.getMaintenanceRequests(session.organizationId, session.role) };
});
//#endregion
export { getMaintenanceData_createServerFn_handler };
