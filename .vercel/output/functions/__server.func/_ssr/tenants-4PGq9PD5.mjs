import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BQmhoXtj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenants-4PGq9PD5.js
var $$splitComponentImporter = () => import("./tenants-Dey5g4EH.mjs");
var getTenantsData = createServerFn({ method: "GET" }).handler(createSsrRpc("bdc7f7c2e26947b795a39d36d9a8227d996af0a99b7c131224892dee931f47bf"));
var Route = createFileRoute("/tenants/")({
	loader: () => getTenantsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
