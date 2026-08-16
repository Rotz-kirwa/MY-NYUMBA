import { o as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BAm5Wmdg.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as Plus, o as Smartphone } from "../_libs/lucide-react.mjs";
import { a as PageHeader, c as Td, l as statusVariant, n as Badge, o as Panel, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./payments-CN1DuXSJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-C3orT0Gk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var triggerStkPushServerFn = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("ac2722378cb8143150902c0c23a4d87fa988bd02dd9d0447eb46cf29ac680161"));
function PaymentsPage() {
	const { payments } = Route.useLoaderData();
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [phone, setPhone] = (0, import_react.useState)("+254 712 445 908");
	const [amount, setAmount] = (0, import_react.useState)(47e3);
	const [statusMsg, setStatusMsg] = (0, import_react.useState)("");
	const handleStkPush = async (e) => {
		e.preventDefault();
		setStatusMsg("Initiating M-Pesa STK Push...");
		const res = await triggerStkPushServerFn({ data: {
			phone,
			amount
		} });
		if (res.success) setStatusMsg(`STK Push prompt sent to ${phone}! Ref: ${res.mockReference || "PENDING"}`);
		else setStatusMsg("Failed to send STK push.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Financial Operations",
			title: "Rent & Payments",
			subtitle: "Real-time payment ledger, Daraja M-Pesa reconciliation, and double-entry charge allocations.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowModal(true),
				className: "flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), " Record payment"]
			})
		}),
		showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-xs border border-border bg-card p-6 shadow-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold mb-2",
						children: "Record / Initiate Rent Payment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-4",
						children: "Send an STK Push to tenant's phone or record manual collection."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleStkPush,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold mb-1",
								children: "M-Pesa Phone Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: "w-full rounded-xs border border-border bg-background px-3 py-2 text-sm outline-none",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold mb-1",
								children: "Amount (KSh)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: amount,
								onChange: (e) => setAmount(Number(e.target.value)),
								className: "w-full rounded-xs border border-border bg-background px-3 py-2 text-sm outline-none",
								required: true
							})] }),
							statusMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-primary",
								children: statusMsg
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowModal(false),
									className: "rounded-xs border border-border px-3 py-1.5 text-xs font-semibold",
									children: "Close"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "flex items-center gap-1 rounded-xs bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { size: 14 }), " Send M-Pesa STK Push"]
								})]
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Payment Transactions Ledger",
			meta: `${payments.length} total payments`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
				head: [
					"Reference",
					"Tenant ID",
					"Unit ID",
					"Amount",
					"Date",
					"Channel",
					"Status"
				],
				children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "transition-colors duration-150 hover:bg-muted/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							num: true,
							"font-mono": true,
							children: p.transactionReference
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.tenantId }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							num: true,
							children: p.unitId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							num: true,
							"font-mono": true,
							className: "font-semibold text-success",
							children: KSh(p.amount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							num: true,
							children: p.transactionDate
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "neutral",
							children: p.paymentMethod
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: statusVariant(p.status),
							children: p.status
						}) })
					]
				}, p.id))
			})
		})
	] });
}
//#endregion
export { PaymentsPage as component };
