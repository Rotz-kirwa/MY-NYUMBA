import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Metric, Badge, Table, Td } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { ArrowLeft, Trash2, User, Home, Banknote, FileText, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";

const getTenantDetailData = createServerFn({ method: "POST" })
  .validator((d: { tenantId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { TenantService } = await import("@/server/services/tenant.service");
    const { FinancialService } = await import("@/server/services/financial.service");
    const { PropertyService } = await import("@/server/services/property.service");

    const tenant = await TenantService.getTenantById(session.organizationId, data.tenantId, session.role);
    const leases = await TenantService.getAllLeases(session.organizationId, session.role);
    const tenantLeases = leases.filter((l: (typeof leases)[number]) => l.tenantId === data.tenantId);

    const rentCharges = await FinancialService.getTenantRentCharges(session.organizationId, data.tenantId, session.role);
    const payments = await FinancialService.getTenantPayments(session.organizationId, data.tenantId, session.role);
    const properties = await PropertyService.getAllProperties(session.organizationId, session.role);
    const units = await PropertyService.getAllUnits(session.organizationId, session.role);

    return {
      tenant,
      leases: tenantLeases,
      rentCharges,
      payments,
      properties,
      units,
    };
  });

const deleteTenantFromDetailServerFn = createServerFn({ method: "POST" })
  .validator((d: { tenantId: string }) => d)
  .handler(async ({ data }) => {
    const session = await getSessionContext();
    const { TenantService } = await import("@/server/services/tenant.service");
    return await TenantService.deleteTenant(session.organizationId, data.tenantId, session.role);
  });


export const Route = createFileRoute("/tenants/$tenantId")({
  loader: ({ params }) => getTenantDetailData({ data: { tenantId: params.tenantId } }),
  component: TenantDetailPage,
});

function TenantDetailPage() {
  const { tenant, leases = [], rentCharges = [], payments = [], properties = [], units = [] } = Route.useLoaderData() || {};
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (tenant && confirm(`Are you sure you want to delete tenant "${tenant.fullName}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await deleteTenantFromDetailServerFn({ data: { tenantId: tenant.id } });
        navigate({ to: "/tenants" });
      } catch (err) {
        console.error(err);
        setIsDeleting(false);
      }
    }
  };

  if (!tenant) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-xl font-bold text-foreground">Tenant record not found</h2>
          <p className="text-xs text-muted-foreground mt-1">The requested tenant profile may have been removed or does not exist.</p>
          <Link to="/tenants" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <ArrowLeft size={14} /> Back to Tenants Directory
          </Link>
        </div>
      </AppShell>
    );
  }

  // Calculate totals
  const totalBilled = rentCharges.reduce((acc: number, c: (typeof rentCharges)[number]) => acc + (c.totalAmount || 0), 0);
  const totalPaid = payments.reduce((acc: number, p: (typeof payments)[number]) => acc + (p.status === "COMPLETED" ? p.amount || 0 : 0), 0);
  const totalArrears = rentCharges.reduce((acc: number, c: (typeof rentCharges)[number]) => acc + (c.balance || 0), 0);

  // Active Lease and Unit details
  const activeLease = leases.find((l: (typeof leases)[number]) => l.status === "Active") || leases[0];
  const assignedUnit = activeLease ? units.find((u: (typeof units)[number]) => u.id === activeLease.unitId) : null;
  const assignedProperty = activeLease ? properties.find((p: (typeof properties)[number]) => p.id === activeLease.propertyId) : null;

  return (
    <AppShell>
      {/* Navigation Back Button */}
      <div className="mb-4">
        <Link
          to="/tenants"
          className="inline-flex items-center gap-2 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={14} /> Back to Tenants Directory
        </Link>
      </div>

      <PageHeader
        eyebrow="Tenant Account Profile"
        title={tenant.fullName}
        subtitle={`M-Pesa: ${tenant.phone} · Email: ${tenant.email} · National ID: ${tenant.nationalId}`}
        actions={
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xs bg-danger/10 border border-danger/20 px-3 py-2 text-[13px] font-semibold text-danger hover:bg-danger/20 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Trash2 size={15} /> Delete Tenant Profile
          </button>
        }
      />

      {/* Top Financial & Operational Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Metric label="Payment Credit Score" value={`${tenant.score} / 100`} accent={tenant.score > 85 ? "success" : "danger"} note="Credit rating score" />
        <Metric label="Total Billed" value={KSh(totalBilled)} note={`${rentCharges.length} billing periods`} />
        <Metric label="Total Paid" value={KSh(totalPaid)} accent="success" note={`${payments.length} ledger payments`} />
        <Metric label="Outstanding Arrears" value={KSh(totalArrears)} accent={totalArrears > 0 ? "danger" : "success"} note={totalArrears > 0 ? "Action required" : "Account clear"} />
      </div>

      {/* Profile Information Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Personal & Credential Details */}
        <Panel title="Personal Identity & Credentials">
          <div className="p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><User size={14} /> Full Name</span>
              <span className="font-bold text-foreground">{tenant.fullName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><CreditCard size={14} /> Phone (M-Pesa)</span>
              <span className="font-mono font-bold text-primary">{tenant.phone}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Email Address</span>
              <span className="font-mono text-foreground">{tenant.email}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">National ID / Passport</span>
              <span className="font-mono font-bold text-foreground">{tenant.nationalId}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Emergency Contact</span>
              <span className="font-mono text-muted-foreground">{tenant.emergencyContact || "Not provided"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Account Status</span>
              <Badge variant={tenant.status === "Active" ? "paid" : "neutral"}>{tenant.status}</Badge>
            </div>
          </div>
        </Panel>

        {/* Assigned Unit & Lease Terms */}
        <Panel title="Assigned Unit & Lease Terms">
          <div className="p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Home size={14} /> Assigned Unit</span>
              <span className="font-bold text-foreground font-mono">{assignedUnit?.unitNumber || "House A-04"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Property Portfolio</span>
              <span className="font-bold text-primary">{assignedProperty?.name || "Nairobi Executive Portfolio"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Banknote size={14} /> Monthly Rent</span>
              <span className="font-bold text-foreground font-mono">{KSh(activeLease?.monthlyRent || 0)} / mo</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Security Deposit Held</span>
              <span className="font-bold text-success font-mono">{KSh(activeLease?.depositAmount || 0)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Lease Term</span>
              <span className="font-mono text-foreground">{activeLease ? `${activeLease.startDate} → ${activeLease.endDate}` : "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Lease Status</span>
              <Badge variant={activeLease?.status === "Active" ? "paid" : "neutral"}>{activeLease?.status || "Active"}</Badge>
            </div>
          </div>
        </Panel>
      </div>

      {/* Rent Charges Ledger History */}
      <div className="mb-6">
        <Panel title="Rent Charges Ledger" meta={`${rentCharges.length} billing entries`}>
          {rentCharges.length > 0 ? (
            <Table head={["Billing Period", "Due Date", "Rent Billed", "Amount Paid", "Balance Due", "Status"]}>
              {rentCharges.map((c: (typeof rentCharges)[number]) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/50">
                  <Td className="font-bold font-mono text-primary">{c.billingPeriod}</Td>
                  <Td num>{c.dueDate}</Td>
                  <Td num className="font-semibold">{KSh(c.totalAmount)}</Td>
                  <Td num className="text-success font-semibold">{KSh(c.amountPaid)}</Td>
                  <Td num className={c.balance > 0 ? "text-danger font-bold" : "text-muted-foreground"}>
                    {KSh(c.balance)}
                  </Td>
                  <Td>
                    <Badge variant={c.status === "PAID" ? "paid" : c.status === "PARTIAL" ? "partial" : "overdue"}>
                      {c.status}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <FileText className="mx-auto text-muted-foreground/30 mb-2" size={28} />
              No rent charge records on file for this tenant.
            </div>
          )}
        </Panel>
      </div>

      {/* Payments History Ledger */}
      <div>
        <Panel title="Payment Transactions History" meta={`${payments.length} payments recorded`}>
          {payments.length > 0 ? (
            <Table head={["Transaction Ref", "Date & Time", "Method", "Amount Paid", "Notes", "Status"]}>
              {payments.map((p: (typeof payments)[number]) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/50">
                  <Td className="font-bold font-mono text-primary">{p.transactionReference}</Td>
                  <Td num>{new Date(p.transactionDate).toLocaleString()}</Td>
                  <Td>{p.paymentMethod}</Td>
                  <Td num className="font-bold text-success">{KSh(p.amount)}</Td>
                  <Td>{p.notes || "Rent payment"}</Td>
                  <Td>
                    <Badge variant={p.status === "COMPLETED" ? "paid" : "neutral"}>{p.status}</Badge>
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <CreditCard className="mx-auto text-muted-foreground/30 mb-2" size={28} />
              No payment transactions recorded for this tenant yet.
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
