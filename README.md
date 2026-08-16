# My Nyumba — Kenyan Property Management SaaS

![My Nyumba](/public/nairobi_luxury_apartments.png)

Production-grade, multi-tenant property management SaaS built for Kenya with **TanStack Start**, **Drizzle ORM**, **LibSQL/PostgreSQL**, **M-Pesa Daraja STK Push Integration**, and custom **OKLCH Sapphire Blue & Regal Gold Design System**.

---

## 🚀 Features

- **Multi-Tenant Property Engine**: Organization-isolated properties, units, leases, and tenant ledgers.
- **Automated M-Pesa Daraja Integration**: Live STK Push reconciliation & callback verification for Kenyan real estate.
- **Financial Ledgers & Reports**: Real-time revenue collection, arrears aging, net operating income (NOI), and expense tracking.
- **Persona Authentication**: Role-based switcher for Portfolio Owners, Property Managers, Accountants, and Tenants.
- **Sapphire & Regal Gold Aesthetics**: Custom OKLCH design system with Nairobi luxury architecture visuals.

---

## 🛠️ Tech Stack

- **Framework**: TanStack Start (React 19 + Vite + Nitro Engine)
- **Database & Persistence**: Drizzle ORM + LibSQL / SQLite / PostgreSQL
- **Integrations**: Safaricom M-Pesa Daraja STK Push API
- **Styling**: Tailwind CSS v4 + Custom OKLCH Sapphire Blue Design System

---

## 📦 Deployment Instructions

### 1. Deploying to Vercel (Recommended for Fullstack / Frontend)

1. **Import Repository**:
   - Push your code to GitHub: `https://github.com/Rotz-kirwa/MY-NYUMBA`
   - Log into [Vercel](https://vercel.com) and click **Add New Project**.
   - Select `MY-NYUMBA`.

2. **Build Settings**:
   - **Framework Preset**: Vite / Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`

3. **Environment Variables**:
   Add the following variables in Vercel Project Settings:
   ```env
   DATABASE_URL=file:mynyumba.db
   MPESA_ENVIRONMENT=sandbox
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_PASSKEY=your_passkey
   MPESA_SHORTCODE=174379
   ```

4. Click **Deploy**.

---

### 2. Deploying to Render (Recommended for Backend Web Service)

1. **New Web Service**:
   - Log into [Render](https://render.com).
   - Click **New +** → **Web Service** or **Blueprints**.
   - Connect repository `https://github.com/Rotz-kirwa/MY-NYUMBA`.

2. **Configuration**:
   - **Runtime**: Node.js
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

3. **Environment Variables**:
   Add the following in Render environment configuration:
   - `NODE_VERSION`: `20.18.0`
   - `DATABASE_URL`: `file:mynyumba.db` (or your PostgreSQL connection string)
   - `PORT`: `10000`
   - `MPESA_CONSUMER_KEY`: `your_key`
   - `MPESA_CONSUMER_SECRET`: `your_secret`
   - `MPESA_PASSKEY`: `your_passkey`
   - `MPESA_SHORTCODE`: `174379`

4. Click **Deploy Web Service**.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
bun install # or npm install

# 2. Start local server
bun run dev # or npm run dev

# 3. Build production bundle
bun run build
```

---

© 2026 My Nyumba SaaS Ltd · Nairobi, Kenya
