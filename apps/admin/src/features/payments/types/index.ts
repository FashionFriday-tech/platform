export type PaymentStatusType =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURE_PENDING'
  | 'CAPTURED'
  | 'FAILED'
  | 'VOID_PENDING'
  | 'VOIDED'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type PaymentMethodType = 'COD' | 'RAZORPAY' | 'STRIPE' | 'WALLET';

export interface PaymentCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
}

export interface PaymentItem {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
  amount: number;
  totalAmount: number;
  discountAmount: number;
  shippingFees: number;
  advanceAmount: number;
  refundedAmount: number;
  balanceAmount: number;
  currency: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignatureVerified: boolean;
  bankRrn?: string | null;
  customer: PaymentCustomer;
  itemsCount: number;
  itemsSummary: string[];
  isExpiringSoon: boolean;
  hoursSinceAuthorized: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStatsSummary {
  totalGrossVolume: number;
  capturedVolume: number;
  authorizedVolume: number;
  refundedVolume: number;
  failedVolume: number;
  codAdvanceVolume: number;
  codPendingVolume: number;
  totalTransactions: number;
  capturedCount: number;
  authorizedCount: number;
  refundedCount: number;
  failedCount: number;
  expiringAuthorizationsCount: number;
  successRate: number;
  refundRate: number;
}

export interface DailyTrendPoint {
  date: string;
  volume: number;
  count: number;
  captured: number;
}

export interface PaymentStatsResponse {
  summary: PaymentStatsSummary;
  methodBreakdown: {
    razorpay: number;
    cod: number;
    wallet: number;
    stripe: number;
  };
  dailyTrend: DailyTrendPoint[];
  generatedAt: string;
}

export interface PaymentDetailResponse {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: PaymentStatusType;
    paymentMethod: PaymentMethodType;
    totalAmount: number;
    discountAmount: number;
    shippingFees: number;
    finalAmount: number;
    advanceAmount: number;
    refundedAmount: number;
    balanceDue: number;
    currency: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    createdAt: string;
    updatedAt: string;
    shippingAddress: Record<string, any>;
    items: {
      id: string;
      name: string;
      image: string;
      price: number;
      quantity: number;
      size: string;
      color: string;
    }[];
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    joinedAt?: string | null;
  };
  feeBreakdown: {
    grossAmount: number;
    estimatedMdrFee: number;
    estimatedGstOnFee: number;
    estimatedNetPayout: number;
  };
  gateway: {
    isConfigured: boolean;
    livePayment?: Record<string, any> | null;
    liveRefunds?: Record<string, any> | null;
    fetchError?: string | null;
    bankRrn?: string | null;
  };
}

export type PaymentSortField = 'createdAt' | 'amount' | 'orderNumber' | 'status';
export type PaymentSortDir = 'asc' | 'desc';
export type RiskFilterType = 'ALL' | 'EXPIRING' | 'NEEDS_CAPTURE' | 'REFUND_IN_PROGRESS' | 'FAILED';
