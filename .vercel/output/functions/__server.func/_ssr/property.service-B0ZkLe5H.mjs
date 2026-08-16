import { a as eq, i as and } from "../_libs/drizzle-orm+postgres.mjs";
import { n as db, p as units, t as authorizeOrThrow, u as properties } from "./permissions-Cic7R_qN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/property.service-B0ZkLe5H.js
var PropertyService = class {
	static async getAllProperties(orgId, role) {
		authorizeOrThrow(role, "properties:read");
		return await db.select().from(properties).where(eq(properties.organizationId, orgId));
	}
	static async getPropertyById(orgId, propertyId, role) {
		authorizeOrThrow(role, "properties:read");
		const [prop] = await db.select().from(properties).where(and(eq(properties.organizationId, orgId), eq(properties.id, propertyId)));
		return prop || null;
	}
	static async getAllUnits(orgId, role) {
		authorizeOrThrow(role, "properties:read");
		return await db.select().from(units).where(eq(units.organizationId, orgId));
	}
	static async createProperty(orgId, data, role) {
		authorizeOrThrow(role, "properties:create");
		await db.insert(properties).values({
			...data,
			organizationId: orgId
		});
		return { success: true };
	}
};
//#endregion
export { PropertyService as t };
