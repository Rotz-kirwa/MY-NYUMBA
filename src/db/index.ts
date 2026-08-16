import { drizzle } from "drizzle-orm/libsql/web";
import type { Client } from "@libsql/client/web";
import * as schema from "./schema";
import path from "path";

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // On Vercel or Serverless environments where working dir (/var/task) is read-only,
  // SQLite must write database and journal/lock files to writable /tmp directory.
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NETLIFY);

  if (isServerless) {
    return "file:/tmp/mynyumba.db";
  }

  const fileName = envUrl ? envUrl.replace(/^file:/, "") : "mynyumba.db";
  return `file:${path.resolve(process.cwd(), fileName)}`;
}

const isBrowser = typeof window !== "undefined";
const dbUrl = isBrowser ? "file::memory:" : getDatabaseUrl();

const dummyClient: Client = {
  execute: async () => ({ rows: [], columns: [], columnTypes: [], rowsAffected: 0 }),
  executeMultiple: async () => {},
  transaction: async () => ({}) as any,
  close: () => {},
} as unknown as Client;

let clientInstance: Client | undefined;

async function getClientInstance(): Promise<Client> {
  if (isBrowser) return dummyClient;
  if (clientInstance) return clientInstance;

  try {
    if (
      dbUrl.startsWith("http:") ||
      dbUrl.startsWith("https:") ||
      dbUrl.startsWith("libsql:") ||
      dbUrl.startsWith("ws:") ||
      dbUrl.startsWith("wss:")
    ) {
      const { createClient } = await import("@libsql/client/web");
      clientInstance = createClient({ url: dbUrl });
    } else {
      const { createClient } = await import("@libsql/client");
      clientInstance = createClient({ url: dbUrl });
    }
  } catch (err) {
    console.warn("Native @libsql/client unavailable, attempting @libsql/client/web or memory fallback:", err);
    try {
      const { createClient } = await import("@libsql/client/web");
      clientInstance = createClient({ url: "https://fallback.libsql.org" });
    } catch {
      clientInstance = dummyClient;
    }
  }

  return clientInstance;
}

export const rawClient: Client = new Proxy({} as Client, {
  get(_target, prop) {
    return (...args: any[]) => {
      return getClientInstance().then((client) => {
        const fn = (client as any)[prop];
        if (typeof fn === "function") {
          return fn.apply(client, args);
        }
        return fn;
      });
    };
  },
});

export const db = drizzle(rawClient, { schema });
export type Database = typeof db;

let isInitPromise: Promise<void> | undefined;

export async function ensureTablesExist() {
  if (isBrowser) return;
  if (!isInitPromise) {
    isInitPromise = (async () => {
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

      const { seedDatabase } = await import("./seed");
      await seedDatabase();
    })();
  }
  return isInitPromise;
}
