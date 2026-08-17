import { authorizeOrThrow, type UserRole } from "../permissions";
import { TenantContext } from "../auth/tenant-context";
import { TenantRepository } from "../repositories/tenant.repository";
import { LeaseRepository } from "../repositories/lease.repository";

export class TenantService {
  static async getAllTenants(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "tenants:read");
    const repo = new TenantRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllTenants();
  }

  static async getTenantById(orgId: string, tenantId: string, role: UserRole) {
    authorizeOrThrow(role, "tenants:read");
    const repo = new TenantRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findTenantById(tenantId);
  }

  static async getAllLeases(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "leases:read");
    const repo = new LeaseRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllLeases();
  }

  static async createTenant(orgId: string, data: any, role: UserRole) {
    authorizeOrThrow(role, "tenants:create");
    const repo = new TenantRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    const created = await repo.createTenant(data);
    return { success: true, tenant: created };
  }

  static async deleteTenant(orgId: string, tenantId: string, role: UserRole) {
    authorizeOrThrow(role, "tenants:delete");
    const repo = new TenantRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    const deleted = await repo.deleteTenant(tenantId);
    return { success: true, tenant: deleted };
  }
}
