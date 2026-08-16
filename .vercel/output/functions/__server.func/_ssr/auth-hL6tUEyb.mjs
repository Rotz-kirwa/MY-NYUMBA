import { i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { a as integer, c as eq, i as real, n as sqliteTable, r as text, t as drizzle } from "../_libs/drizzle-orm.mjs";
import path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-hL6tUEyb.js
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
var clientInstance;
async function getClientInstance() {
	if (isBrowser) return dummyClient;
	if (clientInstance) return clientInstance;
	try {
		if (dbUrl.startsWith("http:") || dbUrl.startsWith("https:") || dbUrl.startsWith("libsql:") || dbUrl.startsWith("ws:") || dbUrl.startsWith("wss:")) {
			const { createClient } = await import("../_libs/@libsql/client.mjs").then((n) => n.t);
			clientInstance = createClient({ url: dbUrl });
		} else {
			const { createClient } = await import("../_libs/@libsql/client.mjs").then((n) => n.r);
			clientInstance = createClient({ url: dbUrl });
		}
	} catch (err) {
		console.warn("Native @libsql/client unavailable, attempting @libsql/client/web or memory fallback:", err);
		try {
			const { createClient } = await import("../_libs/@libsql/client.mjs").then((n) => n.t);
			clientInstance = createClient({ url: "https://fallback.libsql.org" });
		} catch {
			clientInstance = dummyClient;
		}
	}
	return clientInstance;
}
var rawClient = new Proxy({}, { get(_target, prop) {
	return (...args) => {
		return getClientInstance().then((client) => {
			const fn = client[prop];
			if (typeof fn === "function") return fn.apply(client, args);
			return fn;
		});
	};
} });
var db = drizzle(rawClient, { schema: schema_exports });
var isInitPromise;
async function ensureTablesExist() {
	if (isBrowser) return;
	if (!isInitPromise) isInitPromise = (async () => {
		await rawClient.executeMultiple(`
        CREATE TABLE IF NOT EXISTS organizations (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          logo TEXT,
          currency TEXT NOT NULL DEFAULT 'KES',
          timezone TEXT NOT NULL DEFAULT 'Africa/Nairobi',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'PROPERTY_MANAGER',
          status TEXT NOT NULL DEFAULT 'ACTIVE',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS properties (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          name TEXT NOT NULL,
          property_code TEXT NOT NULL,
          area TEXT NOT NULL,
          tier TEXT NOT NULL DEFAULT 'Mid',
          total_units INTEGER NOT NULL DEFAULT 0,
          occupied_units INTEGER NOT NULL DEFAULT 0,
          caretaker_name TEXT NOT NULL,
          caretaker_phone TEXT NOT NULL,
          year_built INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'ACTIVE',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS units (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          unit_number TEXT NOT NULL,
          type TEXT NOT NULL,
          monthly_rent REAL NOT NULL,
          service_charge REAL NOT NULL DEFAULT 0,
          deposit_amount REAL NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'Vacant',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tenants (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          national_id TEXT NOT NULL,
          emergency_contact TEXT,
          score INTEGER NOT NULL DEFAULT 100,
          status TEXT NOT NULL DEFAULT 'Active',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS leases (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          unit_id TEXT NOT NULL,
          tenant_id TEXT NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          monthly_rent REAL NOT NULL,
          deposit_amount REAL NOT NULL,
          billing_day INTEGER NOT NULL DEFAULT 1,
          status TEXT NOT NULL DEFAULT 'Active',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS rent_charges (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          lease_id TEXT NOT NULL,
          tenant_id TEXT NOT NULL,
          unit_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          billing_period TEXT NOT NULL,
          due_date TEXT NOT NULL,
          rent_amount REAL NOT NULL,
          service_charge REAL NOT NULL DEFAULT 0,
          total_amount REAL NOT NULL,
          amount_paid REAL NOT NULL DEFAULT 0,
          balance REAL NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          tenant_id TEXT NOT NULL,
          lease_id TEXT NOT NULL,
          unit_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          amount REAL NOT NULL,
          payment_method TEXT NOT NULL,
          transaction_reference TEXT NOT NULL UNIQUE,
          transaction_date TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'COMPLETED',
          notes TEXT,
          created_by TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS payment_allocations (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          payment_id TEXT NOT NULL,
          rent_charge_id TEXT NOT NULL,
          allocated_amount REAL NOT NULL,
          allocated_at TEXT NOT NULL,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS maintenance_requests (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          unit_id TEXT,
          reference_number TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          priority TEXT NOT NULL DEFAULT 'Normal',
          status TEXT NOT NULL DEFAULT 'Open',
          raised_by TEXT NOT NULL,
          assigned_vendor TEXT,
          estimated_cost REAL,
          actual_cost REAL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          property_id TEXT NOT NULL,
          vendor_name TEXT NOT NULL,
          category TEXT NOT NULL,
          amount REAL NOT NULL,
          expense_date TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Paid',
          notes TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS documents (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          name TEXT NOT NULL,
          kind TEXT NOT NULL,
          linked_entity TEXT NOT NULL,
          file_size TEXT NOT NULL,
          file_url TEXT NOT NULL,
          uploaded_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          unit_label TEXT NOT NULL,
          preview TEXT NOT NULL,
          channel TEXT NOT NULL,
          unread INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY,
          organization_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          metadata_json TEXT,
          created_at TEXT NOT NULL
        );
      `);
		const { seedDatabase } = await Promise.resolve().then(() => seed_exports);
		await seedDatabase();
	})();
	return isInitPromise;
}
var seed_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_ORG_ID: () => DEFAULT_ORG_ID,
	seedDatabase: () => seedDatabase
});
var DEFAULT_ORG_ID = "org_mynyumba_nairobi";
async function seedDatabase() {
	if (typeof window !== "undefined") return;
	await ensureTablesExist();
	const [existingOrg] = await db.select().from(organizations).where(eq(organizations.id, DEFAULT_ORG_ID));
	if (existingOrg) return;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await db.insert(organizations).values({
		id: DEFAULT_ORG_ID,
		name: "My Nyumba Properties Ltd",
		slug: "my-nyumba-nairobi",
		email: "management@mynyumba.co.ke",
		phone: "+254 700 000 000",
		currency: "KES",
		timezone: "Africa/Nairobi",
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	await db.insert(users).values({
		id: "usr_wanjiru",
		organizationId: DEFAULT_ORG_ID,
		name: "Wanjiru Kimani",
		email: "wanjiru@mynyumba.co.ke",
		phone: "+254 712 345 678",
		passwordHash: "pbkdf2_hashed_secret",
		role: "OWNER",
		status: "ACTIVE",
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const p of [
		{
			id: "kilimani-heights",
			name: "Kilimani Heights",
			code: "KH-01",
			area: "Kilimani",
			tier: "Mid",
			totalUnits: 24,
			occupiedUnits: 22,
			caretakerName: "Joseph Mwangi",
			caretakerPhone: "+254 712 884 210",
			yearBuilt: 2016
		},
		{
			id: "lavington-green",
			name: "Lavington Green Residences",
			code: "LG-02",
			area: "Lavington",
			tier: "Premium",
			totalUnits: 12,
			occupiedUnits: 11,
			caretakerName: "Agnes Wairimu",
			caretakerPhone: "+254 733 402 918",
			yearBuilt: 2019
		},
		{
			id: "riverside-court",
			name: "Riverside Court Apartments",
			code: "RC-03",
			area: "Westlands",
			tier: "Premium",
			totalUnits: 18,
			occupiedUnits: 16,
			caretakerName: "Peter Ochieng",
			caretakerPhone: "+254 720 118 673",
			yearBuilt: 2014
		},
		{
			id: "kileleshwa-mews",
			name: "Kileleshwa Mews",
			code: "KM-04",
			area: "Kileleshwa",
			tier: "Mid",
			totalUnits: 16,
			occupiedUnits: 15,
			caretakerName: "Halima Abdi",
			caretakerPhone: "+254 726 550 341",
			yearBuilt: 2018
		},
		{
			id: "south-b-villas",
			name: "South B Garden Villas",
			code: "SB-05",
			area: "South B",
			tier: "Standard",
			totalUnits: 20,
			occupiedUnits: 18,
			caretakerName: "Samuel Kiptoo",
			caretakerPhone: "+254 715 903 226",
			yearBuilt: 2011
		},
		{
			id: "ruaka-skyline",
			name: "Ruaka Skyline Towers",
			code: "RS-06",
			area: "Ruaka",
			tier: "Standard",
			totalUnits: 32,
			occupiedUnits: 27,
			caretakerName: "Grace Njeri",
			caretakerPhone: "+254 701 447 802",
			yearBuilt: 2021
		},
		{
			id: "karen-oaks",
			name: "Karen Oaks Townhouses",
			code: "KO-07",
			area: "Karen",
			tier: "Premium",
			totalUnits: 8,
			occupiedUnits: 8,
			caretakerName: "David Muriuki",
			caretakerPhone: "+254 738 271 095",
			yearBuilt: 2020
		}
	]) await db.insert(properties).values({
		id: p.id,
		organizationId: DEFAULT_ORG_ID,
		name: p.name,
		propertyCode: p.code,
		area: p.area,
		tier: p.tier,
		totalUnits: p.totalUnits,
		occupiedUnits: p.occupiedUnits,
		caretakerName: p.caretakerName,
		caretakerPhone: p.caretakerPhone,
		yearBuilt: p.yearBuilt,
		status: "ACTIVE",
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const u of [
		{
			id: "u1",
			propertyId: "kilimani-heights",
			unitNumber: "A4",
			type: "1 Bed",
			rent: 47e3,
			status: "Occupied"
		},
		{
			id: "u2",
			propertyId: "kilimani-heights",
			unitNumber: "A5",
			type: "1 Bed",
			rent: 47e3,
			status: "Vacant"
		},
		{
			id: "u3",
			propertyId: "kilimani-heights",
			unitNumber: "B2",
			type: "2 Bed",
			rent: 68e3,
			status: "Occupied"
		},
		{
			id: "u4",
			propertyId: "kilimani-heights",
			unitNumber: "B7",
			type: "2 Bed",
			rent: 68e3,
			status: "Notice"
		},
		{
			id: "u5",
			propertyId: "lavington-green",
			unitNumber: "L1",
			type: "3 Bed",
			rent: 155e3,
			status: "Occupied"
		},
		{
			id: "u6",
			propertyId: "lavington-green",
			unitNumber: "L4",
			type: "3 Bed",
			rent: 148e3,
			status: "Occupied"
		},
		{
			id: "u7",
			propertyId: "riverside-court",
			unitNumber: "R2",
			type: "2 Bed",
			rent: 92e3,
			status: "Occupied"
		},
		{
			id: "u8",
			propertyId: "riverside-court",
			unitNumber: "R9",
			type: "2 Bed",
			rent: 92e3,
			status: "Under repair"
		},
		{
			id: "u9",
			propertyId: "kileleshwa-mews",
			unitNumber: "K3",
			type: "2 Bed",
			rent: 74e3,
			status: "Occupied"
		},
		{
			id: "u10",
			propertyId: "south-b-villas",
			unitNumber: "S12",
			type: "Studio",
			rent: 26e3,
			status: "Occupied"
		},
		{
			id: "u11",
			propertyId: "ruaka-skyline",
			unitNumber: "T18",
			type: "1 Bed",
			rent: 32e3,
			status: "Vacant"
		},
		{
			id: "u12",
			propertyId: "karen-oaks",
			unitNumber: "O2",
			type: "4 Bed Maisonette",
			rent: 21e4,
			status: "Occupied"
		}
	]) await db.insert(units).values({
		id: u.id,
		organizationId: DEFAULT_ORG_ID,
		propertyId: u.propertyId,
		unitNumber: u.unitNumber,
		type: u.type,
		monthlyRent: u.rent,
		depositAmount: u.rent * 2,
		status: u.status,
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const t of [
		{
			id: "t1",
			name: "Brian Otieno",
			phone: "+254 712 445 908",
			email: "brian.otieno@gmail.com",
			idNo: "32491028",
			score: 97
		},
		{
			id: "t2",
			name: "Faith Chebet",
			phone: "+254 726 118 340",
			email: "faith.chebet@yahoo.com",
			idNo: "29104829",
			score: 78
		},
		{
			id: "t3",
			name: "Kevin Njoroge",
			phone: "+254 733 902 117",
			email: "kevin.njoroge@outlook.com",
			idNo: "31092837",
			score: 54
		},
		{
			id: "t4",
			name: "Dr. Amina Yusuf",
			phone: "+254 720 664 231",
			email: "amina.yusuf@knh.or.ke",
			idNo: "25492019",
			score: 99
		},
		{
			id: "t5",
			name: "Michael Kariuki",
			phone: "+254 701 338 774",
			email: "mkariuki@lawfirm.co.ke",
			idNo: "28301928",
			score: 61
		},
		{
			id: "t6",
			name: "Sharon Wanjiku",
			phone: "+254 715 220 486",
			email: "sharon.w@designstudio.co.ke",
			idNo: "34910293",
			score: 92
		},
		{
			id: "t7",
			name: "Tabitha Mueni",
			phone: "+254 738 771 049",
			email: "t.mueni@techcorp.co.ke",
			idNo: "30291029",
			score: 95
		},
		{
			id: "t8",
			name: "Dennis Kamau",
			phone: "+254 704 559 812",
			email: "dennis.kamau@fintech.co.ke",
			idNo: "35910284",
			score: 83
		},
		{
			id: "t9",
			name: "Esther Naliaka",
			phone: "+254 729 004 517",
			email: "esther.naliaka@consulting.co.ke",
			idNo: "24910294",
			score: 100
		},
		{
			id: "t10",
			name: "Collins Barasa",
			phone: "+254 717 862 330",
			email: "cbarasa@freelance.com",
			idNo: "33910284",
			score: 71
		}
	]) await db.insert(tenants).values({
		id: t.id,
		organizationId: DEFAULT_ORG_ID,
		fullName: t.name,
		phone: t.phone,
		email: t.email,
		nationalId: t.idNo,
		score: t.score,
		status: "Active",
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const l of [
		{
			id: "l1",
			tenantId: "t1",
			unitId: "u1",
			propertyId: "kilimani-heights",
			start: "2023-03-01",
			end: "2027-02-28",
			rent: 47e3,
			deposit: 94e3,
			status: "Active"
		},
		{
			id: "l2",
			tenantId: "t2",
			unitId: "u3",
			propertyId: "kilimani-heights",
			start: "2022-08-15",
			end: "2026-08-14",
			rent: 68e3,
			deposit: 136e3,
			status: "Expiring"
		},
		{
			id: "l3",
			tenantId: "t4",
			unitId: "u5",
			propertyId: "lavington-green",
			start: "2020-02-01",
			end: "2027-01-31",
			rent: 155e3,
			deposit: 31e4,
			status: "Active"
		},
		{
			id: "l4",
			tenantId: "t3",
			unitId: "u4",
			propertyId: "kilimani-heights",
			start: "2021-11-01",
			end: "2026-10-31",
			rent: 68e3,
			deposit: 136e3,
			status: "Expiring"
		},
		{
			id: "l5",
			tenantId: "t9",
			unitId: "u12",
			propertyId: "karen-oaks",
			start: "2019-04-01",
			end: "2027-03-31",
			rent: 21e4,
			deposit: 42e4,
			status: "Active"
		},
		{
			id: "l6",
			tenantId: "t8",
			unitId: "u10",
			propertyId: "south-b-villas",
			start: "2024-07-01",
			end: "2026-06-30",
			rent: 26e3,
			deposit: 52e3,
			status: "Ended"
		}
	]) await db.insert(leases).values({
		id: l.id,
		organizationId: DEFAULT_ORG_ID,
		propertyId: l.propertyId,
		unitId: l.unitId,
		tenantId: l.tenantId,
		startDate: l.start,
		endDate: l.end,
		monthlyRent: l.rent,
		depositAmount: l.deposit,
		status: l.status,
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const p of [
		{
			id: "p1",
			ref: "TFR3K9X2LM",
			tenantId: "t1",
			leaseId: "l1",
			unitId: "u1",
			propertyId: "kilimani-heights",
			amount: 47e3,
			expected: 47e3,
			date: "2026-08-03",
			channel: "MPESA",
			status: "paid"
		},
		{
			id: "p2",
			ref: "TH8B4Q7WPD",
			tenantId: "t2",
			leaseId: "l2",
			unitId: "u3",
			propertyId: "kilimani-heights",
			amount: 34e3,
			expected: 68e3,
			date: "2026-08-05",
			channel: "MPESA",
			status: "partial"
		},
		{
			id: "p3",
			ref: "TG2M6R1YKV",
			tenantId: "t4",
			leaseId: "l3",
			unitId: "u5",
			propertyId: "lavington-green",
			amount: 155e3,
			expected: 155e3,
			date: "2026-08-01",
			channel: "BANK_TRANSFER",
			status: "paid"
		},
		{
			id: "p4",
			ref: "TJ5N8Z3QCB",
			tenantId: "t6",
			leaseId: "l3",
			unitId: "u7",
			propertyId: "riverside-court",
			amount: 92e3,
			expected: 92e3,
			date: "2026-08-02",
			channel: "MPESA",
			status: "paid"
		},
		{
			id: "p5",
			ref: "TK9P2V6HRX",
			tenantId: "t7",
			leaseId: "l3",
			unitId: "u9",
			propertyId: "kileleshwa-mews",
			amount: 74e3,
			expected: 74e3,
			date: "2026-08-04",
			channel: "MPESA",
			status: "paid"
		},
		{
			id: "p6",
			ref: "TL4D7C5JNS",
			tenantId: "t10",
			leaseId: "l6",
			unitId: "u11",
			propertyId: "ruaka-skyline",
			amount: 16e3,
			expected: 32e3,
			date: "2026-08-09",
			channel: "MPESA",
			status: "partial"
		},
		{
			id: "p7",
			ref: "TM7X1F8GTQ",
			tenantId: "t9",
			leaseId: "l5",
			unitId: "u12",
			propertyId: "karen-oaks",
			amount: 21e4,
			expected: 21e4,
			date: "2026-08-01",
			channel: "BANK_TRANSFER",
			status: "paid"
		}
	]) {
		const chargeId = `rc_${p.id}`;
		await db.insert(rentCharges).values({
			id: chargeId,
			organizationId: DEFAULT_ORG_ID,
			leaseId: p.leaseId,
			tenantId: p.tenantId,
			unitId: p.unitId,
			propertyId: p.propertyId,
			billingPeriod: "2026-08",
			dueDate: "2026-08-05",
			rentAmount: p.expected,
			totalAmount: p.expected,
			amountPaid: p.amount,
			balance: p.expected - p.amount,
			status: p.status === "paid" ? "PAID" : p.amount > 0 ? "PARTIALLY_PAID" : "OVERDUE",
			createdAt: now,
			updatedAt: now
		}).onConflictDoNothing();
		await db.insert(payments).values({
			id: p.id,
			organizationId: DEFAULT_ORG_ID,
			tenantId: p.tenantId,
			leaseId: p.leaseId,
			unitId: p.unitId,
			propertyId: p.propertyId,
			amount: p.amount,
			paymentMethod: p.channel,
			transactionReference: p.ref,
			transactionDate: p.date,
			status: "COMPLETED",
			createdBy: "usr_wanjiru",
			createdAt: now,
			updatedAt: now
		}).onConflictDoNothing();
		await db.insert(paymentAllocations).values({
			id: `alloc_${p.id}`,
			organizationId: DEFAULT_ORG_ID,
			paymentId: p.id,
			rentChargeId: chargeId,
			allocatedAmount: p.amount,
			allocatedAt: p.date
		}).onConflictDoNothing();
	}
	for (const t of [
		{
			id: "m1",
			ref: "MNT-1042",
			title: "Borehole pump tripping at night",
			propertyId: "ruaka-skyline",
			unitId: "u11",
			raisedBy: "Grace Njeri",
			priority: "Urgent",
			status: "In progress",
			vendor: "Maji Works Ltd",
			cost: 42e3
		},
		{
			id: "m2",
			ref: "MNT-1041",
			title: "Kitchen sink blocked",
			propertyId: "kilimani-heights",
			unitId: "u3",
			raisedBy: "Faith Chebet",
			priority: "Normal",
			status: "Assigned",
			vendor: "Ndegwa Plumbing",
			cost: 8500
		},
		{
			id: "m3",
			ref: "MNT-1039",
			title: "Lift service overdue",
			propertyId: "riverside-court",
			unitId: "u7",
			raisedBy: "Peter Ochieng",
			priority: "Urgent",
			status: "Open",
			vendor: "Schindler Kenya"
		},
		{
			id: "m4",
			ref: "MNT-1037",
			title: "Repaint after vacancy",
			propertyId: "kilimani-heights",
			unitId: "u2",
			raisedBy: "Joseph Mwangi",
			priority: "Low",
			status: "Resolved",
			vendor: "Rangi Bora Painters",
			cost: 18500
		},
		{
			id: "m5",
			ref: "MNT-1035",
			title: "Gate motor replacement",
			propertyId: "kileleshwa-mews",
			unitId: "u9",
			raisedBy: "Halima Abdi",
			priority: "Normal",
			status: "Resolved",
			vendor: "SecureGate Kenya",
			cost: 63e3
		}
	]) await db.insert(maintenanceRequests).values({
		id: t.id,
		organizationId: DEFAULT_ORG_ID,
		propertyId: t.propertyId,
		unitId: t.unitId,
		referenceNumber: t.ref,
		title: t.title,
		priority: t.priority,
		status: t.status,
		raisedBy: t.raisedBy,
		assignedVendor: t.vendor,
		actualCost: t.cost,
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const e of [
		{
			id: "e1",
			date: "2026-08-10",
			vendor: "Nairobi Water & Sewerage",
			category: "Water",
			propertyId: "kilimani-heights",
			amount: 84300,
			status: "Paid"
		},
		{
			id: "e2",
			date: "2026-08-08",
			vendor: "Kenya Power",
			category: "Power",
			propertyId: "riverside-court",
			amount: 121500,
			status: "Paid"
		},
		{
			id: "e3",
			date: "2026-08-07",
			vendor: "Lion Guard Security",
			category: "Security",
			propertyId: "lavington-green",
			amount: 96e3,
			status: "Pending"
		},
		{
			id: "e4",
			date: "2026-08-05",
			vendor: "Maji Works Ltd",
			category: "Repairs",
			propertyId: "ruaka-skyline",
			amount: 42e3,
			status: "Pending"
		},
		{
			id: "e5",
			date: "2026-08-03",
			vendor: "Taka Taka Solutions",
			category: "Garbage",
			propertyId: "south-b-villas",
			amount: 18e3,
			status: "Paid"
		},
		{
			id: "e6",
			date: "2026-08-01",
			vendor: "Karen Residents Assoc.",
			category: "Levies",
			propertyId: "karen-oaks",
			amount: 35e3,
			status: "Paid"
		}
	]) await db.insert(expenses).values({
		id: e.id,
		organizationId: DEFAULT_ORG_ID,
		propertyId: e.propertyId,
		vendorName: e.vendor,
		category: e.category,
		amount: e.amount,
		expenseDate: e.date,
		status: e.status,
		createdAt: now,
		updatedAt: now
	}).onConflictDoNothing();
	for (const d of [
		{
			id: "d1",
			name: "Lease — Otieno, Kilimani A4.pdf",
			kind: "Lease",
			linked: "Brian Otieno",
			size: "412 KB"
		},
		{
			id: "d2",
			name: "National ID — Chebet.jpg",
			kind: "ID",
			linked: "Faith Chebet",
			size: "1.1 MB"
		},
		{
			id: "d3",
			name: "Kenya Power invoice Aug 2026.pdf",
			kind: "Invoice",
			linked: "Riverside Court",
			size: "88 KB"
		},
		{
			id: "d4",
			name: "Fire compliance certificate 2026.pdf",
			kind: "Compliance",
			linked: "Lavington Green",
			size: "2.4 MB"
		},
		{
			id: "d5",
			name: "Receipt TFR3K9X2LM.pdf",
			kind: "Receipt",
			linked: "Brian Otieno",
			size: "64 KB"
		}
	]) await db.insert(documents).values({
		id: d.id,
		organizationId: DEFAULT_ORG_ID,
		name: d.name,
		kind: d.kind,
		linkedEntity: d.linked,
		fileSize: d.size,
		fileUrl: `/uploads/${d.name}`,
		uploadedAt: now
	}).onConflictDoNothing();
	for (const m of [
		{
			id: "c1",
			sender: "Faith Chebet",
			unit: "Kilimani Heights · B2",
			preview: "I have sent 34,000 today, will clear the balance on Friday after payday.",
			channel: "SMS",
			unread: 1
		},
		{
			id: "c2",
			sender: "Kevin Njoroge",
			unit: "Kilimani Heights · B7",
			preview: "Kindly give me until the 20th, my employer delayed salaries.",
			channel: "WhatsApp",
			unread: 1
		},
		{
			id: "c3",
			sender: "Grace Njeri (Caretaker)",
			unit: "Ruaka Skyline Towers",
			preview: "Pump technician arrived, he says the control panel needs replacing.",
			channel: "WhatsApp",
			unread: 0
		},
		{
			id: "c4",
			sender: "Dr. Amina Yusuf",
			unit: "Lavington Green · L1",
			preview: "Thank you for the quick response on the water heater.",
			channel: "In-app",
			unread: 0
		},
		{
			id: "c5",
			sender: "Sharon Wanjiku",
			unit: "Riverside Court · R2",
			preview: "Requesting a copy of my July rent receipt for reimbursement.",
			channel: "In-app",
			unread: 0
		}
	]) await db.insert(messages).values({
		id: m.id,
		organizationId: DEFAULT_ORG_ID,
		senderName: m.sender,
		unitLabel: m.unit,
		preview: m.preview,
		channel: m.channel,
		unread: m.unread,
		createdAt: now
	}).onConflictDoNothing();
	console.log("✅ My Nyumba Nairobi portfolio successfully seeded into relational database.");
}
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function getSessionContext(request) {
	if ((request?.headers.get("Authorization"))?.startsWith("Bearer tenant_")) return {
		id: "usr_tenant_1",
		organizationId: DEFAULT_ORG_ID,
		name: "Brian Otieno",
		email: "brian.otieno@gmail.com",
		role: "TENANT"
	};
	return {
		id: "usr_wanjiru",
		organizationId: DEFAULT_ORG_ID,
		name: "Wanjiru Kimani",
		email: "wanjiru@mynyumba.co.ke",
		role: "OWNER"
	};
}
//#endregion
export { getSessionContext as a, messages as c, properties as d, rentCharges as f, units as h, expenses as i, paymentAllocations as l, tenants as m, db as n, leases as o, seedDatabase as p, documents as r, maintenanceRequests as s, createServerRpc as t, payments as u };
