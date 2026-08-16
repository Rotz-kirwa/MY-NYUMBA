import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./auth-rqTrEcQH.mjs";
import { t as PropertyService } from "./property.service-CPBnOvyc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/units-CBS3Jw3z.js
var getUnitsData_createServerFn_handler = createServerRpc({
	id: "88c6a14d0908930a0f1fd8cf792364f9563c6084ad46bed9b0a83b77b24a5273",
	name: "getUnitsData",
	filename: "src/routes/units/index.tsx"
}, (opts) => getUnitsData.__executeServer(opts));
var getUnitsData = createServerFn({ method: "GET" }).handler(getUnitsData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { units: await PropertyService.getAllUnits(session.organizationId, session.role) };
});
//#endregion
export { getUnitsData_createServerFn_handler };
