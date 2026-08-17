import { db, ensureTablesExist } from "./index";
import * as s from "./schema";
import { eq } from "drizzle-orm";

export const DEFAULT_ORG_ID = "org_mynyumba_nairobi";

export async function seedDatabase() {
  if (typeof window !== "undefined") return;
  await ensureTablesExist();

  const [existingOrg] = await db
    .select()
    .from(s.organizations)
    .where(eq(s.organizations.id, DEFAULT_ORG_ID));
  if (existingOrg) return;

  const now = new Date().toISOString();

  // 1. Organization
  await db.insert(s.organizations).values({
    id: DEFAULT_ORG_ID,
    name: "My Nyumba Properties Ltd",
    slug: "my-nyumba-nairobi",
    email: "management@mynyumba.co.ke",
    phone: "+254 700 000 000",
    currency: "KES",
    timezone: "Africa/Nairobi",
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();

  // 2. Default System Users across Roles
  const usersList = [
    { id: "usr_dev", name: "Lead Developer", email: "dev@gmail.com", phone: "+254 700 136 200", role: "OWNER" },
    { id: "usr_wanjiru", name: "Wanjiru Kimani", email: "wanjiru@mynyumba.co.ke", phone: "+254 712 345 678", role: "OWNER" },
    { id: "usr_mwangi", name: "Joseph Mwangi", email: "mwangi@mynyumba.co.ke", phone: "+254 712 884 210", role: "PROPERTY_MANAGER" },
    { id: "usr_accounts", name: "Accounts Dept", email: "accounts@mynyumba.co.ke", phone: "+254 720 000 111", role: "ACCOUNTANT" },
    { id: "usr_brian", name: "Brian Otieno", email: "brian.otieno@gmail.com", phone: "+254 712 445 908", role: "TENANT" },
  ];


  for (const u of usersList) {
    await db.insert(s.users).values({
      id: u.id,
      organizationId: DEFAULT_ORG_ID,
      name: u.name,
      email: u.email,
      phone: u.phone,
      passwordHash: "pbkdf2_hashed_secret",
      role: u.role,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 3. Properties
  const propList = [
    { id: "kilimani-heights", name: "Kilimani Heights", code: "KH-01", area: "Kilimani", tier: "Mid", totalUnits: 24, occupiedUnits: 22, caretakerName: "Joseph Mwangi", caretakerPhone: "+254 712 884 210", yearBuilt: 2016 },
    { id: "lavington-green", name: "Lavington Green Residences", code: "LG-02", area: "Lavington", tier: "Premium", totalUnits: 12, occupiedUnits: 11, caretakerName: "Agnes Wairimu", caretakerPhone: "+254 733 402 918", yearBuilt: 2019 },
    { id: "riverside-court", name: "Riverside Court Apartments", code: "RC-03", area: "Westlands", tier: "Premium", totalUnits: 18, occupiedUnits: 16, caretakerName: "Peter Ochieng", caretakerPhone: "+254 720 118 673", yearBuilt: 2014 },
    { id: "kileleshwa-mews", name: "Kileleshwa Mews", code: "KM-04", area: "Kileleshwa", tier: "Mid", totalUnits: 16, occupiedUnits: 15, caretakerName: "Halima Abdi", caretakerPhone: "+254 726 550 341", yearBuilt: 2018 },
    { id: "south-b-villas", name: "South B Garden Villas", code: "SB-05", area: "South B", tier: "Standard", totalUnits: 20, occupiedUnits: 18, caretakerName: "Samuel Kiptoo", caretakerPhone: "+254 715 903 226", yearBuilt: 2011 },
    { id: "ruaka-skyline", name: "Ruaka Skyline Towers", code: "RS-06", area: "Ruaka", tier: "Standard", totalUnits: 32, occupiedUnits: 27, caretakerName: "Grace Njeri", caretakerPhone: "+254 701 447 802", yearBuilt: 2021 },
    { id: "karen-oaks", name: "Karen Oaks Townhouses", code: "KO-07", area: "Karen", tier: "Premium", totalUnits: 8, occupiedUnits: 8, caretakerName: "David Muriuki", caretakerPhone: "+254 738 271 095", yearBuilt: 2020 },
  ];

  for (const p of propList) {
    await db.insert(s.properties).values({
      id: p.id,
      organizationId: DEFAULT_ORG_ID,
      name: p.name,
      propertyCode: p.code,
      area: p.area,
      tier: p.tier,
      totalUnits: p.totalUnits,
      occupiedUnits: p.occupiedUnits,
      caretakerName: p.caretakerName,
      caretakerPhone: p.caretakerPhone,
      yearBuilt: p.yearBuilt,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 4. Units
  const unitList = [
    { id: "u1", propertyId: "kilimani-heights", unitNumber: "A4", type: "1 Bed", rent: 47000, status: "Occupied" },
    { id: "u2", propertyId: "kilimani-heights", unitNumber: "A5", type: "1 Bed", rent: 47000, status: "Vacant" },
    { id: "u3", propertyId: "kilimani-heights", unitNumber: "B2", type: "2 Bed", rent: 68000, status: "Occupied" },
    { id: "u4", propertyId: "kilimani-heights", unitNumber: "B7", type: "2 Bed", rent: 68000, status: "Notice" },
    { id: "u5", propertyId: "lavington-green", unitNumber: "L1", type: "3 Bed", rent: 155000, status: "Occupied" },
    { id: "u6", propertyId: "lavington-green", unitNumber: "L4", type: "3 Bed", rent: 148000, status: "Occupied" },
    { id: "u7", propertyId: "riverside-court", unitNumber: "R2", type: "2 Bed", rent: 92000, status: "Occupied" },
    { id: "u8", propertyId: "riverside-court", unitNumber: "R9", type: "2 Bed", rent: 92000, status: "Under repair" },
    { id: "u9", propertyId: "kileleshwa-mews", unitNumber: "K3", type: "2 Bed", rent: 74000, status: "Occupied" },
    { id: "u10", propertyId: "south-b-villas", unitNumber: "S12", type: "Studio", rent: 26000, status: "Occupied" },
    { id: "u11", propertyId: "ruaka-skyline", unitNumber: "T18", type: "1 Bed", rent: 32000, status: "Vacant" },
    { id: "u12", propertyId: "karen-oaks", unitNumber: "O2", type: "4 Bed Maisonette", rent: 210000, status: "Occupied" },
  ];

  for (const u of unitList) {
    await db.insert(s.units).values({
      id: u.id,
      organizationId: DEFAULT_ORG_ID,
      propertyId: u.propertyId,
      unitNumber: u.unitNumber,
      type: u.type,
      monthlyRent: u.rent,
      depositAmount: u.rent * 2,
      status: u.status,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 5. Tenants
  const tenantList = [
    { id: "t1", name: "Brian Otieno", phone: "+254 712 445 908", email: "brian.otieno@gmail.com", idNo: "32491028", score: 97 },
    { id: "t2", name: "Faith Chebet", phone: "+254 726 118 340", email: "faith.chebet@yahoo.com", idNo: "29104829", score: 78 },
    { id: "t3", name: "Kevin Njoroge", phone: "+254 733 902 117", email: "kevin.njoroge@outlook.com", idNo: "31092837", score: 54 },
    { id: "t4", name: "Dr. Amina Yusuf", phone: "+254 720 664 231", email: "amina.yusuf@knh.or.ke", idNo: "25492019", score: 99 },
    { id: "t5", name: "Michael Kariuki", phone: "+254 701 338 774", email: "mkariuki@lawfirm.co.ke", idNo: "28301928", score: 61 },
    { id: "t6", name: "Sharon Wanjiku", phone: "+254 715 220 486", email: "sharon.w@designstudio.co.ke", idNo: "34910293", score: 92 },
    { id: "t7", name: "Tabitha Mueni", phone: "+254 738 771 049", email: "t.mueni@techcorp.co.ke", idNo: "30291029", score: 95 },
    { id: "t8", name: "Dennis Kamau", phone: "+254 704 559 812", email: "dennis.kamau@fintech.co.ke", idNo: "35910284", score: 83 },
    { id: "t9", name: "Esther Naliaka", phone: "+254 729 004 517", email: "esther.naliaka@consulting.co.ke", idNo: "24910294", score: 100 },
    { id: "t10", name: "Collins Barasa", phone: "+254 717 862 330", email: "cbarasa@freelance.com", idNo: "33910284", score: 71 },
  ];

  for (const t of tenantList) {
    await db.insert(s.tenants).values({
      id: t.id,
      organizationId: DEFAULT_ORG_ID,
      fullName: t.name,
      phone: t.phone,
      email: t.email,
      nationalId: t.idNo,
      score: t.score,
      status: "Active",
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 6. Leases
  const leaseList = [
    { id: "l1", tenantId: "t1", unitId: "u1", propertyId: "kilimani-heights", start: "2023-03-01", end: "2027-02-28", rent: 47000, deposit: 94000, status: "Active" },
    { id: "l2", tenantId: "t2", unitId: "u3", propertyId: "kilimani-heights", start: "2022-08-15", end: "2026-08-14", rent: 68000, deposit: 136000, status: "Expiring" },
    { id: "l3", tenantId: "t4", unitId: "u5", propertyId: "lavington-green", start: "2020-02-01", end: "2027-01-31", rent: 155000, deposit: 310000, status: "Active" },
    { id: "l4", tenantId: "t3", unitId: "u4", propertyId: "kilimani-heights", start: "2021-11-01", end: "2026-10-31", rent: 68000, deposit: 136000, status: "Expiring" },
    { id: "l5", tenantId: "t9", unitId: "u12", propertyId: "karen-oaks", start: "2019-04-01", end: "2027-03-31", rent: 210000, deposit: 420000, status: "Active" },
    { id: "l6", tenantId: "t8", unitId: "u10", propertyId: "south-b-villas", start: "2024-07-01", end: "2026-06-30", rent: 26000, deposit: 52000, status: "Ended" },
  ];

  for (const l of leaseList) {
    await db.insert(s.leases).values({
      id: l.id,
      organizationId: DEFAULT_ORG_ID,
      propertyId: l.propertyId,
      unitId: l.unitId,
      tenantId: l.tenantId,
      startDate: l.start,
      endDate: l.end,
      monthlyRent: l.rent,
      depositAmount: l.deposit,
      status: l.status,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 7. Rent Charges & Payments
  const paymentList = [
    { id: "p1", ref: "TFR3K9X2LM", tenantId: "t1", leaseId: "l1", unitId: "u1", propertyId: "kilimani-heights", amount: 47000, expected: 47000, date: "2026-08-03", channel: "MPESA", status: "paid" },
    { id: "p2", ref: "TH8B4Q7WPD", tenantId: "t2", leaseId: "l2", unitId: "u3", propertyId: "kilimani-heights", amount: 34000, expected: 68000, date: "2026-08-05", channel: "MPESA", status: "partial" },
    { id: "p3", ref: "TG2M6R1YKV", tenantId: "t4", leaseId: "l3", unitId: "u5", propertyId: "lavington-green", amount: 155000, expected: 155000, date: "2026-08-01", channel: "BANK_TRANSFER", status: "paid" },
    { id: "p4", ref: "TJ5N8Z3QCB", tenantId: "t6", leaseId: "l3", unitId: "u7", propertyId: "riverside-court", amount: 92000, expected: 92000, date: "2026-08-02", channel: "MPESA", status: "paid" },
    { id: "p5", ref: "TK9P2V6HRX", tenantId: "t7", leaseId: "l3", unitId: "u9", propertyId: "kileleshwa-mews", amount: 74000, expected: 74000, date: "2026-08-04", channel: "MPESA", status: "paid" },
    { id: "p6", ref: "TL4D7C5JNS", tenantId: "t10", leaseId: "l6", unitId: "u11", propertyId: "ruaka-skyline", amount: 16000, expected: 32000, date: "2026-08-09", channel: "MPESA", status: "partial" },
    { id: "p7", ref: "TM7X1F8GTQ", tenantId: "t9", leaseId: "l5", unitId: "u12", propertyId: "karen-oaks", amount: 210000, expected: 210000, date: "2026-08-01", channel: "BANK_TRANSFER", status: "paid" },
  ];

  for (const p of paymentList) {
    const chargeId = `rc_${p.id}`;
    await db.insert(s.rentCharges).values({
      id: chargeId,
      organizationId: DEFAULT_ORG_ID,
      leaseId: p.leaseId,
      tenantId: p.tenantId,
      unitId: p.unitId,
      propertyId: p.propertyId,
      billingPeriod: "2026-08",
      dueDate: "2026-08-05",
      rentAmount: p.expected,
      totalAmount: p.expected,
      amountPaid: p.amount,
      balance: p.expected - p.amount,
      status: p.status === "paid" ? "PAID" : p.amount > 0 ? "PARTIALLY_PAID" : "OVERDUE",
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();

    await db.insert(s.payments).values({
      id: p.id,
      organizationId: DEFAULT_ORG_ID,
      tenantId: p.tenantId,
      leaseId: p.leaseId,
      unitId: p.unitId,
      propertyId: p.propertyId,
      amount: p.amount,
      paymentMethod: p.channel,
      transactionReference: p.ref,
      transactionDate: p.date,
      status: "COMPLETED",
      createdBy: "usr_wanjiru",
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();

    await db.insert(s.paymentAllocations).values({
      id: `alloc_${p.id}`,
      organizationId: DEFAULT_ORG_ID,
      paymentId: p.id,
      rentChargeId: chargeId,
      allocatedAmount: p.amount,
      allocatedAt: p.date,
    }).onConflictDoNothing();
  }

  // 8. Maintenance Requests
  const ticketList = [
    { id: "m1", ref: "MNT-1042", title: "Borehole pump tripping at night", propertyId: "ruaka-skyline", unitId: "u11", raisedBy: "Grace Njeri", priority: "Urgent", status: "In progress", vendor: "Maji Works Ltd", cost: 42000 },
    { id: "m2", ref: "MNT-1041", title: "Kitchen sink blocked", propertyId: "kilimani-heights", unitId: "u3", raisedBy: "Faith Chebet", priority: "Normal", status: "Assigned", vendor: "Ndegwa Plumbing", cost: 8500 },
    { id: "m3", ref: "MNT-1039", title: "Lift service overdue", propertyId: "riverside-court", unitId: "u7", raisedBy: "Peter Ochieng", priority: "Urgent", status: "Open", vendor: "Schindler Kenya" },
    { id: "m4", ref: "MNT-1037", title: "Repaint after vacancy", propertyId: "kilimani-heights", unitId: "u2", raisedBy: "Joseph Mwangi", priority: "Low", status: "Resolved", vendor: "Rangi Bora Painters", cost: 18500 },
    { id: "m5", ref: "MNT-1035", title: "Gate motor replacement", propertyId: "kileleshwa-mews", unitId: "u9", raisedBy: "Halima Abdi", priority: "Normal", status: "Resolved", vendor: "SecureGate Kenya", cost: 63000 },
  ];

  for (const t of ticketList) {
    await db.insert(s.maintenanceRequests).values({
      id: t.id,
      organizationId: DEFAULT_ORG_ID,
      propertyId: t.propertyId,
      unitId: t.unitId,
      referenceNumber: t.ref,
      title: t.title,
      priority: t.priority,
      status: t.status,
      raisedBy: t.raisedBy,
      assignedVendor: t.vendor,
      actualCost: t.cost,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 9. Expenses
  const expList = [
    { id: "e1", date: "2026-08-10", vendor: "Nairobi Water & Sewerage", category: "Water", propertyId: "kilimani-heights", amount: 84300, status: "Paid" },
    { id: "e2", date: "2026-08-08", vendor: "Kenya Power", category: "Power", propertyId: "riverside-court", amount: 121500, status: "Paid" },
    { id: "e3", date: "2026-08-07", vendor: "Lion Guard Security", category: "Security", propertyId: "lavington-green", amount: 96000, status: "Pending" },
    { id: "e4", date: "2026-08-05", vendor: "Maji Works Ltd", category: "Repairs", propertyId: "ruaka-skyline", amount: 42000, status: "Pending" },
    { id: "e5", date: "2026-08-03", vendor: "Taka Taka Solutions", category: "Garbage", propertyId: "south-b-villas", amount: 18000, status: "Paid" },
    { id: "e6", date: "2026-08-01", vendor: "Karen Residents Assoc.", category: "Levies", propertyId: "karen-oaks", amount: 35000, status: "Paid" },
  ];

  for (const e of expList) {
    await db.insert(s.expenses).values({
      id: e.id,
      organizationId: DEFAULT_ORG_ID,
      propertyId: e.propertyId,
      vendorName: e.vendor,
      category: e.category,
      amount: e.amount,
      expenseDate: e.date,
      status: e.status,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // 10. Documents
  const docList = [
    { id: "d1", name: "Lease — Otieno, Kilimani A4.pdf", kind: "Lease", linked: "Brian Otieno", size: "412 KB" },
    { id: "d2", name: "National ID — Chebet.jpg", kind: "ID", linked: "Faith Chebet", size: "1.1 MB" },
    { id: "d3", name: "Kenya Power invoice Aug 2026.pdf", kind: "Invoice", linked: "Riverside Court", size: "88 KB" },
    { id: "d4", name: "Fire compliance certificate 2026.pdf", kind: "Compliance", linked: "Lavington Green", size: "2.4 MB" },
    { id: "d5", name: "Receipt TFR3K9X2LM.pdf", kind: "Receipt", linked: "Brian Otieno", size: "64 KB" },
  ];

  for (const d of docList) {
    await db.insert(s.documents).values({
      id: d.id,
      organizationId: DEFAULT_ORG_ID,
      name: d.name,
      kind: d.kind,
      linkedEntity: d.linked,
      fileSize: d.size,
      fileUrl: `/uploads/${d.name}`,
      uploadedAt: now,
    }).onConflictDoNothing();
  }

  // 11. Messages
  const msgList = [
    { id: "c1", sender: "Faith Chebet", unit: "Kilimani Heights · B2", preview: "I have sent 34,000 today, will clear the balance on Friday after payday.", channel: "SMS", unread: 1 },
    { id: "c2", sender: "Kevin Njoroge", unit: "Kilimani Heights · B7", preview: "Kindly give me until the 20th, my employer delayed salaries.", channel: "WhatsApp", unread: 1 },
    { id: "c3", sender: "Grace Njeri (Caretaker)", unit: "Ruaka Skyline Towers", preview: "Pump technician arrived, he says the control panel needs replacing.", channel: "WhatsApp", unread: 0 },
    { id: "c4", sender: "Dr. Amina Yusuf", unit: "Lavington Green · L1", preview: "Thank you for the quick response on the water heater.", channel: "In-app", unread: 0 },
    { id: "c5", sender: "Sharon Wanjiku", unit: "Riverside Court · R2", preview: "Requesting a copy of my July rent receipt for reimbursement.", channel: "In-app", unread: 0 },
  ];

  for (const m of msgList) {
    await db.insert(s.messages).values({
      id: m.id,
      organizationId: DEFAULT_ORG_ID,
      senderName: m.sender,
      unitLabel: m.unit,
      preview: m.preview,
      channel: m.channel,
      unread: Boolean(m.unread),
      createdAt: now,
    }).onConflictDoNothing();
  }

  console.log("✅ My Nyumba Nairobi portfolio successfully seeded into relational database.");
}

if (process.argv[1]?.endsWith("seed.ts")) {
  seedDatabase().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
}

