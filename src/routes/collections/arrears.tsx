import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { useState } from "react";
import {
  AlertTriangle,
  Smartphone,
  ShieldAlert,
  Building2,
  Home,
  Users,
  FileText,
  Search,
  X,
  FilterX,
  Receipt,
  CheckCircle2,
} from "lucide-react";

const getArrearsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { FinancialService } = await import("@/server/services/financial.service");
  const { PropertyService } = await import("@/server/services/property.service");
  const { TenantService } = await import("@/server/services/tenant.service");

  const rentCharges = await FinancialService.getRentCharges(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  const leases = await TenantService.getAllLeases(session.organizationId, session.role);

  const overdueCharges = rentCharges.filter((c: any) => c.status !== "PAID" && (c.balance || (c.totalAmount - c.amountPaid)) > 0);
  const totalArrears = overdueCharges.reduce((sum: number, c: any) => sum + (c.balance || (c.totalAmount - c.amountPaid)), 0);

  return { overdueCharges, totalArrears, rentCharges, props, units, tenants, leases };
});

const triggerStkPushServerFn = createServerFn({ method: "POST" })
  .validator((d: { phone: string; amount: number }) => d)
  .handler(async ({ data }) => {
    const { MpesaIntegration } = await import("@/server/integrations/mpesa");
    return await MpesaIntegration.initiateStkPush({
      phoneNumber: data.phone,
      amount: data.amount,
      accountReference: "RENT-ARREARS",
    });
  });


export const Route = createFileRoute("/collections/arrears")({
  loader: () => getArrearsData(),
  component: ArrearsPage,
});

function ArrearsPage() {
  const { overdueCharges = [], totalArrears = 0, rentCharges = [], props = [], units = [], tenants = [], leases = [] } = Route.useLoaderData() || {};
  const router = useRouter();

  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "properties" | "units" | "tenants" | "leases">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  // Lookup Maps
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));
  const propertyMap = new Map(props.map((p) => [p.id, p]));
  const unitMap = new Map(units.map((u) => [u.id, u]));

  // Metrics Calculations
  const severeCharges = overdueCharges.filter((c: any) => (c.balance || (c.totalAmount - c.amountPaid)) >= 50000);
  const totalSevereArrears = severeCharges.reduce((s: number, c: any) => s + (c.balance || (c.totalAmount - c.amountPaid)), 0);
  const defaultingTenantsCount = new Set(overdueCharges.map((c: any) => c.tenantId)).size;

  // Real-time Search Engine Filters
  const query = searchQuery.trim().toLowerCase();

  const filteredOverdue = overdueCharges.filter((c: any) => {
    if (!query) return true;
    const tenant = tenantMap.get(c.tenantId);
    const property = propertyMap.get(c.propertyId);
    const unit = unitMap.get(c.unitId);

    return (
      tenant?.fullName?.toLowerCase().includes(query) ||
      tenant?.phone?.includes(query) ||
      tenant?.nationalId?.toLowerCase().includes(query) ||
      property?.name?.toLowerCase().includes(query) ||
      unit?.unitNumber?.toLowerCase().includes(query) ||
      c.billingPeriod?.toLowerCase().includes(query) ||
      c.status?.toLowerCase().includes(query)
    );
  });

  const filteredProps = props.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query)
    );
  });

  const filteredUnits = units.filter((u) => {
    if (!query) return true;
    const prop = propertyMap.get(u.propertyId);
    const unitLease = leases.find((l) => l.unitId === u.id);
    const tenant = unitLease ? tenantMap.get(unitLease.tenantId) : null;

    return (
      u.unitNumber.toLowerCase().includes(query) ||
      prop?.name?.toLowerCase().includes(query) ||
      tenant?.fullName?.toLowerCase().includes(query) ||
      u.status.toLowerCase().includes(query)
    );
  });

  const filteredTenants = tenants.filter((t) => {
    const hasArrears = overdueCharges.some((c: any) => c.tenantId === t.id);
    if (!hasArrears) return false;
    if (!query) return true;

    const tenantLease = leases.find((l) => l.tenantId === t.id);
    const prop = tenantLease ? propertyMap.get(tenantLease.propertyId) : null;
    const unit = tenantLease ? unitMap.get(tenantLease.unitId) : null;

    return (
      t.fullName.toLowerCase().includes(query) ||
      t.phone.includes(query) ||
      t.nationalId.toLowerCase().includes(query) ||
      prop?.name?.toLowerCase().includes(query) ||
      unit?.unitNumber?.toLowerCase().includes(query)
    );
  });

  const filteredLeases = leases.filter((l) => {
    const hasArrears = overdueCharges.some((c: any) => c.leaseId === l.id || c.tenantId === l.tenantId);
    if (!hasArrears) return false;
    if (!query) return true;

    const tenant = tenantMap.get(l.tenantId);
    const prop = propertyMap.get(l.propertyId);
    const unit = unitMap.get(l.unitId);

    return (
      l.id.toLowerCase().includes(query) ||
      tenant?.fullName?.toLowerCase().includes(query) ||
      prop?.name?.toLowerCase().includes(query) ||
      unit?.unitNumber?.toLowerCase().includes(query)
    );
  });

  const handleSendStkPush = async (charge: typeof overdueCharges[number]) => {
    const tenant = tenantMap.get(charge.tenantId);
    const targetPhone = tenant?.phone || "+254712445908";
    const dueAmount = charge.balance || (charge.totalAmount - charge.amountPaid);

    setDispatchingId(charge.id);
    setStatusMsg(`Initiating Daraja M-Pesa STK Push prompt for KSh ${dueAmount.toLocaleString()} to ${tenant?.fullName || 'Tenant'} (${targetPhone})...`);

    try {
      const res = await triggerStkPushServerFn({ data: { phone: targetPhone, amount: dueAmount } });
      if (res.success) {
        setStatusMsg(`✅ M-Pesa STK Push prompt successfully dispatched to ${targetPhone}! Ref: ${res.mockReference || "PENDING"}`);
      } else {
        setStatusMsg("❌ Failed to dispatch M-Pesa STK push prompt.");
      }
    } catch (err: any) {
      setStatusMsg("❌ Error dispatching STK Push: " + err?.message);
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Collections & Portfolio Risk Index"
        title="Arrears & Overdue Ledger"
        subtitle="Comprehensive risk watchlist categorized by Properties, Units, Tenants, and Leases with 1-click M-Pesa STK collection triggers."
      />

      {/* SOLID DOMINANT HIGH-CONTRAST METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-red-500 bg-red-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">Total Arrears Balance</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(totalArrears)}</span>
          </div>
          <p className="mt-2 text-xs text-red-100 font-medium">{overdueCharges.length} Overdue Rent Charges</p>
        </div>

        <div className="rounded-md border border-amber-500 bg-amber-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">High Severity (&gt;50k)</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(totalSevereArrears)}</span>
          </div>
          <p className="mt-2 text-xs text-amber-100 font-medium">{severeCharges.length} Critical Accounts</p>
        </div>

        <div className="rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Defaulting Tenants</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{defaultingTenantsCount}</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium">Distinct Tenant Accounts</p>
        </div>

        <div className="rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Risk Assessment</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">
              {totalArrears > 100000 ? "High Risk" : totalArrears > 0 ? "Moderate" : "Low Risk"}
            </span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium">Actionable Collection Queue</p>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 rounded-xs border border-primary/30 bg-primary/10 p-3 text-xs font-bold text-primary flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="text-xs hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* SEARCH ENGINE BAR */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-md shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search arrears by tenant name, phone, national ID, property asset, unit number, billing period..."
            className="w-full rounded-xs border border-border bg-background pl-9 pr-9 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium shrink-0">
            <span>Filtering by <strong className="text-primary">"{searchQuery}"</strong></span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[11px] font-bold text-danger hover:underline cursor-pointer flex items-center gap-1"
            >
              <FilterX size={13} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* INDIVIDUAL CATEGORY TAB FILTER BAR */}
      <div className="mb-6 flex items-center overflow-x-auto border-b border-border bg-card p-1.5 rounded-md gap-1 shadow-xs">
        <button
          onClick={() => setActiveCategoryTab("all")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Receipt size={14} /> All Arrears Records ({filteredOverdue.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("properties")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "properties"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-blue-950/20 hover:text-blue-400"
          }`}
        >
          <Building2 size={14} /> By Property Portfolio ({filteredProps.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("units")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "units"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-emerald-950/20 hover:text-emerald-400"
          }`}
        >
          <Home size={14} /> By Unit Inventory ({filteredUnits.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("tenants")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "tenants"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-amber-950/20 hover:text-amber-400"
          }`}
        >
          <Users size={14} /> By Defaulting Tenant ({filteredTenants.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("leases")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "leases"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-purple-950/20 hover:text-purple-400"
          }`}
        >
          <FileText size={14} /> By Active Lease ({filteredLeases.length})
        </button>
      </div>

      {/* DYNAMIC TAB VIEW 1: ALL OVERDUE CHARGES */}
      {activeCategoryTab === "all" && (
        <Panel title="Overdue Rent Accounts & Arrears Ledger" meta={`${filteredOverdue.length} active arrears records`}>
          {filteredOverdue.length > 0 ? (
            <Table head={["Tenant Account", "Property Asset & Unit", "Billing Period", "Total Billed", "Paid", "Balance Due", "Severity Risk", "Actions"]}>
              {filteredOverdue.map((c: any) => {
                const tenant = tenantMap.get(c.tenantId);
                const property = propertyMap.get(c.propertyId);
                const unit = unitMap.get(c.unitId);

                const tenantLabel = tenant ? tenant.fullName : c.tenantId;
                const propertyLabel = property ? property.name : c.propertyId || "Portfolio Property";
                const unitLabel = unit ? `Unit ${unit.unitNumber}` : c.unitId || "House";

                const due = c.balance || (c.totalAmount - c.amountPaid);
                const isSevere = due >= 50000;

                return (
                  <tr key={c.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td>
                      <span className="block font-bold text-foreground">{tenantLabel}</span>
                      <span className="text-[11px] font-mono text-muted-foreground">{tenant?.phone || c.tenantId}</span>
                    </Td>
                    <Td>
                      <span className="block font-semibold text-foreground">{propertyLabel}</span>
                      <span className="text-[11px] font-mono text-primary font-bold">{unitLabel}</span>
                    </Td>
                    <Td num className="font-semibold">{c.billingPeriod}</Td>
                    <Td num className="font-bold font-mono">{KSh(c.totalAmount || c.rentAmount || 0)}</Td>
                    <Td num className="text-success font-mono font-bold">{KSh(c.amountPaid || 0)}</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(due)}</Td>
                    <Td>
                      {isSevere ? (
                        <Badge variant="overdue">High Severity (&gt;50k)</Badge>
                      ) : (
                        <Badge variant="partial">Moderate (&lt;50k)</Badge>
                      )}
                    </Td>
                    <Td right>
                      <button
                        onClick={() => handleSendStkPush(c)}
                        disabled={dispatchingId === c.id}
                        className="inline-flex items-center gap-1.5 rounded-xs bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                      >
                        <Smartphone size={13} /> {dispatchingId === c.id ? "Sending..." : "STK Push"}
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <CheckCircle2 className="mx-auto text-success mb-3" size={36} />
              <p className="font-bold text-foreground text-sm">
                {searchQuery ? `No Arrears Found Matching "${searchQuery}"` : "Zero Outstanding Rent Arrears!"}
              </p>
              <p className="mt-1">All tenant rent payments across the portfolio are up to date.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
                >
                  <FilterX size={13} /> Clear Search Filter
                </button>
              )}
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 2: CATEGORIZED BY PROPERTY */}
      {activeCategoryTab === "properties" && (
        <Panel title="Property Portfolio Arrears Breakdown" meta={`${filteredProps.length} properties`}>
          <Table head={["Property Asset", "Code & Tier", "Units Occupied", "Total Billed Roll", "Arrears Balance", "Risk Index"]}>
            {filteredProps.map((p) => {
              const propCharges = overdueCharges.filter((c: any) => c.propertyId === p.id);
              const propArrears = propCharges.reduce((s: number, c: any) => s + (c.balance || (c.totalAmount - c.amountPaid)), 0);
              const allPropCharges = rentCharges.filter((c: any) => c.propertyId === p.id);
              const propBilled = allPropCharges.reduce((s: number, c: any) => s + (c.totalAmount || c.rentAmount || 0), 0);

              return (
                <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <Td>
                    <span className="block font-bold text-foreground">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">{p.address}</span>
                  </Td>
                  <Td num className="font-mono">{p.code} ({p.tier})</Td>
                  <Td num>{p.occupiedUnits} / {p.totalUnits} occupied</Td>
                  <Td num className="font-bold font-mono">{KSh(propBilled)}</Td>
                  <Td num className="font-extrabold text-danger font-mono">{KSh(propArrears)}</Td>
                  <Td>
                    <Badge variant={propArrears > 50000 ? "overdue" : propArrears > 0 ? "partial" : "paid"}>
                      {propArrears > 50000 ? "High Default Risk" : propArrears > 0 ? "Moderate Watch" : "Zero Arrears"}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 3: CATEGORIZED BY UNIT */}
      {activeCategoryTab === "units" && (
        <Panel title="Unit-Level Arrears Watchlist" meta={`${filteredUnits.length} units`}>
          <Table head={["Unit Door Number", "Belongs to Property", "Current Tenant", "Monthly Rent", "Outstanding Arrears", "Status"]}>
            {filteredUnits.map((u) => {
              const prop = propertyMap.get(u.propertyId);
              const unitLease = leases.find((l) => l.unitId === u.id);
              const tenant = unitLease ? tenantMap.get(unitLease.tenantId) : null;

              const unitOverdue = overdueCharges.filter((c: any) => c.unitId === u.id);
              const unitArrears = unitOverdue.reduce((s: number, c: any) => s + (c.balance || (c.totalAmount - c.amountPaid)), 0);

              return (
                <tr key={u.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <Td num className="font-bold font-mono text-primary text-sm">Unit {u.unitNumber}</Td>
                  <Td className="font-semibold">{prop?.name || u.propertyId}</Td>
                  <Td>
                    {tenant ? (
                      <div>
                        <span className="block font-bold text-foreground">{tenant.fullName}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">{tenant.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Vacant Unit</span>
                    )}
                  </Td>
                  <Td num className="font-bold font-mono">{KSh(u.monthlyRent)}</Td>
                  <Td num className="font-extrabold text-danger font-mono">{KSh(unitArrears)}</Td>
                  <Td>
                    <Badge variant={unitArrears > 0 ? "overdue" : "paid"}>
                      {unitArrears > 0 ? `${unitOverdue.length} Overdue Charge(s)` : "Up to Date"}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 4: CATEGORIZED BY DEFAULTING TENANT */}
      {activeCategoryTab === "tenants" && (
        <Panel title="Defaulting Tenant Accounts & Risk Index" meta={`${filteredTenants.length} tenants in arrears`}>
          {filteredTenants.length > 0 ? (
            <Table head={["Defaulting Tenant", "Contact Phone & ID", "Assigned Property & Unit", "Total Arrears Due", "Overdue Periods", "Actions"]}>
              {filteredTenants.map((t) => {
                const tenantLease = leases.find((l) => l.tenantId === t.id);
                const prop = tenantLease ? propertyMap.get(tenantLease.propertyId) : null;
                const unit = tenantLease ? unitMap.get(tenantLease.unitId) : null;

                const tenantOverdue = overdueCharges.filter((c: any) => c.tenantId === t.id);
                const tenantArrears = tenantOverdue.reduce((s: number, c: any) => s + (c.balance || (c.totalAmount - c.amountPaid)), 0);
                const periods = tenantOverdue.map((c: any) => c.billingPeriod).join(", ");

                return (
                  <tr key={t.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td className="font-bold text-foreground text-sm">{t.fullName}</Td>
                    <Td num className="font-mono">
                      <span className="block text-foreground font-semibold">{t.phone}</span>
                      <span className="text-[11px] text-muted-foreground">ID: {t.nationalId}</span>
                    </Td>
                    <Td>
                      <span className="block font-semibold text-foreground">{prop?.name || "Portfolio Property"}</span>
                      <span className="text-[11px] font-mono text-primary font-bold">Unit {unit?.unitNumber || "House"}</span>
                    </Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(tenantArrears)}</Td>
                    <Td num className="text-muted-foreground font-medium">{periods || "Current Period"}</Td>
                    <Td right>
                      {tenantOverdue[0] && (
                        <button
                          onClick={() => handleSendStkPush(tenantOverdue[0])}
                          disabled={dispatchingId === tenantOverdue[0].id}
                          className="inline-flex items-center gap-1.5 rounded-xs bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
                        >
                          <Smartphone size={13} /> {dispatchingId === tenantOverdue[0].id ? "Sending..." : "Prompt STK Push"}
                        </button>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <CheckCircle2 className="mx-auto text-success mb-3" size={36} />
              <p className="font-bold text-foreground text-sm">No Defaulting Tenants Found Matching "{searchQuery}"</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
                >
                  <FilterX size={13} /> Clear Search Filter
                </button>
              )}
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 5: CATEGORIZED BY LEASE */}
      {activeCategoryTab === "leases" && (
        <Panel title="Lease Contracts Under Arrears Notice" meta={`${filteredLeases.length} leases`}>
          {filteredLeases.length > 0 ? (
            <Table head={["Lease Reference", "Tenant Account", "Property & Unit", "Agreed Monthly Rent", "Arrears Balance", "Lease Status"]}>
              {filteredLeases.map((l) => {
                const tenant = tenantMap.get(l.tenantId);
                const prop = propertyMap.get(l.propertyId);
                const unit = unitMap.get(l.unitId);

                const leaseOverdue = overdueCharges.filter((c: any) => c.leaseId === l.id || c.tenantId === l.tenantId);
                const leaseArrears = leaseOverdue.reduce((s: number, c: any) => s + (c.balance || (c.totalAmount - c.amountPaid)), 0);

                return (
                  <tr key={l.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td num className="font-bold font-mono text-primary text-xs">{l.id}</Td>
                    <Td className="font-bold text-foreground">{tenant?.fullName || l.tenantId}</Td>
                    <Td>
                      <span className="block font-semibold text-foreground">{prop?.name || l.propertyId}</span>
                      <span className="text-[11px] font-mono text-primary font-bold">Unit {unit?.unitNumber || l.unitId}</span>
                    </Td>
                    <Td num className="font-bold font-mono">{KSh(l.monthlyRent)}</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(leaseArrears)}</Td>
                    <Td>
                      <Badge variant={leaseArrears > 0 ? "overdue" : "paid"}>
                        {leaseArrears > 0 ? "Under Default Notice" : "In Good Standing"}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <CheckCircle2 className="mx-auto text-success mb-3" size={36} />
              <p className="font-bold text-foreground text-sm">No Leases Under Default Notice Matching "{searchQuery}"</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
                >
                  <FilterX size={13} /> Clear Search Filter
                </button>
              )}
            </div>
          )}
        </Panel>
      )}
    </AppShell>
  );
}
