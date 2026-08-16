import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { OperationsService } from "@/server/services/operations.service";
import { KSh } from "@/lib/mynyumba";

const getMaintenanceData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const tickets = await OperationsService.getMaintenanceRequests(session.organizationId, session.role);
  return { tickets };
});

export const Route = createFileRoute("/maintenance/")({
  loader: () => getMaintenanceData(),
  component: MaintenancePage,
});

function MaintenancePage() {
  const { tickets } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Property Operations"
        title="Maintenance & Work Orders"
        subtitle="Manage facility repairs, vendor dispatch, and property maintenance logs."
      />

      <Panel title="Work Orders Queue" meta={`${tickets.length} open/historical requests`}>
        <Table head={["Reference", "Title", "Property ID", "Priority", "Status", "Vendor", "Cost"]}>
          {tickets.map((t) => (
            <tr key={t.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td num font-mono>{t.referenceNumber}</Td>
              <Td className="font-medium">{t.title}</Td>
              <Td>{t.propertyId}</Td>
              <Td>
                <Badge variant={statusVariant(t.priority)}>{t.priority}</Badge>
              </Td>
              <Td>
                <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
              </Td>
              <Td>{t.assignedVendor || "—"}</Td>
              <Td num>{t.actualCost ? KSh(t.actualCost) : "—"}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
