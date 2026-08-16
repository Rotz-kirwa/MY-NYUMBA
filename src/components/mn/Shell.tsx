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
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { to: "/properties", label: "Properties", icon: Building2, group: "Portfolio" },
  { to: "/units", label: "Units", icon: DoorOpen, group: "Portfolio" },
  { to: "/tenants", label: "Tenants", icon: Users, group: "Portfolio" },
  { to: "/leases", label: "Leases", icon: FileSignature, group: "Portfolio" },
  { to: "/payments", label: "Rent & Payments", icon: Banknote, group: "Money" },
  { to: "/expenses", label: "Expenses", icon: Receipt, group: "Money" },
  { to: "/reports", label: "Reports", icon: BarChart3, group: "Money" },
  { to: "/maintenance", label: "Maintenance", icon: Wrench, group: "Operations" },
  { to: "/messages", label: "Messages", icon: MessagesSquare, group: "Operations" },
  { to: "/documents", label: "Documents", icon: FolderClosed, group: "Operations" },
  { to: "/settings", label: "Settings", icon: Settings, group: "Operations" },
] as const;

const groups = ["Overview", "Portfolio", "Money", "Operations"] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 [transition-timing-function:cubic-bezier(0.22,0.8,0.3,1)] lg:flex"
        style={{ width: collapsed ? 72 : 264 }}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-sidebar-primary font-display text-[15px] font-semibold text-sidebar-primary-foreground">
            N
          </span>
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

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-12 items-center gap-3 border-t border-sidebar-border px-4 text-[13px] text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          <span className={cn("transition-opacity duration-150", collapsed && "opacity-0")}>
            Collapse
          </span>
        </button>
      </aside>

      <div
        className="transition-[padding] duration-200"
        style={{ paddingLeft: 0 }}
        data-shell
      >
        <div className="lg:pl-[var(--pl)]" style={{ ["--pl" as string]: `${collapsed ? 72 : 264}px` }}>
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex size-7 items-center justify-center rounded-xs bg-primary font-display text-sm font-semibold text-primary-foreground">
                N
              </span>
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

            <div className="ml-auto flex items-center gap-2">
              <button className="hidden items-center gap-1.5 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90 sm:flex">
                <Plus size={15} /> Record payment
              </button>
              <button className="relative rounded-xs border border-border bg-card p-2 transition-colors duration-150 hover:border-border-strong">
                <Bell size={16} />
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-ochre" />
              </button>
              <div className="flex items-center gap-2 border-l border-border pl-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent font-display text-[13px] font-semibold text-primary">
                  WK
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-[13px] font-semibold">Wanjiru Kimani</p>
                  <p className="text-[11px] text-muted-foreground">Portfolio manager</p>
                </div>
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
