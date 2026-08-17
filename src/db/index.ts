import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { createClient as createLibsqlClient } from "@libsql/client";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/config/env";

const isBrowser = typeof window !== "undefined";

const connectionString = isBrowser ? undefined : env.DATABASE_URL;

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

const dbPath = process.env.VERCEL ? "file:/tmp/mynyumba.db" : "file:mynyumba.db";
const libsqlClient = !isBrowser && !queryClient ? createLibsqlClient({ url: dbPath }) : null;

export const db: any = queryClient
  ? drizzlePg(queryClient, { schema })
  : libsqlClient
    ? drizzleLibsql(libsqlClient, { schema })
    : null;

export type Database = typeof db;

/**
 * Ensures all tables exist for local fallback sqlite environment.
 */
export async function ensureTablesExist() {
  if (!libsqlClient) return;

  const sqls = [
    'CREATE TABLE IF NOT EXISTS organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, email TEXT NOT NULL, phone TEXT NOT NULL, logo TEXT, currency TEXT NOT NULL DEFAULT "KES", timezone TEXT NOT NULL DEFAULT "Africa/Nairobi", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT "PROPERTY_MANAGER", status TEXT NOT NULL DEFAULT "ACTIVE", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS properties (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, name TEXT NOT NULL, property_code TEXT NOT NULL, area TEXT NOT NULL, tier TEXT NOT NULL DEFAULT "Mid", total_units INTEGER NOT NULL DEFAULT 0, occupied_units INTEGER NOT NULL DEFAULT 0, caretaker_name TEXT NOT NULL, caretaker_phone TEXT NOT NULL, year_built INTEGER NOT NULL, status TEXT NOT NULL DEFAULT "ACTIVE", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS units (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, property_id TEXT NOT NULL, unit_number TEXT NOT NULL, type TEXT NOT NULL, monthly_rent REAL NOT NULL, service_charge REAL NOT NULL DEFAULT 0, deposit_amount REAL NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT "Vacant", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, full_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, national_id TEXT NOT NULL, emergency_contact TEXT, score INTEGER NOT NULL DEFAULT 100, status TEXT NOT NULL DEFAULT "Active", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS leases (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, property_id TEXT NOT NULL, unit_id TEXT NOT NULL, tenant_id TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, monthly_rent REAL NOT NULL, deposit_amount REAL NOT NULL, billing_day INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT "Active", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS rent_charges (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, lease_id TEXT NOT NULL, tenant_id TEXT NOT NULL, unit_id TEXT NOT NULL, property_id TEXT NOT NULL, billing_period TEXT NOT NULL, due_date TEXT NOT NULL, rent_amount REAL NOT NULL, service_charge REAL NOT NULL DEFAULT 0, total_amount REAL NOT NULL, amount_paid REAL NOT NULL DEFAULT 0, balance REAL NOT NULL, status TEXT NOT NULL DEFAULT "PENDING", created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, tenant_id TEXT NOT NULL, lease_id TEXT NOT NULL, unit_id TEXT NOT NULL, property_id TEXT NOT NULL, amount REAL NOT NULL, payment_method TEXT NOT NULL, transaction_reference TEXT NOT NULL UNIQUE, transaction_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT "COMPLETED", notes TEXT, created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS payment_allocations (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, payment_id TEXT NOT NULL, rent_charge_id TEXT NOT NULL, allocated_amount REAL NOT NULL, allocated_at TEXT NOT NULL, notes TEXT)',
    'CREATE TABLE IF NOT EXISTS mpesa_transactions (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, merchant_request_id TEXT NOT NULL, checkout_request_id TEXT NOT NULL UNIQUE, phone_number TEXT NOT NULL, amount REAL NOT NULL, mpesa_receipt_number TEXT, status TEXT NOT NULL DEFAULT "INITIATED", result_code INTEGER, result_desc TEXT, raw_callback_json TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS maintenance_requests (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, property_id TEXT NOT NULL, unit_id TEXT, reference_number TEXT NOT NULL, title TEXT NOT NULL, description TEXT, priority TEXT NOT NULL DEFAULT "Normal", status TEXT NOT NULL DEFAULT "Open", raised_by TEXT NOT NULL, assigned_vendor TEXT, estimated_cost REAL, actual_cost REAL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS expenses (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, property_id TEXT NOT NULL, vendor_name TEXT NOT NULL, category TEXT NOT NULL, amount REAL NOT NULL, expense_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT "Paid", notes TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, name TEXT NOT NULL, kind TEXT NOT NULL, linked_entity TEXT NOT NULL, file_size TEXT NOT NULL, file_url TEXT NOT NULL, uploaded_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, sender_name TEXT NOT NULL, unit_label TEXT NOT NULL, preview TEXT NOT NULL, channel TEXT NOT NULL, unread INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS audit_logs (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, user_id TEXT NOT NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, metadata_json TEXT, created_at TEXT NOT NULL)',
  ];

  for (const sql of sqls) {
    try {
      await libsqlClient.execute(sql);
    } catch (err) {
      console.warn("Table create warning:", err);
    }
  }
}

