import { c as eq, s as and } from "../_libs/drizzle-orm.mjs";
import { d as properties, h as units, n as db } from "./auth-UPPOjy5n.mjs";
import { t as authorizeOrThrow } from "./permissions-BwJa66ci.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/property.service-Cb-0wOJ1.js
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
