import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BUC7l0SS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maintenance-BbQrdb82.js
var $$splitComponentImporter = () => import("./maintenance-DmxJkr8M.mjs");
var getMaintenanceData = createServerFn({ method: "GET" }).handler(createSsrRpc("0c8ed591840def60e06274dab0158fcf4a7ae7cdd186a9edf86a37876b4b8d3e"));
var Route = createFileRoute("/maintenance/")({
	loader: () => getMaintenanceData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
