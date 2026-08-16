# My Nyumba — Kenyan Property Management SaaS

> **Property management & Rent collection, architected for Nairobi.**

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)](https://github.com/Rotz-kirwa/MY-NYUMBA)
[![Framework](https://img.shields.io/badge/Framework-TanStack_Start_React_19-0B4ED5?style=for-the-badge&logo=react)](https://tanstack.com/start)
[![Database](https://img.shields.io/badge/ORM-Drizzle_LibSQL_PostgreSQL-E5A118?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team)
[![Integration](https://img.shields.io/badge/M--Pesa-Daraja_STK_Push-green?style=for-the-badge&logo=safaricom)](https://developer.safaricom.co.ke)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel_%26_Render-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 📌 Executive Overview

**My Nyumba** is a production-grade, multi-tenant property management SaaS platform engineered specifically for the Kenyan real estate market. Built with **TanStack Start**, **Drizzle ORM**, **LibSQL/PostgreSQL**, and **Tailwind CSS v4**, the system replaces disconnected mock setups with authoritative server-side persistence, real-time financial ledgers, automated Safaricom M-Pesa Daraja STK reconciliation, and strict multi-tenant data isolation.

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
                               │ Drizzle ORM Type-Safe DDL
  ┌────────────────────────────▼────────────────────────────┐
  │              Persistence & Multi-Tenant DB              │
  │          LibSQL / SQLite / PostgreSQL Database          │
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

Configure the following environment variables in your deployment environments (.env / Vercel / Render):

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | `file:mynyumba.db` | Connection string for LibSQL, SQLite, or PostgreSQL |
| `NODE_ENV` | **Yes** | `production` | Node execution mode (`development` / `production`) |
| `PORT` | No | `10000` | Port for the production Nitro server |
| `MPESA_ENVIRONMENT` | **Yes** | `sandbox` | Safaricom environment (`sandbox` or `production`) |
| `MPESA_CONSUMER_KEY` | **Yes** | `mock_key` | Daraja API Consumer Key |
| `MPESA_CONSUMER_SECRET` | **Yes** | `mock_secret` | Daraja API Consumer Secret |
| `MPESA_PASSKEY` | **Yes** | `mock_passkey` | Daraja STK Push Passkey |
| `MPESA_SHORTCODE` | **Yes** | `174379` | Paybill / Till Number |

---

## 🚢 Deployment Instructions

### Option 1: Deploying to Vercel (Recommended for Fullstack / SPA)

This repository includes a pre-configured `vercel.json` file.

1. **Push to GitHub**: Ensure all latest code is pushed to your repository:
   ```bash
   git push origin main
   ```
2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import the `Rotz-kirwa/MY-NYUMBA` repository.
3. **Build & Output Settings**:
   - **Framework**: `Vite` / `Other`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
4. **Environment Variables**: Add your `DATABASE_URL` and `MPESA_*` credentials under Project Settings.
5. Click **Deploy**.

---

### Option 2: Deploying to Render (Recommended for Web Service / Backend)

This repository includes a pre-configured `render.yaml` Blueprint file.

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect your GitHub repository `Rotz-kirwa/MY-NYUMBA`.
4. Render will detect `render.yaml` and configure the following settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start` (`node .output/server/index.mjs`)
5. Click **Apply / Deploy**.

---

## 💻 Local Development Workflow

### Prerequisites
- Node.js `v20.x` or higher
- Bun `v1.x` (or `npm`)

### Quick Start Commands

```bash
# 1. Clone the repository
git clone git@github.com:Rotz-kirwa/MY-NYUMBA.git
cd MY-NYUMBA

# 2. Install dependencies
bun install
# or: npm install

# 3. Seed initial database schema & sample data
bun run seed

# 4. Start local development server
bun run dev

# 5. Build for production verification
bun run build
```

The application will be available locally at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔒 Production Build & Health Check

To test production server execution locally before deploying:

```bash
# Run full build
bun run build

# Start production Nitro server
npm run start
```

---

## 📄 License & Attribution

Copyright © 2026 **My Nyumba SaaS Ltd** · Nairobi, Kenya. All rights reserved.
