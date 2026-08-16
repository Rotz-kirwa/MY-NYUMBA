import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { PropertyService } from "@/server/services/property.service";
import { KSh } from "@/lib/mynyumba";

const getUnitsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  return { units };
});

export const Route = createFileRoute("/units/")({
  loader: () => getUnitsData(),
  component: UnitsPage,
});

function UnitsPage() {
  const { units } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Inventory"
        title="Units"
        subtitle="Full inventory of residential units across all portfolio properties."
      />

      <Panel title="All Units" meta={`${units.length} total units`}>
        <Table head={["Unit Label", "Property ID", "Type", "Monthly Rent", "Deposit Required", "Status"]}>
          {units.map((u) => (
            <tr key={u.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td num>{u.unitNumber}</Td>
              <Td>{u.propertyId}</Td>
              <Td>{u.type}</Td>
              <Td num>{KSh(u.monthlyRent)}</Td>
              <Td num>{KSh(u.depositAmount)}</Td>
              <Td>
                <Badge variant={statusVariant(u.status)}>{u.status}</Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
