export type OrderStatus =
  | 'pending'
  | 'stock_check'
  | 'stock_confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'confirmed'
  | 'returned'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'capture_pending'
  | 'captured'
  | 'failed'
  | 'void_pending'
  | 'voided'
  | 'refund_pending'
  | 'partially_refunded'
  | 'refunded'
  | 'paid'
  | 'unpaid';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  altPhone?: string;
  avatar?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  quality?: string | null;
  colors?: string[];
  product?: any;
  sku?: string;
  sellerId?: string | null;
  productSellerId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  seller?: {
    id: string;
    name: string;
    storeName?: string;
    phone?: string;
    email?: string;
  } | null;
}

export interface ShippingAddress {
  fullName?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  street: string;
  building?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentType: 'cod' | 'prepaid';
  totalAmount?: number;
  discountAmount?: number;
  shippingFees?: number;
  finalAmount?: number;
  tracking?: {
    trackingId: string;
    courierService: string;
  };
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  total: number;
}
