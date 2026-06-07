export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | string;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  statusLabel?: string;
  createdAt: string | Date;
  date?: string;
  origin?: string;
  destination?: string;
  shippingAddress?: any;
  items: OrderItem[];
  totalPrice?: number;
  courierPartner?: string;
  trackingNumber?: string;
}
