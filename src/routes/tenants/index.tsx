import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { Plus, Users, Home, ShieldCheck, Banknote, Trash2 } from "lucide-react";
import { useState } from "react";

const getTenantsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { TenantService } = await import("@/server/services/tenant.service");
  const { PropertyService } = await import("@/server/services/property.service");
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  const properties = await PropertyService.getAllProperties(session.organizationId, session.role);
  return { tenants, properties };
});

const deleteTenantServerFn = createServerFn({ method: "POST" })
  .validator((d: { tenantId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { TenantService } = await import("@/server/services/tenant.service");
    return await TenantService.deleteTenant(session.organizationId, data.tenantId, session.role);
  });

const genUniqueId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const createTenantServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      fullName: string;
      phone: string;
      email?: string;
      nationalId: string;
      houseNumber: string;
      propertyId?: string;
      depositAmount: number;
      monthlyRent: number;
      startingPayment: number;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { TenantService } = await import("@/server/services/tenant.service");
      const { PropertyRepository } = await import("@/server/repositories/property.repository");
      const { LeaseRepository } = await import("@/server/repositories/lease.repository");
      const { TenantContext } = await import("@/server/auth/tenant-context");
      const { db } = await import("@/db");
      const { rentCharges, payments } = await import("@/db/schema");

      const now = new Date().toISOString();
      const tenantId = genUniqueId("t");
      const ctx = new TenantContext({
        userId: session.userId,
        organizationId: session.organizationId,
        role: session.role,
        email: session.email,
        name: session.name,
        isAuthenticated: true,
      });


      // 1. Create Tenant Profile
      const tenantRes = await TenantService.createTenant(
        session.organizationId,
        {
          id: tenantId,
          organizationId: session.organizationId,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
          nationalId: data.nationalId,
          emergencyContact: "+254 700 000 000",
          score: 100,
          status: "Active",
          createdAt: now,
          updatedAt: now,
        },
        session.role
      );

      // 2. Get or Create Property Asset
      const propRepo = new PropertyRepository(ctx);
      let targetPropertyId = data.propertyId;
      const existingProps = await propRepo.findAllProperties();

      if (!targetPropertyId || existingProps.length === 0) {
        if (existingProps.length > 0) {
          targetPropertyId = existingProps[0].id;
        } else {
          const newProp = await propRepo.createProperty({
            id: genUniqueId("prop"),
            organizationId: session.organizationId,
            name: "Nairobi Executive Portfolio",
            propertyCode: "NEP-01",
            area: "Nairobi Central",
            tier: "Executive",
            totalUnits: 20,
            occupiedUnits: 1,
            caretakerName: "Main Office Caretaker",
            caretakerPhone: data.phone,
            yearBuilt: 2024,
            status: "ACTIVE",
            createdAt: now,
            updatedAt: now,
          });
          targetPropertyId = newProp.id;
        }
      }

      // 3. Create Unit (House Number)
      const unitId = genUniqueId("unit");
      const newUnit = await propRepo.createUnit({
        id: unitId,
        organizationId: session.organizationId,
        propertyId: targetPropertyId,
        unitNumber: data.houseNumber,
        type: "Residential",
        monthlyRent: data.monthlyRent,
        serviceCharge: 0,
        depositAmount: data.depositAmount,
        status: "Occupied",
        createdAt: now,
        updatedAt: now,
      });

      // 4. Create Active Lease
      const leaseRepo = new LeaseRepository(ctx);
      const leaseId = genUniqueId("lease");
      const startDate = now.substring(0, 10);
      const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
      const newLease = await leaseRepo.createLease({
        id: leaseId,
        organizationId: session.organizationId,
        propertyId: targetPropertyId,
        unitId: newUnit.id,
        tenantId: tenantId,
        startDate,
        endDate,
        monthlyRent: data.monthlyRent,
        depositAmount: data.depositAmount,
        billingDay: 1,
        status: "Active",
        createdAt: now,
        updatedAt: now,
      });

      // 5. Create Initial Rent Charge Entry
      const chargeId = genUniqueId("chg");
      const currentPeriod = "Aug 2026";
      const rentAmount = data.monthlyRent;
      const totalAmount = data.monthlyRent;
      const amountPaid = Math.min(data.startingPayment, totalAmount);
      const balance = Math.max(0, totalAmount - amountPaid);
      const chargeStatus = balance <= 0 ? "PAID" : amountPaid > 0 ? "PARTIAL" : "PENDING";

      await db.insert(rentCharges).values({
        id: chargeId,
        organizationId: session.organizationId,
        leaseId: newLease.id,
        tenantId: tenantId,
        unitId: newUnit.id,
        propertyId: targetPropertyId,
        billingPeriod: currentPeriod,
        dueDate: startDate,
        rentAmount,
        serviceCharge: 0,
        totalAmount,
        amountPaid,
        balance,
        status: chargeStatus,
        createdAt: now,
        updatedAt: now,
      });

      // 6. Record Initial Payment Entry if payment made
      if (data.startingPayment > 0) {
        const pmtId = genUniqueId("pmt");
        const txRef = `ONB${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 899 + 100)}`;
        await db.insert(payments).values({
          id: pmtId,
          organizationId: session.organizationId,
          tenantId,
          leaseId: newLease.id,
          unitId: newUnit.id,
          propertyId: targetPropertyId,
          amount: data.startingPayment,
          paymentMethod: "M-PESA",
          transactionReference: txRef,
          transactionDate: now,
          status: "COMPLETED",
          notes: "Onboarding Deposit & Starting Rent Payment",
          createdBy: session.userId,
          createdAt: now,
          updatedAt: now,
        });
      }

      return { success: true, tenant: tenantRes.tenant };
    } catch (err: any) {
      console.error("Failed to onboard tenant:", err);
      return { success: false, error: err?.message || "Failed to onboard tenant. Please check your data." };
    }
  });

export const Route = createFileRoute("/tenants/")({
  loader: () => getTenantsData(),
  component: TenantsPage,
});

function TenantsPage() {
  const { tenants, properties } = Route.useLoaderData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+254 ");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [propertyId, setPropertyId] = useState(properties[0]?.id || "");
  const [depositAmount, setDepositAmount] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [startingPayment, setStartingPayment] = useState("");

  const handleDeleteTenant = async (tenantId: string, name: string) => {
    if (confirm(`Are you sure you want to delete tenant "${name}"? This action cannot be undone.`)) {
      setDeletingId(tenantId);
      try {
        await deleteTenantServerFn({ data: { tenantId } });
        router.invalidate();
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await createTenantServerFn({
        data: {
          fullName,
          phone,
          nationalId,
          email,
          houseNumber: houseNumber || `House A-${Math.floor(Math.random() * 89) + 10}`,
          propertyId: propertyId || properties[0]?.id,
          depositAmount: depositAmount ? Number(depositAmount) : 0,
          monthlyRent: monthlyRent ? Number(monthlyRent) : 0,
          startingPayment: startingPayment ? Number(startingPayment) : 0,
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to onboard tenant.");
        return;
      }

      setShowModal(false);
      setFullName("");
      setPhone("+254 ");
      setNationalId("");
      setEmail("");
      setHouseNumber("");
      setDepositAmount("");
      setMonthlyRent("");
      setStartingPayment("");
      setErrorMessage(null);
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Portfolio Directory"
        title="Tenants"
        subtitle="Manage active tenants, contact credentials, national IDs, house numbers, security deposits, and starting rent payments."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus size={15} /> Add tenant
          </button>
        }
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Onboard New Tenant</h3>
                <p className="text-[11px] text-muted-foreground">Capture tenant credentials, house assignment, deposit, and initial rent payment.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              {/* Tenant Credentials */}
              <div className="rounded-xs border border-border p-3 space-y-3 bg-muted/20">
                <div className="font-bold text-primary flex items-center gap-1">
                  <Users size={14} /> 1. Personal & Contact Identity
                </div>
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wanjiru Kimani"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Phone Number (M-Pesa) *</label>
                    <input
                      type="text"
                      required
                      placeholder="+254 7..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">National ID / Passport *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 34891029"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. wanjiru@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* House / Unit Assignment */}
              <div className="rounded-xs border border-border p-3 space-y-3 bg-muted/20">
                <div className="font-bold text-primary flex items-center gap-1">
                  <Home size={14} /> 2. Property & House / Unit Assignment
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">House / Unit Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House A-04 / Apt 12B"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Property Asset</label>
                    <select
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.area})
                        </option>
                      ))}
                      {properties.length === 0 && <option value="">Nairobi Central Portfolio (Default)</option>}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Deposit & Starting Rent Payment */}
              <div className="rounded-xs border border-border p-3 space-y-3 bg-muted/20">
                <div className="font-bold text-primary flex items-center gap-1">
                  <Banknote size={14} /> 3. Deposit & Rent Ledger Terms
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Deposit (KSh) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 25000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Monthly Rent (KSh) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 25000"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Starting Payment *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 50000"
                      value={startingPayment}
                      onChange={(e) => setStartingPayment(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono text-success font-bold"
                    />
                  </div>
                </div>
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
                  {isSubmitting ? "Processing Ledger..." : "Complete Onboarding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Panel title="Active Tenants" meta={`${tenants.length} tenants registered`}>
        {tenants.length > 0 ? (
          <Table head={["Tenant Name", "Phone", "Email", "National ID", "Payment Score", "Status", "Actions"]}>
            {tenants.map((t: (typeof tenants)[number]) => (
              <tr key={t.id} className="transition-colors duration-150 hover:bg-muted/50">
                <Td>
                  <Link to="/tenants/$tenantId" params={{ tenantId: t.id }} className="font-semibold text-primary hover:underline">
                    {t.fullName}
                  </Link>
                </Td>
                <Td num>{t.phone}</Td>
                <Td>{t.email}</Td>
                <Td num>{t.nationalId}</Td>
                <Td num>
                  <span className={`font-bold ${t.score > 85 ? "text-success" : t.score > 70 ? "text-warning" : "text-danger"}`}>
                    {t.score} / 100
                  </span>
                </Td>
                <Td>
                  <Badge variant={t.status === "Active" ? "paid" : "neutral"}>{t.status}</Badge>
                </Td>
                <Td right>
                  <div className="flex items-center justify-end gap-3">
                    <Link to="/tenants/$tenantId" params={{ tenantId: t.id }} className="text-xs font-semibold text-primary">
                      View Profile →
                    </Link>
                    <button
                      onClick={() => handleDeleteTenant(t.id, t.fullName)}
                      disabled={deletingId === t.id}
                      title="Delete Tenant"
                      className="p-1 rounded text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <Users className="mx-auto text-muted-foreground/40 mb-3" size={32} />
            <p className="font-bold text-foreground text-sm">No Tenants Onboarded Yet</p>
            <p className="mt-1">Onboard your first tenant account to link active unit leases and track M-Pesa rent payments.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus size={14} /> Onboard First Tenant
            </button>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
