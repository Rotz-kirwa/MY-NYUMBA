import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { RentRibbon } from "@/components/mn/RentRibbon";
import { Badge, Panel, Table, Td } from "@/components/mn/Bits";
import { KSh } from "@/lib/mynyumba";
import {
  Building2,
  Home,
  Users,
  FileText,
  Banknote,
  Wrench,
  ArrowUpRight,
  Activity,
  Plus,
  CreditCard,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  if (!session) {
    throw redirect({ to: "/login" });
  }

  const { PropertyService } = await import("@/server/services/property.service");
  const { FinancialService } = await import("@/server/services/financial.service");
  const { OperationsService } = await import("@/server/services/operations.service");
  const { TenantService } = await import("@/server/services/tenant.service");

  const props = await PropertyService.getAllProperties(session.organizationId, session.role);


  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  const leases = await TenantService.getAllLeases(session.organizationId, session.role);
  const finSummary = await FinancialService.getFinancialSummary(session.organizationId, session.role);
  const payments = await FinancialService.getPayments(session.organizationId, session.role);
  const rentCharges = await FinancialService.getRentCharges(session.organizationId, session.role);
  const tickets = await OperationsService.getMaintenanceRequests(session.organizationId, session.role);
  const expenses = await OperationsService.getExpenses(session.organizationId, session.role);

  const totalUnits = units.length > 0 ? units.length : props.reduce((s: number, p: any) => s + p.totalUnits, 0);
  const occupiedUnits = units.length > 0 ? units.filter((u: any) => u.status === "Occupied").length : props.reduce((s: number, p: any) => s + p.occupiedUnits, 0);
  const vacantUnits = totalUnits - occupiedUnits;
  const arrears = rentCharges.filter((c: any) => c.status !== "PAID" && c.balance > 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
  const netIncome = finSummary.collected - totalExpenses;

  // Build tenant lookup map
  const tenantMap = new Map<string, string>();
  tenants.forEach((t: any) => tenantMap.set(t.id, t.fullName));

  // Build property lookup map
  const propertyMap = new Map<string, string>();
  props.forEach((p: any) => propertyMap.set(p.id, p.name));

  // Build real-time audit activity feed
  const activities: Array<{
    id: string;
    type: "payment" | "tenant" | "lease" | "ticket" | "property";
    title: string;
    description: string;
    timestamp: string;
    badgeColor: "emerald" | "blue" | "purple" | "amber" | "rose";
  }> = [];

  payments.forEach((p: any) => {
    const tName = tenantMap.get(p.tenantId) || "Tenant";
    activities.push({
      id: `act_${p.id}`,
      type: "payment",
      title: "M-Pesa Payment Received",
      description: `${tName} paid KSh ${p.amount.toLocaleString()} (Ref: ${p.transactionReference})`,
      timestamp: p.transactionDate || p.createdAt,
      badgeColor: "emerald",
    });
  });

  tenants.forEach((t: any) => {
    activities.push({
      id: `act_${t.id}`,
      type: "tenant",
      title: "Tenant Onboarded",
      description: `${t.fullName} registered with ID ${t.nationalId} (${t.phone})`,
      timestamp: t.createdAt,
      badgeColor: "amber",
    });
  });

  leases.forEach((l: any) => {
    const tName = tenantMap.get(l.tenantId) || "Tenant";
    activities.push({
      id: `act_${l.id}`,
      type: "lease",
      title: "Lease Contract Active",
      description: `Agreed monthly rent KSh ${l.monthlyRent.toLocaleString()} for ${tName}`,
      timestamp: l.createdAt,
      badgeColor: "purple",
    });
  });

  tickets.forEach((t: any) => {
    activities.push({
      id: `act_${t.id}`,
      type: "ticket",
      title: "Maintenance Ticket Logged",
      description: `${t.title} — Priority: ${t.priority || "Normal"}`,
      timestamp: t.createdAt,
      badgeColor: "rose",
    });
  });

  // Sort activities newest first
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    sessionUser: session,
    props,
    units,
    tenants,
    leases,
    finSummary,
    payments,
    rentCharges,
    tickets,
    expenses,
    tenantMap: Object.fromEntries(tenantMap),
    propertyMap: Object.fromEntries(propertyMap),
    totalUnits,
    occupiedUnits,
    vacantUnits,
    arrears,
    totalExpenses,
    netIncome,
    activities: activities.slice(0, 10),
  };
});

export const Route = createFileRoute("/")({
  loader: () => getDashboardData(),
  head: () => ({
    meta: [
      { title: "My Nyumba — Nairobi rent collection dashboard" },
      {
        name: "description",
        content:
          "Track properties, units, tenant onboardings, active leases, rent collection, and arrears across your Nairobi real estate portfolio.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();

  const firstName = data?.sessionUser?.name ? data.sessionUser.name.split(" ")[0] : "Manager";
  const propsList = data?.props || [];
  const unitsList = data?.units || [];
  const tenantsList = data?.tenants || [];
  const leasesList = data?.leases || [];

  const totalUnitsCount = data?.totalUnits || 0;
  const occupiedUnitsCount = data?.occupiedUnits || 0;
  const vacantUnitsCount = data?.vacantUnits || 0;
  const arrearsList = data?.arrears || [];
  const finSummaryObj = data?.finSummary || { arrearsCarried: 0, billed: 0, collected: 0, collectionRate: 0 };
  const tenantMap = data?.tenantMap || {};
  const propertyMap = data?.propertyMap || {};
  const activitiesList = data?.activities || [];

  const occupancyPercent = totalUnitsCount > 0 ? Math.round((occupiedUnitsCount / totalUnitsCount) * 100) : 0;
  const openTicketsCount = (data?.tickets || []).filter((t: any) => t.status !== "RESOLVED" && t.status !== "Resolved").length;

  return (
    <AppShell>
      {/* Header Banner & Actions */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-caption">Monday, 17 August 2026 · Portfolio Executive Overview</p>
          <h1 className="t-display-lg mt-1.5">Habari, {firstName}</h1>
          <p className="t-body mt-1 text-muted-foreground">
            {propsList.length} Properties · {totalUnitsCount} Units · {tenantsList.length} Tenants · {leasesList.length} Active Leases
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/tenants"
            className="flex items-center gap-1.5 rounded-xs border border-border-strong bg-card px-3 py-2 text-[13px] font-semibold transition-colors duration-150 hover:bg-muted"
          >
            <Plus size={14} /> Onboard Tenant
          </Link>
          <Link
            to="/collections/arrears"
            className="rounded-xs border border-border-strong bg-card px-3 py-2 text-[13px] font-semibold transition-colors duration-150 hover:bg-muted"
          >
            Manage Arrears
          </Link>
          <Link
            to="/payments"
            className="rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90"
          >
            Reconcile M-Pesa
          </Link>
        </div>
      </div>

      {/* SOLID FULLY DOMINANT PORTFOLIO SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* 1. PROPERTIES CARD (SOLID DOMINANT BLUE) */}
        <Link
          to="/properties"
          className="group relative overflow-hidden rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Properties</span>
            <div className="rounded-md bg-white/20 p-2 text-white group-hover:scale-110 transition-transform">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-white">{propsList.length}</span>
            <span className="text-xs text-blue-100 font-semibold">Assets</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium flex items-center justify-between">
            <span>Portfolio Buildings Registered</span>
            <ArrowUpRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* 2. UNITS CARD (SOLID DOMINANT EMERALD) */}
        <Link
          to="/units"
          className="group relative overflow-hidden rounded-md border border-emerald-500 bg-emerald-600 p-5 text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Units Inventory</span>
            <div className="rounded-md bg-white/20 p-2 text-white group-hover:scale-110 transition-transform">
              <Home size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-white">{totalUnitsCount}</span>
            <span className="text-xs text-emerald-100 font-semibold">{occupancyPercent}% Occupied</span>
          </div>
          <p className="mt-2 text-xs text-emerald-100 font-medium flex items-center justify-between">
            <span>{occupiedUnitsCount} Occupied · {vacantUnitsCount} Vacant</span>
            <ArrowUpRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* 3. TENANTS CARD (SOLID DOMINANT AMBER) */}
        <Link
          to="/tenants"
          className="group relative overflow-hidden rounded-md border border-amber-500 bg-amber-600 p-5 text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Active Tenants</span>
            <div className="rounded-md bg-white/20 p-2 text-white group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-white">{tenantsList.length}</span>
            <span className="text-xs text-amber-100 font-semibold">Verified Accounts</span>
          </div>
          <p className="mt-2 text-xs text-amber-100 font-medium flex items-center justify-between">
            <span>Identity & Credential Records</span>
            <ArrowUpRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>

        {/* 4. LEASES CARD (SOLID DOMINANT PURPLE) */}
        <Link
          to="/leases"
          className="group relative overflow-hidden rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md transition-all duration-200 hover:bg-purple-700 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Active Leases</span>
            <div className="rounded-md bg-white/20 p-2 text-white group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-white">{leasesList.length}</span>
            <span className="text-xs text-purple-100 font-semibold">Contracts</span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium flex items-center justify-between">
            <span>Tenancy Terms & Deposit Records</span>
            <ArrowUpRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </p>
        </Link>
      </div>

      {/* Hero Financial Collection Band */}
      <div className="mb-6 rounded-md border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="t-caption tracking-wider text-muted-foreground">North-Star Performance Metric</p>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Collection Rate This Month</h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold tracking-tight text-foreground t-num">
                {finSummaryObj.collectionRate}%
              </span>
              <span className="inline-flex items-center rounded-xs bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                Live DB Ledger
              </span>
              <span className="text-xs text-muted-foreground">Target: 95.0%</span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Collected to Date</p>
              <p className="text-xl font-extrabold text-success t-num">{KSh(finSummaryObj.collected)}</p>
            </div>
            <div className="h-8 w-px bg-border mx-2" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Billed</p>
              <p className="text-xl font-bold text-foreground t-num">{KSh(finSummaryObj.billed)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 60/40 Two-Column Content Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Left Column (60%): Rent Ribbon & Arrears Watchlist */}
        <div className="flex flex-col gap-6">
          <RentRibbon
            rentCharges={data.rentCharges}
            payments={data.payments}
            totalUnits={totalUnitsCount}
            occupiedUnits={occupiedUnitsCount}
          />

          <Panel
            title="Arrears Risk Watchlist"
            meta={<Link to="/collections/arrears" className="text-xs font-semibold text-primary hover:underline">View All Overdue →</Link>}
          >
            {arrearsList.length > 0 ? (
              <Table
                head={["Tenant Account", "Unit / Property", "Total Billed", "Paid", "Balance Due", "Status"]}
              >
                {arrearsList.slice(0, 5).map((c: any) => {
                  const due = c.balance ?? ((c.totalAmount || c.rentAmount || 0) - (c.amountPaid || 0));
                  const tenantName = tenantMap[c.tenantId] || c.tenantId || "Tenant Account";
                  const propertyName = propertyMap[c.propertyId] || c.propertyId || "Property";
                  const unitLabel = `${propertyName} (${c.unitId || 'Unit'})`;
                  return (
                    <tr key={c.id} className="transition-colors duration-150 hover:bg-muted/50">
                      <Td className="font-semibold">{tenantName}</Td>
                      <Td num>{unitLabel}</Td>
                      <Td num>{KSh(c.totalAmount || c.rentAmount || 0)}</Td>
                      <Td num className="text-success">{KSh(c.amountPaid || 0)}</Td>
                      <Td num className="font-bold text-danger">{KSh(due)}</Td>
                      <Td>
                        <Badge variant="overdue">Overdue</Badge>
                      </Td>
                    </tr>
                  );
                })}
              </Table>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <p className="font-medium text-foreground">No Defaulting Arrears</p>
                <p className="mt-1">All rent charges across your portfolio are fully paid to date.</p>
              </div>
            )}
          </Panel>
        </div>

        {/* Right Column (40%): Live Portfolio Activity Logs & Audit Stream */}
        <div className="flex flex-col gap-6">
          {/* Recent Activity Log Stream */}
          <Panel
            title="Portfolio Activity & Audit Stream"
            meta={<span className="text-[11px] font-mono text-muted-foreground">{activitiesList.length} recent events</span>}
          >
            {activitiesList.length > 0 ? (
              <div className="divide-y divide-border">
                {activitiesList.map((act) => {
                  const isPayment = act.type === "payment";
                  const isTenant = act.type === "tenant";
                  const isLease = act.type === "lease";
                  const isTicket = act.type === "ticket";

                  return (
                    <div key={act.id} className="p-3.5 text-xs transition-colors hover:bg-muted/30 flex gap-3 items-start">
                      <div
                        className={`rounded-full p-2 mt-0.5 shrink-0 ${
                          isPayment
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : isTenant
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : isLease
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {isPayment && <CreditCard size={14} />}
                        {isTenant && <Users size={14} />}
                        {isLease && <FileText size={14} />}
                        {isTicket && <Wrench size={14} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground truncate">{act.title}</span>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {new Date(act.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground text-[11px] leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Activity className="mx-auto text-muted-foreground/30 mb-2" size={28} />
                No portfolio activities logged yet.
              </div>
            )}
          </Panel>

          {/* Quick Management Shortcuts */}
          <Panel title="Quick Management Actions">
            <div className="p-4 grid gap-2.5">
              <Link
                to="/payments"
                className="flex items-center justify-between rounded-xs border border-border bg-card p-3 text-xs font-semibold transition-colors hover:border-primary hover:bg-muted/50"
              >
                <span className="flex items-center gap-2">💳 Record M-Pesa / Bank Payment</span>
                <span className="text-muted-foreground">→</span>
              </Link>
              <Link
                to="/collections/arrears"
                className="flex items-center justify-between rounded-xs border border-danger/20 bg-danger-soft/20 p-3 text-xs font-semibold text-danger transition-colors hover:bg-danger-soft/40"
              >
                <span className="flex items-center gap-2">📲 Trigger Bulk M-Pesa Reminders</span>
                <span>→</span>
              </Link>
              <Link
                to="/maintenance"
                className="flex items-center justify-between rounded-xs border border-border bg-card p-3 text-xs font-semibold transition-colors hover:border-primary hover:bg-muted/50"
              >
                <span className="flex items-center gap-2">🛠 Log Maintenance Ticket</span>
                <span className="text-muted-foreground">→</span>
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
