import { pgTable, text, integer, doublePrecision, boolean, index } from "drizzle-orm/pg-core";

/* ============================================================================
 * 1. MULTI-TENANT ORGANIZATIONS & USERS
 * ============================================================================ */

export const organizations = pgTable("organizations", {
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

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("PROPERTY_MANAGER"),
    status: text("status").notNull().default("ACTIVE"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_users_org").on(t.organizationId),
    index("idx_users_email").on(t.email),
  ]
);

/* ============================================================================
 * 2. PORTFOLIO: PROPERTIES & UNITS
 * ============================================================================ */

export const properties = pgTable(
  "properties",
  {
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
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_properties_org").on(t.organizationId),
    index("idx_properties_org_status").on(t.organizationId, t.status),
  ]
);

export const units = pgTable(
  "units",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    unitNumber: text("unit_number").notNull(),
    type: text("type").notNull(),
    monthlyRent: doublePrecision("monthly_rent").notNull(),
    serviceCharge: doublePrecision("service_charge").notNull().default(0),
    depositAmount: doublePrecision("deposit_amount").notNull().default(0),
    status: text("status").notNull().default("Vacant"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_units_org").on(t.organizationId),
    index("idx_units_property").on(t.propertyId),
  ]
);

/* ============================================================================
 * 3. TENANTS & LEASES
 * ============================================================================ */

export const tenants = pgTable(
  "tenants",
  {
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
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_tenants_org").on(t.organizationId),
    index("idx_tenants_phone").on(t.phone),
  ]
);

export const leases = pgTable(
  "leases",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    unitId: text("unit_id").notNull().references(() => units.id),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    monthlyRent: doublePrecision("monthly_rent").notNull(),
    depositAmount: doublePrecision("deposit_amount").notNull(),
    billingDay: integer("billing_day").notNull().default(1),
    status: text("status").notNull().default("Active"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_leases_org").on(t.organizationId),
    index("idx_leases_tenant").on(t.tenantId),
    index("idx_leases_unit").on(t.unitId),
  ]
);

/* ============================================================================
 * 4. FINANCIAL ENGINE: CHARGES, PAYMENTS & ALLOCATIONS
 * ============================================================================ */

export const rentCharges = pgTable(
  "rent_charges",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    leaseId: text("lease_id").notNull().references(() => leases.id),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    unitId: text("unit_id").notNull().references(() => units.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    billingPeriod: text("billing_period").notNull(),
    dueDate: text("due_date").notNull(),
    rentAmount: doublePrecision("rent_amount").notNull(),
    serviceCharge: doublePrecision("service_charge").notNull().default(0),
    totalAmount: doublePrecision("total_amount").notNull(),
    amountPaid: doublePrecision("amount_paid").notNull().default(0),
    balance: doublePrecision("balance").notNull(),
    status: text("status").notNull().default("PENDING"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_charges_org").on(t.organizationId),
    index("idx_charges_org_tenant").on(t.organizationId, t.tenantId),
    index("idx_charges_org_status").on(t.organizationId, t.status),
    index("idx_charges_period").on(t.organizationId, t.billingPeriod),
  ]
);

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    leaseId: text("lease_id").notNull().references(() => leases.id),
    unitId: text("unit_id").notNull().references(() => units.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    amount: doublePrecision("amount").notNull(),
    paymentMethod: text("payment_method").notNull(),
    transactionReference: text("transaction_reference").notNull().unique(),
    transactionDate: text("transaction_date").notNull(),
    status: text("status").notNull().default("COMPLETED"),
    notes: text("notes"),
    createdBy: text("created_by").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_payments_org").on(t.organizationId),
    index("idx_payments_org_ref").on(t.organizationId, t.transactionReference),
    index("idx_payments_org_tenant").on(t.organizationId, t.tenantId),
  ]
);

export const paymentAllocations = pgTable(
  "payment_allocations",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    paymentId: text("payment_id").notNull().references(() => payments.id),
    rentChargeId: text("rent_charge_id").notNull().references(() => rentCharges.id),
    allocatedAmount: doublePrecision("allocated_amount").notNull(),
    allocatedAt: text("allocated_at").notNull(),
    notes: text("notes"),
  },
  (t) => [
    index("idx_allocations_org").on(t.organizationId),
    index("idx_allocations_payment").on(t.organizationId, t.paymentId),
    index("idx_allocations_charge").on(t.organizationId, t.rentChargeId),
  ]
);

export const mpesaTransactions = pgTable(
  "mpesa_transactions",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    merchantRequestId: text("merchant_request_id").notNull(),
    checkoutRequestId: text("checkout_request_id").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    amount: doublePrecision("amount").notNull(),
    mpesaReceiptNumber: text("mpesa_receipt_number"),
    status: text("status").notNull().default("INITIATED"),
    resultCode: integer("result_code"),
    resultDesc: text("result_desc"),
    rawCallbackJson: text("raw_callback_json"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_mpesa_org").on(t.organizationId),
    index("idx_mpesa_checkout").on(t.checkoutRequestId),
    index("idx_mpesa_receipt").on(t.mpesaReceiptNumber),
  ]
);

/* ============================================================================
 * 5. OPERATIONS: MAINTENANCE, EXPENSES, DOCUMENTS, MESSAGES
 * ============================================================================ */

export const maintenanceRequests = pgTable(
  "maintenance_requests",
  {
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
    estimatedCost: doublePrecision("estimated_cost"),
    actualCost: doublePrecision("actual_cost"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_maint_org").on(t.organizationId),
    index("idx_maint_org_status").on(t.organizationId, t.status),
  ]
);

export const expenses = pgTable(
  "expenses",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    vendorName: text("vendor_name").notNull(),
    category: text("category").notNull(),
    amount: doublePrecision("amount").notNull(),
    expenseDate: text("expense_date").notNull(),
    status: text("status").notNull().default("Paid"),
    notes: text("notes"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    index("idx_expenses_org").on(t.organizationId),
    index("idx_expenses_date").on(t.organizationId, t.expenseDate),
  ]
);

export const documents = pgTable(
  "documents",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    name: text("name").notNull(),
    kind: text("kind").notNull(),
    linkedEntity: text("linked_entity").notNull(),
    fileSize: text("file_size").notNull(),
    fileUrl: text("file_url").notNull(),
    uploadedAt: text("uploaded_at").notNull(),
  },
  (t) => [index("idx_documents_org").on(t.organizationId)]
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    senderName: text("sender_name").notNull(),
    unitLabel: text("unit_label").notNull(),
    preview: text("preview").notNull(),
    channel: text("channel").notNull(),
    unread: boolean("unread").notNull().default(true),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("idx_messages_org").on(t.organizationId)]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organizations.id),
    userId: text("user_id").notNull(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    index("idx_audit_org").on(t.organizationId),
    index("idx_audit_user").on(t.organizationId, t.userId),
  ]
);
