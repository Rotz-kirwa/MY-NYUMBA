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

export const properties: Property[] = [
  {
    id: "kilimani-heights",
    name: "Kilimani Heights",
    area: "Kilimani",
    tier: "Mid",
    units: 24,
    occupied: 22,
    monthlyRoll: 1_128_000,
    collected: 946_000,
    caretaker: "Joseph Mwangi",
    caretakerPhone: "+254 712 884 210",
    yearBuilt: 2016,
  },
  {
    id: "lavington-green",
    name: "Lavington Green Residences",
    area: "Lavington",
    tier: "Premium",
    units: 12,
    occupied: 11,
    monthlyRoll: 1_705_000,
    collected: 1_560_000,
    caretaker: "Agnes Wairimu",
    caretakerPhone: "+254 733 402 918",
    yearBuilt: 2019,
  },
  {
    id: "riverside-court",
    name: "Riverside Court Apartments",
    area: "Westlands",
    tier: "Premium",
    units: 18,
    occupied: 16,
    monthlyRoll: 1_440_000,
    collected: 1_080_000,
    caretaker: "Peter Ochieng",
    caretakerPhone: "+254 720 118 673",
    yearBuilt: 2014,
  },
  {
    id: "kileleshwa-mews",
    name: "Kileleshwa Mews",
    area: "Kileleshwa",
    tier: "Mid",
    units: 16,
    occupied: 15,
    monthlyRoll: 1_020_000,
    collected: 884_000,
    caretaker: "Halima Abdi",
    caretakerPhone: "+254 726 550 341",
    yearBuilt: 2018,
  },
  {
    id: "south-b-villas",
    name: "South B Garden Villas",
    area: "South B",
    tier: "Standard",
    units: 20,
    occupied: 18,
    monthlyRoll: 640_000,
    collected: 494_000,
    caretaker: "Samuel Kiptoo",
    caretakerPhone: "+254 715 903 226",
    yearBuilt: 2011,
  },
  {
    id: "ruaka-skyline",
    name: "Ruaka Skyline Towers",
    area: "Ruaka",
    tier: "Standard",
    units: 32,
    occupied: 27,
    monthlyRoll: 864_000,
    collected: 621_000,
    caretaker: "Grace Njeri",
    caretakerPhone: "+254 701 447 802",
    yearBuilt: 2021,
  },
  {
    id: "karen-oaks",
    name: "Karen Oaks Townhouses",
    area: "Karen",
    tier: "Premium",
    units: 8,
    occupied: 8,
    monthlyRoll: 1_640_000,
    collected: 1_640_000,
    caretaker: "David Muriuki",
    caretakerPhone: "+254 738 271 095",
    yearBuilt: 2020,
  },
];

export type Unit = {
  id: string;
  propertyId: string;
  label: string;
  type: "Studio" | "1 Bed" | "2 Bed" | "3 Bed" | "4 Bed Maisonette";
  rent: number;
  status: "Occupied" | "Vacant" | "Notice" | "Under repair";
  tenant?: string;
};

export const units: Unit[] = [
  { id: "u1", propertyId: "kilimani-heights", label: "A4", type: "1 Bed", rent: 47_000, status: "Occupied", tenant: "Brian Otieno" },
  { id: "u2", propertyId: "kilimani-heights", label: "A5", type: "1 Bed", rent: 47_000, status: "Vacant" },
  { id: "u3", propertyId: "kilimani-heights", label: "B2", type: "2 Bed", rent: 68_000, status: "Occupied", tenant: "Faith Chebet" },
  { id: "u4", propertyId: "kilimani-heights", label: "B7", type: "2 Bed", rent: 68_000, status: "Notice", tenant: "Kevin Njoroge" },
  { id: "u5", propertyId: "lavington-green", label: "L1", type: "3 Bed", rent: 155_000, status: "Occupied", tenant: "Dr. Amina Yusuf" },
  { id: "u6", propertyId: "lavington-green", label: "L4", type: "3 Bed", rent: 148_000, status: "Occupied", tenant: "Michael Kariuki" },
  { id: "u7", propertyId: "riverside-court", label: "R2", type: "2 Bed", rent: 92_000, status: "Occupied", tenant: "Sharon Wanjiku" },
  { id: "u8", propertyId: "riverside-court", label: "R9", type: "2 Bed", rent: 92_000, status: "Under repair" },
  { id: "u9", propertyId: "kileleshwa-mews", label: "K3", type: "2 Bed", rent: 74_000, status: "Occupied", tenant: "Tabitha Mueni" },
  { id: "u10", propertyId: "south-b-villas", label: "S12", type: "Studio", rent: 26_000, status: "Occupied", tenant: "Dennis Kamau" },
  { id: "u11", propertyId: "ruaka-skyline", label: "T18", type: "1 Bed", rent: 32_000, status: "Vacant" },
  { id: "u12", propertyId: "karen-oaks", label: "O2", type: "4 Bed Maisonette", rent: 210_000, status: "Occupied", tenant: "Esther Naliaka" },
];

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

export const tenants: Tenant[] = [
  { id: "t1", name: "Brian Otieno", phone: "+254 712 445 908", unit: "A4", property: "Kilimani Heights", propertyId: "kilimani-heights", since: "2023-03-01", balance: 0, status: "paid", score: 97 },
  { id: "t2", name: "Faith Chebet", phone: "+254 726 118 340", unit: "B2", property: "Kilimani Heights", propertyId: "kilimani-heights", since: "2022-08-15", balance: 34_000, status: "partial", score: 78 },
  { id: "t3", name: "Kevin Njoroge", phone: "+254 733 902 117", unit: "B7", property: "Kilimani Heights", propertyId: "kilimani-heights", since: "2021-11-01", balance: 68_000, status: "overdue", score: 54 },
  { id: "t4", name: "Dr. Amina Yusuf", phone: "+254 720 664 231", unit: "L1", property: "Lavington Green Residences", propertyId: "lavington-green", since: "2020-02-01", balance: 0, status: "paid", score: 99 },
  { id: "t5", name: "Michael Kariuki", phone: "+254 701 338 774", unit: "L4", property: "Lavington Green Residences", propertyId: "lavington-green", since: "2023-09-01", balance: 148_000, status: "overdue", score: 61 },
  { id: "t6", name: "Sharon Wanjiku", phone: "+254 715 220 486", unit: "R2", property: "Riverside Court Apartments", propertyId: "riverside-court", since: "2024-01-05", balance: 0, status: "paid", score: 92 },
  { id: "t7", name: "Tabitha Mueni", phone: "+254 738 771 049", unit: "K3", property: "Kileleshwa Mews", propertyId: "kileleshwa-mews", since: "2022-06-01", balance: 0, status: "paid", score: 95 },
  { id: "t8", name: "Dennis Kamau", phone: "+254 704 559 812", unit: "S12", property: "South B Garden Villas", propertyId: "south-b-villas", since: "2024-07-01", balance: 26_000, status: "due", score: 83 },
  { id: "t9", name: "Esther Naliaka", phone: "+254 729 004 517", unit: "O2", property: "Karen Oaks Townhouses", propertyId: "karen-oaks", since: "2019-04-01", balance: 0, status: "paid", score: 100 },
  { id: "t10", name: "Collins Barasa", phone: "+254 717 862 330", unit: "T7", property: "Ruaka Skyline Towers", propertyId: "ruaka-skyline", since: "2023-12-01", balance: 16_000, status: "partial", score: 71 },
];

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

export const payments: Payment[] = [
  { id: "p1", ref: "TFR3K9X2LM", tenant: "Brian Otieno", unit: "A4", property: "Kilimani Heights", amount: 47_000, expected: 47_000, date: "2026-08-03", channel: "M-Pesa", status: "paid" },
  { id: "p2", ref: "TH8B4Q7WPD", tenant: "Faith Chebet", unit: "B2", property: "Kilimani Heights", amount: 34_000, expected: 68_000, date: "2026-08-05", channel: "M-Pesa", status: "partial" },
  { id: "p3", ref: "TG2M6R1YKV", tenant: "Dr. Amina Yusuf", unit: "L1", property: "Lavington Green Residences", amount: 155_000, expected: 155_000, date: "2026-08-01", channel: "Bank transfer", status: "paid" },
  { id: "p4", ref: "TJ5N8Z3QCB", tenant: "Sharon Wanjiku", unit: "R2", property: "Riverside Court Apartments", amount: 92_000, expected: 92_000, date: "2026-08-02", channel: "M-Pesa", status: "paid" },
  { id: "p5", ref: "TK9P2V6HRX", tenant: "Tabitha Mueni", unit: "K3", property: "Kileleshwa Mews", amount: 74_000, expected: 74_000, date: "2026-08-04", channel: "M-Pesa", status: "paid" },
  { id: "p6", ref: "TL4D7C5JNS", tenant: "Collins Barasa", unit: "T7", property: "Ruaka Skyline Towers", amount: 16_000, expected: 32_000, date: "2026-08-09", channel: "M-Pesa", status: "partial" },
  { id: "p7", ref: "TM7X1F8GTQ", tenant: "Esther Naliaka", unit: "O2", property: "Karen Oaks Townhouses", amount: 210_000, expected: 210_000, date: "2026-08-01", channel: "Bank transfer", status: "paid" },
  { id: "p8", ref: "—", tenant: "Kevin Njoroge", unit: "B7", property: "Kilimani Heights", amount: 0, expected: 68_000, date: "2026-08-05", channel: "M-Pesa", status: "overdue" },
  { id: "p9", ref: "—", tenant: "Michael Kariuki", unit: "L4", property: "Lavington Green Residences", amount: 0, expected: 148_000, date: "2026-08-05", channel: "Bank transfer", status: "overdue" },
  { id: "p10", ref: "—", tenant: "Dennis Kamau", unit: "S12", property: "South B Garden Villas", amount: 0, expected: 26_000, date: "2026-08-20", channel: "M-Pesa", status: "due" },
  { id: "p11", ref: "TN3W9B4KLE", tenant: "Grace Atieno", unit: "T22", property: "Ruaka Skyline Towers", amount: 27_000, expected: 27_000, date: "2026-08-06", channel: "M-Pesa", status: "paid" },
  { id: "p12", ref: "TP6Y2H7MDA", tenant: "Ibrahim Hassan", unit: "S3", property: "South B Garden Villas", amount: 31_000, expected: 31_000, date: "2026-08-07", channel: "Cash", status: "paid" },
];

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

export const leases: Lease[] = [
  { id: "l1", tenant: "Brian Otieno", unit: "A4", property: "Kilimani Heights", start: "2023-03-01", end: "2027-02-28", rent: 47_000, deposit: 94_000, status: "Active" },
  { id: "l2", tenant: "Faith Chebet", unit: "B2", property: "Kilimani Heights", start: "2022-08-15", end: "2026-08-14", rent: 68_000, deposit: 136_000, status: "Expiring" },
  { id: "l3", tenant: "Dr. Amina Yusuf", unit: "L1", property: "Lavington Green Residences", start: "2020-02-01", end: "2027-01-31", rent: 155_000, deposit: 310_000, status: "Active" },
  { id: "l4", tenant: "Kevin Njoroge", unit: "B7", property: "Kilimani Heights", start: "2021-11-01", end: "2026-10-31", rent: 68_000, deposit: 136_000, status: "Expiring" },
  { id: "l5", tenant: "Esther Naliaka", unit: "O2", property: "Karen Oaks Townhouses", start: "2019-04-01", end: "2027-03-31", rent: 210_000, deposit: 420_000, status: "Active" },
  { id: "l6", tenant: "Dennis Kamau", unit: "S12", property: "South B Garden Villas", start: "2024-07-01", end: "2026-06-30", rent: 26_000, deposit: 52_000, status: "Ended" },
];

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

export const tickets: Ticket[] = [
  { id: "m1", ref: "MNT-1042", title: "Borehole pump tripping at night", property: "Ruaka Skyline Towers", unit: "Common", raisedBy: "Grace Njeri", date: "2026-08-12", priority: "Urgent", status: "In progress", vendor: "Maji Works Ltd", cost: 42_000 },
  { id: "m2", ref: "MNT-1041", title: "Kitchen sink blocked", property: "Kilimani Heights", unit: "B2", raisedBy: "Faith Chebet", date: "2026-08-11", priority: "Normal", status: "Assigned", vendor: "Ndegwa Plumbing" },
  { id: "m3", ref: "MNT-1039", title: "Lift service overdue", property: "Riverside Court Apartments", unit: "Common", raisedBy: "Peter Ochieng", date: "2026-08-09", priority: "Urgent", status: "Open" },
  { id: "m4", ref: "MNT-1037", title: "Repaint after vacancy", property: "Kilimani Heights", unit: "A5", raisedBy: "Joseph Mwangi", date: "2026-08-06", priority: "Low", status: "Resolved", vendor: "Rangi Bora Painters", cost: 18_500 },
  { id: "m5", ref: "MNT-1035", title: "Gate motor replacement", property: "Kileleshwa Mews", unit: "Common", raisedBy: "Halima Abdi", date: "2026-08-02", priority: "Normal", status: "Resolved", vendor: "SecureGate Kenya", cost: 63_000 },
];

export type Expense = {
  id: string;
  date: string;
  vendor: string;
  category: "Water" | "Power" | "Security" | "Repairs" | "Garbage" | "Levies";
  property: string;
  amount: number;
  status: "Paid" | "Pending";
};

export const expenses: Expense[] = [
  { id: "e1", date: "2026-08-10", vendor: "Nairobi Water & Sewerage", category: "Water", property: "Kilimani Heights", amount: 84_300, status: "Paid" },
  { id: "e2", date: "2026-08-08", vendor: "Kenya Power", category: "Power", property: "Riverside Court Apartments", amount: 121_500, status: "Paid" },
  { id: "e3", date: "2026-08-07", vendor: "Lion Guard Security", category: "Security", property: "Lavington Green Residences", amount: 96_000, status: "Pending" },
  { id: "e4", date: "2026-08-05", vendor: "Maji Works Ltd", category: "Repairs", property: "Ruaka Skyline Towers", amount: 42_000, status: "Pending" },
  { id: "e5", date: "2026-08-03", vendor: "Taka Taka Solutions", category: "Garbage", property: "South B Garden Villas", amount: 18_000, status: "Paid" },
  { id: "e6", date: "2026-08-01", vendor: "Karen Residents Assoc.", category: "Levies", property: "Karen Oaks Townhouses", amount: 35_000, status: "Paid" },
];

export type Thread = {
  id: string;
  from: string;
  unit: string;
  preview: string;
  time: string;
  channel: "SMS" | "WhatsApp" | "In-app";
  unread: boolean;
};

export const threads: Thread[] = [
  { id: "c1", from: "Faith Chebet", unit: "Kilimani Heights · B2", preview: "I have sent 34,000 today, will clear the balance on Friday after payday.", time: "09:12", channel: "M-Pesa" as unknown as "SMS", unread: true },
  { id: "c2", from: "Kevin Njoroge", unit: "Kilimani Heights · B7", preview: "Kindly give me until the 20th, my employer delayed salaries.", time: "08:40", channel: "WhatsApp", unread: true },
  { id: "c3", from: "Grace Njeri (Caretaker)", unit: "Ruaka Skyline Towers", preview: "Pump technician arrived, he says the control panel needs replacing.", time: "Yesterday", channel: "WhatsApp", unread: false },
  { id: "c4", from: "Dr. Amina Yusuf", unit: "Lavington Green · L1", preview: "Thank you for the quick response on the water heater.", time: "Yesterday", channel: "In-app", unread: false },
  { id: "c5", from: "Sharon Wanjiku", unit: "Riverside Court · R2", preview: "Requesting a copy of my July rent receipt for reimbursement.", time: "Thu", channel: "In-app", unread: false },
];

export type Doc = {
  id: string;
  name: string;
  kind: "Lease" | "ID" | "Invoice" | "Compliance" | "Receipt";
  linked: string;
  size: string;
  uploaded: string;
};

export const documents: Doc[] = [
  { id: "d1", name: "Lease — Otieno, Kilimani A4.pdf", kind: "Lease", linked: "Brian Otieno", size: "412 KB", uploaded: "2026-03-02" },
  { id: "d2", name: "National ID — Chebet.jpg", kind: "ID", linked: "Faith Chebet", size: "1.1 MB", uploaded: "2026-08-15" },
  { id: "d3", name: "Kenya Power invoice Aug 2026.pdf", kind: "Invoice", linked: "Riverside Court", size: "88 KB", uploaded: "2026-08-08" },
  { id: "d4", name: "Fire compliance certificate 2026.pdf", kind: "Compliance", linked: "Lavington Green", size: "2.4 MB", uploaded: "2026-01-19" },
  { id: "d5", name: "Receipt TFR3K9X2LM.pdf", kind: "Receipt", linked: "Brian Otieno", size: "64 KB", uploaded: "2026-08-03" },
];

export const collectionByDay = [
  4, 9, 26, 38, 61, 12, 8, 5, 14, 22, 7, 4, 3, 6, 2, 5, 3, 2, 4, 9, 3, 2, 1, 2, 3, 1, 2, 4, 1, 2, 1,
];

export const monthlySeries = [
  { m: "Feb", collected: 6.1, billed: 7.2 },
  { m: "Mar", collected: 6.6, billed: 7.4 },
  { m: "Apr", collected: 7.0, billed: 7.6 },
  { m: "May", collected: 6.8, billed: 7.9 },
  { m: "Jun", collected: 7.4, billed: 8.1 },
  { m: "Jul", collected: 7.9, billed: 8.3 },
  { m: "Aug", collected: 7.2, billed: 8.4 },
];

export const portfolio = {
  billed: properties.reduce((s, p) => s + p.monthlyRoll, 0),
  collected: properties.reduce((s, p) => s + p.collected, 0),
  units: properties.reduce((s, p) => s + p.units, 0),
  occupied: properties.reduce((s, p) => s + p.occupied, 0),
};

export const rentSegments = () => {
  const collected = portfolio.collected;
  const partial = 386_000;
  const overdue = 612_000;
  const notDue = Math.max(portfolio.billed - collected - partial - overdue, 0);
  return [
    { key: "collected", label: "Collected", value: collected, color: "var(--success)" },
    { key: "partial", label: "Part-paid", value: partial, color: "var(--ochre)" },
    { key: "overdue", label: "Overdue", value: overdue, color: "var(--danger)" },
    { key: "notdue", label: "Not yet due", value: notDue, color: "var(--border-strong)" },
  ];
};
