import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DxtQbyTX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maintenance-BbEbCmzb.js
var $$splitComponentImporter = () => import("./maintenance-C-1QnIO22.mjs");
var getMaintenanceData = createServerFn({ method: "GET" }).handler(createSsrRpc("0c8ed591840def60e06274dab0158fcf4a7ae7cdd186a9edf86a37876b4b8d3e"));
var Route = createFileRoute("/maintenance/")({
	loader: () => getMaintenanceData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
