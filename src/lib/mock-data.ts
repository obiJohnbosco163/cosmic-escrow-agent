export type EscrowStatus = "draft" | "funded" | "production" | "shipping" | "delivered" | "released" | "disputed";

export type Milestone = {
  id: string;
  name: string;
  amount: number;
  percent: number;
  status: "pending" | "in_progress" | "completed" | "released";
  date?: string;
};

export type Escrow = {
  id: string;
  contractId: string;
  title: string;
  buyer: string;
  supplier: string;
  supplierCountry: string;
  buyerCountry: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  riskScore: number;
  createdAt: string;
  milestones: Milestone[];
  released: number;
  pending: number;
};

export type Supplier = {
  id: string;
  name: string;
  country: string;
  flag: string;
  verified: boolean;
  riskScore: number;
  matchScore: number;
  totalDeals: number;
  successRate: number;
  avgDeliveryDays: number;
  category: string;
};

export type ActivityItem = {
  id: string;
  type: "escrow_created" | "document_verified" | "funds_released" | "risk_alert" | "milestone_approved" | "dispute";
  title: string;
  subtitle: string;
  time: string;
};

export const escrows: Escrow[] = [
  {
    id: "ESC-9942",
    contractId: "0x8F2c...3A9C",
    title: "Shenzhen Electronics Supply",
    buyer: "AstraPilot Trading Co.",
    supplier: "Shenzhen TechSolar Ltd.",
    supplierCountry: "CN",
    buyerCountry: "US",
    amount: 125000,
    currency: "USDC",
    status: "shipping",
    riskScore: 18,
    createdAt: "2024-10-12",
    released: 80000,
    pending: 45000,
    milestones: [
      { id: "m1", name: "Initial Deposit", amount: 37500, percent: 30, status: "released", date: "Oct 12" },
      { id: "m2", name: "Production QA", amount: 50000, percent: 40, status: "released", date: "Oct 28" },
      { id: "m3", name: "Shipping (BoL)", amount: 25000, percent: 20, status: "in_progress", date: "Nov 14" },
      { id: "m4", name: "Delivery Confirm", amount: 12500, percent: 10, status: "pending" },
    ],
  },
  {
    id: "ESC-1042",
    contractId: "0x4a7b...9f2b",
    title: "Brazilian Coffee Beans — 20MT",
    buyer: "Nordic Roasters AB",
    supplier: "Fazenda Aurora",
    supplierCountry: "BR",
    buyerCountry: "SE",
    amount: 84000,
    currency: "USDC",
    status: "production",
    riskScore: 24,
    createdAt: "2024-10-22",
    released: 25200,
    pending: 58800,
    milestones: [
      { id: "m1", name: "Deposit", amount: 25200, percent: 30, status: "released", date: "Oct 22" },
      { id: "m2", name: "Harvest Verified", amount: 33600, percent: 40, status: "in_progress" },
      { id: "m3", name: "FOB Santos", amount: 16800, percent: 20, status: "pending" },
      { id: "m4", name: "Delivery", amount: 8400, percent: 10, status: "pending" },
    ],
  },
  {
    id: "ESC-992",
    contractId: "0x1d5a...77ee",
    title: "Vietnam Apparel Run",
    buyer: "Lumen Apparel Inc.",
    supplier: "Hanoi Garments JSC",
    supplierCountry: "VN",
    buyerCountry: "CA",
    amount: 56000,
    currency: "USDC",
    status: "disputed",
    riskScore: 62,
    createdAt: "2024-09-18",
    released: 16800,
    pending: 39200,
    milestones: [
      { id: "m1", name: "Deposit", amount: 16800, percent: 30, status: "released" },
      { id: "m2", name: "Production", amount: 22400, percent: 40, status: "in_progress" },
      { id: "m3", name: "Shipping", amount: 11200, percent: 20, status: "pending" },
      { id: "m4", name: "Delivery", amount: 5600, percent: 10, status: "pending" },
    ],
  },
  {
    id: "ESC-8801",
    contractId: "0xa12c...44b1",
    title: "Kenyan Tea — Premium Grade",
    buyer: "Albion Tea House",
    supplier: "Kericho Highlands Co-op",
    supplierCountry: "KE",
    buyerCountry: "GB",
    amount: 32500,
    currency: "USDC",
    status: "released",
    riskScore: 12,
    createdAt: "2024-08-04",
    released: 32500,
    pending: 0,
    milestones: [
      { id: "m1", name: "Deposit", amount: 9750, percent: 30, status: "released" },
      { id: "m2", name: "Inspection", amount: 13000, percent: 40, status: "released" },
      { id: "m3", name: "Shipping", amount: 6500, percent: 20, status: "released" },
      { id: "m4", name: "Delivery", amount: 3250, percent: 10, status: "released" },
    ],
  },
];

export const suppliers: Supplier[] = [
  { id: "s1", name: "Shenzhen TechSolar Ltd.", country: "China", flag: "🇨🇳", verified: true, riskScore: 18, matchScore: 92, totalDeals: 148, successRate: 98.6, avgDeliveryDays: 21, category: "Electronics" },
  { id: "s2", name: "Guangdong PowerX", country: "China", flag: "🇨🇳", verified: true, riskScore: 38, matchScore: 76, totalDeals: 62, successRate: 91.2, avgDeliveryDays: 28, category: "Electronics" },
  { id: "s3", name: "Sunrise Energy Co.", country: "India", flag: "🇮🇳", verified: false, riskScore: 60, matchScore: 54, totalDeals: 14, successRate: 78.0, avgDeliveryDays: 35, category: "Solar" },
  { id: "s4", name: "Fazenda Aurora", country: "Brazil", flag: "🇧🇷", verified: true, riskScore: 24, matchScore: 88, totalDeals: 47, successRate: 96.0, avgDeliveryDays: 18, category: "Agriculture" },
  { id: "s5", name: "Hanoi Garments JSC", country: "Vietnam", flag: "🇻🇳", verified: true, riskScore: 42, matchScore: 71, totalDeals: 88, successRate: 89.4, avgDeliveryDays: 24, category: "Apparel" },
  { id: "s6", name: "Kericho Highlands Co-op", country: "Kenya", flag: "🇰🇪", verified: true, riskScore: 15, matchScore: 94, totalDeals: 36, successRate: 99.1, avgDeliveryDays: 16, category: "Agriculture" },
];

export const activity: ActivityItem[] = [
  { id: "a1", type: "document_verified", title: "BoL Document Verified", subtitle: "Contract #ESC-1042 · Shanghai port", time: "2m ago" },
  { id: "a2", type: "funds_released", title: "Funds Released to Supplier", subtitle: "34,500 USDC · Stellar Network", time: "14m ago" },
  { id: "a3", type: "milestone_approved", title: "AI Risk Assessment Complete", subtitle: "Supplier: Apex Manufacturing", time: "1h ago" },
  { id: "a4", type: "dispute", title: "Dispute Opened", subtitle: "ESC-992 · Quality non-conformance", time: "3h ago" },
  { id: "a5", type: "escrow_created", title: "New Escrow Initialized", subtitle: "ESC-9942 · 125,000 USDC locked", time: "6h ago" },
  { id: "a6", type: "risk_alert", title: "Compliance Flag Raised", subtitle: "Sanctions screening · Route APAC-1", time: "9h ago" },
];

export const tradeRoutes = [
  { from: { x: 720, y: 180, label: "Shenzhen" }, to: { x: 220, y: 200, label: "Los Angeles" }, intensity: 0.9 },
  { from: { x: 350, y: 320, label: "Santos" }, to: { x: 500, y: 130, label: "Stockholm" }, intensity: 0.7 },
  { from: { x: 700, y: 220, label: "Hanoi" }, to: { x: 200, y: 150, label: "Toronto" }, intensity: 0.5 },
  { from: { x: 540, y: 270, label: "Mombasa" }, to: { x: 470, y: 160, label: "London" }, intensity: 0.8 },
  { from: { x: 530, y: 200, label: "Istanbul" }, to: { x: 240, y: 180, label: "New York" }, intensity: 0.6 },
];

export const kpis = {
  protectedVolume: 24_500_000,
  protectedDelta: 12.4,
  activeEscrows: 128,
  awaitingRelease: 84,
  completedToday: 12,
  verifiedSuppliers: 412,
  riskAlerts: 3,
  fundsReleasedMTD: 8_240_000,
  avgSettlementHours: 38,
};

export const escrowLiquiditySeries = [
  { day: "Mon", value: 5.2 },
  { day: "Tue", value: 6.1 },
  { day: "Wed", value: 5.8 },
  { day: "Thu", value: 7.4 },
  { day: "Fri", value: 8.1 },
  { day: "Sat", value: 7.6 },
  { day: "Today", value: 8.2 },
];

export const volumeSeries = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  volume: Math.round(800 + Math.sin(i / 2) * 400 + i * 180),
  fees: Math.round(8 + Math.sin(i / 2) * 4 + i * 1.6),
}));

export const riskRadar = [
  { axis: "Supplier History", score: 88 },
  { axis: "Country Risk", score: 72 },
  { axis: "Document Integrity", score: 94 },
  { axis: "Sanctions", score: 98 },
  { axis: "Logistics", score: 81 },
  { axis: "Payment Velocity", score: 86 },
];
