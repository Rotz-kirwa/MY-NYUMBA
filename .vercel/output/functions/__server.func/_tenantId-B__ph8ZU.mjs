import { m as createFileRoute, p as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./_ssr/createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-ZfcF9uaC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_tenantId-B__ph8ZU.js
var $$splitComponentImporter = () => import("./_tenantId-BU2DPyX-.mjs");
var getTenantDetailData = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("e4e9c07bcc9b422a77ab7e2f205d2e5167160ee61222531def2ec274530aacf7"));
var Route = createFileRoute("/tenants/$tenantId")({
	loader: ({ params }) => getTenantDetailData({ data: { tenantId: params.tenantId } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
