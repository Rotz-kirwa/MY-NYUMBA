import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";

const getSettingsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  return { session };
});

export const Route = createFileRoute("/settings/")({
  loader: () => getSettingsData(),
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="System Configuration"
        title="Settings & Organization"
        subtitle="Manage tenant isolation, team RBAC roles, and Daraja M-Pesa API integration credentials."
      />

      <div className="grid gap-6">
        <Panel title="Active Organization Details">
          <div className="p-4 space-y-3">
            <div>
              <p className="t-caption">Organization Name</p>
              <p className="font-semibold text-base">My Nyumba Properties Ltd</p>
            </div>
            <div>
              <p className="t-caption">Organization ID (Tenant Boundary)</p>
              <p className="font-mono text-sm text-primary">{session.organizationId}</p>
            </div>
            <div>
              <p className="t-caption">Active Session User</p>
              <p className="text-sm">{session.name} ({session.email}) — <Badge variant="paid">{session.role}</Badge></p>
            </div>
          </div>
        </Panel>

        <Panel title="M-Pesa Daraja Integration Secrets">
          <div className="p-4 space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold mb-1">Business ShortCode (Paybill / Till)</label>
              <input type="text" readOnly value="174379" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Passkey</label>
              <input type="password" readOnly value="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-sm font-mono" />
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
