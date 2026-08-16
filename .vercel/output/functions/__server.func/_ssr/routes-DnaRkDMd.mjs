import { g as createFileRoute, h as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DxtQbyTX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DnaRkDMd.js
var $$splitComponentImporter = () => import("./routes-C3JolYIA.mjs");
var getDashboardData = createServerFn({ method: "GET" }).handler(createSsrRpc("114c006b287821f2aa841eeafcd341531ca53f9ed9d20295b3b653dcb1e76c32"));
var Route = createFileRoute("/")({
	loader: () => getDashboardData(),
	head: () => ({ meta: [
		{ title: "My Nyumba — Nairobi rent collection dashboard" },
		{
			name: "description",
			content: "Track rent collection, arrears and M-Pesa payments across your Nairobi property portfolio in one ledger."
		},
		{
			property: "og:title",
			content: "My Nyumba — Rent collection dashboard"
		},
		{
			property: "og:description",
			content: "The rent ribbon: money in vs money owed across every unit, every day."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
