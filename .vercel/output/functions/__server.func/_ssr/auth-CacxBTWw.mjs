import { i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CacxBTWw.js
var DEFAULT_ORG_ID = "org_mynyumba_nairobi";
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function getSessionContext(request) {
	if ((request?.headers.get("Authorization"))?.startsWith("Bearer tenant_")) return {
		id: "usr_tenant_1",
		organizationId: DEFAULT_ORG_ID,
		name: "Brian Otieno",
		email: "brian.otieno@gmail.com",
		role: "TENANT"
	};
	return {
		id: "usr_wanjiru",
		organizationId: DEFAULT_ORG_ID,
		name: "Wanjiru Kimani",
		email: "wanjiru@mynyumba.co.ke",
		role: "OWNER"
	};
}
//#endregion
export { getSessionContext as n, createServerRpc as t };
