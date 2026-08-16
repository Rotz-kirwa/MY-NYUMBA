import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { TenantService } from "@/server/services/tenant.service";
import { Plus } from "lucide-react";

const getTenantsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  return { tenants };
});

export const Route = createFileRoute("/tenants/")({
  loader: () => getTenantsData(),
  component: TenantsPage,
});

function TenantsPage() {
  const { tenants } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Portfolio Directory"
        title="Tenants"
        subtitle="Manage active tenants, contact credentials, national IDs, and payment performance history."
        actions={
          <button className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground">
            <Plus size={15} /> Add tenant
          </button>
        }
      />

      <Panel title="Active Tenants" meta={`${tenants.length} tenants registered`}>
        <Table head={["Tenant Name", "Phone", "Email", "National ID", "Payment Score", "Status", ""]}>
          {tenants.map((t) => (
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
                <Link to="/tenants/$tenantId" params={{ tenantId: t.id }} className="text-xs font-semibold text-primary">
                  View Profile →
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
