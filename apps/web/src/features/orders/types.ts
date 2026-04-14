export type OrderStatus = 'shipping' | 'arrived' | 'canceled';

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
  status: OrderStatus;
  statusLabel: string;
  date: string;
  origin: string;
  destination: string;
  items: OrderItem[];
  totalPrice: number;
}
