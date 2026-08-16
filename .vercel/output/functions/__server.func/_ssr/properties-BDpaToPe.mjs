import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
import { t as PropertyService } from "./property.service-B0ZkLe5H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-BDpaToPe.js
var getPropertiesData_createServerFn_handler = createServerRpc({
	id: "35ad280e2e8c25186a8309ff7270d42a47092048e6caf8a54c9db96c2812f956",
	name: "getPropertiesData",
	filename: "src/routes/properties/index.tsx"
}, (opts) => getPropertiesData.__executeServer(opts));
var getPropertiesData = createServerFn({ method: "GET" }).handler(getPropertiesData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { props: await PropertyService.getAllProperties(session.organizationId, session.role) };
});
//#endregion
export { getPropertiesData_createServerFn_handler };
