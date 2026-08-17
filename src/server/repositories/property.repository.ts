import { BaseRepository } from "./base.repository";
import { db } from "@/db";
import { properties, units } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export class PropertyRepository extends BaseRepository {
  async findAllProperties() {
    return await db
      .select()
      .from(properties)
      .where(this.scopeOrg(properties.organizationId));
  }

  async findPropertyById(id: string) {
    const result = await db
      .select()
      .from(properties)
      .where(and(this.scopeOrg(properties.organizationId), eq(properties.id, id)));
    return result[0] || null;
  }

  async findAllUnits() {
    return await db
      .select()
      .from(units)
      .where(this.scopeOrg(units.organizationId));
  }

  async findUnitsByPropertyId(propertyId: string) {
    return await db
      .select()
      .from(units)
      .where(and(this.scopeOrg(units.organizationId), eq(units.propertyId, propertyId)));
  }

  async findUnitById(id: string) {
    const result = await db
      .select()
      .from(units)
      .where(and(this.scopeOrg(units.organizationId), eq(units.id, id)));
    return result[0] || null;
  }

  async createProperty(data: typeof properties.$inferInsert) {
    const payload = this.attachOrgId(data);
    const result = await db.insert(properties).values(payload).returning();
    return result[0];
  }

  async createUnit(data: typeof units.$inferInsert) {
    const payload = this.attachOrgId(data);
    const result = await db.insert(units).values(payload).returning();
    return result[0];
  }
}
