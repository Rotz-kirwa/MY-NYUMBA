import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, Metric, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { Plus, FileText, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";

const getLeasesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { TenantService } = await import("@/server/services/tenant.service");
  const { PropertyService } = await import("@/server/services/property.service");
  const leases = await TenantService.getAllLeases(session.organizationId, session.role);
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  return { leases, tenants, props, units };
});

const genUniqueId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const createLeaseServerFn = createServerFn({ method: "POST" })
  .validator((d: {
    tenantId: string;
    propertyId: string;
    unitId: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
    billingDay: number;
    status: string;
  }) => d)
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { TenantContext } = await import("@/server/auth/tenant-context");
      const { LeaseRepository } = await import("@/server/repositories/lease.repository");
      const { PropertyRepository } = await import("@/server/repositories/property.repository");

      const ctx = new TenantContext({
        userId: session.userId,
        organizationId: session.organizationId,
        role: session.role,
        email: session.email,
        name: session.name,
        isAuthenticated: true,
      });

      const leaseRepo = new LeaseRepository(ctx);
      const propRepo = new PropertyRepository(ctx);
      const leaseId = genUniqueId("lease");


      const newLease = await leaseRepo.createLease({
        id: leaseId,
        organizationId: session.organizationId,
        propertyId: data.propertyId,
        unitId: data.unitId,
        tenantId: data.tenantId,
        startDate: data.startDate,
        endDate: data.endDate,
        monthlyRent: data.monthlyRent,
        depositAmount: data.depositAmount,
        billingDay: data.billingDay || 1,
        status: data.status || "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update unit status to occupied
      const targetUnit = await propRepo.findUnitById(data.unitId);
      if (targetUnit) {
        await propRepo.createUnit({
          ...targetUnit,
          status: "Occupied",
          updatedAt: new Date().toISOString(),
        });
      }

      return { success: true, lease: newLease };
    } catch (err: any) {
      console.error("Error creating lease:", err);
      return { success: false, error: err?.message || "Failed to create lease contract." };
    }
  });

const deleteLeaseServerFn = createServerFn({ method: "POST" })
  .validator((d: { leaseId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { TenantService } = await import("@/server/services/tenant.service");
    return await TenantService.deleteLease(session.organizationId, data.leaseId, session.role);
  });


export const Route = createFileRoute("/leases/")({
  loader: () => getLeasesData(),
  component: LeasesPage,
});

function LeasesPage() {
  const { leases, tenants, props, units } = Route.useLoaderData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().substring(0, 10);
  const nextYearStr = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

  // Form fields
  const [tenantId, setTenantId] = useState(tenants[0]?.id || "");
  const [propertyId, setPropertyId] = useState(props[0]?.id || "");
  const [unitId, setUnitId] = useState(units[0]?.id || "");
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextYearStr);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [billingDay, setBillingDay] = useState(1);
  const [status, setStatus] = useState("Active");

  const activeLeasesCount = leases.filter((l) => l.status === "Active").length;
  const totalMonthlyRoll = leases.reduce((sum, l) => sum + (l.monthlyRent || 0), 0);

  const handleDeleteLease = async (lId: string) => {
    if (confirm(`Are you sure you want to delete lease "${lId}"?`)) {
      setDeletingId(lId);
      try {
        await deleteLeaseServerFn({ data: { leaseId: lId } });
        router.invalidate();
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCreateLease = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const targetTenantId = tenantId || tenants[0]?.id;
    const targetPropId = propertyId || props[0]?.id;
    const targetUnitId = unitId || units[0]?.id;

    if (!targetTenantId || !targetPropId || !targetUnitId) {
      setErrorMessage("Please ensure tenants, properties, and units exist before creating a lease.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createLeaseServerFn({
        data: {
          tenantId: targetTenantId,
          propertyId: targetPropId,
          unitId: targetUnitId,
          startDate,
          endDate,
          monthlyRent: monthlyRent ? Number(monthlyRent) : 0,
          depositAmount: depositAmount ? Number(depositAmount) : 0,
          billingDay: Number(billingDay) || 1,
          status,
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to create lease.");
        return;
      }

      setShowModal(false);
      setMonthlyRent("");
      setDepositAmount("");
      setErrorMessage(null);
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTenantName = (tId: string) => {
    const t = tenants.find((item) => item.id === tId);
    return t ? t.fullName : tId;
  };

  const getUnitInfo = (uId: string) => {
    const u = units.find((item) => item.id === uId);
    return u ? `Unit ${u.unitNumber}` : uId;
  };

  const getPropertyName = (pId: string) => {
    const p = props.find((item) => item.id === pId);
    return p ? p.name : pId;
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Lease Contracts & Agreements"
        title="Leases"
        subtitle="Manage tenant tenancy contracts, security deposits, monthly rent terms, and lease validity periods."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus size={15} /> Add Lease Agreement
          </button>
        }
      />

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Metric label="Total Leases Registered" value={leases.length} note="Active & Historical" />
        <Metric label="Active Contracts" value={activeLeasesCount} accent="success" note="Currently active" />
        <Metric label="Active Rent Roll" value={KSh(totalMonthlyRoll)} accent="success" note="Monthly contract revenue" />
        <Metric label="Billing Cycle" value="1st of Month" note="Standard ledger due date" />
      </div>

      {/* Add Lease Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Add Lease Agreement</h3>
                <p className="text-[11px] text-muted-foreground">Bind tenant, unit assignment, rent roll rate, and agreement period.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleCreateLease} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Tenant *</label>
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.phone}) · ID: {t.nationalId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Property Asset *</label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    {props.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.propertyCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit Assignment *</label>
                  <select
                    value={unitId}
                    onChange={(e) => setUnitId(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.unitNumber} ({u.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block font-semibold mb-1">Billing Day</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={billingDay}
                    onChange={(e) => setBillingDay(Number(e.target.value))}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Agreement Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                  <option value="Terminated">Terminated</option>
                </select>
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
                  {isSubmitting ? "Saving Lease..." : "Save Lease Agreement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leases Table */}
      <Panel title="Lease Registry" meta={`${leases.length} registered agreements`}>
        {leases.length > 0 ? (
          <Table head={["Lease ID", "Tenant", "Property & Unit", "Start Date", "End Date", "Monthly Rent", "Security Deposit", "Status", "Actions"]}>
            {leases.map((l: (typeof leases)[number]) => (
              <tr key={l.id} className="transition-colors duration-150 hover:bg-muted/50">
                <Td num className="font-bold font-mono text-primary">{l.id}</Td>
                <Td className="font-semibold">{getTenantName(l.tenantId)}</Td>
                <Td>
                  <span className="block font-medium">{getPropertyName(l.propertyId)}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{getUnitInfo(l.unitId)}</span>
                </Td>
                <Td num>{l.startDate}</Td>
                <Td num>{l.endDate}</Td>
                <Td num className="font-semibold">{KSh(l.monthlyRent)}</Td>
                <Td num className="text-muted-foreground">{KSh(l.depositAmount)}</Td>
                <Td>
                  <Badge variant={statusVariant(l.status)}>{l.status}</Badge>
                </Td>
                <Td right>
                  <button
                    onClick={() => handleDeleteLease(l.id)}
                    disabled={deletingId === l.id}
                    className="text-muted-foreground hover:text-danger p-1 cursor-pointer transition-colors"
                    title="Delete Lease"
                  >
                    <Trash2 size={14} />
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <FileText className="mx-auto text-muted-foreground/40 mb-3" size={32} />
            <p className="font-bold text-foreground text-sm">No Lease Contracts Registered Yet</p>
            <p className="mt-1">Add tenancy lease agreements to bind tenants with property units and rent terms.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus size={14} /> Add First Lease Agreement
            </button>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
