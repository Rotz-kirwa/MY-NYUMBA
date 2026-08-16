import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BUC7l0SS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-_uUbVdqv.js
var $$splitComponentImporter = () => import("./reports-D3GUZrPa.mjs");
var getReportsData = createServerFn({ method: "GET" }).handler(createSsrRpc("131880c66816e88e93afedb9db2968ef745ed0ac2605f407fa2f8bf95e93c7d3"));
var Route = createFileRoute("/reports/")({
	loader: () => getReportsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
