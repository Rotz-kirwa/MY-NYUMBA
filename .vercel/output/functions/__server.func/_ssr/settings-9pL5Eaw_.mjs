import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-9pL5Eaw_.js
var getSettingsData_createServerFn_handler = createServerRpc({
	id: "cbfb81c1185bea99fbaa361d31ce48ceb0ea86ea8eeb404dc39e6a8912b34fcf",
	name: "getSettingsData",
	filename: "src/routes/settings/index.tsx"
}, (opts) => getSettingsData.__executeServer(opts));
var getSettingsData = createServerFn({ method: "GET" }).handler(getSettingsData_createServerFn_handler, async () => {
	return { session: await getSessionContext() };
});
//#endregion
export { getSettingsData_createServerFn_handler };
