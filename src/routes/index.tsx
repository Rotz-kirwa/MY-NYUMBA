import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mn/Shell";
import { RentRibbon } from "@/components/mn/RentRibbon";
import { Badge, Metric, Panel, Table, Td, CountUp, statusVariant } from "@/components/mn/Bits";
import {
  KSh,
  payments,
  properties,
  tickets,
  monthlySeries,
  portfolio,
} from "@/lib/mynyumba";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Nyumba — Nairobi rent collection dashboard" },
      {
        name: "description",
        content:
          "Track rent collection, arrears and M-Pesa payments across your Nairobi property portfolio in one ledger.",
      },
      { property: "og:title", content: "My Nyumba — Rent collection dashboard" },
      {
        property: "og:description",
        content: "The rent ribbon: money in vs money owed across every unit, every day.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const arrears = payments.filter((p) => p.status !== "paid");
  const max = Math.max(...monthlySeries.map((m) => m.billed));

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-caption">Monday, 17 August 2026 · Nairobi</p>
          <h1 className="t-display-lg mt-1.5">Habari, Wanjiru</h1>
          <p className="t-body mt-1 text-muted-foreground">
            Seven properties, {portfolio.units} units. Two payment promises fall due today.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xs border border-border-strong bg-card px-3 py-2 text-[13px] font-semibold transition-colors duration-150 hover:bg-muted">
            Send rent reminders
          </button>
          <button className="rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90">
            Reconcile M-Pesa
          </button>
        </div>
      </div>

      <RentRibbon />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Arrears carried"
          value={<CountUp value={612_000} format={(n) => KSh(n)} />}
          note="14 units · oldest 63 days"
          accent="danger"
          delay={60}
        />
        <Metric
          label="Vacant units"
          value={<CountUp value={13} />}
          note="Est. KSh 486,000 monthly loss"
          accent="ochre"
          delay={140}
        />
        <Metric
          label="Net operating income"
          value={<CountUp value={6_128_400} format={(n) => KSh(n)} />}
          note="After KSh 396,800 expenses"
          accent="success"
          delay={220}
        />
        <Metric
          label="Open maintenance"
          value={<CountUp value={3} />}
          note="1 urgent · Ruaka borehole"
          delay={300}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Arrears watchlist"
          meta={<Link to="/payments" className="hover:text-foreground">All payments →</Link>}
          delay={80}
        >
          <Table
            head={["Tenant", "Unit", "Expected", { label: "Paid", align: "right" }, "Status", ""]}
          >
            {arrears.map((p) => (
              <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/50">
                <Td>
                  <span className="font-medium">{p.tenant}</span>
                  <span className="block text-xs text-muted-foreground">{p.property}</span>
                </Td>
                <Td num>{p.unit}</Td>
                <Td num>{KSh(p.expected)}</Td>
                <Td num right>
                  {KSh(p.amount)}
                </Td>
                <Td>
                  <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                </Td>
                <Td right>
                  <span className="row-actions text-xs font-semibold text-primary">Follow up</span>
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel title="Billed vs collected" meta="KSh millions" delay={160}>
          <div className="flex h-56 items-end gap-3 px-5 pt-6">
            {monthlySeries.map((m, i) => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full items-end justify-center gap-1">
                  <div
                    className="bar-draw w-1/2 origin-bottom rounded-t-[1px] bg-border-strong/60"
                    style={{ height: `${(m.billed / max) * 100}%`, animationDelay: `${i * 50}ms` }}
                  />
                  <div
                    className="bar-draw w-1/2 origin-bottom rounded-t-[1px] bg-primary"
                    style={{
                      height: `${(m.collected / max) * 100}%`,
                      animationDelay: `${i * 50 + 80}ms`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{m.m}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-[1px] bg-primary" /> Collected
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-[1px] bg-border-strong/60" /> Billed
            </span>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel
          title="Property performance"
          meta={<Link to="/properties" className="hover:text-foreground">View all →</Link>}
          delay={200}
        >
          <div className="divide-y divide-border">
            {properties.slice(0, 5).map((p) => {
              const pct = Math.round((p.collected / p.monthlyRoll) * 100);
              return (
                <Link
                  key={p.id}
                  to="/properties/$propertyId"
                  params={{ propertyId: p.id }}
                  className="flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.area} · {p.occupied}/{p.units} occupied
                    </p>
                  </div>
                  <div className="hidden h-1.5 w-32 overflow-hidden rounded-xs bg-muted sm:block">
                    <div
                      className="ribbon-draw h-full"
                      style={{
                        width: `${pct}%`,
                        background: pct > 90 ? "var(--success)" : pct > 70 ? "var(--ochre)" : "var(--danger)",
                      }}
                    />
                  </div>
                  <span className="t-num w-12 text-right text-sm">{pct}%</span>
                  <ArrowUpRight size={14} className="text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Operations today"
          meta={<Link to="/maintenance" className="hover:text-foreground">Maintenance →</Link>}
          delay={240}
        >
          <div className="divide-y divide-border">
            {tickets.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                <span className="t-num mt-0.5 text-[11px] text-muted-foreground">{t.ref}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.property} · {t.unit} · raised by {t.raisedBy}
                  </p>
                </div>
                <Badge variant={statusVariant(t.priority)}>{t.priority}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
