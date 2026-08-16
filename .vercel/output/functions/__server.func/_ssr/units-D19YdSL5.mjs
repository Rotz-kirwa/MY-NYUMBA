import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BQmhoXtj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/units-D19YdSL5.js
var $$splitComponentImporter = () => import("./units-BDOPxSzh.mjs");
var getUnitsData = createServerFn({ method: "GET" }).handler(createSsrRpc("88c6a14d0908930a0f1fd8cf792364f9563c6084ad46bed9b0a83b77b24a5273"));
var Route = createFileRoute("/units/")({
	loader: () => getUnitsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
