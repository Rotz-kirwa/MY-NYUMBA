import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- count-up number (500ms tween, reduced-motion safe) ---------- */
export function CountUp({
  value,
  format = (n: number) => n.toLocaleString("en-KE"),
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    const b = value;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 500, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(a + (b - a) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={cn("t-num", className)}>{format(Math.round(display))}</span>;
}

/* ---------- status badge (deliberately static, no pulse) ---------- */
const tone = {
  paid: "bg-success-soft text-success border-success/25",
  partial: "bg-ochre-soft text-warning border-warning/25",
  overdue: "bg-danger-soft text-danger border-danger/25",
  due: "bg-info-soft text-info border-info/25",
  neutral: "bg-muted text-muted-foreground border-border-strong/50",
} as const;

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: keyof typeof tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tone[variant],
      )}
    >
      {children}
    </span>
  );
}

export const statusVariant = (s: string): keyof typeof tone => {
  const k = s.toLowerCase();
  if (["paid", "occupied", "active", "resolved", "paid up"].includes(k)) return "paid";
  if (["partial", "notice", "expiring", "pending", "in progress", "assigned"].includes(k))
    return "partial";
  if (["overdue", "urgent", "vacant", "ended", "under repair"].includes(k)) return "overdue";
  if (["due", "open", "low", "normal"].includes(k)) return "due";
  return "neutral";
};

/* ---------- layout primitives ---------- */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <p className="t-caption">{eyebrow}</p>
        <h1 className="t-display-lg mt-1.5">{title}</h1>
        {subtitle && <p className="t-body mt-1 max-w-xl text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  meta,
  children,
  className,
  delay = 0,
}: {
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={cn("panel stagger-in overflow-hidden", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {(title || meta) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {title && <h2 className="t-heading">{title}</h2>}
          {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  note,
  delay = 0,
  accent,
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  delay?: number;
  accent?: "ochre" | "danger" | "success";
}) {
  return (
    <div
      className="panel stagger-in relative px-4 py-3.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      {accent && (
        <span
          className={cn(
            "absolute top-0 left-0 h-full w-[3px]",
            accent === "ochre" && "bg-ochre",
            accent === "danger" && "bg-danger",
            accent === "success" && "bg-success",
          )}
        />
      )}
      <p className="t-caption">{label}</p>
      <p className="t-display-md mt-2">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {children}
    </div>
  );
}

export function Chip({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "cursor-default rounded-xs border px-2.5 py-1 text-xs font-medium transition-colors duration-150",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-border-strong",
      )}
    >
      {children}
    </span>
  );
}

/* ---------- one consistent empty / loading / error system ---------- */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <svg width="72" height="52" viewBox="0 0 72 52" fill="none" aria-hidden>
        <path
          d="M6 46h60M12 46V22l24-14 24 14v24"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
        />
        <path d="M28 46V32h16v14" stroke="var(--ochre)" strokeWidth="1.5" />
        <circle cx="36" cy="20" r="3" fill="var(--ochre)" />
      </svg>
      <h3 className="t-display-md mt-4 text-[18px]">{title}</h3>
      <p className="t-body mt-1 max-w-sm text-muted-foreground">{body}</p>
      {action && (
        <button className="mt-4 rounded-xs border border-border-strong px-3 py-1.5 text-xs font-semibold transition-colors duration-150 hover:bg-muted">
          {action}
        </button>
      )}
    </div>
  );
}

export function Skeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5">
          <div className="h-3 w-1/4 animate-pulse rounded-xs bg-muted" />
          <div className="h-3 w-1/6 animate-pulse rounded-xs bg-muted" />
          <div className="ml-auto h-3 w-20 animate-pulse rounded-xs bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      <span className="t-num text-xs">!</span>
      {message}
    </div>
  );
}

/* ---------- table shell ---------- */
export function Table({
  head,
  children,
}: {
  head: (string | { label: string; align?: "right" })[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {head.map((h, i) => {
              const label = typeof h === "string" ? h : h.label;
              const right = typeof h !== "string" && h.align === "right";
              return (
                <th
                  key={i}
                  className={cn(
                    "t-caption px-4 py-2.5 text-left font-semibold whitespace-nowrap",
                    right && "text-right",
                  )}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  num,
  right,
  className,
}: {
  children: ReactNode;
  num?: boolean;
  right?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle whitespace-nowrap",
        num && "t-num",
        right && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}
