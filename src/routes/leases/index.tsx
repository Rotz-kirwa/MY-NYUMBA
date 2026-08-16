import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { TenantService } from "@/server/services/tenant.service";
import { KSh } from "@/lib/mynyumba";

const getLeasesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const leases = await TenantService.getAllLeases(session.organizationId, session.role);
  return { leases };
});

export const Route = createFileRoute("/leases/")({
  loader: () => getLeasesData(),
  component: LeasesPage,
});

function LeasesPage() {
  const { leases } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Agreements"
        title="Leases"
        subtitle="Active lease contracts, expiry schedules, monthly rent rolls, and security deposit terms."
      />

      <Panel title="Lease Registry" meta={`${leases.length} registered leases`}>
        <Table head={["Lease ID", "Tenant ID", "Unit ID", "Start Date", "End Date", "Monthly Rent", "Security Deposit", "Status"]}>
          {leases.map((l) => (
            <tr key={l.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td num>{l.id}</Td>
              <Td>{l.tenantId}</Td>
              <Td num>{l.unitId}</Td>
              <Td num>{l.startDate}</Td>
              <Td num>{l.endDate}</Td>
              <Td num>{KSh(l.monthlyRent)}</Td>
              <Td num>{KSh(l.depositAmount)}</Td>
              <Td>
                <Badge variant={statusVariant(l.status)}>{l.status}</Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
