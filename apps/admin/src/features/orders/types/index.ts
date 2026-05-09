export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

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
  sku?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentType: 'cod' | 'prepaid';
  tracking?: {
    trackingId: string;
    courierService: string;
  };
  customer: Customer;
  shippingAddress: {
    street: string;
    city: string;
    district?: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  total: number;
}
