import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { OperationsService } from "@/server/services/operations.service";

const getMessagesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const msgs = await OperationsService.getMessages(session.organizationId, session.role);
  return { msgs };
});

export const Route = createFileRoute("/messages/")({
  loader: () => getMessagesData(),
  component: MessagesPage,
});

function MessagesPage() {
  const { msgs } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Communications"
        title="Tenant Messages"
        subtitle="SMS, WhatsApp, and in-app communications with tenants and property caretakers."
      />

      <Panel title="Inbox Threads" meta={`${msgs.length} active threads`}>
        <Table head={["Sender", "Unit", "Preview", "Channel", "Status"]}>
          {msgs.map((m) => (
            <tr key={m.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td className="font-medium">{m.senderName}</Td>
              <Td num>{m.unitLabel}</Td>
              <Td className="max-w-md truncate">{m.preview}</Td>
              <Td>
                <Badge variant="neutral">{m.channel}</Badge>
              </Td>
              <Td>
                {m.unread ? <Badge variant="partial">Unread</Badge> : <span className="text-xs text-muted-foreground">Read</span>}
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
