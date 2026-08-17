import { BaseRepository } from "./base.repository";
import { db } from "@/db";
import { rentCharges, payments, paymentAllocations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Money } from "@/server/utils/money";

export interface RecordPaymentInput {
  tenantId: string;
  leaseId: string;
  unitId: string;
  propertyId: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  transactionDate: string;
  notes?: string;
  createdBy: string;
}

export class FinancialRepository extends BaseRepository {
  async findAllRentCharges() {
    return await db
      .select()
      .from(rentCharges)
      .where(this.scopeOrg(rentCharges.organizationId));
  }

  async findRentChargesByTenantId(tenantId: string) {
    return await db
      .select()
      .from(rentCharges)
      .where(and(this.scopeOrg(rentCharges.organizationId), eq(rentCharges.tenantId, tenantId)));
  }

  async findAllPayments() {
    return await db
      .select()
      .from(payments)
      .where(this.scopeOrg(payments.organizationId));
  }

  async findPaymentsByTenantId(tenantId: string) {
    return await db
      .select()
      .from(payments)
      .where(and(this.scopeOrg(payments.organizationId), eq(payments.tenantId, tenantId)));
  }

  async findPaymentByReference(transactionReference: string) {
    const result = await db
      .select()
      .from(payments)
      .where(and(this.scopeOrg(payments.organizationId), eq(payments.transactionReference, transactionReference)));
    return result[0] || null;
  }

  async findAllPaymentAllocations() {
    return await db
      .select()
      .from(paymentAllocations)
      .where(this.scopeOrg(paymentAllocations.organizationId));
  }

  /**
   * Atomic, transactional payment recording and charge allocation.
   * Ensures that payments and allocations succeed together or rollback completely.
   */
  async recordPaymentTransaction(input: RecordPaymentInput) {
    return await db.transaction(async (tx: any) => {
      const paymentId = `pmt_${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date().toISOString();

      const paymentPayload = this.attachOrgId({
        id: paymentId,
        tenantId: input.tenantId,
        leaseId: input.leaseId,
        unitId: input.unitId,
        propertyId: input.propertyId,
        amount: Money.round(input.amount),
        paymentMethod: input.paymentMethod,
        transactionReference: input.transactionReference,
        transactionDate: input.transactionDate,
        status: "COMPLETED",
        notes: input.notes || null,
        createdBy: input.createdBy,
        createdAt: now,
        updatedAt: now,
      });

      const [newPayment] = await tx.insert(payments).values(paymentPayload).returning();

      // Find unpaid charges for this tenant ordered by billing period / due date
      const pendingCharges = await tx
        .select()
        .from(rentCharges)
        .where(
          and(
            eq(rentCharges.organizationId, this.orgId),
            eq(rentCharges.tenantId, input.tenantId),
            eq(rentCharges.status, "PENDING")
          )
        );

      let remainingPayment = Money.round(input.amount);
      const createdAllocations = [];

      for (const charge of pendingCharges) {
        if (remainingPayment <= 0) break;

        const currentBalance = Money.round(charge.balance);
        const allocationAmount = Math.min(remainingPayment, currentBalance);

        if (allocationAmount > 0) {
          const newAmountPaid = Money.add(charge.amountPaid, allocationAmount);
          const newBalance = Money.subtract(charge.totalAmount, newAmountPaid);
          const newStatus = newBalance <= 0 ? "PAID" : "PARTIAL";

          await tx
            .update(rentCharges)
            .set({
              amountPaid: newAmountPaid,
              balance: newBalance,
              status: newStatus,
              updatedAt: now,
            })
            .where(and(eq(rentCharges.organizationId, this.orgId), eq(rentCharges.id, charge.id)));

          const allocationPayload = this.attachOrgId({
            id: `alloc_${Math.random().toString(36).substring(2, 9)}`,
            paymentId: newPayment.id,
            rentChargeId: charge.id,
            allocatedAmount: allocationAmount,
            allocatedAt: now,
            notes: `Automated payment allocation of ${Money.format(allocationAmount)} against charge ${charge.id}`,
          });

          const [allocation] = await tx.insert(paymentAllocations).values(allocationPayload).returning();
          createdAllocations.push(allocation);

          remainingPayment = Money.subtract(remainingPayment, allocationAmount);
        }
      }

      return {
        payment: newPayment,
        allocations: createdAllocations,
        unallocatedRemainder: remainingPayment,
      };
    });
  }
}
