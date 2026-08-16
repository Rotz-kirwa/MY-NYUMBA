import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
import { t as FinancialService } from "./financial.service-DZoq0JZy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-kBLD9ROU.js
var getReportsData_createServerFn_handler = createServerRpc({
	id: "131880c66816e88e93afedb9db2968ef745ed0ac2605f407fa2f8bf95e93c7d3",
	name: "getReportsData",
	filename: "src/routes/reports/index.tsx"
}, (opts) => getReportsData.__executeServer(opts));
var getReportsData = createServerFn({ method: "GET" }).handler(getReportsData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { summary: await FinancialService.getFinancialSummary(session.organizationId, session.role) };
});
//#endregion
export { getReportsData_createServerFn_handler };
