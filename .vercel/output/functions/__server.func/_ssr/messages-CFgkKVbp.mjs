import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-ZfcF9uaC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-CFgkKVbp.js
var $$splitComponentImporter = () => import("./messages-BABb8Y3z.mjs");
var getMessagesData = createServerFn({ method: "GET" }).handler(createSsrRpc("8881600eec902fcd557bc8dbc80ef9be4d58ba0e6e24a60b25ff348d98f66d9d"));
var Route = createFileRoute("/messages/")({
	loader: () => getMessagesData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
