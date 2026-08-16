import { a as eq, i as and, r as desc } from "../_libs/drizzle-orm+postgres.mjs";
import { c as paymentAllocations, d as rentCharges, l as payments, n as db, t as authorizeOrThrow } from "./permissions-Cp9twb3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/financial.service-CP9WcEAr.js
var FinancialService = class {
	static async getPayments(orgId, role) {
		authorizeOrThrow(role, "payments:read");
		return await db.select().from(payments).where(eq(payments.organizationId, orgId)).orderBy(desc(payments.createdAt));
	}
	static async getRentCharges(orgId, role) {
		authorizeOrThrow(role, "payments:read");
		return await db.select().from(rentCharges).where(eq(rentCharges.organizationId, orgId));
	}
	static async getFinancialSummary(orgId, role) {
		authorizeOrThrow(role, "reports:read");
		const charges = await this.getRentCharges(orgId, role);
		const pmts = await this.getPayments(orgId, role);
		const totalBilled = charges.reduce((acc, c) => acc + c.totalAmount, 0);
		const totalCollected = pmts.reduce((acc, p) => acc + (p.status === "COMPLETED" ? p.amount : 0), 0);
		return {
			billed: totalBilled,
			collected: totalCollected,
			arrearsCarried: charges.reduce((acc, c) => acc + c.balance, 0),
			collectionRate: totalBilled > 0 ? Math.round(totalCollected / totalBilled * 100) : 0
		};
	}
	static async recordPayment(orgId, role, userId, params) {
		authorizeOrThrow(role, "payments:create");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const pmtId = `pmt_${Date.now()}`;
		await db.insert(payments).values({
			id: pmtId,
			organizationId: orgId,
			tenantId: params.tenantId,
			leaseId: params.leaseId,
			unitId: params.unitId,
			propertyId: params.propertyId,
			amount: params.amount,
			paymentMethod: params.paymentMethod,
			transactionReference: params.transactionReference,
			transactionDate: now.slice(0, 10),
			status: "COMPLETED",
			notes: params.notes,
			createdBy: userId,
			createdAt: now,
			updatedAt: now
		});
		const pendingCharges = await db.select().from(rentCharges).where(and(eq(rentCharges.organizationId, orgId), eq(rentCharges.tenantId, params.tenantId)));
		let remainingPayment = params.amount;
		for (const charge of pendingCharges) {
			if (remainingPayment <= 0) break;
			if (charge.balance <= 0) continue;
			const alloc = Math.min(charge.balance, remainingPayment);
			const newBalance = charge.balance - alloc;
			const newPaid = charge.amountPaid + alloc;
			const newStatus = newBalance === 0 ? "PAID" : "PARTIALLY_PAID";
			await db.update(rentCharges).set({
				amountPaid: newPaid,
				balance: newBalance,
				status: newStatus,
				updatedAt: now
			}).where(eq(rentCharges.id, charge.id));
			await db.insert(paymentAllocations).values({
				id: `alloc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				organizationId: orgId,
				paymentId: pmtId,
				rentChargeId: charge.id,
				allocatedAmount: alloc,
				allocatedAt: now
			});
			remainingPayment -= alloc;
		}
		return {
			success: true,
			paymentId: pmtId
		};
	}
};
//#endregion
export { FinancialService as t };
