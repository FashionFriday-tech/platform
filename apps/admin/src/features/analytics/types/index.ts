// ─── Analytics Type Definitions ──────────────────────────────────────────────

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ProductPerformanceData {
  name: string;
  sales: number;
  revenue: number;
}

export interface StateOrderData {
  state: string;
  orders: number;
  revenue: number;
}

export interface TrafficSourceData {
  source: string;
  visitors: number;
  color: string;
}

export interface RealtimeOrder {
  id: string;
  product: string;
  city: string;
  amount: number;
  timeAgo: string;
}

export interface RetentionCohort {
  cohort: string;
  months: number[];
}

export interface AOVData {
  date: string;
  current: number;
  previous: number;
}

export interface AnalyticsPayload {
  kpis: {
    totalRevenue: number;
    totalRevenueFormatted: string;
    revenueTrend: string;
    revenueTrendUp: boolean;
    revenueSpark: number[];

    totalOrders: number;
    totalOrdersFormatted: string;
    ordersTrend: string;
    ordersTrendUp: boolean;
    ordersSpark: number[];

    siteVisits: number;
    siteVisitsFormatted: string;
    visitsTrend: string;
    visitsTrendUp: boolean;
    visitsSpark: number[];

    unitsSold: number;
    unitsSoldFormatted: string;
    unitsTrend: string;
    unitsTrendUp: boolean;
    unitsSpark: number[];
  };

  revenueTrend: {
    '7d': { date: string; revenue: number; orders: number }[];
    '30d': { date: string; revenue: number; orders: number }[];
    '90d': { date: string; revenue: number; orders: number }[];
  };

  conversion: {
    rate: number;
    rateDelta: string;
    rateDeltaUp: boolean;
    funnel: { label: string; value: string; count: number; pct: string; color: string }[];
  };

  stateOrders: { state: string; orders: number; revenue: number }[];

  categoryDistribution: { name: string; value: number; color: string; count: number }[];

  topProducts: { name: string; sales: number; revenue: number; image?: string }[];

  customerActivity: {
    menSales: number;
    womenSales: number;
    unisexSales: number;
    totalSales: number;
    activeCustomers: number;
    repeatCustomers: number;
    newCustomersToday: number;
  };

  trafficSources: { source: string; visitors: number; color: string }[];

  aovTrend: {
    current: number;
    previous: number;
    delta: string;
    data: { date: string; current: number; previous: number }[];
  };

  customerRetention: {
    cohort: string;
    m0: number;
    m1: number;
    m2: number;
    m3: number;
    m4: number;
    m5: number;
  }[];

  liveOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    location: string;
    amount: number;
    status: string;
    itemsCount: number;
    timestamp: string;
    timeAgo: string;
  }[];

  lastUpdated: string;
  cached: boolean;
}
