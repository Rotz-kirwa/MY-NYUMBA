import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { useState, useEffect } from "react";
import {
  Banknote,
  Plus,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Building2,
  Home,
  Users,
  FileText,
  Receipt,
  Search,
  X,
  FilterX,
} from "lucide-react";

const getPaymentsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { FinancialService } = await import("@/server/services/financial.service");
  const { PropertyService } = await import("@/server/services/property.service");
  const { TenantService } = await import("@/server/services/tenant.service");

  const payments = await FinancialService.getPayments(session.organizationId, session.role);
  const rentCharges = await FinancialService.getRentCharges(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  const leases = await TenantService.getAllLeases(session.organizationId, session.role);

  return { payments, rentCharges, props, units, tenants, leases };
});

const recordPaymentServerFn = createServerFn({ method: "POST" })
  .validator((d: {
    tenantId: string;
    leaseId: string;
    unitId: string;
    propertyId: string;
    amount: number;
    paymentMethod: string;
    transactionReference: string;
    notes?: string;
  }) => d)
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { FinancialService } = await import("@/server/services/financial.service");
      return await FinancialService.recordPayment(
        session.organizationId,
        session.role,
        session.userId,
        data
      );
    } catch (err: any) {
      console.error("Error recording payment:", err);
      return { success: false, error: err?.message || "Failed to record payment transaction." };
    }
  });

const triggerStkPushServerFn = createServerFn({ method: "POST" })
  .validator((d: { phone: string; amount: number }) => d)
  .handler(async ({ data }) => {
    const { MpesaIntegration } = await import("@/server/integrations/mpesa");
    return await MpesaIntegration.initiateStkPush({
      phoneNumber: data.phone,
      amount: data.amount,
      accountReference: "RENT",
    });
  });


export const Route = createFileRoute("/payments/")({
  loader: () => getPaymentsData(),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { payments = [], rentCharges = [], props = [], units = [], tenants = [], leases = [] } = Route.useLoaderData() || {};
  const router = useRouter();

  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "properties" | "units" | "tenants" | "leases">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"manual" | "stk">("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Form Fields
  const [selectedTenantId, setSelectedTenantId] = useState(tenants?.[0]?.id || "");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedLeaseId, setSelectedLeaseId] = useState("");
  const [amount, setAmount] = useState<string | number>("");
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa Paybill");
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");

  // Auto update dependent fields when tenant is selected
  useEffect(() => {
    if (!selectedTenantId && tenants.length > 0) {
      setSelectedTenantId(tenants[0].id);
    }
    const tenant = tenants.find((t) => t.id === selectedTenantId);
    if (tenant) {
      setPhone(tenant.phone);
      const activeLease = leases.find((l) => l.tenantId === tenant.id && l.status === "Active") || leases.find((l) => l.tenantId === tenant.id);
      if (activeLease) {
        setSelectedLeaseId(activeLease.id);
        setSelectedPropertyId(activeLease.propertyId);
        setSelectedUnitId(activeLease.unitId);
        setAmount(activeLease.monthlyRent || "");
      } else {
        const defaultProp = props[0]?.id || "";
        const defaultUnit = units[0]?.id || "";
        setSelectedPropertyId(defaultProp);
        setSelectedUnitId(defaultUnit);
        setSelectedLeaseId(`lease_${Date.now()}`);
      }
    }
  }, [selectedTenantId, tenants, leases, props, units]);

  // Lookup Maps
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));
  const propertyMap = new Map(props.map((p) => [p.id, p]));
  const unitMap = new Map(units.map((u) => [u.id, u]));

  // Metrics Calculations
  const totalCollected = payments.reduce((acc, p) => acc + (p.status === "COMPLETED" ? p.amount || 0 : 0), 0);
  const mpesaCollected = payments
    .filter((p) => p.status === "COMPLETED" && (p.paymentMethod.toLowerCase().includes("mpesa") || p.paymentMethod.toLowerCase().includes("m-pesa")))
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const bankCollected = totalCollected - mpesaCollected;

  // Real-time Search Engine Filters
  const query = searchQuery.trim().toLowerCase();

  const filteredPayments = payments.filter((p) => {
    if (!query) return true;
    const tenant = tenantMap.get(p.tenantId);
    const property = propertyMap.get(p.propertyId);
    const unit = unitMap.get(p.unitId);

    return (
      p.transactionReference?.toLowerCase().includes(query) ||
      p.paymentMethod?.toLowerCase().includes(query) ||
      tenant?.fullName?.toLowerCase().includes(query) ||
      tenant?.phone?.includes(query) ||
      property?.name?.toLowerCase().includes(query) ||
      property?.code?.toLowerCase().includes(query) ||
      unit?.unitNumber?.toLowerCase().includes(query) ||
      p.unitId?.toLowerCase().includes(query)
    );
  });

  const filteredProps = props.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      p.tier.toLowerCase().includes(query)
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
    if (!query) return true;
    const tenant = tenantMap.get(l.tenantId);
    const prop = propertyMap.get(l.propertyId);
    const unit = unitMap.get(l.unitId);

    return (
      l.id.toLowerCase().includes(query) ||
      tenant?.fullName?.toLowerCase().includes(query) ||
      prop?.name?.toLowerCase().includes(query) ||
      unit?.unitNumber?.toLowerCase().includes(query) ||
      l.status.toLowerCase().includes(query)
    );
  });

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const ref = transactionRef.trim() || `MP${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      const res = await recordPaymentServerFn({
        data: {
          tenantId: selectedTenantId,
          leaseId: selectedLeaseId,
          unitId: selectedUnitId,
          propertyId: selectedPropertyId,
          amount: Number(amount) || 0,
          paymentMethod,
          transactionReference: ref,
          notes: notes || "Rent payment recorded via manager ledger",
        },
      });

      if (res && "error" in res && res.error) {
        setErrorMessage(res.error);
        return;
      }

      setShowModal(false);
      setTransactionRef("");
      setNotes("");
      setErrorMessage(null);
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg("Initiating Daraja M-Pesa STK Push...");
    try {
      const res = await triggerStkPushServerFn({ data: { phone, amount: Number(amount) } });
      if (res.success) {
        setStatusMsg(`STK Push prompt sent to ${phone}! Ref: ${res.mockReference || "PENDING"}`);
        setTimeout(() => {
          setShowModal(false);
          setStatusMsg("");
          router.invalidate();
        }, 2000);
      } else {
        setStatusMsg("Failed to send STK push prompt.");
      }
    } catch (err: any) {
      setStatusMsg("STK Push error: " + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Financial Ledger & Real-Time Search Engine"
        title="Rent & Payments"
        subtitle="Search transactions, properties, units, tenants, and leases with individual category breakdowns."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus size={15} /> Record Payment
          </button>
        }
      />

      {/* SOLID DOMINANT CATEGORIZED FINANCIAL METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-emerald-500 bg-emerald-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Total Revenue Collected</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Banknote size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(totalCollected)}</span>
          </div>
          <p className="mt-2 text-xs text-emerald-100 font-medium">Reconciled Portfolio Inflow</p>
        </div>

        <div className="rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">M-Pesa Mobile Inflow</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Smartphone size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(mpesaCollected)}</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium">Daraja STK & Paybill Settlements</p>
        </div>

        <div className="rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Bank Wire & Cash</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(bankCollected)}</span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium">NCBA / Equity Direct Receipts</p>
        </div>

        <div className="rounded-md border border-amber-500 bg-amber-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Ledger Receipts</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Receipt size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{payments.length}</span>
          </div>
          <p className="mt-2 text-xs text-amber-100 font-medium">Total Individual Receipts On Record</p>
        </div>
      </div>

      {/* SEARCH ENGINE BAR */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-md shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by M-Pesa ref, tenant name, phone, property asset, unit number, lease ID..."
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
          <Receipt size={14} /> All Payment Transactions ({filteredPayments.length})
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
          <Users size={14} /> By Tenant Account ({filteredTenants.length})
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

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Record Rent Payment Transaction</h3>
                <p className="text-[11px] text-muted-foreground">Categorize fund inflow by Property, Unit, Tenant, and Active Lease.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-xs border border-border">
              <button
                type="button"
                onClick={() => setModalMode("manual")}
                className={`py-1.5 text-xs font-bold rounded-xs transition-colors ${
                  modalMode === "manual" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Record Received Payment
              </button>
              <button
                type="button"
                onClick={() => setModalMode("stk")}
                className={`py-1.5 text-xs font-bold rounded-xs transition-colors ${
                  modalMode === "stk" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Trigger M-Pesa STK Push
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            {modalMode === "manual" ? (
              <form onSubmit={handleRecordManualPayment} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Select Tenant Account *</label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.phone}) · ID: {t.nationalId}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xs border border-border bg-muted/40 p-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5"><Building2 size={13} /> Property Portfolio</span>
                    <span className="font-bold text-foreground">
                      {propertyMap.get(selectedPropertyId)?.name || "Nairobi Executive Portfolio"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5"><Home size={13} /> Assigned Door / Unit</span>
                    <span className="font-bold text-primary font-mono">
                      Unit {unitMap.get(selectedUnitId)?.unitNumber || "House A-04"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Amount Paid (KSh) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 30000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold text-success"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Payment Method / Channel *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                    >
                      <option value="M-Pesa Paybill">M-Pesa Paybill</option>
                      <option value="M-Pesa Till">M-Pesa Till Number</option>
                      <option value="NCBA Bank Transfer">NCBA Bank Transfer</option>
                      <option value="Equity Bank Direct">Equity Bank Direct</option>
                      <option value="Cash Receipt">Cash Receipt</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">M-Pesa Ref / Transaction Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QK872X99L"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Ledger Memo / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. August 2026 rent payment via M-Pesa"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xs border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    {isSubmitting ? "Recording Transaction..." : "Save Payment Entry"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStkPush} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Select Tenant Account</label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Target M-Pesa Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Amount to Prompt (KSh) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                  />
                </div>

                {statusMsg && (
                  <div className="rounded-xs bg-primary/10 border border-primary/30 p-2.5 text-xs font-semibold text-primary">
                    {statusMsg}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xs border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    <Smartphone size={14} /> Send M-Pesa STK Push
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DYNAMIC TAB VIEW 1: ALL TRANSACTIONS */}
      {activeCategoryTab === "all" && (
        <Panel title="Categorized Payment Ledger" meta={`${filteredPayments.length} of ${payments.length} total payments`}>
          {filteredPayments.length > 0 ? (
            <Table head={["Transaction Ref", "Tenant Account", "Property Asset & Unit", "Amount Paid", "Date & Time", "Payment Channel", "Status"]}>
              {filteredPayments.map((p: (typeof payments)[number]) => {
                const tenant = tenantMap.get(p.tenantId);
                const property = propertyMap.get(p.propertyId);
                const unit = unitMap.get(p.unitId);

                const tenantLabel = tenant ? tenant.fullName : p.tenantId;
                const propertyLabel = property ? property.name : p.propertyId || "Portfolio Property";
                const unitLabel = unit ? `Unit ${unit.unitNumber}` : p.unitId || "House";

                return (
                  <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td num className="font-bold font-mono text-primary">{p.transactionReference}</Td>
                    <Td>
                      <span className="block font-bold text-foreground">{tenantLabel}</span>
                      <span className="text-[11px] font-mono text-muted-foreground">{tenant?.phone || p.tenantId}</span>
                    </Td>
                    <Td>
                      <span className="block font-semibold text-foreground">{propertyLabel}</span>
                      <span className="text-[11px] font-mono text-primary font-bold">{unitLabel}</span>
                    </Td>
                    <Td num className="font-extrabold text-success font-mono">{KSh(p.amount)}</Td>
                    <Td num className="text-muted-foreground">{new Date(p.transactionDate).toLocaleString()}</Td>
                    <Td>
                      <Badge variant="neutral">{p.paymentMethod}</Badge>
                    </Td>
                    <Td>
                      <Badge variant={p.status === "COMPLETED" ? "paid" : "neutral"}>{p.status}</Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <CreditCard className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">
                {searchQuery ? `No Payment Transactions Found Matching "${searchQuery}"` : "No Payment Transactions Recorded Yet"}
              </p>
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
        <Panel title="Property Portfolio Revenue Breakdown" meta={`${filteredProps.length} of ${props.length} properties`}>
          {filteredProps.length > 0 ? (
            <Table head={["Property Asset", "Code & Tier", "Total Units", "Total Billed Roll", "Total Rent Collected", "Arrears Carried", "Collection Rate"]}>
              {filteredProps.map((p) => {
                const propPayments = payments.filter((pmt) => pmt.propertyId === p.id && pmt.status === "COMPLETED");
                const propCollected = propPayments.reduce((s, pmt) => s + (pmt.amount || 0), 0);
                const propCharges = rentCharges.filter((c) => c.propertyId === p.id);
                const propBilled = propCharges.reduce((s, c) => s + (c.totalAmount || c.rentAmount || 0), 0);
                const propArrears = propCharges.reduce((s, c) => s + (c.balance || 0), 0);
                const rate = propBilled > 0 ? Math.round((propCollected / propBilled) * 100) : (propCollected > 0 ? 100 : 0);

                return (
                  <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td>
                      <span className="block font-bold text-foreground">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">{p.address}</span>
                    </Td>
                    <Td num className="font-mono">{p.code} ({p.tier})</Td>
                    <Td num>{p.occupiedUnits} / {p.totalUnits} occupied</Td>
                    <Td num className="font-bold font-mono">{KSh(propBilled)}</Td>
                    <Td num className="font-extrabold text-success font-mono">{KSh(propCollected)}</Td>
                    <Td num className="font-bold text-danger font-mono">{KSh(propArrears)}</Td>
                    <Td>
                      <span className={`inline-flex items-center rounded-xs px-2 py-0.5 text-xs font-bold ${
                        rate >= 90 ? "bg-success/15 text-success" : rate >= 70 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"
                      }`}>
                        {rate}% Paid
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Building2 className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Properties Found Matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
              >
                <FilterX size={13} /> Clear Search Filter
              </button>
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 3: CATEGORIZED BY UNIT */}
      {activeCategoryTab === "units" && (
        <Panel title="Individual Unit Settlement Breakdown" meta={`${filteredUnits.length} of ${units.length} units`}>
          {filteredUnits.length > 0 ? (
            <Table head={["Unit Door Number", "Belongs to Property", "Assigned Tenant", "Monthly Rent Rate", "Total Rent Paid", "Occupancy Status"]}>
              {filteredUnits.map((u) => {
                const prop = propertyMap.get(u.propertyId);
                const unitLease = leases.find((l) => l.unitId === u.id);
                const tenant = unitLease ? tenantMap.get(unitLease.tenantId) : null;
                const unitPayments = payments.filter((pmt) => pmt.unitId === u.id && pmt.status === "COMPLETED");
                const totalPaid = unitPayments.reduce((s, pmt) => s + (pmt.amount || 0), 0);

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
                    <Td num className="font-extrabold text-success font-mono">{KSh(totalPaid)}</Td>
                    <Td>
                      <Badge variant={u.status === "Occupied" ? "paid" : u.status === "Vacant" ? "neutral" : "overdue"}>
                        {u.status}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Home className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Units Found Matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
              >
                <FilterX size={13} /> Clear Search Filter
              </button>
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 4: CATEGORIZED BY TENANT */}
      {activeCategoryTab === "tenants" && (
        <Panel title="Tenant Payment Ledgers & Accounts" meta={`${filteredTenants.length} of ${tenants.length} tenants`}>
          {filteredTenants.length > 0 ? (
            <Table head={["Tenant Account", "National ID & Phone", "Assigned Property & Unit", "Total Billed Roll", "Total Rent Settled", "Outstanding Balance", "Account Status"]}>
              {filteredTenants.map((t) => {
                const tenantLease = leases.find((l) => l.tenantId === t.id);
                const prop = tenantLease ? propertyMap.get(tenantLease.propertyId) : null;
                const unit = tenantLease ? unitMap.get(tenantLease.unitId) : null;

                const tenantPayments = payments.filter((pmt) => pmt.tenantId === t.id && pmt.status === "COMPLETED");
                const tenantCollected = tenantPayments.reduce((s, pmt) => s + (pmt.amount || 0), 0);
                const tenantCharges = rentCharges.filter((c) => c.tenantId === t.id);
                const tenantBilled = tenantCharges.reduce((s, c) => s + (c.totalAmount || c.rentAmount || 0), 0);
                const tenantBalance = tenantCharges.reduce((s, c) => s + (c.balance || 0), 0);

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
                    <Td num className="font-bold font-mono">{KSh(tenantBilled)}</Td>
                    <Td num className="font-extrabold text-success font-mono">{KSh(tenantCollected)}</Td>
                    <Td num className="font-bold text-danger font-mono">{KSh(tenantBalance)}</Td>
                    <Td>
                      <Badge variant={tenantBalance === 0 ? "paid" : "overdue"}>
                        {tenantBalance === 0 ? "Good Standing" : "In Arrears"}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Users className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Tenants Found Matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
              >
                <FilterX size={13} /> Clear Search Filter
              </button>
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 5: CATEGORIZED BY LEASE */}
      {activeCategoryTab === "leases" && (
        <Panel title="Active Tenancy Lease Agreements" meta={`${filteredLeases.length} of ${leases.length} leases`}>
          {filteredLeases.length > 0 ? (
            <Table head={["Lease Reference", "Tenant Account", "Property & Unit", "Deposit Paid", "Agreed Monthly Rent", "Total Settled", "Lease Status"]}>
              {filteredLeases.map((l) => {
                const tenant = tenantMap.get(l.tenantId);
                const prop = propertyMap.get(l.propertyId);
                const unit = unitMap.get(l.unitId);

                const leasePayments = payments.filter((pmt) => pmt.leaseId === l.id && pmt.status === "COMPLETED");
                const totalSettled = leasePayments.reduce((s, pmt) => s + (pmt.amount || 0), 0);

                return (
                  <tr key={l.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td num className="font-bold font-mono text-primary text-xs">{l.id}</Td>
                    <Td className="font-bold text-foreground">{tenant?.fullName || l.tenantId}</Td>
                    <Td>
                      <span className="block font-semibold text-foreground">{prop?.name || l.propertyId}</span>
                      <span className="text-[11px] font-mono text-primary font-bold">Unit {unit?.unitNumber || l.unitId}</span>
                    </Td>
                    <Td num className="font-bold font-mono text-amber-400">{KSh(l.depositAmount)}</Td>
                    <Td num className="font-bold font-mono">{KSh(l.monthlyRent)}</Td>
                    <Td num className="font-extrabold text-success font-mono">{KSh(totalSettled)}</Td>
                    <Td>
                      <Badge variant={l.status === "Active" ? "paid" : "neutral"}>{l.status}</Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <FileText className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Leases Found Matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
              >
                <FilterX size={13} /> Clear Search Filter
              </button>
            </div>
          )}
        </Panel>
      )}
    </AppShell>
  );
}
