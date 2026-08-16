import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/server/auth";
import { FinancialService } from "@/server/services/financial.service";
import { MpesaIntegration } from "@/server/integrations/mpesa";
import { KSh } from "@/lib/mynyumba";
import { useState } from "react";
import { Banknote, Plus, Smartphone } from "lucide-react";

const getPaymentsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const payments = await FinancialService.getPayments(session.organizationId, session.role);
  const rentCharges = await FinancialService.getRentCharges(session.organizationId, session.role);
  return { payments, rentCharges };
});

const triggerStkPushServerFn = createServerFn({ method: "POST" })
  .validator((d: { phone: string; amount: number }) => d)
  .handler(async ({ data }) => {
    return await MpesaIntegration.initiateStkPush({
      phoneNumber: data.phone,
      amount: data.amount,
      accountReference: "RENT",
    });
  });

export const Route = createFileRoute("/payments/")({
  loader: () => getPaymentsData(),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { payments } = Route.useLoaderData();
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("+254 712 445 908");
  const [amount, setAmount] = useState(47000);
  const [statusMsg, setStatusMsg] = useState("");

  const handleStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("Initiating M-Pesa STK Push...");
    const res = await triggerStkPushServerFn({ data: { phone, amount } });
    if (res.success) {
      setStatusMsg(`STK Push prompt sent to ${phone}! Ref: ${res.mockReference || 'PENDING'}`);
    } else {
      setStatusMsg("Failed to send STK push.");
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Financial Operations"
        title="Rent & Payments"
        subtitle="Real-time payment ledger, Daraja M-Pesa reconciliation, and double-entry charge allocations."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground"
          >
            <Plus size={15} /> Record payment
          </button>
        }
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xs border border-border bg-card p-6 shadow-lg">
            <h3 className="font-display text-lg font-semibold mb-2">Record / Initiate Rent Payment</h3>
            <p className="text-xs text-muted-foreground mb-4">Send an STK Push to tenant's phone or record manual collection.</p>
            <form onSubmit={handleStkPush} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">M-Pesa Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Amount (KSh)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-sm outline-none"
                  required
                />
              </div>
              {statusMsg && <div className="text-xs font-semibold text-primary">{statusMsg}</div>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xs border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-xs bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <Smartphone size={14} /> Send M-Pesa STK Push
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Panel title="Payment Transactions Ledger" meta={`${payments.length} total payments`}>
        <Table head={["Reference", "Tenant ID", "Unit ID", "Amount", "Date", "Channel", "Status"]}>
          {payments.map((p) => (
            <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
              <Td num font-mono>{p.transactionReference}</Td>
              <Td>{p.tenantId}</Td>
              <Td num>{p.unitId}</Td>
              <Td num font-mono className="font-semibold text-success">{KSh(p.amount)}</Td>
              <Td num>{p.transactionDate}</Td>
              <Td>
                <Badge variant="neutral">{p.paymentMethod}</Badge>
              </Td>
              <Td>
                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
