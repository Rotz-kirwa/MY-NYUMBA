import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as getSessionContext, t as createServerRpc } from "./auth-CacxBTWw.mjs";
import { t as FinancialService } from "./financial.service-BLFymj0C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-CVr-iyAx.js
var MpesaIntegration = class {
	static async initiateStkPush(params) {
		const consumerKey = process.env.MPESA_CONSUMER_KEY || "MOCK_KEY";
		process.env.MPESA_SHORTCODE;
		if (consumerKey === "MOCK_KEY") {
			const mockRef = `TFR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
			return {
				success: true,
				merchantRequestId: `MR_${Date.now()}`,
				checkoutRequestId: `ws_CO_${Date.now()}`,
				responseCode: "0",
				responseDescription: "Success. Request accepted for processing",
				customerMessage: `STK Push prompt sent to ${params.phoneNumber} for KSh ${params.amount}`,
				mockReference: mockRef
			};
		}
		return {
			success: true,
			checkoutRequestId: `live_CO_${Date.now()}`
		};
	}
	static async handleCallback(orgId, role, userId, callback) {
		const { stkCallback } = callback.Body;
		if (stkCallback.ResultCode !== 0) return {
			success: false,
			reason: stkCallback.ResultDesc
		};
		const items = stkCallback.CallbackMetadata?.Item || [];
		const getVal = (name) => items.find((i) => i.Name === name)?.Value;
		const mpesaRef = String(getVal("MpesaReceiptNumber") || `MPESA_${Date.now()}`);
		const amount = Number(getVal("Amount") || 0);
		try {
			await FinancialService.recordPayment(orgId, role, userId, {
				tenantId: "t1",
				leaseId: "l1",
				unitId: "u1",
				propertyId: "kilimani-heights",
				amount,
				paymentMethod: "MPESA",
				transactionReference: mpesaRef,
				notes: `M-Pesa STK Push CheckoutRequestID: ${stkCallback.CheckoutRequestID}`
			});
			return {
				success: true,
				reference: mpesaRef
			};
		} catch (err) {
			return {
				success: true,
				idempotencySkipped: true,
				reference: mpesaRef
			};
		}
	}
};
var getPaymentsData_createServerFn_handler = createServerRpc({
	id: "5157baf2dc0b36a4388e735358d9c231fa5b1119d24ecd956d1afa4f148247fc",
	name: "getPaymentsData",
	filename: "src/routes/payments/index.tsx"
}, (opts) => getPaymentsData.__executeServer(opts));
var getPaymentsData = createServerFn({ method: "GET" }).handler(getPaymentsData_createServerFn_handler, async () => {
	const session = await getSessionContext();
	return {
		payments: await FinancialService.getPayments(session.organizationId, session.role),
		rentCharges: await FinancialService.getRentCharges(session.organizationId, session.role)
	};
});
var triggerStkPushServerFn_createServerFn_handler = createServerRpc({
	id: "ac2722378cb8143150902c0c23a4d87fa988bd02dd9d0447eb46cf29ac680161",
	name: "triggerStkPushServerFn",
	filename: "src/routes/payments/index.tsx"
}, (opts) => triggerStkPushServerFn.__executeServer(opts));
var triggerStkPushServerFn = createServerFn({ method: "POST" }).validator((d) => d).handler(triggerStkPushServerFn_createServerFn_handler, async ({ data }) => {
	return await MpesaIntegration.initiateStkPush({
		phoneNumber: data.phone,
		amount: data.amount,
		accountReference: "RENT"
	});
});
//#endregion
export { getPaymentsData_createServerFn_handler, triggerStkPushServerFn_createServerFn_handler };
