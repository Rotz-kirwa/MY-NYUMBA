import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D5aZwTxT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-jgX3jun_.js
var $$splitComponentImporter = () => import("./tenants-CE7gVyNo.mjs");
var getTenantsData = createServerFn({ method: "GET" }).handler(createSsrRpc("bdc7f7c2e26947b795a39d36d9a8227d996af0a99b7c131224892dee931f47bf"));
var Route = createFileRoute("/tenants/")({
	loader: () => getTenantsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
