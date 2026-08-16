import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { PropertyService } from "@/server/services/property.service";
import { Building2, Plus, ArrowUpRight } from "lucide-react";

const getPropertiesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  return { props };
});

export const Route = createFileRoute("/properties/")({
  loader: () => getPropertiesData(),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { props } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Portfolio management"
        title="Properties"
        subtitle="Manage Nairobi real estate assets, caretakers, and occupancy distribution."
        actions={
          <button className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground">
            <Plus size={15} /> Add property
          </button>
        }
      />

      <Panel title="All Properties" meta={`${props.length} total properties`}>
        <Table head={["Property Code", "Name", "Neighborhood", "Tier", "Occupancy", "Caretaker", "Actions"]}>
          {props.map((p) => (
            <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td num>{p.propertyCode}</Td>
              <Td>
                <Link to="/properties/$propertyId" params={{ propertyId: p.id }} className="font-semibold text-primary hover:underline">
                  {p.name}
                </Link>
              </Td>
              <Td>{p.area}</Td>
              <Td>
                <Badge variant="neutral">{p.tier}</Badge>
              </Td>
              <Td num>{p.occupiedUnits} / {p.totalUnits} units</Td>
              <Td>
                <span className="block text-xs font-medium">{p.caretakerName}</span>
                <span className="text-[11px] text-muted-foreground">{p.caretakerPhone}</span>
              </Td>
              <Td right>
                <Link to="/properties/$propertyId" params={{ propertyId: p.id }} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Details <ArrowUpRight size={13} />
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
