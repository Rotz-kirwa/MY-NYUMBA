import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
import { t as OperationsService } from "./operations.service-DIlxbNHj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-D9zD6z_V.js
var getExpensesData_createServerFn_handler = createServerRpc({
	id: "162029d70e723cbea9bfe23704687de36a1428b0bdff7929f9a3ded61e0f4d59",
	name: "getExpensesData",
	filename: "src/routes/expenses/index.tsx"
}, (opts) => getExpensesData.__executeServer(opts));
var getExpensesData = createServerFn({ method: "GET" }).handler(getExpensesData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { exp: await OperationsService.getExpenses(session.organizationId, session.role) };
});
//#endregion
export { getExpensesData_createServerFn_handler };
