import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
import { t as OperationsService } from "./operations.service-CaXXWzZZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-D2mqJxMB.js
var getDocumentsData_createServerFn_handler = createServerRpc({
	id: "a9e3167bb4c70f0af405b9d3b7e984912d3575a47dbcd32efd3c831d8c783956",
	name: "getDocumentsData",
	filename: "src/routes/documents/index.tsx"
}, (opts) => getDocumentsData.__executeServer(opts));
var getDocumentsData = createServerFn({ method: "GET" }).handler(getDocumentsData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return { docs: await OperationsService.getDocuments(session.organizationId, session.role) };
});
//#endregion
export { getDocumentsData_createServerFn_handler };
