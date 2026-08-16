import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Metric, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { TenantService } from "@/server/services/tenant.service";

const getTenantDetailData = createServerFn({ method: "POST" })
  .validator((d: { tenantId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const tenant = await TenantService.getTenantById(session.organizationId, data.tenantId, session.role);
    const leases = await TenantService.getAllLeases(session.organizationId, session.role);
    const tenantLeases = leases.filter((l) => l.tenantId === data.tenantId);
    return { tenant, leases: tenantLeases };
  });

export const Route = createFileRoute("/tenants/$tenantId")({
  loader: ({ params }) => getTenantDetailData({ data: { tenantId: params.tenantId } }),
  component: TenantDetailPage,
});

function TenantDetailPage() {
  const { tenant, leases } = Route.useLoaderData();

  if (!tenant) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold">Tenant record not found</h2>
          <Link to="/tenants" className="mt-4 inline-block text-primary hover:underline">← Back to tenants</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tenant Profile"
        title={tenant.fullName}
        subtitle={`Phone: ${tenant.phone} · Email: ${tenant.email} · National ID: ${tenant.nationalId}`}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Metric label="Payment Score" value={`${tenant.score} / 100`} accent={tenant.score > 85 ? "success" : "danger"} />
        <Metric label="Status" value={tenant.status} note="Active in portfolio" />
        <Metric label="Lease Records" value={leases.length} note="Active & Historical" />
      </div>

      <Panel title="Active Leases" meta={`${leases.length} leases on file`}>
        <div className="p-4 divide-y divide-border">
          {leases.map((l) => (
            <div key={l.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">Lease {l.id} (Unit {l.unitId})</p>
                <p className="text-xs text-muted-foreground">Start: {l.startDate} · End: {l.endDate}</p>
              </div>
              <Badge variant={l.status === "Active" ? "paid" : "neutral"}>{l.status}</Badge>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
