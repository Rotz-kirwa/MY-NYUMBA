import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Building2,
  DoorOpen,
  Users,
  FileSignature,
  Banknote,
  Wrench,
  Receipt,
  MessagesSquare,
  FolderClosed,
  BarChart3,
  Settings,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  Plus,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard, group: "Overview" },
  { to: "/payments", label: "Rent & Payments", icon: Banknote, group: "Collections" },
  { to: "/collections/arrears", label: "Arrears (Overdue)", icon: AlertTriangle, group: "Collections" },
  { to: "/expenses", label: "Expenses", icon: Receipt, group: "Collections" },
  { to: "/properties", label: "Properties", icon: Building2, group: "Portfolio" },
  { to: "/units", label: "Units", icon: DoorOpen, group: "Portfolio" },
  { to: "/tenants", label: "Tenants", icon: Users, group: "Portfolio" },
  { to: "/leases", label: "Leases", icon: FileSignature, group: "Portfolio" },
  { to: "/maintenance", label: "Maintenance", icon: Wrench, group: "Operations" },
  { to: "/messages", label: "Messages", icon: MessagesSquare, group: "Operations" },
  { to: "/documents", label: "Documents", icon: FolderClosed, group: "Operations" },
  { to: "/reports", label: "Reports & Statements", icon: BarChart3, group: "Reports & Statements" },
  { to: "/settings", label: "Settings", icon: Settings, group: "Settings" },
] as const;

const groups = ["Overview", "Collections", "Portfolio", "Operations", "Reports & Statements", "Settings"] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("Wanjiru Kimani");
  const [userRole, setUserRole] = useState("Portfolio Owner");
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof document !== "undefined") {
      let token: string | null = null;
      const match = document.cookie.match(/mn_session=([^;]+)/);
      if (match && match[1]) {
        token = match[1];
      } else {
        try { token = localStorage.getItem("mn_session"); } catch (e) {}
      }

      if (token) {
        import("@/lib/auth").then(({ decodeSessionToken }) => {
          const decoded = decodeSessionToken(token!);
          if (decoded?.name) setUserName(decoded.name);
          if (decoded?.role) setUserRole(decoded.role.replace("_", " "));
        });
      }
    }
  }, []);


  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar omitted for brevity */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 [transition-timing-function:cubic-bezier(0.22,0.8,0.3,1)] lg:flex"
        style={{ width: collapsed ? 72 : 264 }}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <img src="/favicon.png" alt="My Nyumba" className="size-8 shrink-0 rounded-xs object-cover shadow-sm" />
          <span
            className={cn(
              "font-display text-[17px] font-semibold tracking-tight text-sidebar-accent-foreground transition-opacity duration-150",
              collapsed && "pointer-events-none opacity-0",
            )}
          >
            My&nbsp;Nyumba
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-4">
          {groups.map((g) => (
            <div key={g} className="mb-4">
              <p
                className={cn(
                  "px-2 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/45 uppercase transition-opacity duration-150",
                  collapsed && "opacity-0",
                )}
              >
                {g}
              </p>
              {nav
                .filter((n) => n.group === g)
                .map((n) => {
                  const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      title={collapsed ? n.label : undefined}
                      className={cn(
                        "mb-0.5 flex items-center gap-3 rounded-xs px-2 py-2 text-[13px] font-medium transition-colors duration-150",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <span className="relative flex size-5 shrink-0 items-center justify-center">
                        <Icon size={17} strokeWidth={active ? 2.1 : 1.7} />
                        {active && (
                          <span className="absolute -left-2 h-5 w-[2px] bg-sidebar-primary" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "truncate transition-opacity duration-150",
                          collapsed && "pointer-events-none opacity-0",
                        )}
                      >
                        {n.label}
                      </span>
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-2 space-y-1">
          <Link
            to="/login"
            onClick={() => {
              document.cookie = "mn_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              try { localStorage.removeItem("mn_session"); } catch (e) {}
            }}
            title={collapsed ? "Sign out" : undefined}
            className="flex items-center gap-3 rounded-xs px-2 py-2 text-[13px] font-medium text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >

            <LogOut size={17} />
            <span className={cn("truncate transition-opacity duration-150", collapsed && "pointer-events-none opacity-0")}>
              Sign out
            </span>
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full h-10 items-center gap-3 rounded-xs px-2 text-[13px] text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-accent-foreground cursor-pointer"
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            <span className={cn("transition-opacity duration-150", collapsed && "opacity-0")}>
              Collapse
            </span>
          </button>
        </div>
      </aside>

      <div
        className="transition-[padding] duration-200"
        style={{ paddingLeft: 0 }}
        data-shell
      >
        <div className="lg:pl-[var(--pl)]" style={{ ["--pl" as string]: `${collapsed ? 72 : 264}px` }}>
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/favicon.png" alt="My Nyumba" className="size-7 shrink-0 rounded-xs object-cover shadow-sm" />
              <span className="font-display text-[15px] font-semibold">My Nyumba</span>
            </div>

            <label className="hidden max-w-md flex-1 items-center gap-2 rounded-xs border border-border bg-card px-3 py-2 transition-colors duration-150 focus-within:border-primary md:flex">
              <Search size={15} className="text-muted-foreground" />
              <input
                placeholder="Search tenants, units, M-Pesa refs…"
                className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
              <kbd className="t-num rounded-[2px] border border-border px-1.5 text-[10px] text-muted-foreground">
                /
              </kbd>
            </label>

            <div className="ml-auto flex items-center gap-2 relative">
              <Link
                to="/payments"
                className="hidden items-center gap-1.5 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90 sm:flex"
              >
                <Plus size={15} /> Record payment
              </Link>
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative rounded-xs border border-border bg-card p-2 transition-colors duration-150 hover:border-border-strong cursor-pointer"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-ochre" />
              </button>

              {showNotifications && (
                <div className="absolute right-12 top-12 z-50 w-72 rounded-md border border-border bg-card p-4 shadow-xl text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold">System Alerts</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Daraja API</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      🔔 <span className="font-semibold text-foreground">Daraja Callback Listener Active</span> — Real-time M-Pesa C2B reconciliation initialized.
                    </p>
                    <p className="text-muted-foreground">
                      🛡️ <span className="font-semibold text-foreground">PostgreSQL Session Active</span> — Double-entry accounting ledger ready.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent font-display text-[13px] font-semibold text-primary">
                  {initials}
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-[13px] font-semibold">{userName}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{userRole}</p>
                </div>
                <Link
                  to="/login"
                  onClick={() => {
                    document.cookie = "mn_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    try { localStorage.removeItem("mn_session"); } catch (e) {}
                  }}
                  title="Sign out"
                  className="ml-1 flex size-8 items-center justify-center rounded-xs border border-border bg-card text-muted-foreground transition-colors hover:border-danger-soft hover:bg-danger-soft hover:text-danger"
                >
                  <LogOut size={15} />
                </Link>

              </div>
            </div>
          </header>

          <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-xs px-2.5 py-1.5 text-xs font-medium whitespace-nowrap",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
