import { a as eq, i as and } from "../_libs/drizzle-orm+postgres.mjs";
import { a as leases, f as tenants, n as db, t as authorizeOrThrow } from "./permissions-Cp9twb3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenant.service-LdVKdSUV.js
var TenantService = class {
	static async getAllTenants(orgId, role) {
		authorizeOrThrow(role, "tenants:read");
		return await db.select().from(tenants).where(eq(tenants.organizationId, orgId));
	}
	static async getTenantById(orgId, tenantId, role) {
		authorizeOrThrow(role, "tenants:read");
		const [tenant] = await db.select().from(tenants).where(and(eq(tenants.organizationId, orgId), eq(tenants.id, tenantId)));
		return tenant || null;
	}
	static async getAllLeases(orgId, role) {
		authorizeOrThrow(role, "leases:read");
		return await db.select().from(leases).where(eq(leases.organizationId, orgId));
	}
};
//#endregion
export { TenantService as t };
