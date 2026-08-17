import { BaseRepository } from "./base.repository";
import { db } from "@/db";
import { leases } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export class LeaseRepository extends BaseRepository {
  async findAllLeases() {
    return await db
      .select()
      .from(leases)
      .where(this.scopeOrg(leases.organizationId));
  }

  async findLeaseById(id: string) {
    const result = await db
      .select()
      .from(leases)
      .where(and(this.scopeOrg(leases.organizationId), eq(leases.id, id)));
    return result[0] || null;
  }

  async findLeasesByTenantId(tenantId: string) {
    return await db
      .select()
      .from(leases)
      .where(and(this.scopeOrg(leases.organizationId), eq(leases.tenantId, tenantId)));
  }

  async createLease(data: typeof leases.$inferInsert) {
    const payload = this.attachOrgId(data);
    const result = await db.insert(leases).values(payload).returning();
    return result[0];
  }
}
