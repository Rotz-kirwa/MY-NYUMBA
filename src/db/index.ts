import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const isBrowser = typeof window !== "undefined";

function getDatabaseUrl(): string | undefined {
  if (isBrowser) return undefined;
  return process.env["DATABASE_URL"];
}

const connectionString = getDatabaseUrl();

function createPgClient() {
  if (!connectionString) return null;
  try {
    return postgres(connectionString, { max: 10, idle_timeout: 20 });
  } catch (err) {
    console.warn("PostgreSQL connection error:", err);
    return null;
  }
}

export const queryClient = createPgClient();

function createChainableProxy(): any {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === "then") {
        return (resolve: (val: any) => void) => resolve([]);
      }
      if (prop === "catch" || prop === "finally" || typeof prop === "symbol") {
        return undefined;
      }
      return (..._args: any[]) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

export const db = queryClient ? drizzle(queryClient, { schema }) : (createChainableProxy() as any);

export type Database = typeof db;

let isInitPromise: Promise<void> | undefined;

export async function ensureTablesExist() {
  if (isBrowser || !queryClient) return;
  if (!isInitPromise) {
    isInitPromise = (async () => {
      try {
        await queryClient.unsafe(`
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
            organization_id TEXT NOT NULL REFERENCES organizations(id),
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
            organization_id TEXT NOT NULL REFERENCES organizations(id),
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
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            property_id TEXT NOT NULL REFERENCES properties(id),
            unit_number TEXT NOT NULL,
            type TEXT NOT NULL,
            monthly_rent DOUBLE PRECISION NOT NULL,
            service_charge DOUBLE PRECISION NOT NULL DEFAULT 0,
            deposit_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'Vacant',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS tenants (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
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
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            property_id TEXT NOT NULL REFERENCES properties(id),
            unit_id TEXT NOT NULL REFERENCES units(id),
            tenant_id TEXT NOT NULL REFERENCES tenants(id),
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            monthly_rent DOUBLE PRECISION NOT NULL,
            deposit_amount DOUBLE PRECISION NOT NULL,
            billing_day INTEGER NOT NULL DEFAULT 1,
            status TEXT NOT NULL DEFAULT 'Active',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS rent_charges (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            lease_id TEXT NOT NULL REFERENCES leases(id),
            tenant_id TEXT NOT NULL REFERENCES tenants(id),
            unit_id TEXT NOT NULL REFERENCES units(id),
            property_id TEXT NOT NULL REFERENCES properties(id),
            billing_period TEXT NOT NULL,
            due_date TEXT NOT NULL,
            rent_amount DOUBLE PRECISION NOT NULL,
            service_charge DOUBLE PRECISION NOT NULL DEFAULT 0,
            total_amount DOUBLE PRECISION NOT NULL,
            amount_paid DOUBLE PRECISION NOT NULL DEFAULT 0,
            balance DOUBLE PRECISION NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            tenant_id TEXT NOT NULL REFERENCES tenants(id),
            lease_id TEXT NOT NULL REFERENCES leases(id),
            unit_id TEXT NOT NULL REFERENCES units(id),
            property_id TEXT NOT NULL REFERENCES properties(id),
            amount DOUBLE PRECISION NOT NULL,
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
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            payment_id TEXT NOT NULL REFERENCES payments(id),
            rent_charge_id TEXT NOT NULL REFERENCES rent_charges(id),
            allocated_amount DOUBLE PRECISION NOT NULL,
            allocated_at TEXT NOT NULL,
            notes TEXT
          );

          CREATE TABLE IF NOT EXISTS maintenance_requests (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            property_id TEXT NOT NULL REFERENCES properties(id),
            unit_id TEXT,
            reference_number TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT NOT NULL DEFAULT 'Normal',
            status TEXT NOT NULL DEFAULT 'Open',
            raised_by TEXT NOT NULL,
            assigned_vendor TEXT,
            estimated_cost DOUBLE PRECISION,
            actual_cost DOUBLE PRECISION,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            property_id TEXT NOT NULL REFERENCES properties(id),
            vendor_name TEXT NOT NULL,
            category TEXT NOT NULL,
            amount DOUBLE PRECISION NOT NULL,
            expense_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Paid',
            notes TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            name TEXT NOT NULL,
            kind TEXT NOT NULL,
            linked_entity TEXT NOT NULL,
            file_size TEXT NOT NULL,
            file_url TEXT NOT NULL,
            uploaded_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            sender_name TEXT NOT NULL,
            unit_label TEXT NOT NULL,
            preview TEXT NOT NULL,
            channel TEXT NOT NULL,
            unread BOOLEAN NOT NULL DEFAULT true,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL REFERENCES organizations(id),
            user_id TEXT NOT NULL,
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            metadata_json TEXT,
            created_at TEXT NOT NULL
          );
        `);

        const { seedDatabase } = await import("./seed");
        await seedDatabase();
      } catch (e) {
        console.warn("ensureTablesExist PostgreSQL initialization warning:", e);
      }
    })();
  }
  return isInitPromise;
}
