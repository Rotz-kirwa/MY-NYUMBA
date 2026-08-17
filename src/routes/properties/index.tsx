import { createFileRoute, Link, useRouter, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, Metric } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { Building2, Plus, ArrowUpRight, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";

const getPropertiesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  if (!session) {
    throw redirect({ to: "/login" });
  }
  const { PropertyService } = await import("@/server/services/property.service");
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  return { props };
});

const genUniqueId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const createPropertyServerFn = createServerFn({ method: "POST" })
  .validator((d: { name: string; propertyCode: string; area: string; tier: string; totalUnits: number; caretakerName: string; caretakerPhone: string }) => d)
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      if (!session) {
        throw new Error("Unauthorized");
      }
      const { PropertyService } = await import("@/server/services/property.service");
      const id = genUniqueId("prop");

      const prop = await PropertyService.createProperty(
        session.organizationId,
        {
          id,
          organizationId: session.organizationId,
          name: data.name,
          propertyCode: data.propertyCode,
          area: data.area,
          tier: data.tier,
          totalUnits: data.totalUnits,
          occupiedUnits: 0,
          caretakerName: data.caretakerName,
          caretakerPhone: data.caretakerPhone,
          yearBuilt: 2024,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        session.role
      );
      return { success: true, prop };
    } catch (err: any) {
      console.error("Error creating property:", err);
      return { success: false, error: err?.message || "Failed to create property asset." };
    }
  });

const deletePropertyServerFn = createServerFn({ method: "POST" })
  .validator((d: { propertyId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { PropertyService } = await import("@/server/services/property.service");
    return await PropertyService.deleteProperty(session.organizationId, data.propertyId, session.role);
  });


export const Route = createFileRoute("/properties/")({
  loader: () => getPropertiesData(),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { props } = Route.useLoaderData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [area, setArea] = useState("");
  const [tier, setTier] = useState("Executive");
  const [unitsCount, setUnitsCount] = useState<string | number>(12);
  const [caretaker, setCaretaker] = useState("");
  const [caretakerPhone, setCaretakerPhone] = useState("+254 ");

  const totalUnits = props.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
  const totalOccupied = props.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0);
  const overallOccupancy = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

  const handleDeleteProperty = async (propertyId: string, propName: string) => {
    if (confirm(`Are you sure you want to delete property "${propName}"? This action will remove associated unit records.`)) {
      setDeletingId(propertyId);
      try {
        await deletePropertyServerFn({ data: { propertyId } });
        router.invalidate();
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await createPropertyServerFn({
        data: {
          name,
          propertyCode: code || `PRP-${Math.floor(Math.random() * 900) + 100}`,
          area: area || "Nairobi Central",
          tier,
          totalUnits: Number(unitsCount) || 1,
          caretakerName: caretaker || "Main Office Caretaker",
          caretakerPhone: caretakerPhone || "+254 700 000 000",
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to create property.");
        return;
      }

      setShowModal(false);
      setName("");
      setCode("");
      setArea("");
      setTier("Executive");
      setUnitsCount(12);
      setCaretaker("");
      setCaretakerPhone("+254 ");
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
        eyebrow="Portfolio Management"
        title="Properties"
        subtitle="Manage real estate property assets, neighborhood tiers, caretakers, and unit distributions."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus size={15} /> Add Property Asset
          </button>
        }
      />

      {/* Metric Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Metric label="Total Properties" value={props.length} note="Active real estate assets" />
        <Metric label="Total Units Capacity" value={totalUnits} note="Across portfolio" />
        <Metric label="Occupied Units" value={totalOccupied} accent="success" note={`${totalUnits - totalOccupied} vacant units`} />
        <Metric label="Occupancy Rate" value={`${overallOccupancy}%`} accent={overallOccupancy >= 85 ? "success" : "warning"} note="Target: 95%" />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Add Property Asset</h3>
                <p className="text-[11px] text-muted-foreground">Register building, caretaker, location, and unit count.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleCreateProperty} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kilimani Heights Towers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Property Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KLM-01"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Neighborhood / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kilimani, Nairobi"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Asset Tier *</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Mid">Mid Tier</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Total Units *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 16"
                    value={unitsCount}
                    onChange={(e) => setUnitsCount(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Caretaker Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Joseph Ochieng"
                    value={caretaker}
                    onChange={(e) => setCaretaker(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Caretaker Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+254 7..."
                    value={caretakerPhone}
                    onChange={(e) => setCaretakerPhone(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold"
                  />
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
                  {isSubmitting ? "Saving..." : "Save Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Panel title="Property Directory" meta={`${props.length} total properties`}>
        {props.length > 0 ? (
          <Table head={["Property Code", "Property Name", "Neighborhood", "Tier", "Occupancy", "Caretaker Contact", "Actions"]}>
            {props.map((p: (typeof props)[number]) => (
              <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                <Td num className="font-bold font-mono text-primary">{p.propertyCode}</Td>
                <Td>
                  <Link to="/properties/$propertyId" params={{ propertyId: p.id }} className="font-semibold text-foreground hover:text-primary hover:underline">
                    {p.name}
                  </Link>
                </Td>
                <Td>{p.area}</Td>
                <Td>
                  <Badge variant="neutral">{p.tier}</Badge>
                </Td>
                <Td num className="font-semibold">
                  {p.occupiedUnits} / {p.totalUnits} units
                </Td>
                <Td>
                  <span className="block text-xs font-semibold">{p.caretakerName}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{p.caretakerPhone}</span>
                </Td>
                <Td right>
                  <div className="flex items-center justify-end gap-3">
                    <Link to="/properties/$propertyId" params={{ propertyId: p.id }} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      View Asset <ArrowUpRight size={13} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(p.id, p.name)}
                      disabled={deletingId === p.id}
                      className="text-muted-foreground hover:text-danger p-1 cursor-pointer transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <Building2 className="mx-auto text-muted-foreground/40 mb-3" size={32} />
            <p className="font-bold text-foreground text-sm">No Properties Registered Yet</p>
            <p className="mt-1">Add your first property asset to start managing units, tenant leases, and rent collection.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus size={14} /> Add First Property Asset
            </button>
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
