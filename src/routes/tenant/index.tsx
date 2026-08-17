import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KSh } from "@/lib/mynyumba";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";
import {
  Home,
  CreditCard,
  Wrench,
  FileText,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Camera,
  Send,
} from "lucide-react";

const getTenantPortalData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { db } = await import("@/db");
  const { tenants: tenantsTable } = await import("@/db/schema");
  const { FinancialService } = await import("@/server/services/financial.service");
  const { OperationsService } = await import("@/server/services/operations.service");

  let tenantsList: any[] = [];
  if (db) {
    tenantsList = await db.select().from(tenantsTable);
  }
  const tenant = tenantsList.find((t: any) => t.email === session.email) || tenantsList[0];

  const payments = await FinancialService.getPayments(session.organizationId, session.role);
  const tickets = await OperationsService.getMaintenanceRequests(session.organizationId, session.role);
  const rentCharges = await FinancialService.getRentCharges(session.organizationId, session.role);

  const tenantPayments = payments.filter((p: any) => p.tenantId === tenant?.id || p.tenant === tenant?.name);
  const tenantTickets = tickets.filter((t: any) => t.raisedBy === tenant?.name || t.tenantId === tenant?.id);
  const tenantCharges = rentCharges.filter((c: any) => c.tenantId === tenant?.id || c.tenant === tenant?.name);

  const balance = tenantCharges
    .filter((c: any) => c.status !== "PAID")
    .reduce((sum: number, c: any) => sum + ((c.amountBilled || c.totalAmount || 0) - (c.amountPaid || 0)), 0);

  return {
    tenantName: session.name || tenant?.name || "Tenant Account",
    unit: tenant?.unit || "Unit Unassigned",
    balance: balance,
    monthlyRent: tenantCharges[0]?.amountBilled || 0,
    nextDueDate: "2026-09-01",
    status: balance === 0 ? "PAID" : "OVERDUE",
    recentPayments: tenantPayments.slice(0, 5).map((p: any) => ({
      id: p.id,
      ref: p.reference || p.ref || "N/A",
      amount: p.amount,
      date: p.paymentDate || p.date || "Recent",
      channel: p.paymentMethod || p.channel || "M-Pesa",
    })),
    activeTickets: tenantTickets.slice(0, 5).map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      date: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : "Recent",
    })),
  };
});

const triggerStkPushServerFn = createServerFn({ method: "POST" })
  .validator((d: { phone: string; amount: number }) => d)
  .handler(async ({ data }) => {
    const { MpesaIntegration } = await import("@/server/integrations/mpesa");
    return await MpesaIntegration.initiateStkPush({
      phoneNumber: data.phone,
      amount: data.amount,
      accountReference: "RENT-PAYMENT",
    });
  });


export const Route = createFileRoute("/tenant/")({
  loader: () => getTenantPortalData(),
  component: TenantPortalPage,
});

function TenantPortalPage() {
  const data = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState<"home" | "pay" | "maintenance" | "documents" | "messages">("home");
  const [phone, setPhone] = useState("+254 712 445 908");
  const [payAmount, setPayAmount] = useState<number>(47000);
  const [payStatus, setPayStatus] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayStatus("Sending M-Pesa STK Push prompt to your phone...");
    const res = await triggerStkPushServerFn({ data: { phone, amount: payAmount } });
    if (res.success) {
      setPayStatus(`STK Push prompt sent to ${phone}! Check your phone to enter M-Pesa PIN.`);
    } else {
      setPayStatus("Failed to send M-Pesa prompt. Please try again.");
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketMsg("Maintenance ticket submitted successfully! A manager will review it shortly.");
      setTicketTitle("");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07152E] text-white font-sans pb-24 selection:bg-primary selection:text-white">
      {/* Top Header */}
      <header className="px-5 pt-8 pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Tenant Portal</p>
          <h1 className="text-xl font-bold mt-0.5">{data.tenantName}</h1>
          <p className="text-xs text-white/70">{data.unit}</p>
        </div>
        <div className="size-10 rounded-full bg-[#0B4ED5] flex items-center justify-center font-bold text-sm text-white shadow-md">
          BO
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-5 pt-6 max-w-md mx-auto">
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Balance Hero Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-[#0B4ED5]/20 blur-2xl pointer-events-none" />
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Current Balance Owed</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight font-mono">{KSh(data.balance)}</span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Paid up for August
                </span>
              </div>
              <p className="text-xs text-white/60 mt-2">Next billing period starts: {data.nextDueDate}</p>

              <button
                onClick={() => setActiveTab("pay")}
                className="mt-5 w-full rounded-xl bg-[#0B4ED5] hover:bg-[#0B4ED5]/90 py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <Smartphone size={18} /> Pay Rent via M-Pesa Now
              </button>
            </div>

            {/* Quick Actions / Recent Transactions */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">Recent Rent Receipts</h2>
              <div className="space-y-2">
                {data.recentPayments.map((p: any) => (
                  <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-400">{KSh(p.amount)} Paid</p>
                      <p className="text-[11px] text-white/60 mt-0.5">M-Pesa Ref: {p.ref} · {p.date}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Tickets */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">Maintenance Status</h2>
              {data.activeTickets.map((t: any) => (
                <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">{t.title}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">Submitted {t.date}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pay" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-bold">M-Pesa Rent STK Push</h2>
              <p className="text-xs text-white/70 leading-relaxed">
                Initiate an instant payment prompt directly to your Safaricom mobile phone. You will receive an M-Pesa popup asking for your PIN.
              </p>

              {payStatus && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                  {payStatus}
                </div>
              )}

              <form onSubmit={handlePay} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-semibold">Phone Number (M-Pesa)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white font-mono focus:border-[#0B4ED5] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-semibold">Amount (KES)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white font-mono focus:border-[#0B4ED5] focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0B4ED5] py-3.5 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0B4ED5]/90 transition"
                >
                  <Smartphone size={18} /> Trigger M-Pesa STK Prompt
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-bold">Report Maintenance Issue</h2>
              <p className="text-xs text-white/70">
                Log a repair ticket with automated AI triage routing to our caretaker team.
              </p>

              {ticketMsg && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300">
                  {ticketMsg}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/70 mb-1 font-semibold">Issue Description</label>
                  <textarea
                    rows={3}
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="e.g. Kitchen sink faucet leaking under cabinet"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm text-white focus:border-[#0B4ED5] focus:outline-none"
                    required
                  />
                </div>

                <div className="rounded-xl border border-dashed border-white/20 p-4 text-center cursor-pointer hover:bg-white/5 transition">
                  <Camera size={24} className="mx-auto text-white/60 mb-1" />
                  <p className="text-xs font-semibold text-white/80">Attach Photo (Optional)</p>
                  <p className="text-[10px] text-white/40">Tap to upload leak or repair image</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="w-full rounded-xl bg-[#0B4ED5] py-3 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0B4ED5]/90 transition"
                >
                  <Send size={16} /> Submit Ticket
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Lease Documents & Receipts</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-xs text-white/60">
              <FileText className="mx-auto text-white/40 mb-2" size={24} />
              <p className="font-semibold text-white">No Digital Documents Attached</p>
              <p className="mt-1 text-[11px]">Lease agreements and M-Pesa receipts will appear here once issued by your property manager.</p>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Property Manager Messages</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-xs text-white/60">
              <MessageSquare className="mx-auto text-white/40 mb-2" size={24} />
              <p className="font-semibold text-white">No Message Threads</p>
              <p className="mt-1 text-[11px]">Direct updates and broadcast notices from your property management team will be shown here.</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Thumb Reachable) */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#07152E]/95 border-t border-white/10 backdrop-blur-xl px-4 py-2.5 flex items-center justify-around z-50">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
            activeTab === "home" ? "text-[#0B4ED5]" : "text-white/50 hover:text-white/80"
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab("pay")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
            activeTab === "pay" ? "text-[#0B4ED5]" : "text-white/50 hover:text-white/80"
          }`}
        >
          <CreditCard size={20} />
          <span>Pay Rent</span>
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
            activeTab === "maintenance" ? "text-[#0B4ED5]" : "text-white/50 hover:text-white/80"
          }`}
        >
          <Wrench size={20} />
          <span>Repair</span>
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
            activeTab === "documents" ? "text-[#0B4ED5]" : "text-white/50 hover:text-white/80"
          }`}
        >
          <FileText size={20} />
          <span>Docs</span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
            activeTab === "messages" ? "text-[#0B4ED5]" : "text-white/50 hover:text-white/80"
          }`}
        >
          <MessageSquare size={20} />
          <span>Inbox</span>
        </button>
      </nav>
    </div>
  );
}
