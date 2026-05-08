// ─── Revenue & Orders ───────────────────────────────────────────────────────

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export const MOCK_REVENUE_7D: RevenueData[] = [
  { date: 'May 25', revenue: 42000, orders: 312 },
  { date: 'May 26', revenue: 38500, orders: 287 },
  { date: 'May 27', revenue: 51200, orders: 398 },
  { date: 'May 28', revenue: 47800, orders: 356 },
  { date: 'May 29', revenue: 63400, orders: 472 },
  { date: 'May 30', revenue: 58100, orders: 431 },
  { date: 'May 31', revenue: 72300, orders: 538 },
];

export const MOCK_REVENUE_30D: RevenueData[] = [
  { date: 'May 1', revenue: 31200, orders: 245 },
  { date: 'May 3', revenue: 35800, orders: 268 },
  { date: 'May 5', revenue: 42100, orders: 312 },
  { date: 'May 7', revenue: 38900, orders: 290 },
  { date: 'May 9', revenue: 46700, orders: 345 },
  { date: 'May 11', revenue: 41300, orders: 310 },
  { date: 'May 13', revenue: 52400, orders: 387 },
  { date: 'May 15', revenue: 48900, orders: 362 },
  { date: 'May 17', revenue: 55100, orders: 408 },
  { date: 'May 19', revenue: 51800, orders: 384 },
  { date: 'May 21', revenue: 58200, orders: 431 },
  { date: 'May 23', revenue: 54700, orders: 405 },
  { date: 'May 25', revenue: 62100, orders: 460 },
  { date: 'May 27', revenue: 59400, orders: 440 },
  { date: 'May 29', revenue: 67800, orders: 502 },
  { date: 'May 31', revenue: 72300, orders: 538 },
];

// ─── Category Data ──────────────────────────────────────────────────────────

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export const MOCK_CATEGORY_DATA: CategoryData[] = [
  { name: 'Men', value: 40, color: '#6a4fbb' },
  { name: 'Women', value: 35, color: '#ec4899' },
  { name: 'Accessories', value: 15, color: '#f59e0b' },
  { name: 'Kids', value: 10, color: '#22c55e' },
];

// ─── Product Performance ────────────────────────────────────────────────────

export interface ProductPerformanceData {
  name: string;
  sales: number;
  revenue: number;
}

export const MOCK_TOP_PRODUCTS: ProductPerformanceData[] = [
  { name: 'Classic White Sneaker', sales: 420, revenue: 33600 },
  { name: 'Denim Jacket', sales: 380, revenue: 26600 },
  { name: 'Leather Crossbody Bag', sales: 290, revenue: 23200 },
  { name: 'Summer Floral Dress', sales: 250, revenue: 15000 },
  { name: 'Aviator Sunglasses', sales: 210, revenue: 10500 },
];

// ─── Indian State-wise Orders ───────────────────────────────────────────────

export interface StateOrderData {
  state: string;
  orders: number;
  revenue: number;
}

export const MOCK_STATE_ORDERS: StateOrderData[] = [
  { state: 'Maharashtra', orders: 8540, revenue: 6832000 },
  { state: 'Karnataka', orders: 6200, revenue: 4960000 },
  { state: 'Delhi', orders: 5800, revenue: 4640000 },
  { state: 'Tamil Nadu', orders: 4900, revenue: 3920000 },
  { state: 'Telangana', orders: 4500, revenue: 3600000 },
  { state: 'Gujarat', orders: 4100, revenue: 3280000 },
  { state: 'Uttar Pradesh', orders: 3800, revenue: 3040000 },
  { state: 'West Bengal', orders: 3100, revenue: 2480000 },
  { state: 'Rajasthan', orders: 2800, revenue: 2240000 },
  { state: 'Kerala', orders: 2600, revenue: 2080000 },
  { state: 'Madhya Pradesh', orders: 2200, revenue: 1760000 },
  { state: 'Haryana', orders: 2100, revenue: 1680000 },
  { state: 'Punjab', orders: 1900, revenue: 1520000 },
  { state: 'Bihar', orders: 1500, revenue: 1200000 },
  { state: 'Andhra Pradesh', orders: 1800, revenue: 1440000 },
  { state: 'Odisha', orders: 1200, revenue: 960000 },
  { state: 'Jharkhand', orders: 980, revenue: 784000 },
  { state: 'Assam', orders: 750, revenue: 600000 },
  { state: 'Chhattisgarh', orders: 680, revenue: 544000 },
  { state: 'Uttarakhand', orders: 620, revenue: 496000 },
  { state: 'Goa', orders: 580, revenue: 464000 },
  { state: 'Himachal Pradesh', orders: 450, revenue: 360000 },
  { state: 'Tripura', orders: 280, revenue: 224000 },
  { state: 'Meghalaya', orders: 220, revenue: 176000 },
  { state: 'Manipur', orders: 180, revenue: 144000 },
  { state: 'Nagaland', orders: 150, revenue: 120000 },
  { state: 'Arunachal Pradesh', orders: 120, revenue: 96000 },
  { state: 'Mizoram', orders: 100, revenue: 80000 },
  { state: 'Sikkim', orders: 90, revenue: 72000 },
  { state: 'Jammu and Kashmir', orders: 420, revenue: 336000 },
  { state: 'Ladakh', orders: 45, revenue: 36000 },
  { state: 'Puducherry', orders: 310, revenue: 248000 },
  { state: 'Chandigarh', orders: 380, revenue: 304000 },
  { state: 'Dadra and Nagar Haveli and Daman and Diu', orders: 120, revenue: 96000 },
  { state: 'Lakshadweep', orders: 25, revenue: 20000 },
  { state: 'Andaman and Nicobar Islands', orders: 65, revenue: 52000 },
];

// ─── Traffic Sources Funnel ─────────────────────────────────────────────────

export interface TrafficSourceData {
  source: string;
  visitors: number;
  color: string;
}

export const MOCK_TRAFFIC_SOURCES: TrafficSourceData[] = [
  { source: 'Direct', visitors: 14200, color: '#6a4fbb' },
  { source: 'Organic Search', visitors: 10800, color: '#8b5cf6' },
  { source: 'Social Media', visitors: 7600, color: '#a855f7' },
  { source: 'Referral', visitors: 4300, color: '#c084fc' },
  { source: 'Email', visitors: 2100, color: '#ddd6fe' },
];

// ─── Realtime Order Ticker ──────────────────────────────────────────────────

export interface RealtimeOrder {
  id: string;
  product: string;
  city: string;
  amount: number;
  timeAgo: string;
}

export const MOCK_REALTIME_ORDERS: RealtimeOrder[] = [
  { id: 'ORD-9841', product: 'Classic White Sneaker', city: 'Mumbai', amount: 4999, timeAgo: '12s ago' },
  { id: 'ORD-9840', product: 'Denim Jacket', city: 'Bangalore', amount: 6999, timeAgo: '34s ago' },
  { id: 'ORD-9839', product: 'Leather Crossbody Bag', city: 'Delhi', amount: 7999, timeAgo: '1m ago' },
  { id: 'ORD-9838', product: 'Summer Floral Dress', city: 'Chennai', amount: 3499, timeAgo: '2m ago' },
  { id: 'ORD-9837', product: 'Aviator Sunglasses', city: 'Hyderabad', amount: 2499, timeAgo: '3m ago' },
  { id: 'ORD-9836', product: 'Cotton Kurta Set', city: 'Pune', amount: 1999, timeAgo: '4m ago' },
  { id: 'ORD-9835', product: 'Running Shoes Pro', city: 'Kolkata', amount: 5499, timeAgo: '5m ago' },
  { id: 'ORD-9834', product: 'Slim Fit Chinos', city: 'Jaipur', amount: 2799, timeAgo: '6m ago' },
  { id: 'ORD-9833', product: 'Silk Saree Collection', city: 'Ahmedabad', amount: 8999, timeAgo: '7m ago' },
  { id: 'ORD-9832', product: 'Graphic Hoodie', city: 'Lucknow', amount: 3299, timeAgo: '8m ago' },
];

// ─── Customer Retention Cohort ──────────────────────────────────────────────

export interface RetentionCohort {
  cohort: string;
  months: number[];
}

export const MOCK_RETENTION_DATA: RetentionCohort[] = [
  { cohort: 'Jan 2025', months: [100, 72, 58, 45, 38, 32] },
  { cohort: 'Feb 2025', months: [100, 68, 54, 42, 35, 0] },
  { cohort: 'Mar 2025', months: [100, 75, 61, 48, 0, 0] },
  { cohort: 'Apr 2025', months: [100, 71, 57, 0, 0, 0] },
  { cohort: 'May 2025', months: [100, 74, 0, 0, 0, 0] },
  { cohort: 'Jun 2025', months: [100, 0, 0, 0, 0, 0] },
];

// ─── AOV Trend ──────────────────────────────────────────────────────────────

export interface AOVData {
  date: string;
  current: number;
  previous: number;
}

export const MOCK_AOV_DATA: AOVData[] = [
  { date: 'May 1', current: 1250, previous: 1180 },
  { date: 'May 5', current: 1320, previous: 1200 },
  { date: 'May 9', current: 1280, previous: 1190 },
  { date: 'May 13', current: 1410, previous: 1220 },
  { date: 'May 17', current: 1380, previous: 1250 },
  { date: 'May 21', current: 1520, previous: 1280 },
  { date: 'May 25', current: 1480, previous: 1260 },
  { date: 'May 29', current: 1590, previous: 1300 },
];

// ─── Stat Sparkline Data ────────────────────────────────────────────────────

export const STAT_SPARKLINES = {
  revenue: [
    { v: 42 }, { v: 38 }, { v: 51 }, { v: 47 }, { v: 63 }, { v: 58 }, { v: 72 },
  ],
  orders: [
    { v: 312 }, { v: 287 }, { v: 398 }, { v: 356 }, { v: 472 }, { v: 431 }, { v: 538 },
  ],
  visits: [
    { v: 2100 }, { v: 2340 }, { v: 2050 }, { v: 2280 }, { v: 2190 }, { v: 2050 }, { v: 1987 },
  ],
  units: [
    { v: 180 }, { v: 195 }, { v: 210 }, { v: 198 }, { v: 230 }, { v: 215 }, { v: 245 },
  ],
};
