import { a as integer, i as real, n as sqliteTable, r as text, t as drizzle } from "../_libs/drizzle-orm.mjs";
import { t as createClient } from "../_libs/@libsql/client.mjs";
import path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions-C-Pc6kCi.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var schema_exports = /* @__PURE__ */ __exportAll({
	auditLogs: () => auditLogs,
	documents: () => documents,
	expenses: () => expenses,
	leases: () => leases,
	maintenanceRequests: () => maintenanceRequests,
	messages: () => messages,
	organizations: () => organizations,
	paymentAllocations: () => paymentAllocations,
	payments: () => payments,
	properties: () => properties,
	rentCharges: () => rentCharges,
	tenants: () => tenants,
	units: () => units,
	users: () => users
});
var organizations = sqliteTable("organizations", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	email: text("email").notNull(),
	phone: text("phone").notNull(),
	logo: text("logo"),
	currency: text("currency").notNull().default("KES"),
	timezone: text("timezone").notNull().default("Africa/Nairobi"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var users = sqliteTable("users", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull(),
	passwordHash: text("password_hash").notNull(),
	role: text("role").notNull().default("PROPERTY_MANAGER"),
	status: text("status").notNull().default("ACTIVE"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var properties = sqliteTable("properties", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	name: text("name").notNull(),
	propertyCode: text("property_code").notNull(),
	area: text("area").notNull(),
	tier: text("tier").notNull().default("Mid"),
	totalUnits: integer("total_units").notNull().default(0),
	occupiedUnits: integer("occupied_units").notNull().default(0),
	caretakerName: text("caretaker_name").notNull(),
	caretakerPhone: text("caretaker_phone").notNull(),
	yearBuilt: integer("year_built").notNull(),
	status: text("status").notNull().default("ACTIVE"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var units = sqliteTable("units", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	propertyId: text("property_id").notNull().references(() => properties.id),
	unitNumber: text("unit_number").notNull(),
	type: text("type").notNull(),
	monthlyRent: real("monthly_rent").notNull(),
	serviceCharge: real("service_charge").notNull().default(0),
	depositAmount: real("deposit_amount").notNull().default(0),
	status: text("status").notNull().default("Vacant"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var tenants = sqliteTable("tenants", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	fullName: text("full_name").notNull(),
	phone: text("phone").notNull(),
	email: text("email").notNull(),
	nationalId: text("national_id").notNull(),
	emergencyContact: text("emergency_contact"),
	score: integer("score").notNull().default(100),
	status: text("status").notNull().default("Active"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var leases = sqliteTable("leases", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	propertyId: text("property_id").notNull().references(() => properties.id),
	unitId: text("unit_id").notNull().references(() => units.id),
	tenantId: text("tenant_id").notNull().references(() => tenants.id),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	monthlyRent: real("monthly_rent").notNull(),
	depositAmount: real("deposit_amount").notNull(),
	billingDay: integer("billing_day").notNull().default(1),
	status: text("status").notNull().default("Active"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var rentCharges = sqliteTable("rent_charges", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	leaseId: text("lease_id").notNull().references(() => leases.id),
	tenantId: text("tenant_id").notNull().references(() => tenants.id),
	unitId: text("unit_id").notNull().references(() => units.id),
	propertyId: text("property_id").notNull().references(() => properties.id),
	billingPeriod: text("billing_period").notNull(),
	dueDate: text("due_date").notNull(),
	rentAmount: real("rent_amount").notNull(),
	serviceCharge: real("service_charge").notNull().default(0),
	totalAmount: real("total_amount").notNull(),
	amountPaid: real("amount_paid").notNull().default(0),
	balance: real("balance").notNull(),
	status: text("status").notNull().default("PENDING"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var payments = sqliteTable("payments", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	tenantId: text("tenant_id").notNull().references(() => tenants.id),
	leaseId: text("lease_id").notNull().references(() => leases.id),
	unitId: text("unit_id").notNull().references(() => units.id),
	propertyId: text("property_id").notNull().references(() => properties.id),
	amount: real("amount").notNull(),
	paymentMethod: text("payment_method").notNull(),
	transactionReference: text("transaction_reference").notNull().unique(),
	transactionDate: text("transaction_date").notNull(),
	status: text("status").notNull().default("COMPLETED"),
	notes: text("notes"),
	createdBy: text("created_by").notNull(),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var paymentAllocations = sqliteTable("payment_allocations", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	paymentId: text("payment_id").notNull().references(() => payments.id),
	rentChargeId: text("rent_charge_id").notNull().references(() => rentCharges.id),
	allocatedAmount: real("allocated_amount").notNull(),
	allocatedAt: text("allocated_at").notNull(),
	notes: text("notes")
});
var maintenanceRequests = sqliteTable("maintenance_requests", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	propertyId: text("property_id").notNull().references(() => properties.id),
	unitId: text("unit_id"),
	referenceNumber: text("reference_number").notNull(),
	title: text("title").notNull(),
	description: text("description"),
	priority: text("priority").notNull().default("Normal"),
	status: text("status").notNull().default("Open"),
	raisedBy: text("raised_by").notNull(),
	assignedVendor: text("assigned_vendor"),
	estimatedCost: real("estimated_cost"),
	actualCost: real("actual_cost"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var expenses = sqliteTable("expenses", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	propertyId: text("property_id").notNull().references(() => properties.id),
	vendorName: text("vendor_name").notNull(),
	category: text("category").notNull(),
	amount: real("amount").notNull(),
	expenseDate: text("expense_date").notNull(),
	status: text("status").notNull().default("Paid"),
	notes: text("notes"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull()
});
var documents = sqliteTable("documents", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	name: text("name").notNull(),
	kind: text("kind").notNull(),
	linkedEntity: text("linked_entity").notNull(),
	fileSize: text("file_size").notNull(),
	fileUrl: text("file_url").notNull(),
	uploadedAt: text("uploaded_at").notNull()
});
var messages = sqliteTable("messages", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	senderName: text("sender_name").notNull(),
	unitLabel: text("unit_label").notNull(),
	preview: text("preview").notNull(),
	channel: text("channel").notNull(),
	unread: integer("unread").notNull().default(1),
	createdAt: text("created_at").notNull()
});
var auditLogs = sqliteTable("audit_logs", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	userId: text("user_id").notNull(),
	action: text("action").notNull(),
	entityType: text("entity_type").notNull(),
	entityId: text("entity_id").notNull(),
	metadataJson: text("metadata_json"),
	createdAt: text("created_at").notNull()
});
function getDatabaseUrl() {
	const envUrl = process.env.DATABASE_URL;
	if (envUrl && !envUrl.startsWith("file:")) return envUrl;
	if (Boolean(process.env.VERCEL) || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) || Boolean(process.env.NETLIFY)) return "file:/tmp/mynyumba.db";
	const fileName = envUrl ? envUrl.replace(/^file:/, "") : "mynyumba.db";
	return `file:${path.resolve(process.cwd(), fileName)}`;
}
var isBrowser = typeof window !== "undefined";
var dbUrl = isBrowser ? "file::memory:" : getDatabaseUrl();
var dummyClient = {
	execute: async () => ({
		rows: [],
		columns: [],
		columnTypes: [],
		rowsAffected: 0
	}),
	executeMultiple: async () => {},
	transaction: async () => ({}),
	close: () => {}
};
function initClient() {
	if (isBrowser) return dummyClient;
	try {
		if (dbUrl.startsWith("http:") || dbUrl.startsWith("https:") || dbUrl.startsWith("libsql:") || dbUrl.startsWith("ws:") || dbUrl.startsWith("wss:")) return createClient({ url: dbUrl });
	} catch (err) {
		console.warn("Database client initialization warning, using dummy client:", err);
	}
	return dummyClient;
}
var db = drizzle(initClient(), { schema: schema_exports });
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
export { leases as a, paymentAllocations as c, rentCharges as d, tenants as f, expenses as i, payments as l, db as n, maintenanceRequests as o, units as p, documents as r, messages as s, authorizeOrThrow as t, properties as u };
