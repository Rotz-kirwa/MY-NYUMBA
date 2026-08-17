import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { PageHeader, Panel, Table, Td, Badge } from "@/components/mn/Bits";
import { createServerFn } from "@tanstack/react-start";
import { getSessionContext } from "@/lib/auth";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Building2,
  CreditCard,
  Radio,
  History,
  Lock,
  Mail,
  Phone,
  KeyRound,
  CheckCircle2,
  XCircle,
  Search,
  X,
  FilterX,
  UserCheck,
  UserX,
  BadgeAlert,
  Sliders,
} from "lucide-react";

const getSettingsData = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSessionContext();
  const { db } = await import("@/db");
  const { users, auditLogs, organizations } = await import("@/db/schema");
  const { eq, desc } = await import("drizzle-orm");

  const orgUsers = await db.select().from(users).where(eq(users.organizationId, session.organizationId));
  const orgLogs = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.organizationId, session.organizationId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(20);
  const [orgDetails] = await db.select().from(organizations).where(eq(organizations.id, session.organizationId));

  return {
    session,
    adminUsers: orgUsers || [],
    logs: orgLogs || [],
    org: orgDetails || {
      id: session.organizationId,
      name: "My Nyumba Properties Ltd",
      slug: "my-nyumba",
      email: "info@mynyumba.co.ke",
      phone: "+254 700 000 000",
      currency: "KES",
      timezone: "Africa/Nairobi",
    },
  };
});

const addAdministratorServerFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      name: string;
      email: string;
      phone: string;
      role: string;
      initialPassword?: string;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { db } = await import("@/db");
      const { users, auditLogs } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      if (session.role !== "SUPER_ADMIN") {
        return { error: "Only SUPER_ADMIN users have authority to add or invite administrators." };
      }

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email.toLowerCase().trim()));

      if (existing.length > 0) {
        return { error: `An administrator account with email ${data.email} already exists.` };
      }

      const now = new Date().toISOString();
      const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      await db.insert(users).values({
        id: newUserId,
        organizationId: session.organizationId,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        passwordHash: "$2a$10$e7c.E5w9M...mock_hashed_pwd",
        role: data.role,
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      });

      await db.insert(auditLogs).values({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        organizationId: session.organizationId,
        userId: session.userId,
        action: `ADDED_ADMINISTRATOR`,
        entityType: "USER",
        entityId: newUserId,
        metadataJson: JSON.stringify({ name: data.name, email: data.email, role: data.role }),
        createdAt: now,
      });

      return { success: true, userId: newUserId };
    } catch (err: any) {
      console.error("Add Admin Error:", err);
      return { error: err?.message || "Failed to add administrator." };
    }
  });

const updateUserStatusServerFn = createServerFn({ method: "POST" })
  .validator((d: { userId: string; status: string; role?: string }) => d)
  .handler(async ({ data }) => {
    try {
      const session = await getSessionContext();
      const { db } = await import("@/db");
      const { users, auditLogs } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      if (session.role !== "SUPER_ADMIN") {
        return { error: "Only SUPER_ADMIN users can modify administrator permissions or statuses." };
      }

      const now = new Date().toISOString();
      const updatePayload: Record<string, any> = {
        updatedAt: now,
      };

      if (data.status) updatePayload.status = data.status;
      if (data.role) updatePayload.role = data.role;

      await db.update(users).set(updatePayload).where(eq(users.id, data.userId));

      await db.insert(auditLogs).values({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        organizationId: session.organizationId,
        userId: session.userId,
        action: `UPDATED_USER_PERMISSIONS`,
        entityType: "USER",
        entityId: data.userId,
        metadataJson: JSON.stringify(updatePayload),
        createdAt: now,
      });

      return { success: true };
    } catch (err: any) {
      return { error: err?.message || "Failed to update administrator." };
    }
  });


export const Route = createFileRoute("/settings/")({
  loader: () => getSettingsData(),
  component: SettingsPage,
});

function SettingsPage() {
  const { session, adminUsers = [], logs = [], org } = Route.useLoaderData() || {};
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "org" | "payments" | "sms" | "audit">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("PROPERTY_MANAGER");
  const [initialPassword, setInitialPassword] = useState("Nyumba@2026!");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role Breakdown Stats
  const superAdminsCount = adminUsers.filter((u) => u.role === "SUPER_ADMIN").length;
  const managersCount = adminUsers.filter((u) => u.role === "PROPERTY_MANAGER").length;
  const accountantsCount = adminUsers.filter((u) => u.role === "ACCOUNTANT").length;
  const caretakersCount = adminUsers.filter((u) => u.role === "CARETAKER").length;

  const query = searchQuery.trim().toLowerCase();
  const filteredUsers = adminUsers.filter((u) => {
    if (!query) return true;
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.phone.includes(query) ||
      u.role.toLowerCase().includes(query)
    );
  });

  const handleAddAdministrator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg("Registering new administrator account...");

    try {
      const res = await addAdministratorServerFn({
        data: {
          name,
          email,
          phone,
          role,
          initialPassword,
        },
      });

      if (res && "error" in res && res.error) {
        setStatusMsg(`❌ Error: ${res.error}`);
        return;
      }

      if (res.success) {
        setStatusMsg(`🎉 Administrator account for ${name} (${role}) successfully created!`);
        setName("");
        setEmail("");
        setPhone("");
        setShowAddUserModal(false);
        router.invalidate();
      }
    } catch (err: any) {
      setStatusMsg(`❌ Error: ${err?.message || "Failed to create user."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setStatusMsg(`Updating status to ${nextStatus}...`);

    try {
      const res = await updateUserStatusServerFn({
        data: {
          userId,
          status: nextStatus,
        },
      });

      if (res && "error" in res && res.error) {
        setStatusMsg(`❌ Error: ${res.error}`);
        return;
      }

      setStatusMsg(`✅ User status successfully updated to ${nextStatus}.`);
      router.invalidate();
    } catch (err: any) {
      setStatusMsg(`❌ Error: ${err?.message || "Failed to update user status."}`);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setStatusMsg(`Updating user role to ${newRole}...`);

    try {
      const res = await updateUserStatusServerFn({
        data: {
          userId,
          status: "ACTIVE",
          role: newRole,
        },
      });

      if (res && "error" in res && res.error) {
        setStatusMsg(`❌ Error: ${res.error}`);
        return;
      }

      setStatusMsg(`✅ User role successfully changed to ${newRole}.`);
      router.invalidate();
    } catch (err: any) {
      setStatusMsg(`❌ Error: ${err?.message || "Failed to update role."}`);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="System Configuration & Administration"
        title="Settings & Team RBAC Roster"
        subtitle="Manage administrators, role-based access controls, organization profile, M-Pesa Daraja keys, and audit security logs."
      />

      {/* SOLID DOMINANT METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-md border border-blue-500 bg-blue-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Super Authority Admins</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{superAdminsCount}</span>
          </div>
          <p className="mt-2 text-xs text-blue-100 font-medium">Full Authority Accounts</p>
        </div>

        <div className="rounded-md border border-emerald-500 bg-emerald-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Property Managers</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{managersCount}</span>
          </div>
          <p className="mt-2 text-xs text-emerald-100 font-medium">Portfolio & Operations Staff</p>
        </div>

        <div className="rounded-md border border-purple-500 bg-purple-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Finance & Accountants</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{accountantsCount}</span>
          </div>
          <p className="mt-2 text-xs text-purple-100 font-medium">Financial Ledger Controllers</p>
        </div>

        <div className="rounded-md border border-amber-500 bg-amber-600 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Field Caretakers</span>
            <div className="rounded-md bg-white/20 p-2 text-white">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-white">{caretakersCount}</span>
          </div>
          <p className="mt-2 text-xs text-amber-100 font-medium">Defect & Inspection Staff</p>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 rounded-xs border border-primary/30 bg-primary/10 p-3 text-xs font-bold text-primary flex items-center justify-between shadow-xs">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="text-xs hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-md shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search administrator name, email address, phone number, or RBAC role..."
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
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Users size={14} /> Team Administrators & RBAC ({adminUsers.length})
        </button>

        <button
          onClick={() => setActiveTab("org")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "org"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-emerald-950/20 hover:text-emerald-400"
          }`}
        >
          <Building2 size={14} /> Organization Profile
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "payments"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-purple-950/20 hover:text-purple-400"
          }`}
        >
          <CreditCard size={14} /> M-Pesa Daraja Integration
        </button>

        <button
          onClick={() => setActiveTab("sms")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "sms"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-blue-950/20 hover:text-blue-400"
          }`}
        >
          <Radio size={14} /> Onfon SMS Gateway Keys
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 rounded-xs px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "audit"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-amber-950/20 hover:text-amber-400"
          }`}
        >
          <History size={14} /> Audit & Security Logs ({logs.length})
        </button>
      </div>

      {/* MODAL: ADD / INVITE ADMINISTRATOR */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <UserPlus size={20} />
                <span>Add / Invite System Administrator</span>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddAdministrator} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Administrator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Kimani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@mynyumba.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+254 712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xs border border-border bg-background p-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Assign Administrative Role (RBAC) *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background p-2.5 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                >
                  <option value="SUPER_ADMIN">👑 SUPER_ADMIN (Full Platform Authority & Billing)</option>
                  <option value="PROPERTY_MANAGER">🏢 PROPERTY_MANAGER (Manage Properties, Leases, Units)</option>
                  <option value="ACCOUNTANT">💰 ACCOUNTANT (Financial Ledgers, Payments, Expenses)</option>
                  <option value="CARETAKER">🛠️ CARETAKER (Defect Triage & Unit Inspections)</option>
                  <option value="AUDITOR">👁️ AUDITOR (Read-only Compliance Access)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Initial Password *</label>
                <input
                  type="text"
                  required
                  value={initialPassword}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  className="w-full rounded-xs border border-border bg-background p-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="rounded-xs border border-border px-3 py-2 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus size={14} /> {isSubmitting ? "Creating Account..." : "Create Administrator Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEATURE TAB 1: TEAM ADMINISTRATORS & RBAC */}
      {activeTab === "users" && (
        <Panel title="Team Administrators & Role Access Roster" meta={`${filteredUsers.length} active administrators`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-foreground text-sm">System Users & Privileges</h4>
                <p className="text-xs text-muted-foreground">
                  Super Admins can grant or revoke authority, manage sub-administrators, and assign roles across property management, accounting, and caretakers.
                </p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="rounded-xs bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <UserPlus size={15} /> + Add New Administrator
              </button>
            </div>

            <Table head={["Administrator Name", "Email & Contact", "RBAC Role", "Account Status", "Actions"]}>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="transition-colors duration-150 hover:bg-muted/50">
                  <Td className="font-bold text-foreground text-sm">{u.name}</Td>
                  <Td>
                    <div className="font-semibold text-xs text-foreground">{u.email}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{u.phone}</div>
                  </Td>
                  <Td>
                    <select
                      value={u.role}
                      disabled={session.role !== "SUPER_ADMIN" || u.id === session.userId}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="rounded-xs border border-border bg-background px-2 py-1 text-xs font-bold text-primary outline-none cursor-pointer"
                    >
                      <option value="SUPER_ADMIN">👑 SUPER_ADMIN</option>
                      <option value="PROPERTY_MANAGER">🏢 PROPERTY_MANAGER</option>
                      <option value="ACCOUNTANT">💰 ACCOUNTANT</option>
                      <option value="CARETAKER">🛠️ CARETAKER</option>
                      <option value="AUDITOR">👁️ AUDITOR</option>
                    </select>
                  </Td>
                  <Td>
                    {u.status === "ACTIVE" ? (
                      <Badge variant="paid">ACTIVE</Badge>
                    ) : (
                      <Badge variant="unpaid">SUSPENDED</Badge>
                    )}
                  </Td>
                  <Td right>
                    {session.role === "SUPER_ADMIN" && u.id !== session.userId && (
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`rounded-xs px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors ${
                          u.status === "ACTIVE"
                            ? "border border-danger/30 text-danger hover:bg-danger/10"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "Suspend Access" : "Reactivate Account"}
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </Table>
          </div>
        </Panel>
      )}

      {/* FEATURE TAB 2: ORGANIZATION PROFILE */}
      {activeTab === "org" && (
        <Panel title="Active Organization & Portfolio Branding" meta={`Tenant ID: ${org.id}`}>
          <div className="p-4 space-y-4 max-w-xl text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Organization Legal Name</label>
                <input type="text" readOnly value={org.name} className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-bold text-foreground" />
              </div>
              <div>
                <label className="block font-bold mb-1">Organization Slug / Handle</label>
                <input type="text" readOnly value={org.slug} className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-primary font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Official Contact Email</label>
                <input type="text" readOnly value={org.email} className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs text-foreground" />
              </div>
              <div>
                <label className="block font-bold mb-1">Official Contact Phone</label>
                <input type="text" readOnly value={org.phone} className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Base Currency</label>
                <input type="text" readOnly value={org.currency || "KES"} className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-bold text-primary" />
              </div>
              <div>
                <label className="block font-bold mb-1">Timezone</label>
                <input type="text" readOnly value={org.timezone || "Africa/Nairobi"} className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* FEATURE TAB 3: M-PESA DARAJA INTEGRATION */}
      {activeTab === "payments" && (
        <Panel title="M-Pesa Daraja Integration & STK Push Secrets" meta="Live Bank Gateway">
          <div className="p-4 space-y-4 max-w-xl text-xs">
            <div>
              <label className="block font-bold mb-1">Business ShortCode (Paybill / Till Number)</label>
              <input type="text" readOnly value="174379" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono font-bold text-primary" />
            </div>

            <div>
              <label className="block font-bold mb-1">Lipa Na M-Pesa Online Passkey</label>
              <input type="password" readOnly value="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
            </div>

            <div>
              <label className="block font-bold mb-1">Consumer Key</label>
              <input type="password" readOnly value="yZ812984kja9d812948123049182309" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
            </div>

            <div>
              <label className="block font-bold mb-1">Callback URL (Webhook Endpoint)</label>
              <input type="text" readOnly value="https://mynyumba.co.ke/api/v1/mpesa/callback" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
            </div>
          </div>
        </Panel>
      )}

      {/* FEATURE TAB 4: ONFON SMS GATEWAY KEYS */}
      {activeTab === "sms" && (
        <Panel title="Onfon Media Bulk SMS API Configuration" meta="Active SMS Gateway">
          <div className="p-4 space-y-4 max-w-xl text-xs">
            <div>
              <label className="block font-bold mb-1">Default Onfon Sender ID</label>
              <input type="text" readOnly value="MY-NYUMBA" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono font-bold text-primary" />
            </div>

            <div>
              <label className="block font-bold mb-1">Onfon Gateway API Key</label>
              <input type="password" readOnly value="onf_live_secret_99214810293847109283" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
            </div>

            <div>
              <label className="block font-bold mb-1">Client ID / Account Code</label>
              <input type="text" readOnly value="ACC_MYNYUMBA_2026" className="w-full rounded-xs border border-border bg-muted px-3 py-2 text-xs font-mono text-foreground" />
            </div>
          </div>
        </Panel>
      )}

      {/* FEATURE TAB 5: AUDIT & SECURITY LOGS */}
      {activeTab === "audit" && (
        <Panel title="System Audit & Security Logs" meta={`${logs.length} logged events`}>
          {logs.length > 0 ? (
            <Table head={["Timestamp", "Action Executed", "Entity Type", "Entity ID", "Metadata Details"]}>
              {logs.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-muted/40 text-xs">
                  <Td num className="font-mono">{l.createdAt?.slice(0, 19).replace("T", " ")}</Td>
                  <Td className="font-bold text-primary">{l.action}</Td>
                  <Td><Badge variant="neutral">{l.entityType}</Badge></Td>
                  <Td num className="font-mono text-muted-foreground">{l.entityId}</Td>
                  <Td className="font-mono text-[11px] max-w-xs truncate">{l.metadataJson}</Td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <History className="mx-auto text-muted-foreground/30 mb-3" size={32} />
              <p className="font-bold text-foreground text-sm">No Audit Logs Found</p>
            </div>
          )}
        </Panel>
      )}
    </AppShell>
  );
}
