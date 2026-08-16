import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, Metric } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { PropertyService } from "@/server/services/property.service";
import { KSh } from "@/lib/mynyumba";

const getPropertyDetailData = createServerFn({ method: "POST" })
  .validator((d: { propertyId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const prop = await PropertyService.getPropertyById(session.organizationId, data.propertyId, session.role);
    const units = await PropertyService.getAllUnits(session.organizationId, session.role);
    const filteredUnits = units.filter((u) => u.propertyId === data.propertyId);
    return { prop, units: filteredUnits };
  });

export const Route = createFileRoute("/properties/$propertyId")({
  loader: ({ params }) => getPropertyDetailData({ data: { propertyId: params.propertyId } }),
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { prop, units } = Route.useLoaderData();

  if (!prop) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold">Property not found</h2>
          <Link to="/properties" className="mt-4 inline-block text-primary hover:underline">← Back to properties</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Property Detail · ${prop.area}`}
        title={prop.name}
        subtitle={`Caretaker: ${prop.caretakerName} (${prop.caretakerPhone}) · Built ${prop.yearBuilt}`}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Metric label="Total Units" value={prop.totalUnits} note={`${prop.occupiedUnits} occupied`} />
        <Metric label="Tier" value={prop.tier} note="Neighborhood Standard" />
        <Metric label="Occupancy Rate" value={`${Math.round((prop.occupiedUnits / prop.totalUnits) * 100)}%`} accent="success" />
      </div>

      <Panel title={`Units in ${prop.name}`} meta={`${units.length} units registered`}>
        <Table head={["Unit No.", "Type", "Monthly Rent", "Status"]}>
          {units.map((u) => (
            <tr key={u.id}>
              <Td num>{u.unitNumber}</Td>
              <Td>{u.type}</Td>
              <Td num>{KSh(u.monthlyRent)}</Td>
              <Td>
                <Badge variant={u.status === "Occupied" ? "paid" : "overdue"}>{u.status}</Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
