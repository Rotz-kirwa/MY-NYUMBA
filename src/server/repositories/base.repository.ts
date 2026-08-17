import { eq, and, SQL } from "drizzle-orm";
import { db } from "@/db";
import { TenantContext } from "@/server/auth/tenant-context";

export abstract class BaseRepository {
  protected readonly tenantCtx: TenantContext;

  constructor(tenantCtx: TenantContext) {
    this.tenantCtx = tenantCtx;
  }

  protected get orgId(): string {
    return this.tenantCtx.organizationId;
  }

  /**
   * Enforces organisation ID condition on a Drizzle column.
   */
  protected scopeOrg(orgIdColumn: any): SQL {
    return eq(orgIdColumn, this.orgId);
  }

  /**
   * Combines an optional sub-condition with the mandatory organisation ID filter.
   */
  protected withOrgScope(orgIdColumn: any, additionalCondition?: SQL): SQL {
    if (additionalCondition) {
      return and(eq(orgIdColumn, this.orgId), additionalCondition)!;
    }
    return eq(orgIdColumn, this.orgId);
  }

  /**
   * Injects the tenant organization ID into any insert payload.
   */
  protected attachOrgId<T extends Record<string, any>>(data: T): T & { organizationId: string } {
    return {
      ...data,
      organizationId: this.orgId,
    };
  }
}
