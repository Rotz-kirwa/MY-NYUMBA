import { c as createServerFn } from "./_ssr/createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./_ssr/auth-DWAKuBUM.mjs";
import { t as PropertyService } from "./_ssr/property.service-AZ0HrrK5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_propertyId-BaV_enz3.js
var getPropertyDetailData_createServerFn_handler = createServerRpc({
	id: "b1dcf85a9ab0c5b785f921ffb554866f5129511a7045aebffd70167f91e744ea",
	name: "getPropertyDetailData",
	filename: "src/routes/properties/$propertyId.tsx"
}, (opts) => getPropertyDetailData.__executeServer(opts));
var getPropertyDetailData = createServerFn({ method: "POST" }).validator((d) => d).handler(getPropertyDetailData_createServerFn_handler, async ({ data }) => {
	const session = await getSessionContext();
	return {
		prop: await PropertyService.getPropertyById(session.organizationId, data.propertyId, session.role),
		units: (await PropertyService.getAllUnits(session.organizationId, session.role)).filter((u) => u.propertyId === data.propertyId)
	};
});
//#endregion
export { getPropertyDetailData_createServerFn_handler };
