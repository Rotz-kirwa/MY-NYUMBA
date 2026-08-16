import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { authorizeOrThrow, type UserRole } from "../permissions";

export class TenantService {
  static async getAllTenants(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "tenants:read");
    return await db.select().from(s.tenants).where(eq(s.tenants.organizationId, orgId));
  }

  static async getTenantById(orgId: string, tenantId: string, role: UserRole) {
    authorizeOrThrow(role, "tenants:read");
    const [tenant] = await db
      .select()
      .from(s.tenants)
      .where(and(eq(s.tenants.organizationId, orgId), eq(s.tenants.id, tenantId)));
    return tenant || null;
  }

  static async getAllLeases(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "leases:read");
    return await db.select().from(s.leases).where(eq(s.leases.organizationId, orgId));
  }
}
