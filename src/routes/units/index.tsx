import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, Metric, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { Plus, Home, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";

const getUnitsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { PropertyService } = await import("@/server/services/property.service");
  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  return { units, props };
});

const genUniqueId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const createUnitServerFn = createServerFn({ method: "POST" })
  .validator((d: {
    propertyId: string;
    unitNumber: string;
    type: string;
    monthlyRent: number;
    depositAmount: number;
    serviceCharge: number;
    status: string;
  }) => d)
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { TenantContext } = await import("@/server/auth/tenant-context");
      const { PropertyRepository } = await import("@/server/repositories/property.repository");

      const ctx = new TenantContext({
        userId: session.userId,
        organizationId: session.organizationId,
        role: session.role,
        email: session.email,
        name: session.name,
        isAuthenticated: true,
      });
      const propRepo = new PropertyRepository(ctx);
      const unitId = genUniqueId("unit");

      const newUnit = await propRepo.createUnit({
        id: unitId,
        organizationId: session.organizationId,
        propertyId: data.propertyId,
        unitNumber: data.unitNumber,
        type: data.type,
        monthlyRent: data.monthlyRent,
        depositAmount: data.depositAmount,
        serviceCharge: data.serviceCharge || 0,
        status: data.status || "Vacant",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { success: true, unit: newUnit };
    } catch (err: any) {
      console.error("Error creating unit:", err);
      return { success: false, error: err?.message || "Failed to create unit." };
    }
  });

const deleteUnitServerFn = createServerFn({ method: "POST" })
  .validator((d: { unitId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { PropertyService } = await import("@/server/services/property.service");
    return await PropertyService.deleteUnit(session.organizationId, data.unitId, session.role);
  });


export const Route = createFileRoute("/units/")({
  loader: () => getUnitsData(),
  component: UnitsPage,
});

function UnitsPage() {
  const { units, props } = Route.useLoaderData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [propertyId, setPropertyId] = useState(props[0]?.id || "");
  const [unitNumber, setUnitNumber] = useState("");
  const [type, setType] = useState("Residential");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [status, setStatus] = useState("Vacant");

  const totalOccupied = units.filter((u) => u.status === "Occupied").length;
  const totalVacant = units.filter((u) => u.status === "Vacant").length;
  const totalMonthlyRoll = units.reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

  const handleDeleteUnit = async (unitId: string, label: string) => {
    if (confirm(`Are you sure you want to delete unit "${label}"? This action cannot be undone.`)) {
      setDeletingId(unitId);
      try {
        await deleteUnitServerFn({ data: { unitId } });
        router.invalidate();
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const targetPropId = propertyId || props[0]?.id;
    if (!targetPropId) {
      setErrorMessage("Please create a property asset first before adding units.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createUnitServerFn({
        data: {
          propertyId: targetPropId,
          unitNumber,
          type,
          monthlyRent: monthlyRent ? Number(monthlyRent) : 0,
          depositAmount: depositAmount ? Number(depositAmount) : 0,
          serviceCharge: serviceCharge ? Number(serviceCharge) : 0,
          status,
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to add unit.");
        return;
      }

      setShowModal(false);
      setUnitNumber("");
      setType("Residential");
      setMonthlyRent("");
      setDepositAmount("");
      setServiceCharge("");
      setStatus("Vacant");
      setErrorMessage(null);
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPropertyName = (pId: string) => {
    const p = props.find((item) => item.id === pId);
    return p ? `${p.name} (${p.propertyCode})` : pId;
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Portfolio Inventory"
        title="Units"
        subtitle="Manage housing, commercial, and residential units across all real estate properties."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus size={15} /> Add Unit
          </button>
        }
      />

      {/* Top Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Metric label="Total Registered Units" value={units.length} note="Across properties" />
        <Metric label="Occupied Units" value={totalOccupied} accent="success" note={`${totalVacant} vacant`} />
        <Metric label="Vacant Units" value={totalVacant} accent={totalVacant > 0 ? "warning" : "success"} note="Ready for lease" />
        <Metric label="Monthly Rent Roll Capacity" value={KSh(totalMonthlyRoll)} accent="success" note="Potential gross revenue" />
      </div>

      {/* Add Unit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Add Unit to Inventory</h3>
                <p className="text-[11px] text-muted-foreground">Define unit door label, property assignment, rent rate, and deposit terms.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleCreateUnit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Property Asset *</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                >
                  {props.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.propertyCode}) · {p.area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit / House Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apt A-102"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Studio Apartment">Studio Apartment</option>
                    <option value="1 Bedroom">1 Bedroom</option>
                    <option value="2 Bedroom">2 Bedroom</option>
                    <option value="3 Bedroom">3 Bedroom</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial Shop">Commercial Shop</option>
                    <option value="Office Space">Office Space</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Monthly Rent (KSh) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 30000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Deposit Required (KSh) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 30000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Service Charge (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2500"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Initial Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="Vacant">Vacant</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
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
                  {isSubmitting ? "Saving Unit..." : "Save Unit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Units Table */}
      <Panel title="Units Inventory" meta={`${units.length} total units registered`}>
        {units.length > 0 ? (
          <Table head={["Unit Door / No.", "Property Asset", "Type", "Monthly Rent", "Deposit Terms", "Status", "Actions"]}>
            {units.map((u: (typeof units)[number]) => (
              <tr key={u.id} className="transition-colors duration-150 hover:bg-muted/50">
                <Td num className="font-bold font-mono text-primary">{u.unitNumber}</Td>
                <Td className="font-semibold">{getPropertyName(u.propertyId)}</Td>
                <Td>{u.type}</Td>
                <Td num className="font-semibold">{KSh(u.monthlyRent)}</Td>
                <Td num className="text-muted-foreground">{KSh(u.depositAmount)}</Td>
                <Td>
                  <Badge variant={statusVariant(u.status)}>{u.status}</Badge>
                </Td>
                <Td right>
                  <button
                    onClick={() => handleDeleteUnit(u.id, u.unitNumber)}
                    disabled={deletingId === u.id}
                    className="text-muted-foreground hover:text-danger p-1 cursor-pointer transition-colors"
                    title="Delete Unit"
                  >
                    <Trash2 size={14} />
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <Home className="mx-auto text-muted-foreground/40 mb-3" size={32} />
            <p className="font-bold text-foreground text-sm">No Units Configured Yet</p>
            <p className="mt-1">Add property assets and units to start populating monthly rent rolls and tenant assignments.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus size={14} /> Add First Unit
            </button>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
