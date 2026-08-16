import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authorizeOrThrow, type UserRole } from "../permissions";

export class FinancialService {
  static async getPayments(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "payments:read");
    return await db
      .select()
      .from(s.payments)
      .where(eq(s.payments.organizationId, orgId))
      .orderBy(desc(s.payments.createdAt));
  }

  static async getRentCharges(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "payments:read");
    return await db
      .select()
      .from(s.rentCharges)
      .where(eq(s.rentCharges.organizationId, orgId));
  }

  static async getFinancialSummary(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "reports:read");

    const charges = await this.getRentCharges(orgId, role);
    const pmts = await this.getPayments(orgId, role);

    const totalBilled = charges.reduce((acc, c) => acc + c.totalAmount, 0);
    const totalCollected = pmts.reduce((acc, p) => acc + (p.status === "COMPLETED" ? p.amount : 0), 0);
    const arrearsCarried = charges.reduce((acc, c) => acc + c.balance, 0);

    return {
      billed: totalBilled,
      collected: totalCollected,
      arrearsCarried,
      collectionRate: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0,
    };
  }

  static async recordPayment(
    orgId: string,
    role: UserRole,
    userId: string,
    params: {
      tenantId: string;
      leaseId: string;
      unitId: string;
      propertyId: string;
      amount: number;
      paymentMethod: string;
      transactionReference: string;
      notes?: string;
    }
  ) {
    authorizeOrThrow(role, "payments:create");

    const now = new Date().toISOString();
    const pmtId = `pmt_${Date.now()}`;

    // 1. Insert immutable payment record
    await db.insert(s.payments).values({
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
      updatedAt: now,
    });

    // 2. Allocate payment to pending rent charges for tenant
    const pendingCharges = await db
      .select()
      .from(s.rentCharges)
      .where(
        and(
          eq(s.rentCharges.organizationId, orgId),
          eq(s.rentCharges.tenantId, params.tenantId)
        )
      );

    let remainingPayment = params.amount;

    for (const charge of pendingCharges) {
      if (remainingPayment <= 0) break;
      if (charge.balance <= 0) continue;

      const alloc = Math.min(charge.balance, remainingPayment);
      const newBalance = charge.balance - alloc;
      const newPaid = charge.amountPaid + alloc;
      const newStatus = newBalance === 0 ? "PAID" : "PARTIALLY_PAID";

      await db
        .update(s.rentCharges)
        .set({
          amountPaid: newPaid,
          balance: newBalance,
          status: newStatus,
          updatedAt: now,
        })
        .where(eq(s.rentCharges.id, charge.id));

      await db.insert(s.paymentAllocations).values({
        id: `alloc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        organizationId: orgId,
        paymentId: pmtId,
        rentChargeId: charge.id,
        allocatedAmount: alloc,
        allocatedAt: now,
      });

      remainingPayment -= alloc;
    }

    return { success: true, paymentId: pmtId };
  }
}
