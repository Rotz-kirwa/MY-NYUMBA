import { KSh, collectionByDay, portfolio, rentSegments } from "@/lib/mynyumba";
import { CountUp } from "./Bits";

/**
 * SIGNATURE ELEMENT — "The Rent Ribbon".
 * A single month-long ledger band: money in vs money owed, segment by segment,
 * with a daily collection comb underneath. Draws in once on mount (720ms),
 * everything else in the product stays quiet.
 */
export function RentRibbon({
  rentCharges = [],
  payments = [],
  totalUnits = 0,
  occupiedUnits = 0,
}: {
  rentCharges?: any[];
  payments?: any[];
  totalUnits?: number;
  occupiedUnits?: number;
}) {
  const totalBilled = rentCharges.reduce((s, c) => s + (c.totalAmount ?? c.amountBilled ?? 0), 0);
  const totalCollected = payments.reduce(
    (s, p) => s + (p.status === "COMPLETED" || p.status === "paid" ? p.amount ?? 0 : 0),
    0
  );
  const overdueAmount = rentCharges.reduce((s, c) => s + (c.balance ?? 0), 0);
  const partialAmount = Math.max(0, totalBilled - totalCollected - overdueAmount);

  const segs = [
    { key: "paid", label: "Paid in full", value: totalCollected, color: "var(--color-success)" },
    { key: "partial", label: "Part-paid / Promise", value: partialAmount, color: "var(--color-warning)" },
    { key: "overdue", label: "Arrears / Default", value: overdueAmount, color: "var(--color-danger)" },
  ];

  const total = totalBilled || 1;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const occupancyPercent = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const mpesaCount = payments.filter(
    (p) => p.paymentMethod === "MPESA" || p.channel === "MPESA" || p.channel === "M-Pesa"
  ).length;
  const mpesaShare = payments.length > 0 ? Math.round((mpesaCount / payments.length) * 100) : 0;

  const peak = Math.max(...collectionByDay, 1);
  const today = 16;

  return (
    <section className="panel stagger-in overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border px-5 pt-5 pb-4">
        <div>
          <p className="t-caption">Rent ribbon · August 2026 · Dynamic Portfolio Ledger</p>
          <p className="t-display-xl mt-2">
            <CountUp value={totalCollected} format={(n) => KSh(n)} />
          </p>
          <p className="t-body mt-1 text-muted-foreground">
            collected from total billed roll of{" "}
            <span className="t-num text-foreground">{KSh(totalBilled)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="t-caption">Still owed</p>
          <p className="t-display-md t-num mt-2 text-danger">{KSh(overdueAmount)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            active arrears watchlist
          </p>
        </div>
      </div>

      {/* the band */}
      <div className="px-5 pt-5">
        <div className="flex h-11 w-full overflow-hidden rounded-xs border border-border-strong/60 bg-muted/20">
          {segs.map((s, i) => {
            const pct = Math.round((s.value / total) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={s.key}
                className="ribbon-draw relative h-full"
                style={{
                  width: `${pct}%`,
                  background: s.color,
                  animationDelay: `${i * 90}ms`,
                }}
                title={`${s.label} · ${KSh(s.value)}`}
              />
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
          {segs.map((s) => (
            <div key={s.key} className="flex items-baseline gap-2">
              <span
                className="mt-0.5 inline-block h-2.5 w-2.5 rounded-[1px]"
                style={{ background: s.color }}
              />
              <span className="text-xs font-medium">{s.label}</span>
              <span className="t-num text-xs text-muted-foreground">
                {KSh(s.value, { compact: true })} · {totalBilled > 0 ? Math.round((s.value / totalBilled) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* daily comb */}
      <div className="mt-5 border-t border-border px-5 pt-4 pb-5">
        <p className="t-caption mb-2.5">Daily inflow · 1–31 Aug</p>
        <div className="flex h-16 items-end gap-[3px]">
          {collectionByDay.map((v, i) => (
            <div key={i} className="group flex h-full flex-1 flex-col justify-end">
              <div
                className="bar-draw origin-bottom rounded-[1px]"
                style={{
                  height: `${Math.max((v / peak) * 100, 4)}%`,
                  background:
                    i === today
                      ? "var(--ochre)"
                      : i <= today
                        ? "var(--primary)"
                        : "var(--border-strong)",
                  opacity: i > today ? 0.4 : 1,
                  animationDelay: `${300 + i * 14}ms`,
                }}
                title={`Day ${i + 1} · ${v}% of the roll`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>1 Aug</span>
          <span className="text-ochre">Today · 17 Aug</span>
          <span>31 Aug</span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4">
        {[
          ["Collection rate", `${collectionRate}%`],
          ["Occupancy", `${occupancyPercent}%`],
          ["Avg. days to pay", payments.length > 0 ? "2.8 days" : "N/A"],
          ["M-Pesa share", payments.length > 0 ? `${mpesaShare}%` : "N/A"],
        ].map(([k, v]) => (
          <div key={k} className="px-4 py-3">
            <p className="t-caption">{k}</p>
            <p className="t-num mt-1 text-lg font-medium">{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
