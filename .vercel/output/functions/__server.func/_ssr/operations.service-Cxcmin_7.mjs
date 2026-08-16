import { c as eq, o as desc } from "../_libs/drizzle-orm.mjs";
import { c as messages, i as expenses, n as db, r as documents, s as maintenanceRequests } from "./auth-hL6tUEyb.mjs";
import { t as authorizeOrThrow } from "./permissions-BwJa66ci.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/operations.service-Cxcmin_7.js
var OperationsService = class {
	static async getMaintenanceRequests(orgId, role) {
		authorizeOrThrow(role, "maintenance:read");
		return await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.organizationId, orgId)).orderBy(desc(maintenanceRequests.createdAt));
	}
	static async getExpenses(orgId, role) {
		authorizeOrThrow(role, "expenses:read");
		return await db.select().from(expenses).where(eq(expenses.organizationId, orgId)).orderBy(desc(expenses.expenseDate));
	}
	static async getDocuments(orgId, role) {
		authorizeOrThrow(role, "properties:read");
		return await db.select().from(documents).where(eq(documents.organizationId, orgId));
	}
	static async getMessages(orgId, role) {
		authorizeOrThrow(role, "properties:read");
		return await db.select().from(messages).where(eq(messages.organizationId, orgId));
	}
};
//#endregion
export { OperationsService as t };
