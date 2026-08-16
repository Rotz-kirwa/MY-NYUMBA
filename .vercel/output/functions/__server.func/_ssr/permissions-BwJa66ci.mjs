//#region node_modules/.nitro/vite/services/ssr/assets/permissions-BwJa66ci.js
var ROLE_PERMISSIONS = {
	OWNER: [
		"properties:read",
		"properties:create",
		"properties:update",
		"properties:delete",
		"tenants:read",
		"tenants:create",
		"tenants:update",
		"leases:read",
		"leases:create",
		"leases:update",
		"payments:read",
		"payments:create",
		"payments:reverse",
		"expenses:read",
		"expenses:create",
		"maintenance:read",
		"maintenance:update",
		"reports:read",
		"settings:manage",
		"users:manage"
	],
	ADMIN: [
		"properties:read",
		"properties:create",
		"properties:update",
		"tenants:read",
		"tenants:create",
		"tenants:update",
		"leases:read",
		"leases:create",
		"leases:update",
		"payments:read",
		"payments:create",
		"payments:reverse",
		"expenses:read",
		"expenses:create",
		"maintenance:read",
		"maintenance:update",
		"reports:read",
		"settings:manage",
		"users:manage"
	],
	PROPERTY_MANAGER: [
		"properties:read",
		"properties:create",
		"properties:update",
		"tenants:read",
		"tenants:create",
		"tenants:update",
		"leases:read",
		"leases:create",
		"leases:update",
		"payments:read",
		"payments:create",
		"expenses:read",
		"expenses:create",
		"maintenance:read",
		"maintenance:update",
		"reports:read"
	],
	ACCOUNTANT: [
		"properties:read",
		"tenants:read",
		"leases:read",
		"payments:read",
		"payments:create",
		"payments:reverse",
		"expenses:read",
		"expenses:create",
		"reports:read"
	],
	AGENT: [
		"properties:read",
		"tenants:read",
		"tenants:create",
		"leases:read",
		"leases:create"
	],
	MAINTENANCE: [
		"properties:read",
		"maintenance:read",
		"maintenance:update",
		"expenses:read",
		"expenses:create"
	],
	VIEWER: [
		"properties:read",
		"tenants:read",
		"leases:read",
		"payments:read",
		"expenses:read",
		"maintenance:read",
		"reports:read"
	],
	TENANT: [
		"properties:read",
		"leases:read",
		"payments:read",
		"maintenance:read"
	]
};
function hasPermission(role, action) {
	return (ROLE_PERMISSIONS[role] || []).includes(action);
}
function authorizeOrThrow(role, action) {
	if (!hasPermission(role, action)) throw new Error(`Unauthorized: Role '${role}' lacks permission for action '${action}'`);
}
//#endregion
export { authorizeOrThrow as t };
