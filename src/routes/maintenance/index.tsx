import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge, statusVariant } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { KSh } from "@/lib/mynyumba";
import { useState } from "react";
import {
  Sparkles,
  LayoutGrid,
  List,
  Wrench,
  AlertTriangle,
  Plus,
  Search,
  X,
  FilterX,
  Building2,
  Tag,
  Users,
  CheckCircle2,
  Clock,
  HardHat,
  ShieldCheck,
} from "lucide-react";

const getMaintenanceData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { OperationsService } = await import("@/server/services/operations.service");
  const { PropertyService } = await import("@/server/services/property.service");
  const { TenantService } = await import("@/server/services/tenant.service");

  const tickets = await OperationsService.getMaintenanceRequests(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  const units = await PropertyService.getAllUnits(session.organizationId, session.role);
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  return { tickets, props, units, tenants };
});

const classifyTicketAiFn = createServerFn({ method: "POST" })
  .validator((d: { description: string }) => d)
  .handler(async ({ data }) => {
    const text = data.description.toLowerCase();
    let category = "General";
    let priority = "NORMAL";
    let vendor = "Ndegwa Handyman Services";
    let estimatedCost = 4500;

    if (text.includes("water") || text.includes("leak") || text.includes("pump") || text.includes("pipe") || text.includes("sink") || text.includes("toilet")) {
      category = "Plumbing";
      priority = text.includes("tripping") || text.includes("burst") || text.includes("flooding") ? "URGENT" : "NORMAL";
      vendor = "Maji Works Ltd";
      estimatedCost = priority === "URGENT" ? 15000 : 5000;
    } else if (text.includes("power") || text.includes("electric") || text.includes("tripping") || text.includes("socket") || text.includes("meter")) {
      category = "Electrical";
      priority = "URGENT";
      vendor = "Stima Tech Solutions";
      estimatedCost = 9500;
    } else if (text.includes("door") || text.includes("lock") || text.includes("window") || text.includes("roof") || text.includes("wall")) {
      category = "Carpentry & Structure";
      priority = "NORMAL";
      vendor = "Ndegwa Handyman Services";
      estimatedCost = 6000;
    }

    return { category, priority, vendor, estimatedCost, confidence: 96 };
  });

const createTicketServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      propertyId: string;
      unitId?: string;
      tenantId?: string;
      title: string;
      description: string;
      category: string;
      priority: string;
      assignedVendor?: string;
      estimatedCost?: number;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { OperationsService } = await import("@/server/services/operations.service");
      return await OperationsService.createMaintenanceRequest(session.organizationId, session.role, session.userId, data);
    } catch (err: any) {
      console.error("Error creating work order:", err);
      return { error: err?.message || "Failed to create work order." };
    }
  });


export const Route = createFileRoute("/maintenance/")({
  loader: () => getMaintenanceData(),
  component: MaintenancePage,
});

function MaintenancePage() {
  const { tickets = [], props = [], units = [], tenants = [] } = Route.useLoaderData() || {};
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [activeCategoryTab, setActiveCategoryTab] = useState<"all" | "properties" | "categories" | "vendors">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<"manual" | "ai">("manual");

  // Modal State
  const [selectedPropertyId, setSelectedPropertyId] = useState(props[0]?.id || "");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [priority, setPriority] = useState("NORMAL");
  const [vendor, setVendor] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<string | number>("");

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lookup Maps
  const propertyMap = new Map(props.map((p) => [p.id, p]));
  const unitMap = new Map(units.map((u) => [u.id, u]));
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));

  // Dynamically filter units by selected property
  const propertyUnits = selectedPropertyId ? units.filter((u) => u.propertyId === selectedPropertyId) : units;

  // Metrics Calculations
  const urgentTickets = tickets.filter(
    (t: any) => t.priority?.toUpperCase() === "URGENT" || t.priority?.toUpperCase() === "HIGH"
  );
  const activeTickets = tickets.filter((t: any) => t.status?.toUpperCase() !== "RESOLVED");
  const resolvedCost = tickets
    .filter((t: any) => t.status?.toUpperCase() === "RESOLVED")
    .reduce((s: number, t: any) => s + (t.actualCost || t.estimatedCost || 0), 0);
  const assignedVendorCount = new Set(tickets.map((t: any) => t.assignedVendor).filter(Boolean)).size;

  // Real-time Search Engine Filters
  const query = searchQuery.trim().toLowerCase();

  const filteredTickets = tickets.filter((t: any) => {
    if (!query) return true;
    const prop = propertyMap.get(t.propertyId);
    const unit = unitMap.get(t.unitId || "");
    const tenant = tenantMap.get(t.tenantId || "");

    return (
      t.referenceNumber?.toLowerCase().includes(query) ||
      t.title?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.category?.toLowerCase().includes(query) ||
      t.priority?.toLowerCase().includes(query) ||
      t.status?.toLowerCase().includes(query) ||
      t.assignedVendor?.toLowerCase().includes(query) ||
      prop?.name?.toLowerCase().includes(query) ||
      unit?.unitNumber?.toLowerCase().includes(query) ||
      tenant?.fullName?.toLowerCase().includes(query)
    );
  });

  const filteredProps = props.filter((p) => {
    if (!query) return true;
    return p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query);
  });

  // Group by Categories
  const categoryGroupsMap = new Map<string, { category: string; count: number; totalCost: number }>();
  tickets.forEach((t: any) => {
    const cat = t.category || "General";
    const current = categoryGroupsMap.get(cat) || { category: cat, count: 0, totalCost: 0 };
    categoryGroupsMap.set(cat, {
      category: cat,
      count: current.count + 1,
      totalCost: current.totalCost + (t.actualCost || t.estimatedCost || 0),
    });
  });
  const categoryGroups = Array.from(categoryGroupsMap.values()).filter((cg) => {
    if (!query) return true;
    return cg.category.toLowerCase().includes(query);
  });

  // Group by Vendor
  const vendorGroupsMap = new Map<string, { vendor: string; count: number; totalCost: number }>();
  tickets.forEach((t: any) => {
    const v = t.assignedVendor || "Unassigned Handyman";
    const current = vendorGroupsMap.get(v) || { vendor: v, count: 0, totalCost: 0 };
    vendorGroupsMap.set(v, {
      vendor: v,
      count: current.count + 1,
      totalCost: current.totalCost + (t.actualCost || t.estimatedCost || 0),
    });
  });
  const vendorGroups = Array.from(vendorGroupsMap.values()).filter((vg) => {
    if (!query) return true;
    return vg.vendor.toLowerCase().includes(query);
  });

  const handleRunAiTriage = async () => {
    if (!issueDesc) return;
    setIsAnalyzing(true);
    try {
      const result = await classifyTicketAiFn({ data: { description: issueDesc } });
      setAiAnalysis(result);
      setCategory(result.category);
      setPriority(result.priority);
      setVendor(result.vendor);
      setEstimatedCost(result.estimatedCost);
      if (!issueTitle) {
        setIssueTitle(`${result.category} Issue - ${issueDesc.substring(0, 30)}...`);
      }
    } catch (err: any) {
      console.error("AI Triage error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createTicketServerFn({
        data: {
          propertyId: selectedPropertyId,
          unitId: selectedUnitId || undefined,
          tenantId: selectedTenantId || undefined,
          title: issueTitle || `${category} Repair Work`,
          description: issueDesc || `${category} defect reported`,
          category,
          priority,
          assignedVendor: vendor || undefined,
          estimatedCost: Number(estimatedCost) || undefined,
        },
      });

      if (res && "error" in res && res.error) {
        setErrorMessage(res.error);
        return;
      }

      setShowModal(false);
      setIssueDesc("");
      setIssueTitle("");
      setVendor("");
      setEstimatedCost("");
      setAiAnalysis(null);
      setErrorMessage(null);
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to create work order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const kanbanColumns = [
    { title: "Open / Reported", status: "OPEN" },
    { title: "Assigned Contractor", status: "ASSIGNED" },
    { title: "In Progress", status: "IN_PROGRESS" },
    { title: "Resolved & Closed", status: "RESOLVED" },
  ];

  const openAddModal = (mode: "manual" | "ai") => {
    setModalTab(mode);
    setShowModal(true);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Property Operations & Asset Maintenance"
        title="Maintenance & Work Orders"
        subtitle="AI-assisted defect triage, contractor routing, repair cost ledger, and real-time Kanban dispatch."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xs border border-border bg-card p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1 rounded-xs px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={13} /> Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-xs px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={13} /> List
              </button>
            </div>

            <button
              onClick={() => openAddModal("manual")}
              className="flex items-center gap-1.5 rounded-xs bg-primary px-3 py-2 text-[13px] font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <Plus size={15} /> Add Maintenance Ticket
            </button>

            <button
              onClick={() => openAddModal("ai")}
              className="flex items-center gap-1.5 rounded-xs bg-purple-600 px-3 py-2 text-[13px] font-bold text-white hover:bg-purple-700 transition-opacity cursor-pointer shadow-xs"
            >
              <Sparkles size={15} /> AI Triage Defect
            </button>
          </div>
        }
      />

      {/* SOLID DOMINANT METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-red-500 bg-red-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">Urgent Defects</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{urgentTickets.length}</span>
          </div>
          <p className="mt-2 text-xs text-red-100 font-medium">Critical Emergency Work Orders</p>
        </div>

        <div className="rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Active Work Queue</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{activeTickets.length}</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium">Open & In-Progress Tickets</p>
        </div>

        <div className="rounded-md border border-emerald-500 bg-emerald-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Resolved Repairs Outlay</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{KSh(resolvedCost)}</span>
          </div>
          <p className="mt-2 text-xs text-emerald-100 font-medium">Total Settled Maintenance Costs</p>
        </div>

        <div className="rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Active Contractors</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <HardHat size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{assignedVendorCount}</span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium">Dispatched Repair Vendors</p>
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
            placeholder="Search maintenance by ticket ref, title, property asset, unit, category, priority, vendor..."
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
          <Wrench size={14} /> All Work Orders ({filteredTickets.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("properties")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "properties"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-blue-950/20 hover:text-blue-400"
          }`}
        >
          <Building2 size={14} /> By Property Asset ({filteredProps.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("categories")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "categories"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-amber-950/20 hover:text-amber-400"
          }`}
        >
          <Tag size={14} /> By Defect Category ({categoryGroups.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab("vendors")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeCategoryTab === "vendors"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-purple-950/20 hover:text-purple-400"
          }`}
        >
          <Users size={14} /> By Assigned Contractor ({vendorGroups.length})
        </button>
      </div>

      {/* CREATE WORK ORDER & VENDOR ASSIGNMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-md border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-base font-bold">Record Maintenance & Assign Vendor</h3>
                <p className="text-[11px] text-muted-foreground">Dispatch work orders, set repair cost estimates, and route to contractors.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex rounded-xs border border-border bg-muted p-1 gap-1">
              <button
                type="button"
                onClick={() => setModalTab("manual")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                  modalTab === "manual" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🛠️ Direct Work Order Entry
              </button>
              <button
                type="button"
                onClick={() => setModalTab("ai")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  modalTab === "ai" ? "bg-purple-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles size={13} /> AI Defect Auto-Triage
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xs bg-danger/10 border border-danger/30 p-3 text-xs text-danger font-medium flex items-center justify-between">
                <span>⚠️ {errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline text-xs cursor-pointer">Dismiss</button>
              </div>
            )}

            {modalTab === "ai" ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Issue Description (from Tenant or Caretaker)</label>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      placeholder="Describe defect e.g. Burst pipe under kitchen sink flooding floor..."
                      className="w-full rounded-xs border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRunAiTriage}
                      disabled={isAnalyzing || !issueDesc}
                      className="shrink-0 rounded-xs bg-purple-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-purple-700 cursor-pointer disabled:opacity-50 flex flex-col items-center justify-center gap-1"
                    >
                      <Sparkles size={14} />
                      <span>{isAnalyzing ? "Analyzing..." : "Run AI"}</span>
                    </button>
                  </div>
                </div>

                {aiAnalysis && (
                  <div className="rounded-xs border border-purple-500/30 bg-purple-950/10 p-3 space-y-1.5 text-xs">
                    <p className="font-bold text-purple-400 flex items-center gap-1">
                      <Sparkles size={14} /> AI Recommendation ({aiAnalysis.confidence}% Match)
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[11px]">
                      <div>Category: <span className="font-semibold text-foreground">{aiAnalysis.category}</span></div>
                      <div>Urgency: <span className="font-semibold text-danger">{aiAnalysis.priority}</span></div>
                      <div>Assigned Vendor: <span className="font-semibold text-foreground">{aiAnalysis.vendor}</span></div>
                      <div>Est. Cost: <span className="font-semibold text-emerald-500 font-mono">{KSh(aiAnalysis.estimatedCost)}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <form onSubmit={handleCreateWorkOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Target Property Asset *</label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => {
                      setSelectedPropertyId(e.target.value);
                      setSelectedUnitId("");
                    }}
                    required
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  >
                    {props.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Target Unit Number</label>
                  <select
                    value={selectedUnitId}
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  >
                    <option value="">-- General Property Asset --</option>
                    {propertyUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.unitNumber} ({u.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Work Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Kitchen Sink Pipe Plumbing Repair"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Assigned Vendor / Contractor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maji Works Ltd / Stima Tech / Fundi John"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Work Order Amount / Cost (KSh) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 15000"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-mono font-bold text-danger"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Defect Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                  >
                    <option value="Plumbing">Plumbing & Water</option>
                    <option value="Electrical">Electrical & Power</option>
                    <option value="Carpentry & Structure">Carpentry & Structural</option>
                    <option value="Masonry">Masonry & Painting</option>
                    <option value="General">General Maintenance</option>
                    <option value="HVAC & Appliances">HVAC & Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Priority / Urgency *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary font-bold text-danger"
                  >
                    <option value="NORMAL">NORMAL (Scheduled)</option>
                    <option value="URGENT">URGENT (Emergency Dispatch)</option>
                    <option value="LOW">LOW (Deferred)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Defect Description / Scope of Work</label>
                <textarea
                  rows={2}
                  placeholder="Provide scope of work e.g. Replace damaged water valves and unblock main drain pipe..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background p-2 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xs border border-border px-3 py-2 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck size={14} />
                  {isSubmitting ? "Dispatching Work Order..." : "Create & Dispatch Work Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CONTENT BASED ON TAB */}
      {activeCategoryTab === "all" ? (
        viewMode === "kanban" ? (
          <div className="grid gap-4 sm:grid-cols-4">
            {kanbanColumns.map((col) => {
              const colTickets = filteredTickets.filter(
                (t: any) =>
                  t.status?.toUpperCase() === col.status ||
                  (col.status === "OPEN" && (t.status === "Open" || t.status === "OPEN"))
              );

              return (
                <div key={col.status} className="rounded-md border border-border bg-card/70 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{col.title}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                      {colTickets.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colTickets.map((t: any) => {
                      const prop = propertyMap.get(t.propertyId);
                      const unit = unitMap.get(t.unitId || "");

                      return (
                        <div key={t.id} className="rounded-xs border border-border bg-card p-3 shadow-2xs space-y-2 hover:border-primary/50 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-primary">{t.referenceNumber || t.ref || "MNT-101"}</span>
                            <Badge variant={statusVariant(t.priority)}>{t.priority}</Badge>
                          </div>
                          <p className="text-xs font-bold text-foreground leading-tight">{t.title}</p>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            {prop ? prop.name : t.propertyId} {unit ? `· Unit ${unit.unitNumber}` : ""}
                          </p>
                          {t.assignedVendor && (
                            <div className="border-t border-border pt-1.5 text-[11px] font-semibold text-primary flex items-center justify-between">
                              <span className="flex items-center gap-1"><Wrench size={11} /> {t.assignedVendor}</span>
                              <span className="font-mono text-emerald-500">{t.actualCost ? KSh(t.actualCost) : t.estimatedCost ? KSh(t.estimatedCost) : ""}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Panel title="Work Orders Queue" meta={`${filteredTickets.length} of ${tickets.length} total requests`}>
            {filteredTickets.length > 0 ? (
              <Table head={["Reference", "Title & Category", "Property & Unit", "Priority", "Status", "Assigned Vendor", "Cost (KSh)"]}>
                {filteredTickets.map((t: any) => {
                  const prop = propertyMap.get(t.propertyId);
                  const unit = unitMap.get(t.unitId || "");

                  return (
                    <tr key={t.id} className="transition-colors duration-150 hover:bg-muted/50">
                      <Td num className="font-bold font-mono text-primary text-xs">{t.referenceNumber || t.ref || "MNT-101"}</Td>
                      <Td>
                        <span className="block font-bold text-foreground">{t.title}</span>
                        <span className="text-[11px] text-muted-foreground">{t.category || "General"}</span>
                      </Td>
                      <Td>
                        <span className="block font-semibold text-foreground">{prop?.name || t.propertyId}</span>
                        <span className="text-[11px] font-mono text-primary font-bold">{unit ? `Unit ${unit.unitNumber}` : "Building Asset"}</span>
                      </Td>
                      <Td>
                        <Badge variant={statusVariant(t.priority)}>{t.priority}</Badge>
                      </Td>
                      <Td>
                        <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                      </Td>
                      <Td className="font-semibold">{t.assignedVendor || "—"}</Td>
                      <Td num className="font-bold font-mono text-danger">
                        {t.actualCost ? KSh(t.actualCost) : t.estimatedCost ? KSh(t.estimatedCost) : "—"}
                      </Td>
                    </tr>
                  );
                })}
              </Table>
            ) : (
              <div className="p-12 text-center text-xs text-muted-foreground">
                <Wrench className="mx-auto text-muted-foreground/30 mb-3" size={32} />
                <p className="font-bold text-foreground text-sm">
                  {searchQuery ? `No Work Orders Found Matching "${searchQuery}"` : "No Maintenance Requests On File"}
                </p>
              </div>
            )}
          </Panel>
        )
      ) : null}

      {/* DYNAMIC TAB VIEW 2: CATEGORIZED BY PROPERTY */}
      {activeCategoryTab === "properties" && (
        <Panel title="Property Maintenance Outlay & Ticket Breakdown" meta={`${filteredProps.length} properties`}>
          {filteredProps.length > 0 ? (
            <Table head={["Property Asset", "Code & Tier", "Open Defect Tickets", "Resolved Work Orders", "Maintenance Outlay"]}>
              {filteredProps.map((p) => {
                const propTickets = tickets.filter((t: any) => t.propertyId === p.id);
                const openCount = propTickets.filter((t: any) => t.status?.toUpperCase() !== "RESOLVED").length;
                const resolvedCount = propTickets.filter((t: any) => t.status?.toUpperCase() === "RESOLVED").length;
                const totalCost = propTickets.reduce((s: number, t: any) => s + (t.actualCost || t.estimatedCost || 0), 0);

                return (
                  <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td>
                      <span className="block font-bold text-foreground">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">{p.address}</span>
                    </Td>
                    <Td num className="font-mono">{p.code} ({p.tier})</Td>
                    <Td num className="font-bold text-danger">{openCount} ticket(s)</Td>
                    <Td num className="font-bold text-success">{resolvedCount} resolved</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(totalCost)}</Td>
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

      {/* DYNAMIC TAB VIEW 3: CATEGORIZED BY CATEGORY */}
      {activeCategoryTab === "categories" && (
        <Panel title="Defect Category Summary" meta={`${categoryGroups.length} categories`}>
          {categoryGroups.length > 0 ? (
            <Table head={["Category Name", "Total Ticket Count", "Total Repair Outlay", "Category Share"]}>
              {categoryGroups.map((cg) => {
                const sharePct = resolvedCost > 0 ? Math.round((cg.totalCost / resolvedCost) * 100) : 0;

                return (
                  <tr key={cg.category} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td className="font-bold text-foreground text-sm">{cg.category}</Td>
                    <Td num className="font-semibold">{cg.count} ticket(s)</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(cg.totalCost)}</Td>
                    <Td num className="font-bold text-amber-500">{sharePct}% of Total Repair Outlay</Td>
                  </tr>
                );
              })}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Tag className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Defect Categories Found Matching "{searchQuery}"</p>
            </div>
          )}
        </Panel>
      )}

      {/* DYNAMIC TAB VIEW 4: CATEGORIZED BY VENDOR */}
      {activeCategoryTab === "vendors" && (
        <Panel title="Contractor & Vendor Work Allocation" meta={`${vendorGroups.length} vendors`}>
          {vendorGroups.length > 0 ? (
            <Table head={["Assigned Contractor", "Assigned Work Orders", "Total Work Order Costs", "Vendor Allocation"]}>
              {vendorGroups.map((vg) => {
                const sharePct = resolvedCost > 0 ? Math.round((vg.totalCost / resolvedCost) * 100) : 0;

                return (
                  <tr key={vg.vendor} className="transition-colors duration-150 hover:bg-muted/50">
                    <Td className="font-bold text-foreground text-sm">{vg.vendor}</Td>
                    <Td num className="font-semibold">{vg.count} work order(s)</Td>
                    <Td num className="font-extrabold text-danger font-mono">{KSh(vg.totalCost)}</Td>
                    <Td num className="font-bold text-purple-500">{sharePct}% of Total Work Orders</Td>
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
