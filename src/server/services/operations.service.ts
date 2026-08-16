import { db } from "@/db";
import * as s from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { authorizeOrThrow, type UserRole } from "../permissions";

export class OperationsService {
  static async getMaintenanceRequests(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "maintenance:read");
    return await db
      .select()
      .from(s.maintenanceRequests)
      .where(eq(s.maintenanceRequests.organizationId, orgId))
      .orderBy(desc(s.maintenanceRequests.createdAt));
  }

  static async getExpenses(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "expenses:read");
    return await db
      .select()
      .from(s.expenses)
      .where(eq(s.expenses.organizationId, orgId))
      .orderBy(desc(s.expenses.expenseDate));
  }

  static async getDocuments(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    return await db
      .select()
      .from(s.documents)
      .where(eq(s.documents.organizationId, orgId));
  }

  static async getMessages(orgId: string, role: UserRole) {
    authorizeOrThrow(role, "properties:read");
    return await db
      .select()
      .from(s.messages)
      .where(eq(s.messages.organizationId, orgId));
  }
}
