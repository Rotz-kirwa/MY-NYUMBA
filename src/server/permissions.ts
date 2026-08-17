export type UserRole =
  | "OWNER"
  | "ADMIN"
  | "PROPERTY_MANAGER"
  | "ACCOUNTANT"
  | "AGENT"
  | "MAINTENANCE"
  | "VIEWER"
  | "TENANT";

export type PermissionAction =
  | "properties:read"
  | "properties:create"
  | "properties:update"
  | "properties:delete"
  | "tenants:read"
  | "tenants:create"
  | "tenants:update"
  | "tenants:delete"
  | "leases:read"
  | "leases:create"
  | "leases:update"
  | "payments:read"
  | "payments:create"
  | "payments:reverse"
  | "expenses:read"
  | "expenses:create"
  | "maintenance:read"
  | "maintenance:update"
  | "reports:read"
  | "settings:manage"
  | "users:manage";

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  OWNER: [
    "properties:read", "properties:create", "properties:update", "properties:delete",
    "tenants:read", "tenants:create", "tenants:update", "tenants:delete",
    "leases:read", "leases:create", "leases:update",
    "payments:read", "payments:create", "payments:reverse",
    "expenses:read", "expenses:create",
    "maintenance:read", "maintenance:update",
    "reports:read", "settings:manage", "users:manage",
  ],
  ADMIN: [
    "properties:read", "properties:create", "properties:update",
    "tenants:read", "tenants:create", "tenants:update", "tenants:delete",
    "leases:read", "leases:create", "leases:update",
    "payments:read", "payments:create", "payments:reverse",
    "expenses:read", "expenses:create",
    "maintenance:read", "maintenance:update",
    "reports:read", "settings:manage", "users:manage",
  ],
  PROPERTY_MANAGER: [
    "properties:read", "properties:create", "properties:update",
    "tenants:read", "tenants:create", "tenants:update", "tenants:delete",
    "leases:read", "leases:create", "leases:update",
    "payments:read", "payments:create",
    "expenses:read", "expenses:create",
    "maintenance:read", "maintenance:update",
    "reports:read",
  ],
  ACCOUNTANT: [
    "properties:read",
    "tenants:read",
    "leases:read",
    "payments:read", "payments:create", "payments:reverse",
    "expenses:read", "expenses:create",
    "reports:read",
  ],
  AGENT: [
    "properties:read",
    "tenants:read", "tenants:create",
    "leases:read", "leases:create",
  ],
  MAINTENANCE: [
    "properties:read",
    "maintenance:read", "maintenance:update",
    "expenses:read", "expenses:create",
  ],
  VIEWER: [
    "properties:read",
    "tenants:read",
    "leases:read",
    "payments:read",
    "expenses:read",
    "maintenance:read",
    "reports:read",
  ],
  TENANT: [
    "properties:read",
    "leases:read",
    "payments:read",
    "maintenance:read",
  ],
};

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(action);
}

export function authorizeOrThrow(role: UserRole, action: PermissionAction): void {
  if (!hasPermission(role, action)) {
    throw new Error(`Unauthorized: Role '${role}' lacks permission for action '${action}'`);
  }
}
