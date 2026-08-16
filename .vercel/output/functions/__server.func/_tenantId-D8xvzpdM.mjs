import { c as createServerFn } from "./_ssr/createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./_ssr/auth-UPPOjy5n.mjs";
import { t as TenantService } from "./_ssr/tenant.service-BVkb1pyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_tenantId-D8xvzpdM.js
var getTenantDetailData_createServerFn_handler = createServerRpc({
	id: "e4e9c07bcc9b422a77ab7e2f205d2e5167160ee61222531def2ec274530aacf7",
	name: "getTenantDetailData",
	filename: "src/routes/tenants/$tenantId.tsx"
}, (opts) => getTenantDetailData.__executeServer(opts));
var getTenantDetailData = createServerFn({ method: "POST" }).validator((d) => d).handler(getTenantDetailData_createServerFn_handler, async ({ data }) => {
	const session = await getSessionContext();
	return {
		tenant: await TenantService.getTenantById(session.organizationId, data.tenantId, session.role),
		leases: (await TenantService.getAllLeases(session.organizationId, session.role)).filter((l) => l.tenantId === data.tenantId)
	};
});
//#endregion
export { getTenantDetailData_createServerFn_handler };
