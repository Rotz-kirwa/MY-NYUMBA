import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as getSessionContext, t as createServerRpc } from "./auth-hL6tUEyb.mjs";
import { t as OperationsService } from "./operations.service-Cxcmin_7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-BexdBaI_.js
var getMessagesData_createServerFn_handler = createServerRpc({
	id: "8881600eec902fcd557bc8dbc80ef9be4d58ba0e6e24a60b25ff348d98f66d9d",
	name: "getMessagesData",
	filename: "src/routes/messages/index.tsx"
}, (opts) => getMessagesData.__executeServer(opts));
var getMessagesData = createServerFn({ method: "GET" }).handler(getMessagesData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { msgs: await OperationsService.getMessages(session.organizationId, session.role) };
});
//#endregion
export { getMessagesData_createServerFn_handler };
