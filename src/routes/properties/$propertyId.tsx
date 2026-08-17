import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, Metric } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { ArrowLeft, Trash2, Building2, User, Phone, MapPin, Layers } from "lucide-react";
import { useState } from "react";

const getPropertyDetailData = createServerFn({ method: "POST" })
  .validator((d: { propertyId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { PropertyService } = await import("@/server/services/property.service");
    const prop = await PropertyService.getPropertyById(session.organizationId, data.propertyId, session.role);
    const units = await PropertyService.getAllUnits(session.organizationId, session.role);
    const filteredUnits = units.filter((u: (typeof units)[number]) => u.propertyId === data.propertyId);
    return { prop, units: filteredUnits };
  });

const deletePropertyServerFn = createServerFn({ method: "POST" })
  .validator((d: { propertyId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { PropertyService } = await import("@/server/services/property.service");
    return await PropertyService.deleteProperty(session.organizationId, data.propertyId, session.role);
  });


export const Route = createFileRoute("/properties/$propertyId")({
  loader: ({ params }) => getPropertyDetailData({ data: { propertyId: params.propertyId } }),
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { prop, units } = Route.useLoaderData();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (prop && confirm(`Are you sure you want to delete property "${prop.name}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await deletePropertyServerFn({ data: { propertyId: prop.id } });
        navigate({ to: "/properties" });
      } catch (err) {
        console.error(err);
        setIsDeleting(false);
      }
    }
  };

  if (!prop) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold">Property not found</h2>
          <p className="text-xs text-muted-foreground mt-1">The property asset may have been deleted or does not exist.</p>
          <Link to="/properties" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <ArrowLeft size={14} /> Back to Properties Directory
          </Link>
        </div>
      </AppShell>
    );
  }

  const occupancyRate = prop.totalUnits > 0 ? Math.round((prop.occupiedUnits / prop.totalUnits) * 100) : 0;

  return (
    <AppShell>
      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={14} /> Back to Properties Directory
        </Link>
      </div>

      <PageHeader
        eyebrow={`Property Asset · ${prop.propertyCode}`}
        title={prop.name}
        subtitle={`${prop.area} · Caretaker: ${prop.caretakerName} (${prop.caretakerPhone})`}
        actions={
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xs bg-danger/10 border border-danger/20 px-3 py-2 text-[13px] font-semibold text-danger hover:bg-danger/20 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Trash2 size={15} /> Delete Property
          </button>
        }
      />

      {/* Metric Highlights */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Metric label="Total Capacity" value={`${prop.totalUnits} Units`} note="Configured capacity" />
        <Metric label="Occupied Units" value={`${prop.occupiedUnits} Units`} accent="success" note={`${prop.totalUnits - prop.occupiedUnits} vacant`} />
        <Metric label="Occupancy Rate" value={`${occupancyRate}%`} accent={occupancyRate >= 85 ? "success" : "warning"} />
        <Metric label="Asset Tier" value={prop.tier} note="Neighborhood Standard" />
      </div>

      {/* Property Overview Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Panel title="Property Specifications">
          <div className="p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Building2 size={14} /> Property Name</span>
              <span className="font-bold text-foreground">{prop.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Property Code</span>
              <span className="font-mono font-bold text-primary">{prop.propertyCode}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><MapPin size={14} /> Neighborhood / Location</span>
              <span className="font-semibold text-foreground">{prop.area}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Layers size={14} /> Tier Classification</span>
              <Badge variant="neutral">{prop.tier}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Year Constructed</span>
              <span className="font-mono text-foreground">{prop.yearBuilt || 2024}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Caretaker & On-site Management">
          <div className="p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><User size={14} /> Caretaker Name</span>
              <span className="font-bold text-foreground">{prop.caretakerName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Phone size={14} /> Caretaker Phone (M-Pesa)</span>
              <span className="font-mono font-bold text-primary">{prop.caretakerPhone}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Status</span>
              <Badge variant={prop.status === "ACTIVE" ? "paid" : "neutral"}>{prop.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Registration Date</span>
              <span className="font-mono text-muted-foreground">{new Date(prop.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Units Inventory Table */}
      <Panel title={`Units in ${prop.name}`} meta={`${units.length} registered units`}>
        {units.length > 0 ? (
          <Table head={["Unit Door / No.", "Type", "Monthly Rent (KSh)", "Deposit Required", "Status"]}>
            {units.map((u: (typeof units)[number]) => (
              <tr key={u.id} className="transition-colors hover:bg-muted/50">
                <Td num className="font-bold font-mono text-primary">{u.unitNumber}</Td>
                <Td>{u.type}</Td>
                <Td num className="font-semibold">{KSh(u.monthlyRent)}</Td>
                <Td num className="text-muted-foreground">{KSh(u.depositAmount)}</Td>
                <Td>
                  <Badge variant={u.status === "Occupied" ? "paid" : u.status === "Vacant" ? "neutral" : "overdue"}>
                    {u.status}
                  </Badge>
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No units explicitly registered under this property asset yet.
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
