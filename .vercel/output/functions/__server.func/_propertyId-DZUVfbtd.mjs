import { m as createFileRoute, p as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./_ssr/createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-BQmhoXtj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_propertyId-DZUVfbtd.js
var $$splitComponentImporter = () => import("./_propertyId-CLHa7Q-0.mjs");
var getPropertyDetailData = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("b1dcf85a9ab0c5b785f921ffb554866f5129511a7045aebffd70167f91e744ea"));
var Route = createFileRoute("/properties/$propertyId")({
	loader: ({ params }) => getPropertyDetailData({ data: { propertyId: params.propertyId } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
