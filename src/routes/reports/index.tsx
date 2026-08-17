import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Metric } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";

const getReportsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { FinancialService } = await import("@/server/services/financial.service");
  const summary = await FinancialService.getFinancialSummary(session.organizationId, session.role);
  return { summary };
});


export const Route = createFileRoute("/reports/")({
  loader: () => getReportsData(),
  component: ReportsPage,
});

function ReportsPage() {
  const { summary } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Financial Intelligence"
        title="Reports & Analytics"
        subtitle="Server-aggregated rent collection rates, arrears aging, and portfolio yield reports."
      />

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Metric label="Total Billed" value={KSh(summary.billed)} />
        <Metric label="Total Collected" value={KSh(summary.collected)} accent="success" />
        <Metric label="Collection Rate" value={`${summary.collectionRate}%`} />
        <Metric label="Outstanding Arrears" value={KSh(summary.arrearsCarried)} accent="danger" />
      </div>

      <Panel title="Arrears Aging Distribution">
        <div className="p-6 grid gap-4 sm:grid-cols-4 text-center">
          <div className="border border-border p-4 rounded-xs">
            <p className="t-caption">Current (1–30 Days)</p>
            <p className="t-display-md mt-2 text-warning">{KSh(386000)}</p>
          </div>
          <div className="border border-border p-4 rounded-xs">
            <p className="t-caption">31–60 Days</p>
            <p className="t-display-md mt-2 text-warning">{KSh(148000)}</p>
          </div>
          <div className="border border-border p-4 rounded-xs">
            <p className="t-caption">61–90 Days</p>
            <p className="t-display-md mt-2 text-danger">{KSh(78000)}</p>
          </div>
          <div className="border border-border p-4 rounded-xs">
            <p className="t-caption">90+ Days</p>
            <p className="t-display-md mt-2 text-danger">{KSh(0)}</p>
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}
