import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  TrendingUp,
  Coins,
  Users,
  Check,
  Zap,
} from "lucide-react";
import { KSh } from "@/lib/mynyumba";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type RoleConfig = {
  id: string;
  label: string;
  email: string;
  roleBadge: string;
  description: string;
  perks: string[];
};

const ROLES: RoleConfig[] = [
  {
    id: "owner",
    label: "Portfolio Owner",
    email: "wanjiru@mynyumba.co.ke",
    roleBadge: "OWNER (Full Control)",
    description: "Complete visibility over revenue, arrears aging, net operating income, and executive reports.",
    perks: ["Bank & M-Pesa ledger access", "Executive financial reporting", "Multi-property management"],
  },
  {
    id: "manager",
    label: "Property Manager",
    email: "mwangi@mynyumba.co.ke",
    roleBadge: "PROPERTY MANAGER",
    description: "Daily operations, unit assignments, tenant communication, and maintenance work orders.",
    perks: ["Work order dispatch", "Tenant onboarding & scoring", "Rent collection reminders"],
  },
  {
    id: "accountant",
    label: "Accountant",
    email: "accounts@mynyumba.co.ke",
    roleBadge: "ACCOUNTANT",
    description: "Operating expenses, tax compliance summaries, M-Pesa transaction reconciliation.",
    perks: ["Reconciliation ledger", "Expense category tracking", "Audit trail logs"],
  },
  {
    id: "tenant",
    label: "Tenant Portal",
    email: "brian.otieno@gmail.com",
    roleBadge: "TENANT",
    description: "Instant M-Pesa STK rent payments, maintenance request submission, and digital receipts.",
    perks: ["1-Tap M-Pesa payment", "Digital rent receipts", "Direct caretaker messaging"],
  },
];

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(ROLES[0]);
  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"password" | "mpesa">("password");
  const [phone, setPhone] = useState("+254 712 445 908");
  const [isLoading, setIsLoading] = useState(false);
  const [stkStatus, setStkStatus] = useState<string | null>(null);

  const handleRoleSelect = (role: RoleConfig) => {
    setSelectedRole(role);
    setEmail(role.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === "mpesa") {
      setStkStatus("Sending M-Pesa STK Push prompt to your phone...");
      setTimeout(() => {
        setStkStatus("STK Push sent! Confirm PIN on phone to enter console...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }, 1000);
    } else {
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#07152E] text-[#F0F4FA] font-sans selection:bg-[#E5A118] selection:text-black overflow-x-hidden">
      {/* LEFT PANEL: Nairobi Visual Canvas & Brand Identity with Realistic Luxury Apartments Background */}
      <div
        className="relative flex-1 lg:max-w-[55%] p-8 lg:p-14 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#153466] bg-cover bg-center"
        style={{ backgroundImage: `url('/nairobi_luxury_apartments.png')` }}
      >
        {/* Dark Sapphire Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#061229]/94 via-[#0A1E40]/88 to-[#040D1F]/96 backdrop-blur-[2px] pointer-events-none" />

        {/* Ambient Gradient Glows & Background Canvas */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#E5A118]/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-[#0D4ED5]/40 blur-[150px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#F0F4FA 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="My Nyumba"
              className="size-10 shrink-0 rounded-xs object-cover shadow-lg shadow-[#E5A118]/25 border border-[#E5A118]/50"
            />
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-[#F0F4FA]">
                My Nyumba
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-[#E5A118] font-mono">
                Nairobi SaaS Platform
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xs border border-[#1C478A] bg-[#0E2854]/80 px-3 py-1.5 text-xs text-[#B8CDEE] backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Daraja API Active</span>
          </div>
        </div>

        {/* Center Hero Canvas */}
        <div className="relative z-10 my-10 lg:my-0 space-y-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E5A118]/15 border border-[#E5A118]/35 px-3 py-1 text-xs text-[#F7C253]">
              <Sparkles size={13} />
              <span className="font-medium">Property Management SaaS</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
              Property management &amp; <br />
              <span className="italic font-normal text-[#E5A118]">Rent collection, architected for Nairobi.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#B8CDEE] leading-relaxed">
              Authoritative server-side financial ledgers, automated M-Pesa Daraja STK reconciliation, and tenant credit scoring for Kenya's leading real estate portfolios.
            </p>
          </div>

          {/* Interactive Live Mini-Ribbon Hero Card */}
          <div className="rounded-xs border border-[#1D488C] bg-[#0A224A]/90 p-5 backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#96B5E5] font-medium flex items-center gap-2">
                <TrendingUp size={14} className="text-[#E5A118]" /> August 2026 Collection Band
              </span>
              <span className="font-mono text-[#E5A118] font-semibold">{KSh(6128400)} Collected</span>
            </div>

            {/* Micro 31-Day Ribbon Comb */}
            <div className="grid grid-cols-31 gap-[2px] h-9 items-end bg-[#05132B] p-1 rounded-xs border border-[#153B75]">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isPast = day <= 17;
                const isPaid = isPast && day !== 6 && day !== 13;
                const height = isPast ? (isPaid ? "85%" : "40%") : "15%";
                return (
                  <div
                    key={i}
                    title={`Day ${day}`}
                    className="w-full rounded-[1px] transition-all duration-300 hover:scale-y-110"
                    style={{
                      height,
                      backgroundColor: isPast
                        ? isPaid
                          ? "#1E8256"
                          : "#E5A118"
                        : "#142E5C",
                    }}
                  />
                );
              })}
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-medium">
              <div className="flex items-center gap-1.5 rounded-xs bg-[#0F326B] px-2.5 py-1.5 text-[#D1E0F7]">
                <Coins size={12} className="text-[#E5A118]" /> 96.4% Collection
              </div>
              <div className="flex items-center gap-1.5 rounded-xs bg-[#0F326B] px-2.5 py-1.5 text-[#D1E0F7]">
                <Smartphone size={12} className="text-emerald-400" /> M-Pesa Daraja
              </div>
              <div className="flex items-center gap-1.5 rounded-xs bg-[#0F326B] px-2.5 py-1.5 text-[#D1E0F7]">
                <ShieldCheck size={12} className="text-blue-300" /> AES Isolation
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8AA9DA] border-t border-[#153466] pt-6">
          <p>© 2026 My Nyumba SaaS Ltd · Nairobi, Kenya</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Security Policy</span>
            <span className="hover:underline cursor-pointer">Daraja Callback Terms</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Sleek Authentication Console */}
      <div className="flex-1 bg-background text-foreground p-6 sm:p-10 lg:p-14 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <span className="t-caption uppercase tracking-wider text-muted-foreground font-semibold">
              Secure System Gateway
            </span>
            <h2 className="t-display-lg mt-1 text-foreground">Welcome back</h2>
            <p className="t-body mt-1 text-muted-foreground">
              Select your organization role or sign in with your credentials.
            </p>
          </div>

          {/* Role Quick Selector Tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider">
              1. Choose Persona / Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xs bg-muted/60 p-1 border border-border">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`rounded-xs px-2.5 py-2 text-xs font-semibold transition-all duration-200 text-center truncate ${
                    selectedRole.id === r.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role Preview Card */}
          <div className="rounded-xs border border-border bg-[#FCFAF5] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B3B2E] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#D08A28]" /> {selectedRole.roleBadge}
              </span>
              <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                PROD Context
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedRole.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedRole.perks.map((p, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0B3B2E] bg-[#0B3B2E]/5 px-2 py-0.5 rounded-xs border border-[#0B3B2E]/10"
                >
                  <Check size={10} className="text-emerald-700" /> {p}
                </span>
              ))}
            </div>
          </div>

          {/* Sign In Mode Switcher (Password vs M-Pesa OTP) */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-semibold text-[#1A1815] uppercase tracking-wider">
              2. Authentication Method
            </span>
            <div className="flex gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode("password")}
                className={`px-2 py-1 rounded-xs transition-colors ${
                  authMode === "password" ? "bg-[#0B3B2E] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("mpesa")}
                className={`px-2 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  authMode === "mpesa" ? "bg-[#0B3B2E] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone size={12} /> M-Pesa STK
              </button>
            </div>
          </div>

          {/* Form Formality */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "password" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#1A1815]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xs border border-border-strong bg-[#FCFAF5] pl-9 pr-3 py-2 text-sm outline-none focus:border-[#0B3B2E] focus:ring-1 focus:ring-[#0B3B2E] transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-[#1A1815]">Password</label>
                    <a href="#" className="text-xs font-medium text-[#0B3B2E] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xs border border-border-strong bg-[#FCFAF5] pl-9 pr-9 py-2 text-sm outline-none focus:border-[#0B3B2E] focus:ring-1 focus:ring-[#0B3B2E] transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#1A1815]">
                  M-Pesa Registered Phone Number
                </label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3 top-2.5 text-emerald-700" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xs border border-border-strong bg-[#FCFAF5] pl-9 pr-3 py-2 text-sm outline-none focus:border-[#0B3B2E] focus:ring-1 focus:ring-[#0B3B2E] transition-all font-mono font-bold"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  An STK Push prompt will be sent to your phone to authenticate your identity.
                </p>
              </div>
            )}

            {stkStatus && (
              <div className="rounded-xs bg-[#0B3B2E]/10 border border-[#0B3B2E]/20 p-2.5 text-xs text-[#0B3B2E] font-medium flex items-center gap-2">
                <Zap size={14} className="text-[#D08A28] animate-bounce" />
                <span>{stkStatus}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center gap-2 rounded-xs bg-[#0B3B2E] py-3 text-sm font-semibold text-[#F3EFE7] shadow-md transition-all duration-200 hover:bg-[#07281F] hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating session...</span>
              ) : (
                <>
                  <span>Sign into My Nyumba Console</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="rounded-xs bg-[#E8E2D5] p-3 text-center border border-[#D5CEB2]">
            <p className="text-xs text-[#4A463D] font-medium">
              Pair Programming Demo Environment: Click any persona tab above to instant-test tenant isolation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
