import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./auth-UPPOjy5n.mjs";
import { t as TenantService } from "./tenant.service-BVkb1pyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-wflPUfs_.js
var getTenantsData_createServerFn_handler = createServerRpc({
	id: "bdc7f7c2e26947b795a39d36d9a8227d996af0a99b7c131224892dee931f47bf",
	name: "getTenantsData",
	filename: "src/routes/tenants/index.tsx"
}, (opts) => getTenantsData.__executeServer(opts));
var getTenantsData = createServerFn({ method: "GET" }).handler(getTenantsData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { tenants: await TenantService.getAllTenants(session.organizationId, session.role) };
});
//#endregion
export { getTenantsData_createServerFn_handler };
