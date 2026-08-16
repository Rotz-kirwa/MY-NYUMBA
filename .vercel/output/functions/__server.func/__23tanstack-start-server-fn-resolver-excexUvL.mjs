//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-excexUvL.js
var manifest = {
	"0c8ed591840def60e06274dab0158fcf4a7ae7cdd186a9edf86a37876b4b8d3e": {
		functionName: "getMaintenanceData_createServerFn_handler",
		importer: () => import("./_ssr/maintenance-BODa0DUd.mjs")
	},
	"114c006b287821f2aa841eeafcd341531ca53f9ed9d20295b3b653dcb1e76c32": {
		functionName: "getDashboardData_createServerFn_handler",
		importer: () => import("./_ssr/routes-Cf4C1fdS.mjs")
	},
	"131880c66816e88e93afedb9db2968ef745ed0ac2605f407fa2f8bf95e93c7d3": {
		functionName: "getReportsData_createServerFn_handler",
		importer: () => import("./_ssr/reports-kZr0wLVB.mjs")
	},
	"162029d70e723cbea9bfe23704687de36a1428b0bdff7929f9a3ded61e0f4d59": {
		functionName: "getExpensesData_createServerFn_handler",
		importer: () => import("./_ssr/expenses-70Kr76Ok.mjs")
	},
	"35ad280e2e8c25186a8309ff7270d42a47092048e6caf8a54c9db96c2812f956": {
		functionName: "getPropertiesData_createServerFn_handler",
		importer: () => import("./_ssr/properties-Bn7dD82b.mjs")
	},
	"3ed995f020b1431bfaf01921164cbbf4c0e1a5f174ceaad4b05674582ab811b1": {
		functionName: "getLeasesData_createServerFn_handler",
		importer: () => import("./_ssr/leases-CLhaZZem2.mjs")
	},
	"5157baf2dc0b36a4388e735358d9c231fa5b1119d24ecd956d1afa4f148247fc": {
		functionName: "getPaymentsData_createServerFn_handler",
		importer: () => import("./_ssr/payments-BFE5X-MT.mjs")
	},
	"8881600eec902fcd557bc8dbc80ef9be4d58ba0e6e24a60b25ff348d98f66d9d": {
		functionName: "getMessagesData_createServerFn_handler",
		importer: () => import("./_ssr/messages-B8XN98t1.mjs")
	},
	"88c6a14d0908930a0f1fd8cf792364f9563c6084ad46bed9b0a83b77b24a5273": {
		functionName: "getUnitsData_createServerFn_handler",
		importer: () => import("./_ssr/units-BvNCx0rk.mjs")
	},
	"a9e3167bb4c70f0af405b9d3b7e984912d3575a47dbcd32efd3c831d8c783956": {
		functionName: "getDocumentsData_createServerFn_handler",
		importer: () => import("./_ssr/documents-2tp6iluJ.mjs")
	},
	"ac2722378cb8143150902c0c23a4d87fa988bd02dd9d0447eb46cf29ac680161": {
		functionName: "triggerStkPushServerFn_createServerFn_handler",
		importer: () => import("./_ssr/payments-BFE5X-MT.mjs")
	},
	"b1dcf85a9ab0c5b785f921ffb554866f5129511a7045aebffd70167f91e744ea": {
		functionName: "getPropertyDetailData_createServerFn_handler",
		importer: () => import("./_propertyId-_-6JTz1h.mjs")
	},
	"bdc7f7c2e26947b795a39d36d9a8227d996af0a99b7c131224892dee931f47bf": {
		functionName: "getTenantsData_createServerFn_handler",
		importer: () => import("./_ssr/tenants-wflPUfs_.mjs")
	},
	"cbfb81c1185bea99fbaa361d31ce48ceb0ea86ea8eeb404dc39e6a8912b34fcf": {
		functionName: "getSettingsData_createServerFn_handler",
		importer: () => import("./_ssr/settings-DjrI-5dv.mjs")
	},
	"e4e9c07bcc9b422a77ab7e2f205d2e5167160ee61222531def2ec274530aacf7": {
		functionName: "getTenantDetailData_createServerFn_handler",
		importer: () => import("./_tenantId-D8xvzpdM.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
