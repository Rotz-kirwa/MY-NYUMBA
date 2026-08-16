import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DxtQbyTX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-C6Aspo4E.js
var $$splitComponentImporter = () => import("./settings-C9hJWtWI.mjs");
var getSettingsData = createServerFn({ method: "GET" }).handler(createSsrRpc("cbfb81c1185bea99fbaa361d31ce48ceb0ea86ea8eeb404dc39e6a8912b34fcf"));
var Route = createFileRoute("/settings/")({
	loader: () => getSettingsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
