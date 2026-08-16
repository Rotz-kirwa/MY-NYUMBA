import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./auth-DWAKuBUM.mjs";
import { t as TenantService } from "./tenant.service-B9CPK1YO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leases-B_kaEU012.js
var getLeasesData_createServerFn_handler = createServerRpc({
	id: "3ed995f020b1431bfaf01921164cbbf4c0e1a5f174ceaad4b05674582ab811b1",
	name: "getLeasesData",
	filename: "src/routes/leases/index.tsx"
}, (opts) => getLeasesData.__executeServer(opts));
var getLeasesData = createServerFn({ method: "GET" }).handler(getLeasesData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { leases: await TenantService.getAllLeases(session.organizationId, session.role) };
});
//#endregion
export { getLeasesData_createServerFn_handler };
