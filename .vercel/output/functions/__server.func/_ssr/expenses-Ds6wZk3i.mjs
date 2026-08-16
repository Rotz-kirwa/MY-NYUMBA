import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BAm5Wmdg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-Ds6wZk3i.js
var $$splitComponentImporter = () => import("./expenses-BieiRNaf.mjs");
var getExpensesData = createServerFn({ method: "GET" }).handler(createSsrRpc("162029d70e723cbea9bfe23704687de36a1428b0bdff7929f9a3ded61e0f4d59"));
var Route = createFileRoute("/expenses/")({
	loader: () => getExpensesData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
