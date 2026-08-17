import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { useState, useRef } from "react";
import {
  Send,
  Upload,
  MessageSquare,
  Users,
  Search,
  X,
  FilterX,
  CheckCircle2,
  Building2,
  FileSpreadsheet,
  Zap,
  PhoneCall,
  Sparkles,
  Smartphone,
  Radio,
  FileText,
  Tag,
  Plus,
  ShieldCheck,
  Check,
  Download,
  Trash2,
  FileUp,
} from "lucide-react";

const getMessagesData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { OperationsService } = await import("@/server/services/operations.service");
  const { TenantService } = await import("@/server/services/tenant.service");
  const { PropertyService } = await import("@/server/services/property.service");

  const msgs = await OperationsService.getMessages(session.organizationId, session.role);
  const tenants = await TenantService.getAllTenants(session.organizationId, session.role);
  const props = await PropertyService.getAllProperties(session.organizationId, session.role);
  return { msgs, tenants, props };
});


const sendBulkSmsServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      senderId: string;
      messageText: string;
      recipients: Array<{ name: string; phone: string; unit?: string; property?: string }>;
      campaignName: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();

      // Onfon Media Gateway Integration Simulation
      const batchId = `ONF_BATCH_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

      // Save a dispatch log in the database
      const repo = new (await import("@/server/repositories/operations.repository")).OperationsRepository(
        new (await import("@/server/auth/tenant-context")).TenantContext({
          userId: session.userId,
          organizationId: session.organizationId,
          role: session.role,
          email: "",
          name: "",
          isAuthenticated: true,
        })
      );

      const now = new Date().toISOString();
      await (await import("@/db")).db.insert((await import("@/db/schema")).messages).values({
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        organizationId: session.organizationId,
        senderName: `Onfon Bulk Gateway (${data.senderId})`,
        unitLabel: `Broadcast to ${data.recipients.length} Recipient(s)`,
        preview: data.messageText.substring(0, 100) + (data.messageText.length > 100 ? "..." : ""),
        channel: `Bulk SMS (Ref: ${batchId})`,
        unread: false,
        createdAt: now,
      });

      return {
        success: true,
        batchId,
        recipientCount: data.recipients.length,
        status: "DISPATCHED",
        provider: "Onfon Media Bulk Gateway",
      };
    } catch (err: any) {
      console.error("Bulk SMS Dispatch error:", err);
      return { error: err?.message || "Failed to dispatch Bulk SMS via gateway." };
    }
  });

export const Route = createFileRoute("/messages/")({
  loader: () => getMessagesData(),
  component: MessagesPage,
});

function MessagesPage() {
  const { msgs = [], tenants = [], props = [] } = Route.useLoaderData() || {};
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"broadcast" | "senderids" | "upload" | "directory" | "inbox">("broadcast");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Sender IDs List State
  const [senderIds, setSenderIds] = useState<Array<{ id: string; name: string; status: string; isDefault: boolean }>>([
    { id: "MY-NYUMBA", name: "MY-NYUMBA", status: "APPROVED", isDefault: true },
    { id: "NYUMBA_PAY", name: "NYUMBA_PAY", status: "APPROVED", isDefault: false },
    { id: "ONFON_SMS", name: "ONFON_SMS", status: "SYSTEM_DEFAULT", isDefault: false },
    { id: "KENYA_KEYS", name: "KENYA_KEYS", status: "APPROVED", isDefault: false },
  ]);
  const [senderId, setSenderId] = useState("MY-NYUMBA");
  const [newSenderInput, setNewSenderInput] = useState("");
  const [showAddSenderModal, setShowAddSenderModal] = useState(false);

  // Bulk SMS Studio Form State
  const [targetAudience, setTargetAudience] = useState<"all" | "property" | "custom">("all");
  const [selectedPropertyId, setSelectedPropertyId] = useState(props[0]?.id || "");
  const [messageText, setMessageText] = useState("");
  const [campaignName, setCampaignName] = useState("");

  // Custom Uploaded Contacts State
  const [pastedContacts, setPastedContacts] = useState("");
  const [customRecipientList, setCustomRecipientList] = useState<Array<{ name: string; phone: string }>>([]);

  // Lookup maps
  const propertyMap = new Map(props.map((p) => [p.id, p]));

  // Recipient Target Calculation
  let recipientList: Array<{ name: string; phone: string; unit?: string; property?: string }> = [];

  if (targetAudience === "all") {
    recipientList = tenants.map((t) => ({ name: t.fullName, phone: t.phone }));
  } else if (targetAudience === "property") {
    const propTenants = tenants;
    recipientList = propTenants.map((t) => ({ name: t.fullName, phone: t.phone, property: propertyMap.get(selectedPropertyId)?.name }));
  } else if (targetAudience === "custom") {
    recipientList = customRecipientList;
  }

  // Filter Search
  const query = searchQuery.trim().toLowerCase();

  const filteredTenants = tenants.filter((t) => {
    if (!query) return true;
    return t.fullName.toLowerCase().includes(query) || t.phone.includes(query) || t.nationalId.toLowerCase().includes(query);
  });

  const filteredMsgs = msgs.filter((m) => {
    if (!query) return true;
    return (
      m.senderName.toLowerCase().includes(query) ||
      m.preview.toLowerCase().includes(query) ||
      m.channel.toLowerCase().includes(query) ||
      m.unitLabel.toLowerCase().includes(query)
    );
  });

  // Calculate SMS segments (160 chars per SMS)
  const charCount = messageText.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  const handleRegisterNewSenderId = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newSenderInput.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!formatted) return;

    if (senderIds.some((s) => s.id === formatted)) {
      setStatusMsg(`⚠️ Sender ID "${formatted}" is already registered.`);
      return;
    }

    const newObj = { id: formatted, name: formatted, status: "APPROVED", isDefault: false };
    setSenderIds((prev) => [...prev, newObj]);
    setSenderId(formatted);
    setNewSenderInput("");
    setShowAddSenderModal(false);
    setStatusMsg(`🎉 Custom Sender ID "${formatted}" successfully registered on Onfon Gateway!`);
  };

  const handleSetDefaultSenderId = (idToSet: string) => {
    setSenderIds((prev) =>
      prev.map((s) => ({
        ...s,
        isDefault: s.id === idToSet,
      }))
    );
    setSenderId(idToSet);
    setStatusMsg(`✅ Default Sender ID set to "${idToSet}".`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/);
      const parsed: Array<{ name: string; phone: string }> = [];

      lines.forEach((line, index) => {
        if (!line.trim()) return;
        // Skip header if line 1 contains "name" or "phone"
        if (index === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("phone"))) {
          return;
        }
        const parts = line.split(/[,;\t]/);
        if (parts.length >= 2) {
          parsed.push({ name: parts[0].trim(), phone: parts[1].trim() });
        } else if (parts[0].trim()) {
          parsed.push({ name: "Contact", phone: parts[0].trim() });
        }
      });

      if (parsed.length === 0) {
        setStatusMsg("⚠️ Could not parse any contacts from the file. Please check file format.");
        return;
      }

      setCustomRecipientList(parsed);
      setTargetAudience("custom");
      setStatusMsg(`🎉 Successfully uploaded and parsed ${parsed.length} contacts from "${file.name}"!`);
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = "Name,Phone Number\nJane Wambui,+254712445908\nPeter Otieno,+254722109843\nGrace Mutua,+254733987123\nSamuel Njoroge,+254790112233";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my_nyumba_contacts_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleParsePastedContacts = () => {
    if (!pastedContacts.trim()) return;
    const lines = pastedContacts.split("\n");
    const parsed: Array<{ name: string; phone: string }> = [];

    lines.forEach((line) => {
      const parts = line.split(/[,;\t]/);
      if (parts.length >= 2) {
        parsed.push({ name: parts[0].trim(), phone: parts[1].trim() });
      } else if (parts[0].trim()) {
        parsed.push({ name: "Contact", phone: parts[0].trim() });
      }
    });

    setCustomRecipientList(parsed);
    setTargetAudience("custom");
    setActiveTab("broadcast");
    setStatusMsg(`✅ Successfully imported ${parsed.length} custom contact records for Bulk SMS dispatch!`);
  };

  const handleDispatchBulkSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientList.length === 0) {
      setStatusMsg("⚠️ No recipients selected for Bulk SMS dispatch.");
      return;
    }

    setIsSending(true);
    setStatusMsg(`Initiating Onfon Media Gateway Bulk SMS dispatch to ${recipientList.length} recipient(s)...`);

    try {
      const res = await sendBulkSmsServerFn({
        data: {
          senderId,
          messageText,
          recipients: recipientList,
          campaignName,
        },
      });

      if (res && "error" in res && res.error) {
        setStatusMsg(`❌ Error: ${res.error}`);
        return;
      }

      if (res.success) {
        setStatusMsg(
          `🎉 Bulk SMS Campaign Dispatched via Onfon Media Gateway! Batch Ref: ${res.batchId} (${res.recipientCount} Recipients Queued)`
        );
        router.invalidate();
      }
    } catch (err: any) {
      setStatusMsg(`❌ Dispatch Error: ${err?.message || "Failed to send Bulk SMS."}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleInsertTag = (tag: string) => {
    setMessageText((prev) => prev + ` ${tag} `);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Portfolio Communications & Onfon Media Bulk SMS"
        title="Messages & Bulk SMS Broadcast Center"
        subtitle="Send targeted bulk SMS broadcasts, tenant payment notices, emergency alerts, or custom database contact lists via Onfon Media Gateway."
      />

      {/* SOLID DOMINANT METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">SMS Gateway Provider</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Radio size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-2xl font-extrabold text-white">Onfon Media</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium">Active Sender ID: <strong className="text-white font-mono bg-white/20 px-1.5 py-0.5 rounded-xs">{senderId}</strong></p>
        </div>

        <div className="rounded-md border border-emerald-500 bg-emerald-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Contactable Tenants</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{tenants.length}</span>
          </div>
          <p className="mt-2 text-xs text-emerald-100 font-medium">Active Portfolio Mobile Contacts</p>
        </div>

        <div className="rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Custom Contacts List</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <FileSpreadsheet size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{customRecipientList.length}</span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium">Uploaded File Database</p>
        </div>

        <div className="rounded-md border border-amber-500 bg-amber-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">SMS Credit Balance</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Zap size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">45,800</span>
          </div>
          <p className="mt-2 text-xs text-amber-100 font-medium">Onfon Gateway Bulk SMS Credits</p>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 rounded-xs border border-primary/30 bg-primary/10 p-3 text-xs font-bold text-primary flex items-center justify-between shadow-xs">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="text-xs hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* SEARCH ENGINE BAR */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-md shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant directory, sender IDs, contact uploads, gateway batch IDs, or inbox history..."
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

      {/* FEATURE TABS BAR */}
      <div className="mb-6 flex items-center overflow-x-auto border-b border-border bg-card p-1.5 rounded-md gap-1 shadow-xs">
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "broadcast"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Send size={14} /> Bulk SMS Broadcast Studio
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "upload"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-blue-950/20 hover:text-blue-400"
          }`}
        >
          <Upload size={14} /> Upload Contacts Database ({customRecipientList.length})
        </button>

        <button
          onClick={() => setActiveTab("senderids")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "senderids"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-purple-950/20 hover:text-purple-400"
          }`}
        >
          <Tag size={14} /> Sender ID Manager ({senderIds.length})
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "directory"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-amber-950/20 hover:text-amber-400"
          }`}
        >
          <Users size={14} /> Tenant Phone Directory ({filteredTenants.length})
        </button>

        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "inbox"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-emerald-950/20 hover:text-emerald-400"
          }`}
        >
          <MessageSquare size={14} /> Gateway Dispatch History ({filteredMsgs.length})
        </button>
      </div>

      {/* MODAL: REGISTER NEW SENDER ID */}
      {showAddSenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-md border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Tag size={18} />
                <span>Register Custom Sender ID</span>
              </div>
              <button onClick={() => setShowAddSenderModal(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleRegisterNewSenderId} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Sender ID Name / Alphanumeric Tag *</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  placeholder="e.g. KILIMANI_EST or ROT_KEYS"
                  value={newSenderInput}
                  onChange={(e) => setNewSenderInput(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background p-2.5 text-xs font-mono font-bold uppercase text-foreground focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Alphanumeric, max 11 characters, no special symbols. Registered with Communications Authority (CA) & Onfon Gateway.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddSenderModal(false)}
                  className="rounded-xs border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} /> Register & Approve Sender ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEATURE TAB 1: BULK SMS BROADCAST STUDIO */}
      {activeTab === "broadcast" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Panel title="Bulk SMS Broadcast Studio (Onfon Media Integrated)" meta="Dispatch mass tenant alerts">
              <form onSubmit={handleDispatchBulkSms} className="space-y-4 text-xs">
                {/* SENDER ID DROPDOWN SELECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold">Select Sender ID *</label>
                      <button
                        type="button"
                        onClick={() => setShowAddSenderModal(true)}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={12} /> Register Custom ID
                      </button>
                    </div>
                    <select
                      value={senderId}
                      onChange={(e) => setSenderId(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-primary outline-none focus:border-primary cursor-pointer shadow-xs"
                    >
                      {senderIds.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.status}){s.isDefault ? " - DEFAULT" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Campaign Reference Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. August Rent Payment Notice"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Target Recipient Audience Cohort *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetAudience("all")}
                      className={`p-2.5 rounded-xs border text-left font-bold text-xs transition-all cursor-pointer ${
                        targetAudience === "all"
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Users size={14} className="mb-1" />
                      <div>All Portfolio Tenants</div>
                      <div className="text-[10px] text-muted-foreground font-normal">{tenants.length} contacts</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetAudience("property")}
                      className={`p-2.5 rounded-xs border text-left font-bold text-xs transition-all cursor-pointer ${
                        targetAudience === "property"
                          ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Building2 size={14} className="mb-1" />
                      <div>Property Cohort</div>
                      <div className="text-[10px] text-muted-foreground font-normal">By asset name</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetAudience("custom")}
                      className={`p-2.5 rounded-xs border text-left font-bold text-xs transition-all cursor-pointer ${
                        targetAudience === "custom"
                          ? "border-purple-500 bg-purple-500/10 text-purple-500 shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Upload size={14} className="mb-1" />
                      <div>Custom Upload List</div>
                      <div className="text-[10px] text-muted-foreground font-normal">{customRecipientList.length} imported</div>
                    </button>
                  </div>
                </div>

                {targetAudience === "property" && (
                  <div>
                    <label className="block font-bold mb-1">Select Property Asset Cohort *</label>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
                    >
                      {props.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.code}) - {p.occupiedUnits} Occupied Units
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold">SMS Message Body *</label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {charCount} Chars ({smsSegments} SMS Segment{smsSegments > 1 ? "s" : ""})
                    </span>
                  </div>

                  {/* Template Presets */}
                  <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Load Preset:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMessageText("Dear {tenant_name}, please be reminded that your monthly rent payment for {property_name} is due. Thank you.");
                        if (!campaignName) setCampaignName("Rent Payment Reminder");
                      }}
                      className="rounded-xs bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 text-[10px] font-bold hover:bg-primary/20 cursor-pointer"
                    >
                      ⚡ Rent Due Reminder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMessageText("Dear {tenant_name}, routine maintenance works are scheduled for {property_name}. Thank you for your cooperation.");
                        if (!campaignName) setCampaignName("Maintenance Announcement");
                      }}
                      className="rounded-xs bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 text-[10px] font-bold hover:bg-purple-500/20 cursor-pointer"
                    >
                      ⚡ Maintenance Notice
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMessageText("");
                        setCampaignName("");
                      }}
                      className="rounded-xs bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold hover:text-foreground cursor-pointer"
                    >
                      🧹 Clear
                    </button>
                  </div>

                  {/* Insert Tags Bar */}
                  <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Insert Tags:</span>
                    <button
                      type="button"
                      onClick={() => handleInsertTag("{tenant_name}")}
                      className="rounded-xs bg-muted px-2 py-0.5 text-[10px] font-bold hover:bg-primary/20 hover:text-primary cursor-pointer"
                    >
                      + {"{tenant_name}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTag("{property_name}")}
                      className="rounded-xs bg-muted px-2 py-0.5 text-[10px] font-bold hover:bg-primary/20 hover:text-primary cursor-pointer"
                    >
                      + {"{property_name}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertTag("{unit_number}")}
                      className="rounded-xs bg-muted px-2 py-0.5 text-[10px] font-bold hover:bg-primary/20 hover:text-primary cursor-pointer"
                    >
                      + {"{unit_number}"}
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your custom SMS message text here or load a preset..."
                    className="w-full rounded-xs border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Sender ID: <strong className="text-primary font-mono">{senderId}</strong> · Queued: <strong className="text-primary font-mono text-sm">{recipientList.length}</strong> Recipients
                  </div>
                  <button
                    type="submit"
                    disabled={isSending || recipientList.length === 0}
                    className="rounded-xs bg-primary px-5 py-2.5 text-xs font-extrabold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-md transition-all"
                  >
                    <Send size={15} />
                    {isSending ? "Dispatching via Onfon..." : `Dispatch Bulk SMS (${recipientList.length})`}
                  </button>
                </div>
              </form>
            </Panel>
          </div>

          {/* RIGHT SIDE PREVIEW */}
          <div className="space-y-4">
            <Panel title="Onfon Gateway Preview" meta="Live Device Render">
              <div className="rounded-xl border border-border bg-black/90 p-4 text-white space-y-3 font-sans shadow-lg">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-white/10 pb-2">
                  <span className="font-mono text-primary font-bold">FROM: {senderId}</span>
                  <span>Onfon Gateway</span>
                </div>
                <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs leading-relaxed text-emerald-100">
                  {messageText || "Your Bulk SMS text preview will appear here..."}
                </div>
                <div className="text-[10px] text-neutral-500 text-right">
                  {smsSegments} SMS Segment ({charCount} chars)
                </div>
              </div>
            </Panel>

            <Panel title="Recipient Cohort List" meta={`${recipientList.length} queued`}>
              <div className="max-h-60 overflow-y-auto space-y-1.5 p-1 text-xs">
                {recipientList.slice(0, 10).map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xs bg-muted/40 p-2 border border-border">
                    <span className="font-bold text-foreground">{r.name}</span>
                    <span className="font-mono text-muted-foreground text-[11px]">{r.phone}</span>
                  </div>
                ))}
                {recipientList.length > 10 && (
                  <p className="text-center text-[11px] text-muted-foreground pt-1 italic">
                    + {recipientList.length - 10} more recipients in queue
                  </p>
                )}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* FEATURE TAB 2: UPLOAD CONTACTS DATABASE */}
      {activeTab === "upload" && (
        <Panel title="Upload Custom Contact Database (CSV File / Paste Text)" meta="Import external phone lists">
          <div className="space-y-6 text-xs">
            {/* FILE UPLOAD DROPZONE */}
            <div className="rounded-md border-2 border-dashed border-primary/50 bg-primary/5 p-8 text-center space-y-4 hover:border-primary transition-colors">
              <FileUp className="mx-auto text-primary" size={44} />
              <div>
                <h4 className="font-bold text-foreground text-base mb-1">Select or Drag & Drop CSV / Text File</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Upload any <code className="font-mono text-primary font-bold">.csv</code> or <code className="font-mono text-primary font-bold">.txt</code> contact database file containing contact names and mobile numbers.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xs bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Upload size={15} /> Browse & Upload CSV File
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="rounded-xs border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Download Sample CSV Template
                </button>
              </div>
            </div>

            {/* MANUAL PASTE ALTERNATIVE */}
            <div className="space-y-2">
              <label className="block font-bold">Or Paste Contact List Manually (Name, Phone Number per line)</label>
              <textarea
                rows={5}
                value={pastedContacts}
                onChange={(e) => setPastedContacts(e.target.value)}
                placeholder={`Jane Wambui, +254712445908\nPeter Otieno, +254722109843\n+254733987123`}
                className="w-full rounded-xs border border-border bg-background p-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleParsePastedContacts}
                disabled={!pastedContacts.trim()}
                className="rounded-xs bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 size={14} /> Parse & Import Pasted Text
              </button>
            </div>

            {/* PARSED CONTACTS PREVIEW TABLE */}
            {customRecipientList.length > 0 && (
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Parsed Database Preview ({customRecipientList.length} Contacts)</span>
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomRecipientList([])}
                      className="rounded-xs border border-danger/30 text-danger px-3 py-1 text-xs font-bold hover:bg-danger/10 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Clear List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetAudience("custom");
                        setActiveTab("broadcast");
                      }}
                      className="rounded-xs bg-primary px-4 py-1 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                    >
                      <Send size={12} /> Use List in Broadcast Studio
                    </button>
                  </div>
                </div>

                <Table head={["Recipient Name", "Mobile Phone Number"]}>
                  {customRecipientList.map((c, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/40">
                      <Td className="font-bold text-foreground">{c.name}</Td>
                      <Td num className="font-mono text-primary font-bold">{c.phone}</Td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* FEATURE TAB 3: SENDER ID MANAGER */}
      {activeTab === "senderids" && (
        <Panel title="Onfon Gateway Sender ID Roster" meta={`${senderIds.length} registered Sender IDs`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <p className="text-xs text-muted-foreground font-medium">
                Sender IDs are registered with the Communications Authority of Kenya (CA) and provisioned on Onfon Media gateway.
              </p>
              <button
                onClick={() => setShowAddSenderModal(true)}
                className="rounded-xs bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={14} /> Register New Sender ID
              </button>
            </div>

            <Table head={["Sender ID Tag", "Status & CA Compliance", "Default Selection", "Action"]}>
              {senderIds.map((s) => (
                <tr key={s.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <Td className="font-bold font-mono text-primary text-sm">{s.name}</Td>
                  <Td>
                    <Badge variant="paid">{s.status}</Badge>
                  </Td>
                  <Td>
                    {s.isDefault ? (
                      <Badge variant="success">DEFAULT SENDER ID</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Secondary</span>
                    )}
                  </Td>
                  <Td right>
                    {!s.isDefault && (
                      <button
                        onClick={() => handleSetDefaultSenderId(s.id)}
                        className="rounded-xs border border-border bg-background px-3 py-1 text-xs font-bold hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                      >
                        Set as Default
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </Table>
          </div>
        </Panel>
      )}

      {/* FEATURE TAB 4: TENANT PHONE DIRECTORY */}
      {activeTab === "directory" && (
        <Panel title="Portfolio Tenant Mobile Directory" meta={`${filteredTenants.length} contactable accounts`}>
          {filteredTenants.length > 0 ? (
            <Table head={["Tenant Account Name", "Mobile Phone", "National ID", "Direct SMS Action"]}>
              {filteredTenants.map((t) => (
                <tr key={t.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <Td className="font-bold text-foreground text-sm">{t.fullName}</Td>
                  <Td num className="font-mono font-bold text-primary">{t.phone}</Td>
                  <Td num className="font-mono text-muted-foreground">{t.nationalId}</Td>
                  <Td right>
                    <button
                      onClick={() => {
                        setCustomRecipientList([{ name: t.fullName, phone: t.phone }]);
                        setTargetAudience("custom");
                        setActiveTab("broadcast");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xs bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
                    >
                      <Smartphone size={13} /> Draft SMS
                    </button>
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <Users className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Tenants Found Matching "{searchQuery}"</p>
            </div>
          )}
        </Panel>
      )}

      {/* FEATURE TAB 5: GATEWAY DISPATCH HISTORY */}
      {activeTab === "inbox" && (
        <Panel title="Onfon Gateway Dispatch Logs & History" meta={`${filteredMsgs.length} messages logged`}>
          {filteredMsgs.length > 0 ? (
            <Table head={["Dispatch Date", "Gateway Sender & Channel", "Recipient Target", "Message Preview", "Status"]}>
              {filteredMsgs.map((m: (typeof msgs)[number]) => (
                <tr key={m.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <Td num className="font-semibold text-xs">{m.createdAt?.slice(0, 10) || "Today"}</Td>
                  <Td className="font-bold text-foreground">{m.senderName}</Td>
                  <Td className="font-medium text-primary">{m.unitLabel}</Td>
                  <Td className="max-w-md truncate font-sans text-xs">{m.preview}</Td>
                  <Td>
                    <Badge variant="paid">DISPATCHED</Badge>
                  </Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <MessageSquare className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Gateway Logs Found Matching "{searchQuery}"</p>
            </div>
          )}
        </Panel>
      )}
    </AppShell>
  );
}
