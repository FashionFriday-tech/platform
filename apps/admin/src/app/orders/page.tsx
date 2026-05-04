import OrdersFeature from '@/features/orders';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders | Admin Panel',
  description: 'Manage and review customer orders.',
};

export default function OrdersPage() {
  return <OrdersFeature />;
}
