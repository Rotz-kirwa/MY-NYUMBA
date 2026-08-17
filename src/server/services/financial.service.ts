import { authorizeOrThrow, type UserRole } from "../permissions";
import { TenantContext } from "../auth/tenant-context";
import { FinancialRepository } from "../repositories/financial.repository";
import { Money } from "../utils/money";

export class FinancialService {
  static async getPayments(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "payments:read");
    const repo = new FinancialRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllPayments();
  }

  static async getRentCharges(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "payments:read");
    const repo = new FinancialRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllRentCharges();
  }

  static async getTenantRentCharges(orgId: string, tenantId: string, role: UserRole) {
    authorizeOrThrow(role, "payments:read");
    const repo = new FinancialRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findRentChargesByTenantId(tenantId);
  }

  static async getTenantPayments(orgId: string, tenantId: string, role: UserRole) {
    authorizeOrThrow(role, "payments:read");
    const repo = new FinancialRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findPaymentsByTenantId(tenantId);
  }

  static async getFinancialSummary(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "reports:read");

    const charges = await this.getRentCharges(orgId, role);
    const pmts = await this.getPayments(orgId, role);

    const totalBilled = charges.reduce((acc: number, c: (typeof charges)[number]) => Money.add(acc, c.totalAmount), 0);
    const totalCollected = pmts.reduce(
      (acc: number, p: (typeof pmts)[number]) => Money.add(acc, p.status === "COMPLETED" ? p.amount : 0),
      0
    );
    const arrearsCarried = charges.reduce((acc: number, c: (typeof charges)[number]) => Money.add(acc, c.balance), 0);

    return {
      billed: totalBilled,
      collected: totalCollected,
      arrearsCarried,
      collectionRate: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0,
    };
  }

  static calculateLateFee(params: {
    dueDate: string;
    monthlyRent: number;
    gracePeriodDays?: number;
    lateFeePercentage?: number;
  }): { daysOverdue: number; lateFee: number; isOverdue: boolean } {
    const graceDays = params.gracePeriodDays ?? 5;
    const feePct = params.lateFeePercentage ?? 5;
    const due = new Date(params.dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    if (daysOverdue > graceDays) {
      const lateFee = Math.round(params.monthlyRent * (feePct / 100));
      return { daysOverdue, lateFee, isOverdue: true };
    }

    return { daysOverdue, lateFee: 0, isOverdue: daysOverdue > 0 };
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
    const repo = new FinancialRepository(
      new TenantContext({ userId, organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );

    const result = await repo.recordPaymentTransaction({
      ...params,
      transactionDate: new Date().toISOString().slice(0, 10),
      createdBy: userId,
    });

    return { success: true, paymentId: result.payment.id, allocationsCount: result.allocations.length };
  }
}
