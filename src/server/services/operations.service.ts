import { authorizeOrThrow, type UserRole } from "../permissions";
import { TenantContext } from "../auth/tenant-context";
import { OperationsRepository } from "../repositories/operations.repository";

export class OperationsService {
  static async getMaintenanceRequests(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "maintenance:read");
    const repo = new OperationsRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllMaintenanceRequests();
  }

  static async createMaintenanceRequest(
    orgId: string,
    role: UserRole,
    userId: string,
    data: {
      propertyId: string;
      unitId?: string;
      tenantId?: string;
      title: string;
      description: string;
      category: string;
      priority: string;
      assignedVendor?: string;
      estimatedCost?: number;
    }
  ) {
    authorizeOrThrow(role, "maintenance:update");
    const repo = new OperationsRepository(
      new TenantContext({ userId, organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    const now = new Date().toISOString();
    const refNum = `MNT-${Math.floor(100 + Math.random() * 900)}`;

    return await repo.createMaintenanceRequest({
      id: `mnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referenceNumber: refNum,
      propertyId: data.propertyId,
      unitId: data.unitId || null,
      tenantId: data.tenantId || null,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: "OPEN",
      assignedVendor: data.assignedVendor || null,
      estimatedCost: data.estimatedCost || null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static async getExpenses(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "expenses:read");
    const repo = new OperationsRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllExpenses();
  }

  static async createExpense(
    orgId: string,
    role: UserRole,
    userId: string,
    data: {
      propertyId?: string;
      category: string;
      description: string;
      amount: number;
      vendorName: string;
      expenseDate: string;
      receiptReference?: string;
    }
  ) {
    authorizeOrThrow(role, "expenses:create");
    const repo = new OperationsRepository(
      new TenantContext({ userId, organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    const now = new Date().toISOString();
    return await repo.createExpense({
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      propertyId: data.propertyId || null,
      category: data.category,
      description: data.description,
      amount: data.amount,
      vendorName: data.vendorName,
      expenseDate: data.expenseDate,
      receiptReference: data.receiptReference || null,
      status: "APPROVED",
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static async getDocuments(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    const repo = new OperationsRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllDocuments();
  }

  static async getMessages(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    const repo = new OperationsRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllMessages();
  }
}
