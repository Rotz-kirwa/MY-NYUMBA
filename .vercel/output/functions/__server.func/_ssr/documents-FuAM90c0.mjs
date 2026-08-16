import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D5aZwTxT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-FuAM90c0.js
var $$splitComponentImporter = () => import("./documents-rikuwRvc.mjs");
var getDocumentsData = createServerFn({ method: "GET" }).handler(createSsrRpc("a9e3167bb4c70f0af405b9d3b7e984912d3575a47dbcd32efd3c831d8c783956"));
var Route = createFileRoute("/documents/")({
	loader: () => getDocumentsData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
