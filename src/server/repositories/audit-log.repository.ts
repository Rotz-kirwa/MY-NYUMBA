import { BaseRepository } from "./base.repository";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export class AuditLogRepository extends BaseRepository {
  async logAction(input: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadataJson?: Record<string, any>;
  }) {
    const payload = this.attachOrgId({
      id: `audit_${Math.random().toString(36).substring(2, 9)}`,
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadataJson: input.metadataJson ? JSON.stringify(input.metadataJson) : null,
      createdAt: new Date().toISOString(),
    });

    const result = await db.insert(auditLogs).values(payload).returning();
    return result[0];
  }

  async findAllAuditLogs() {
    return await db
      .select()
      .from(auditLogs)
      .where(this.scopeOrg(auditLogs.organizationId));
  }
}
