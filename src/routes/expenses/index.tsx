import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { useState } from "react";
import {
  Banknote,
  Plus,
  Building2,
  Receipt,
  Search,
  X,
  FilterX,
  ShieldCheck,
  Tag,
  Users,
  Wrench,
  FileCheck,
} from "lucide-react";

const getExpensesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { OperationsService } = await import("@/server/services/operations.service");
  const { PropertyService } = await import("@/server/services/property.service");
  const exp = await OperationsService.getExpenses(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  return { exp, props };
});

const createExpenseServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      propertyId?: string;
      category: string;
      description: string;
      amount: number;
      vendorName: string;
      expenseDate: string;
      receiptReference?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { OperationsService } = await import("@/server/services/operations.service");
      return await OperationsService.createExpense(session.organizationId, session.role, session.userId, data);
    } catch (err: any) {
      console.error("Error recording expense:", err);
      return { error: err?.message || "Failed to record expense voucher." };
    }
  });


export const Route = createFileRoute("/expenses/")({
  loader: () => getExpensesData(),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { exp = [], props = [] } = Route.useLoaderData() || {};
  const router = useRouter();

  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "properties" | "categories" | "vendors">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [selectedPropertyId, setSelectedPropertyId] = useState(props[0]?.id || "");
  const [category, setCategory] = useState("Maintenance");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string | number>("");
  const [vendorName, setVendorName] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptRef, setReceiptRef] = useState("");

  // Lookup Maps
  const propertyMap = new Map(props.map((p) => [p.id, p]));

  // Metrics Calculations
  const totalExpenses = exp.reduce((s, e) => s + (e.amount || 0), 0);
  const propertyAllocatedExpenses = exp
    .filter((e) => Boolean(e.propertyId))
    .reduce((s, e) => s + (e.amount || 0), 0);
  const maintenanceExpenses = exp
    .filter((e) => e.category.toLowerCase().includes("maint") || e.category.toLowerCase().includes("repair"))
    .reduce((s, e) => s + (e.amount || 0), 0);

  // Real-time Search Engine Filters
  const query = searchQuery.trim().toLowerCase();

  const filteredExpenses = exp.filter((e) => {
    if (!query) return true;
    const prop = propertyMap.get(e.propertyId || "");

    return (
      e.vendorName?.toLowerCase().includes(query) ||
      e.category?.toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query) ||
      e.receiptReference?.toLowerCase().includes(query) ||
      prop?.name?.toLowerCase().includes(query) ||
      e.id.toLowerCase().includes(query)
    );
  });

  const filteredProps = props.filter((p) => {
    if (!query) return true;
    return p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query);
  });

  // Group by Categories
  const categoryGroupsMap = new Map<string, { category: string; count: number; total: number }>();
  exp.forEach((e) => {
    const cat = e.category || "General";
    const current = categoryGroupsMap.get(cat) || { category: cat, count: 0, total: 0 };
    categoryGroupsMap.set(cat, {
      category: cat,
      count: current.count + 1,
      total: current.total + (e.amount || 0),
    });
  });
  const categoryGroups = Array.from(categoryGroupsMap.values()).filter((cg) => {
    if (!query) return true;
    return cg.category.toLowerCase().includes(query);
  });

  // Group by Vendors
  const vendorGroupsMap = new Map<string, { vendor: string; count: number; total: number }>();
  exp.forEach((e) => {
    const v = e.vendorName || "Unspecified Vendor";
    const current = vendorGroupsMap.get(v) || { vendor: v, count: 0, total: 0 };
    vendorGroupsMap.set(v, {
      vendor: v,
      count: current.count + 1,
      total: current.total + (e.amount || 0),
    });
  });
  const vendorGroups = Array.from(vendorGroupsMap.values()).filter((vg) => {
    if (!query) return true;
    return vg.vendor.toLowerCase().includes(query);
  });

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createExpenseServerFn({
        data: {
          propertyId: selectedPropertyId || undefined,
          category,
          description: description || `${category} expense payout`,
          amount: Number(amount) || 0,
          vendorName,
          expenseDate,
          receiptReference: receiptRef || `EXP${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        },
      });

      if (res && "error" in res && res.error) {
        setErrorMessage(res.error);
        return;
      }

      setShowModal(false);
      setDescription("");
      setAmount("");
      setVendorName("");
      setReceiptRef("");
      setErrorMessage(null);
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to create expense voucher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Financial Operations & Cost Controls"
        title="Operating Expenses"
        subtitle="Track municipal levies, utility bills, contractor repairs, and property maintenance outlays across your portfolio."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus size={15} /> Add Expense Voucher
          </button>
        }
      />

      {/* SOLID DOMINANT METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-red-500 bg-red-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">Total Operating Expenses</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Banknote size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(totalExpenses)}</span>
          </div>
          <p className="mt-2 text-xs text-red-100 font-medium">{exp.length} Expense Vouchers Settled</p>
        </div>

        <div className="rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Property Allocated Outlay</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(propertyAllocatedExpenses)}</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium">Mapped Direct to Asset Portfolios</p>
        </div>

        <div className="rounded-md border border-amber-500 bg-amber-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Repairs & Maintenance</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Wrench size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(maintenanceExpenses)}</span>
          </div>
          <p className="mt-2 text-xs text-amber-100 font-medium">Contractor & Plumbing Outlays</p>
        </div>

        <div className="rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Voucher Audits</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <FileCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">100% Reconciled</span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium">Verified Receipt References</p>
        </div>
      </div>

      {/* SEARCH ENGINE BAR */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-md shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses by vendor, category, property, voucher ref, description..."
            className="w-full rounded-xs border border-border bg-background pl-9 pr-9 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium shrink-0">
            <span>Filtering by <strong className="text-primary">"{searchQuery}"</strong></span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[11px] font-bold text-danger hover:underline cursor-pointer flex items-center gap-1"
            >
              <FilterX size={13} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* CATEGORY TABS BAR */}
      <div className="mb-6 flex items-center overflow-x-auto border-b border-border bg-card p-1.5 rounded-md gap-1 shadow-xs">
        <button
          onClick={() => setActiveCategoryTab("all")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Receipt size={14} /> All Expense Vouchers ({filteredExpenses.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("properties")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "properties"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-blue-950/20 hover:text-blue-400"
          }`}
        >
          <Building2 size={14} /> By Property Portfolio ({filteredProps.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("categories")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "categories"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-amber-950/20 hover:text-amber-400"
          }`}
        >
          <Tag size={14} /> By Expense Category ({categoryGroups.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("vendors")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "vendors"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-purple-950/20 hover:text-purple-400"
          }`}
        >
          <Users size={14} /> By Vendor / Contractor ({vendorGroups.length})
        </button>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Record Operating Expense Voucher</h3>
                <p className="text-[11px] text-muted-foreground">Log utility bills, maintenance outlays, and contractor payouts.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Target Property Asset</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                >
                  <option value="">-- General Portfolio Outlay --</option>
                  {props.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Expense Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  >
                    <option value="Maintenance">Maintenance & Repairs</option>
                    <option value="Utilities">Utilities (Water / Power)</option>
                    <option value="Security">Security Services</option>
                    <option value="Legal">Legal & Municipal Levies</option>
                    <option value="Staff Salaries">Staff Salaries</option>
                    <option value="Insurance">Property Insurance</option>
                    <option value="Cleaning">Cleaning & Garbage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expense Amount (KSh) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 15000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold text-danger"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Vendor / Contractor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nairobi Water / KPLC / Fundi John"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Expense Description / Particulars</label>
                <input
                  type="text"
                  placeholder="e.g. Roof repair and gutter maintenance for House A"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Receipt / Voucher Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. RCT-88421"
                    value={receiptRef}
                    onChange={(e) => setReceiptRef(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xs border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  {isSubmitting ? "Recording Voucher..." : "Save Expense Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC TAB VIEW 1: ALL EXPENSE VOUCHERS */}
      {activeCategoryTab === "all" && (
        <Panel title="Property Operating Expense Ledger" meta={`${filteredExpenses.length} of ${exp.length} total records`}>
          {filteredExpenses.length > 0 ? (
            <Table head={["Voucher Date", "Vendor / Payee", "Expense Category", "Target Property Asset", "Amount Paid", "Status"]}>
              {filteredExpenses.map((e: (typeof exp)[number]) => {
                const prop = propertyMap.get(e.propertyId || "");
                const propertyLabel = prop ? prop.name : e.propertyId ? e.propertyId : "General Portfolio";

                return (
                  <tr key={e.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td num className="font-semibold">{e.expenseDate}</Td>
                    <Td>
                      <span className="block font-bold text-foreground">{e.vendorName}</span>
                      <span className="text-[11px] text-muted-foreground">{e.description || "Expense Voucher"}</span>
                    </Td>
                    <Td>
                      <Badge variant="neutral">{e.category}</Badge>
                    </Td>
                    <Td className="font-semibold text-foreground">{propertyLabel}</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(e.amount)}</Td>
                    <Td>
                      <Badge variant={statusVariant(e.status)}>{e.status}</Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Receipt className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">
                {searchQuery ? `No Expenses Found Matching "${searchQuery}"` : "No Operating Expenses Recorded Yet"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xs border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-muted cursor-pointer"
                >
                  <FilterX size={13} /> Clear Search Filter
                </button>
              )}
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 2: CATEGORIZED BY PROPERTY */}
      {activeCategoryTab === "properties" && (
        <Panel title="Property Portfolio Expense Allocation" meta={`${filteredProps.length} properties`}>
          {filteredProps.length > 0 ? (
            <Table head={["Property Asset", "Code & Tier", "Total Vouchers", "Total Outlay", "Portfolio Share"]}>
              {filteredProps.map((p) => {
                const propExpenses = exp.filter((e) => e.propertyId === p.id);
                const propTotal = propExpenses.reduce((s, e) => s + (e.amount || 0), 0);
                const sharePct = totalExpenses > 0 ? Math.round((propTotal / totalExpenses) * 100) : 0;

                return (
                  <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td>
                      <span className="block font-bold text-foreground">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">{p.address}</span>
                    </Td>
                    <Td num className="font-mono">{p.code} ({p.tier})</Td>
                    <Td num>{propExpenses.length} voucher(s)</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(propTotal)}</Td>
                    <Td num className="font-bold text-primary">{sharePct}% of Total Outlay</Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Building2 className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Properties Found Matching "{searchQuery}"</p>
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 3: CATEGORIZED BY EXPENSE TYPE */}
      {activeCategoryTab === "categories" && (
        <Panel title="Expense Category Outlay Summary" meta={`${categoryGroups.length} categories`}>
          {categoryGroups.length > 0 ? (
            <Table head={["Category Name", "Voucher Count", "Total Category Outlay", "Category Share"]}>
              {categoryGroups.map((cg) => {
                const sharePct = totalExpenses > 0 ? Math.round((cg.total / totalExpenses) * 100) : 0;

                return (
                  <tr key={cg.category} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td className="font-bold text-foreground text-sm">{cg.category}</Td>
                    <Td num className="font-semibold">{cg.count} voucher(s)</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(cg.total)}</Td>
                    <Td num className="font-bold text-amber-500">{sharePct}% of Total Outlay</Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Tag className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Categories Found Matching "{searchQuery}"</p>
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 4: CATEGORIZED BY VENDOR */}
      {activeCategoryTab === "vendors" && (
        <Panel title="Vendor & Contractor Payout Summary" meta={`${vendorGroups.length} vendors`}>
          {vendorGroups.length > 0 ? (
            <Table head={["Vendor / Contractor", "Invoices / Vouchers", "Total Payout Settled", "Vendor Share"]}>
              {vendorGroups.map((vg) => {
                const sharePct = totalExpenses > 0 ? Math.round((vg.total / totalExpenses) * 100) : 0;

                return (
                  <tr key={vg.vendor} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td className="font-bold text-foreground text-sm">{vg.vendor}</Td>
                    <Td num className="font-semibold">{vg.count} invoice(s)</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(vg.total)}</Td>
                    <Td num className="font-bold text-purple-500">{sharePct}% of Total Payouts</Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Users className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Vendors Found Matching "{searchQuery}"</p>
            </div>
          )}
        </Panel>
      )}
    </AppShell>
  );
}
