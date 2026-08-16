import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as PageHeader, c as Td, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as Route } from "./documents-D1yWC2lQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-73XzT8Gg.js
var import_jsx_runtime = require_jsx_runtime();
function DocumentsPage() {
	const { docs } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Storage & Metadata",
		title: "Documents",
		subtitle: "Lease agreements, National ID copies, compliance certificates, and M-Pesa receipts."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Document Vault",
		meta: `${docs.length} indexed files`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
			head: [
				"Document Name",
				"Category",
				"Linked Entity",
				"File Size",
				"Uploaded At"
			],
			children: docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "transition-colors duration-150 hover:bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium text-primary hover:underline",
						children: d.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "neutral",
						children: d.kind
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: d.linkedEntity }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: d.fileSize
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						num: true,
						children: d.uploadedAt
					})
				]
			}, d.id))
		})
	})] });
}
//#endregion
export { DocumentsPage as component };
