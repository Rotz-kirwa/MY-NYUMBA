import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D5aZwTxT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leases-D9cT9-s-.js
var $$splitComponentImporter = () => import("./leases-D3OLR6wZ.mjs");
var getLeasesData = createServerFn({ method: "GET" }).handler(createSsrRpc("3ed995f020b1431bfaf01921164cbbf4c0e1a5f174ceaad4b05674582ab811b1"));
var Route = createFileRoute("/leases/")({
	loader: () => getLeasesData(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
