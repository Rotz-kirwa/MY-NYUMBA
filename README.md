# My Nyumba — Kenyan Property Management SaaS

> **Property management & Rent collection, architected for Nairobi.**

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)](https://github.com/Rotz-kirwa/MY-NYUMBA)
[![Framework](https://img.shields.io/badge/Framework-TanStack_Start_React_19-0B4ED5?style=for-the-badge&logo=react)](https://tanstack.com/start)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_Drizzle_ORM-336791?style=for-the-badge&logo=postgresql)](https://orm.drizzle.team)
[![Integration](https://img.shields.io/badge/M--Pesa-Daraja_STK_Push-green?style=for-the-badge&logo=safaricom)](https://developer.safaricom.co.ke)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel_%26_Render-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 📌 Executive Overview

**My Nyumba** is a production-grade, multi-tenant property management SaaS platform engineered specifically for the Kenyan real estate market. Powered by **TanStack Start (React 19)**, **PostgreSQL (via Drizzle ORM)**, and **Tailwind CSS v4**, the system delivers authoritative server-side persistence, real-time financial ledgers, automated Safaricom M-Pesa Daraja STK reconciliation, and strict multi-tenant data isolation.

---

## 🏛️ System Architecture

```text
  ┌─────────────────────────────────────────────────────────┐
  │         React 19 Frontend + TanStack Router             │
  │     (OKLCH Sapphire Blue & 3D Regal Gold Theme)         │
  └────────────────────────────┬────────────────────────────┘
                               │ Server Functions / RPC
  ┌────────────────────────────▼────────────────────────────┐
  │                 Application Services                    │
  │  PropertyService  •  TenantService  • FinancialService  │
  └────────────────────────────┬────────────────────────────┘
                               │ Drizzle ORM (PostgreSQL)
  ┌────────────────────────────▼────────────────────────────┐
  │           PostgreSQL Database (Render / Neon)           │
  │  Organizations • Users • Properties • Units • Payments  │
  └────────────────────────────┬────────────────────────────┘
                               │ Webhook & Callbacks
  ┌────────────────────────────▼────────────────────────────┐
  │                 External Integrations                   │
  │        Safaricom M-Pesa Daraja STK Push API             │
  └─────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Platform Modules

### 1. Multi-Tenant Property & Unit Engine
- **Tenant Isolation**: Every database query is strictly scoped by `organization_id`.
- **Portfolio Management**: Complete hierarchy tracking properties, residential/commercial units, active leases, and occupancy rates.

### 2. M-Pesa Daraja STK Push Integration
- **Automated Reconciliation**: Triggers instant STK push prompts directly to tenant mobile devices.
- **Idempotent Callbacks**: Verifies Safaricom Daraja signatures and auto-updates ledger entries upon confirmation without double-posting.

### 3. Financial Ledgers & Analytics
- **Authoritative Ledgers**: Real-time revenue tracking, arrears aging, net operating income (NOI), and expense management.
- **31-Day Rent Ribbon**: Dynamic visual collection comb displaying daily rent collection velocity (e.g. KES 6.1M+ target bands).

### 4. Persona-Based Authentication & Gateway
- **Multi-Role Switcher**: Instant context switching between **Portfolio Owner**, **Property Manager**, **Accountant**, and **Tenant Portal**.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions enforced via `permissions.ts` and `auth.ts`.

---

## ⚙️ Environment Variables Reference

Configure the following environment variables in your deployment environments (`.env` / Vercel / Render):

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/dbname` | PostgreSQL connection string (Neon / Supabase / Render / AWS RDS) |
| `NODE_ENV` | **Yes** | `production` | Node execution mode (`development` / `production`) |
| `PORT` | No | `10000` | Port for the production server |
| `MPESA_ENVIRONMENT` | **Yes** | `sandbox` | Safaricom environment (`sandbox` or `production`) |
| `MPESA_CONSUMER_KEY` | **Yes** | `mock_key` | Daraja API Consumer Key |
| `MPESA_CONSUMER_SECRET` | **Yes** | `mock_secret` | Daraja API Consumer Secret |
| `MPESA_PASSKEY` | **Yes** | `mock_passkey` | Daraja STK Push Passkey |
| `MPESA_SHORTCODE` | **Yes** | `174379` | Paybill / Till Number |

---

## 🚢 Deployment Instructions

### Option 1: Deploying Frontend to Vercel

This repository includes a pre-configured `vercel.json` file.

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```
2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import the `Rotz-kirwa/MY-NYUMBA` repository.
3. **Build & Output Settings**:
   - **Framework**: `Vite`
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `.output/public`
4. **Environment Variables**: Add your `DATABASE_URL` (PostgreSQL) under Project Settings.
5. Click **Deploy**.

---

### Option 2: Deploying Backend to Render

1. **Create Web Service on Render**:
   - Connect your GitHub repository `Rotz-kirwa/MY-NYUMBA`.
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
2. **Database Provisioning**:
   - Create a **PostgreSQL Database** on Render or use **Neon / Supabase**.
   - Copy the PostgreSQL connection string and set `DATABASE_URL` in Render Environment Variables.

---

## 🛠️ Local Development & Testing

```bash
# 1. Install dependencies
bun install # or npm install

# 2. Run local development server
npm run dev

# 3. Build for Vercel production
npm run build:vercel
```
