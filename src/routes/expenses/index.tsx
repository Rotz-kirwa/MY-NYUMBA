import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { OperationsService } from "@/server/services/operations.service";
import { KSh } from "@/lib/mynyumba";

const getExpensesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const exp = await OperationsService.getExpenses(session.organizationId, session.role);
  return { exp };
});

export const Route = createFileRoute("/expenses/")({
  loader: () => getExpensesData(),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { exp } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Financial Operations"
        title="Operating Expenses"
        subtitle="Track utilities, security, maintenance repairs, and municipal levies across your portfolio."
      />

      <Panel title="Property Expenses" meta={`${exp.length} total records`}>
        <Table head={["Date", "Vendor", "Category", "Property ID", "Amount", "Status"]}>
          {exp.map((e) => (
            <tr key={e.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td num>{e.expenseDate}</Td>
              <Td className="font-medium">{e.vendorName}</Td>
              <Td>
                <Badge variant="neutral">{e.category}</Badge>
              </Td>
              <Td>{e.propertyId}</Td>
              <Td num className="font-semibold text-danger">{KSh(e.amount)}</Td>
              <Td>
                <Badge variant={statusVariant(e.status)}>{e.status}</Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
