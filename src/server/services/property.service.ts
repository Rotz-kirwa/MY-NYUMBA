import { authorizeOrThrow, type UserRole } from "../permissions";
import { TenantContext } from "../auth/tenant-context";
import { PropertyRepository } from "../repositories/property.repository";
import type { properties, units } from "@/db/schema";

export class PropertyService {
  static async getAllProperties(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    const repo = new PropertyRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllProperties();
  }

  static async getPropertyById(orgId: string, propertyId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    const repo = new PropertyRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findPropertyById(propertyId);
  }

  static async getAllUnits(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    const repo = new PropertyRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    return await repo.findAllUnits();
  }

  static async createProperty(orgId: string, data: typeof properties.$inferInsert, role: UserRole) {
    authorizeOrThrow(role, "properties:create");
    const repo = new PropertyRepository(
      new TenantContext({ userId: "svc", organizationId: orgId, role, email: "", name: "", isAuthenticated: true })
    );
    const created = await repo.createProperty(data);
    return { success: true, property: created };
  }
}
