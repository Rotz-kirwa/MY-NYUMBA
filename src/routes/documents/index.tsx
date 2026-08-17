import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

const getDocumentsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { OperationsService } = await import("@/server/services/operations.service");
  const docs = await OperationsService.getDocuments(session.organizationId, session.role);
  return { docs };
});


export const Route = createFileRoute("/documents/")({
  loader: () => getDocumentsData(),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { docs } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Storage & Metadata"
        title="Documents"
        subtitle="Lease agreements, National ID copies, compliance certificates, and M-Pesa receipts."
      />

      <Panel title="Document Vault" meta={`${docs.length} indexed files`}>
        <Table head={["Document Name", "Category", "Linked Entity", "File Size", "Uploaded At"]}>
          {docs.map((d: (typeof docs)[number]) => (
            <tr key={d.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td className="font-medium text-primary hover:underline">{d.name}</Td>
              <Td>
                <Badge variant="neutral">{d.kind}</Badge>
              </Td>
              <Td>{d.linkedEntity}</Td>
              <Td num>{d.fileSize}</Td>
              <Td num>{d.uploadedAt}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
