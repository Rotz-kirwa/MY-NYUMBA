import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { authorizeOrThrow, type UserRole } from "../permissions";

export class PropertyService {
  static async getAllProperties(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    return await db.select().from(s.properties).where(eq(s.properties.organizationId, orgId));
  }

  static async getPropertyById(orgId: string, propertyId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    const [prop] = await db
      .select()
      .from(s.properties)
      .where(and(eq(s.properties.organizationId, orgId), eq(s.properties.id, propertyId)));
    return prop || null;
  }

  static async getAllUnits(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    return await db.select().from(s.units).where(eq(s.units.organizationId, orgId));
  }

  static async createProperty(orgId: string, data: typeof s.properties.$inferInsert, role: UserRole) {
    authorizeOrThrow(role, "properties:create");
    await db.insert(s.properties).values({ ...data, organizationId: orgId });
    return { success: true };
  }
}
