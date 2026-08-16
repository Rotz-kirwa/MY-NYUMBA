import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BAbcmpPz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-D38TUYFO.js
var $$splitComponentImporter = () => import("./properties-DgUyLqqA.mjs");
var getPropertiesData = createServerFn({ method: "GET" }).handler(createSsrRpc("35ad280e2e8c25186a8309ff7270d42a47092048e6caf8a54c9db96c2812f956"));
var Route = createFileRoute("/properties/")({
	loader: () => getPropertiesData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
