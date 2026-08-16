import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BAbcmpPz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DPbQRFn0.js
var $$splitComponentImporter = () => import("./settings-CEsSYrSe.mjs");
var getSettingsData = createServerFn({ method: "GET" }).handler(createSsrRpc("cbfb81c1185bea99fbaa361d31ce48ceb0ea86ea8eeb404dc39e6a8912b34fcf"));
var Route = createFileRoute("/settings/")({
	loader: () => getSettingsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
