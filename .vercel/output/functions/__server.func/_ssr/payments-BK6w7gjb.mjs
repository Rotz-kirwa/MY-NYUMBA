import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BUC7l0SS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-BK6w7gjb.js
var $$splitComponentImporter = () => import("./payments-CqDvH34G.mjs");
var getPaymentsData = createServerFn({ method: "GET" }).handler(createSsrRpc("5157baf2dc0b36a4388e735358d9c231fa5b1119d24ecd956d1afa4f148247fc"));
var Route = createFileRoute("/payments/")({
	loader: () => getPaymentsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
