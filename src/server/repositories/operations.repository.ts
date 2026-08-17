import { BaseRepository } from "./base.repository";
import { db } from "@/db";
import { maintenanceRequests, expenses, documents, messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export class OperationsRepository extends BaseRepository {
  async findAllMaintenanceRequests() {
    return await db
      .select()
      .from(maintenanceRequests)
      .where(this.scopeOrg(maintenanceRequests.organizationId));
  }

  async findAllExpenses() {
    return await db
      .select()
      .from(expenses)
      .where(this.scopeOrg(expenses.organizationId));
  }

  async findAllDocuments() {
    return await db
      .select()
      .from(documents)
      .where(this.scopeOrg(documents.organizationId));
  }

  async findAllMessages() {
    return await db
      .select()
      .from(messages)
      .where(this.scopeOrg(messages.organizationId));
  }

  async createMaintenanceRequest(data: typeof maintenanceRequests.$inferInsert) {
    const payload = this.attachOrgId(data);
    const result = await db.insert(maintenanceRequests).values(payload).returning();
    return result[0];
  }

  async createExpense(data: typeof expenses.$inferInsert) {
    const payload = this.attachOrgId(data);
    const result = await db.insert(expenses).values(payload).returning();
    return result[0];
  }
}
