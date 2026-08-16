import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, c as Td, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as Route } from "./messages-DM8KPd2V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-CjpWwVT7.js
var import_jsx_runtime = require_jsx_runtime();
function MessagesPage() {
	const { msgs } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Communications",
		title: "Tenant Messages",
		subtitle: "SMS, WhatsApp, and in-app communications with tenants and property caretakers."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Inbox Threads",
		meta: `${msgs.length} active threads`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Sender",
				"Unit",
				"Preview",
				"Channel",
				"Status"
			],
			children: msgs.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium",
						children: m.senderName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: m.unitLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "max-w-md truncate",
						children: m.preview
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "neutral",
						children: m.channel
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "partial",
						children: "Unread"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Read"
					}) })
				]
			}, m.id))
		})
	})] });
}
//#endregion
export { MessagesPage as component };
