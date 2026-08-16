import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/* ============================================================================
 * 1. MULTI-TENANT ORGANIZATIONS & USERS
 * ============================================================================ */

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  logo: text("logo"),
  currency: text("currency").notNull().default("KES"),
  timezone: text("timezone").notNull().default("Africa/Nairobi"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("PROPERTY_MANAGER"), // OWNER, ADMIN, PROPERTY_MANAGER, ACCOUNTANT, AGENT, MAINTENANCE, VIEWER, TENANT
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, INACTIVE, SUSPENDED
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/* ============================================================================
 * 2. PORTFOLIO: PROPERTIES & UNITS
 * ============================================================================ */

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  propertyCode: text("property_code").notNull(),
  area: text("area").notNull(), // Kilimani, Lavington, Westlands, Kileleshwa, South B, Ruaka, Karen
  tier: text("tier").notNull().default("Mid"), // Premium, Mid, Standard
  totalUnits: integer("total_units").notNull().default(0),
  occupiedUnits: integer("occupied_units").notNull().default(0),
  caretakerName: text("caretaker_name").notNull(),
  caretakerPhone: text("caretaker_phone").notNull(),
  yearBuilt: integer("year_built").notNull(),
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, ARCHIVED
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitNumber: text("unit_number").notNull(), // A4, B2, L1, etc.
  type: text("type").notNull(), // Studio, 1 Bed, 2 Bed, 3 Bed, 4 Bed Maisonette
  monthlyRent: real("monthly_rent").notNull(),
  serviceCharge: real("service_charge").notNull().default(0),
  depositAmount: real("deposit_amount").notNull().default(0),
  status: text("status").notNull().default("Vacant"), // Occupied, Vacant, Notice, Under repair
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/* ============================================================================
 * 3. TENANTS & LEASES
 * ============================================================================ */

export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  nationalId: text("national_id").notNull(),
  emergencyContact: text("emergency_contact"),
  score: integer("score").notNull().default(100), // Payment score 0-100
  status: text("status").notNull().default("Active"), // Active, Expired, Moved Out
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const leases = sqliteTable("leases", {
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
  status: text("status").notNull().default("Active"), // Active, Expiring, Ended, Cancelled
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/* ============================================================================
 * 4. FINANCIAL ENGINE: CHARGES, PAYMENTS & ALLOCATIONS
 * ============================================================================ */

export const rentCharges = sqliteTable("rent_charges", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  leaseId: text("lease_id").notNull().references(() => leases.id),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  unitId: text("unit_id").notNull().references(() => units.id),
  propertyId: text("property_id").notNull().references(() => properties.id),
  billingPeriod: text("billing_period").notNull(), // e.g. "2026-08"
  dueDate: text("due_date").notNull(),
  rentAmount: real("rent_amount").notNull(),
  serviceCharge: real("service_charge").notNull().default(0),
  totalAmount: real("total_amount").notNull(),
  amountPaid: real("amount_paid").notNull().default(0),
  balance: real("balance").notNull(),
  status: text("status").notNull().default("PENDING"), // PENDING, PARTIALLY_PAID, PAID, OVERDUE, WAIVED, VOID
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  leaseId: text("lease_id").notNull().references(() => leases.id),
  unitId: text("unit_id").notNull().references(() => units.id),
  propertyId: text("property_id").notNull().references(() => properties.id),
  amount: real("amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // MPESA, BANK_TRANSFER, CASH, CARD, OTHER
  transactionReference: text("transaction_reference").notNull().unique(), // e.g. TFR3K9X2LM
  transactionDate: text("transaction_date").notNull(),
  status: text("status").notNull().default("COMPLETED"), // COMPLETED, PENDING, REVERSED, FAILED
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const paymentAllocations = sqliteTable("payment_allocations", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  paymentId: text("payment_id").notNull().references(() => payments.id),
  rentChargeId: text("rent_charge_id").notNull().references(() => rentCharges.id),
  allocatedAmount: real("allocated_amount").notNull(),
  allocatedAt: text("allocated_at").notNull(),
  notes: text("notes"),
});

/* ============================================================================
 * 5. OPERATIONS: MAINTENANCE, EXPENSES, DOCUMENTS, MESSAGES
 * ============================================================================ */

export const maintenanceRequests = sqliteTable("maintenance_requests", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  propertyId: text("property_id").notNull().references(() => properties.id),
  unitId: text("unit_id"),
  referenceNumber: text("reference_number").notNull(), // MNT-1042
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("Normal"), // Urgent, Normal, Low
  status: text("status").notNull().default("Open"), // Open, Assigned, In progress, Resolved, Cancelled
  raisedBy: text("raised_by").notNull(),
  assignedVendor: text("assigned_vendor"),
  estimatedCost: real("estimated_cost"),
  actualCost: real("actual_cost"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  propertyId: text("property_id").notNull().references(() => properties.id),
  vendorName: text("vendor_name").notNull(),
  category: text("category").notNull(), // Water, Power, Security, Repairs, Garbage, Levies, Other
  amount: real("amount").notNull(),
  expenseDate: text("expense_date").notNull(),
  status: text("status").notNull().default("Paid"), // Paid, Pending
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  kind: text("kind").notNull(), // Lease, ID, Invoice, Compliance, Receipt
  linkedEntity: text("linked_entity").notNull(),
  fileSize: text("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  senderName: text("sender_name").notNull(),
  unitLabel: text("unit_label").notNull(),
  preview: text("preview").notNull(),
  channel: text("channel").notNull(), // SMS, WhatsApp, In-app
  unread: integer("unread").notNull().default(1), // 1 true, 0 false
  createdAt: text("created_at").notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizations.id),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
});
