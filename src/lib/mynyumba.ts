export const KSh = (n: number, opts?: { compact?: boolean }) => {
  if (opts?.compact && Math.abs(n) >= 1_000_000)
    return `KSh ${(n / 1_000_000).toFixed(1)}M`;
  if (opts?.compact && Math.abs(n) >= 1_000) return `KSh ${Math.round(n / 1000)}K`;
  return `KSh ${n.toLocaleString("en-KE")}`;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export type RentStatus = "paid" | "partial" | "overdue" | "due";

export type Property = {
  id: string;
  name: string;
  area: string;
  tier: "Premium" | "Mid" | "Standard";
  units: number;
  occupied: number;
  monthlyRoll: number;
  collected: number;
  caretaker: string;
  caretakerPhone: string;
  yearBuilt: number;
};

export const properties: Property[] = [];

export type Unit = {
  id: string;
  propertyId: string;
  label: string;
  type: "Studio" | "1 Bed" | "2 Bed" | "3 Bed" | "4 Bed Maisonette";
  rent: number;
  status: "Occupied" | "Vacant" | "Notice" | "Under repair";
  tenant?: string;
};

export const units: Unit[] = [];

export type Tenant = {
  id: string;
  name: string;
  phone: string;
  unit: string;
  property: string;
  propertyId: string;
  since: string;
  balance: number;
  status: RentStatus;
  score: number;
};

export const tenants: Tenant[] = [];

export type Payment = {
  id: string;
  ref: string;
  tenant: string;
  unit: string;
  property: string;
  amount: number;
  expected: number;
  date: string;
  channel: "M-Pesa" | "Bank transfer" | "Cash";
  status: RentStatus;
};

export const payments: Payment[] = [];

export type Lease = {
  id: string;
  tenant: string;
  unit: string;
  property: string;
  start: string;
  end: string;
  rent: number;
  deposit: number;
  status: "Active" | "Expiring" | "Ended";
};

export const leases: Lease[] = [];

export type Ticket = {
  id: string;
  ref: string;
  title: string;
  property: string;
  unit: string;
  raisedBy: string;
  date: string;
  priority: "Urgent" | "Normal" | "Low";
  status: "Open" | "Assigned" | "In progress" | "Resolved";
  vendor?: string;
  cost?: number;
};

export const tickets: Ticket[] = [];

export type Expense = {
  id: string;
  date: string;
  vendor: string;
  category: "Water" | "Power" | "Security" | "Repairs" | "Garbage" | "Levies";
  property: string;
  amount: number;
  status: "Paid" | "Pending";
};

export const expenses: Expense[] = [];

export type Thread = {
  id: string;
  from: string;
  unit: string;
  preview: string;
  time: string;
  channel: "SMS" | "WhatsApp" | "In-app";
  unread: boolean;
};

export const threads: Thread[] = [];

export type Doc = {
  id: string;
  name: string;
  kind: "Lease" | "ID" | "Invoice" | "Compliance" | "Receipt";
  linked: string;
  size: string;
  uploaded: string;
};

export const documents: Doc[] = [];

export const collectionByDay: number[] = Array(31).fill(0);

export const monthlySeries: Array<{ m: string; collected: number; billed: number }> = [];

export const portfolio = {
  billed: 0,
  collected: 0,
  units: 0,
  occupied: 0,
};

export const rentSegments = () => {
  return [
    { key: "collected", label: "Collected", value: 0, color: "var(--success)" },
    { key: "partial", label: "Part-paid", value: 0, color: "var(--ochre)" },
    { key: "overdue", label: "Overdue", value: 0, color: "var(--danger)" },
    { key: "notdue", label: "Not yet due", value: 0, color: "var(--border-strong)" },
  ];
};
