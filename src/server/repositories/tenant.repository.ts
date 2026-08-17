import { BaseRepository } from "./base.repository";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export class TenantRepository extends BaseRepository {
  async findAllTenants() {
    return await db
      .select()
      .from(tenants)
      .where(this.scopeOrg(tenants.organizationId));
  }

  async findTenantById(id: string) {
    const result = await db
      .select()
      .from(tenants)
      .where(and(this.scopeOrg(tenants.organizationId), eq(tenants.id, id)));
    return result[0] || null;
  }

  async createTenant(data: typeof tenants.$inferInsert) {
    const payload = this.attachOrgId(data);
    const result = await db.insert(tenants).values(payload).returning();
    return result[0];
  }

  async deleteTenant(id: string) {
    const result = await db
      .delete(tenants)
      .where(and(this.scopeOrg(tenants.organizationId), eq(tenants.id, id)))
      .returning();
    return result[0] || null;
  }
}
