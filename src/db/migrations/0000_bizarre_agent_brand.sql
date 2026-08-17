CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"metadata_json" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"linked_entity" text NOT NULL,
	"file_size" text NOT NULL,
	"file_url" text NOT NULL,
	"uploaded_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"property_id" text NOT NULL,
	"vendor_name" text NOT NULL,
	"category" text NOT NULL,
	"amount" double precision NOT NULL,
	"expense_date" text NOT NULL,
	"status" text DEFAULT 'Paid' NOT NULL,
	"notes" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leases" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"property_id" text NOT NULL,
	"unit_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"monthly_rent" double precision NOT NULL,
	"deposit_amount" double precision NOT NULL,
	"billing_day" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"property_id" text NOT NULL,
	"unit_id" text,
	"reference_number" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'Normal' NOT NULL,
	"status" text DEFAULT 'Open' NOT NULL,
	"raised_by" text NOT NULL,
	"assigned_vendor" text,
	"estimated_cost" double precision,
	"actual_cost" double precision,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"sender_name" text NOT NULL,
	"unit_label" text NOT NULL,
	"preview" text NOT NULL,
	"channel" text NOT NULL,
	"unread" boolean DEFAULT true NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mpesa_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"merchant_request_id" text NOT NULL,
	"checkout_request_id" text NOT NULL,
	"phone_number" text NOT NULL,
	"amount" double precision NOT NULL,
	"mpesa_receipt_number" text,
	"status" text DEFAULT 'INITIATED' NOT NULL,
	"result_code" integer,
	"result_desc" text,
	"raw_callback_json" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "mpesa_transactions_checkout_request_id_unique" UNIQUE("checkout_request_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"logo" text,
	"currency" text DEFAULT 'KES' NOT NULL,
	"timezone" text DEFAULT 'Africa/Nairobi' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "payment_allocations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"rent_charge_id" text NOT NULL,
	"allocated_amount" double precision NOT NULL,
	"allocated_at" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"lease_id" text NOT NULL,
	"unit_id" text NOT NULL,
	"property_id" text NOT NULL,
	"amount" double precision NOT NULL,
	"payment_method" text NOT NULL,
	"transaction_reference" text NOT NULL,
	"transaction_date" text NOT NULL,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"notes" text,
	"created_by" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "payments_transaction_reference_unique" UNIQUE("transaction_reference")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"property_code" text NOT NULL,
	"area" text NOT NULL,
	"tier" text DEFAULT 'Mid' NOT NULL,
	"total_units" integer DEFAULT 0 NOT NULL,
	"occupied_units" integer DEFAULT 0 NOT NULL,
	"caretaker_name" text NOT NULL,
	"caretaker_phone" text NOT NULL,
	"year_built" integer NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rent_charges" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"lease_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"unit_id" text NOT NULL,
	"property_id" text NOT NULL,
	"billing_period" text NOT NULL,
	"due_date" text NOT NULL,
	"rent_amount" double precision NOT NULL,
	"service_charge" double precision DEFAULT 0 NOT NULL,
	"total_amount" double precision NOT NULL,
	"amount_paid" double precision DEFAULT 0 NOT NULL,
	"balance" double precision NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"national_id" text NOT NULL,
	"emergency_contact" text,
	"score" integer DEFAULT 100 NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"property_id" text NOT NULL,
	"unit_number" text NOT NULL,
	"type" text NOT NULL,
	"monthly_rent" double precision NOT NULL,
	"service_charge" double precision DEFAULT 0 NOT NULL,
	"deposit_amount" double precision DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Vacant' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'PROPERTY_MANAGER' NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mpesa_transactions" ADD CONSTRAINT "mpesa_transactions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_rent_charge_id_rent_charges_id_fk" FOREIGN KEY ("rent_charge_id") REFERENCES "public"."rent_charges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_lease_id_leases_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."leases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_charges" ADD CONSTRAINT "rent_charges_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_charges" ADD CONSTRAINT "rent_charges_lease_id_leases_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."leases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_charges" ADD CONSTRAINT "rent_charges_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_charges" ADD CONSTRAINT "rent_charges_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_charges" ADD CONSTRAINT "rent_charges_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_org" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_audit_user" ON "audit_logs" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_documents_org" ON "documents" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_org" ON "expenses" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_date" ON "expenses" USING btree ("organization_id","expense_date");--> statement-breakpoint
CREATE INDEX "idx_leases_org" ON "leases" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_leases_tenant" ON "leases" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_leases_unit" ON "leases" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "idx_maint_org" ON "maintenance_requests" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_maint_org_status" ON "maintenance_requests" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_messages_org" ON "messages" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_mpesa_org" ON "mpesa_transactions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_mpesa_checkout" ON "mpesa_transactions" USING btree ("checkout_request_id");--> statement-breakpoint
CREATE INDEX "idx_mpesa_receipt" ON "mpesa_transactions" USING btree ("mpesa_receipt_number");--> statement-breakpoint
CREATE INDEX "idx_allocations_org" ON "payment_allocations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_allocations_payment" ON "payment_allocations" USING btree ("organization_id","payment_id");--> statement-breakpoint
CREATE INDEX "idx_allocations_charge" ON "payment_allocations" USING btree ("organization_id","rent_charge_id");--> statement-breakpoint
CREATE INDEX "idx_payments_org" ON "payments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_payments_org_ref" ON "payments" USING btree ("organization_id","transaction_reference");--> statement-breakpoint
CREATE INDEX "idx_payments_org_tenant" ON "payments" USING btree ("organization_id","tenant_id");--> statement-breakpoint
CREATE INDEX "idx_properties_org" ON "properties" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_properties_org_status" ON "properties" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_charges_org" ON "rent_charges" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_charges_org_tenant" ON "rent_charges" USING btree ("organization_id","tenant_id");--> statement-breakpoint
CREATE INDEX "idx_charges_org_status" ON "rent_charges" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_charges_period" ON "rent_charges" USING btree ("organization_id","billing_period");--> statement-breakpoint
CREATE INDEX "idx_tenants_org" ON "tenants" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_tenants_phone" ON "tenants" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_units_org" ON "units" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_units_property" ON "units" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_users_org" ON "users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");