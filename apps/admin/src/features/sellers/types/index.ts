export type SellerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface SellerCategory {
  id: string;
  name: string;
  slug?: string;
  gender?: string;
}

export interface Seller {
  id: string;
  name: string;
  storeName: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  status: SellerStatus;
  categories: SellerCategory[];
  productCount?: number;
  orderCount?: number;
  _count?: {
    products?: number;
    orderItems?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SellerOrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt?: string;
}

export interface SellerOrderCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
}

export interface SellerOrder {
  id: string;
  orderId?: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  sellerSubtotal: number;
  sellerTotalAmount?: number;
  totalItemsCount: number;
  customer?: SellerOrderCustomer | null;
  shippingAddress?: Record<string, unknown> | null;
  trackingNumber?: string | null;
  courierPartner?: string | null;
  items: SellerOrderItem[];
  orderCreatedAt?: string;
  createdAt: string;
}

export type SellerOrderGroup = SellerOrder;

export interface SellerOrdersResponse {
  seller: {
    id: string;
    name: string;
    storeName: string;
    phone: string;
    status: SellerStatus;
  };
  totalOrders: number;
  totalOrderItems: number;
  orders: SellerOrder[];
}

export interface SellerProduct {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  sellingPrice: number | string;
  totalStock: number;
  status: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface SellerStatsData {
  totalSellers: number;
  activeSellers: number;
  totalProducts: number;
  totalOrderItems: number;
}
