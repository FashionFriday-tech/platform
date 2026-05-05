import OrdersFeature from '@/features/orders';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders | Admin Panel',
  description: 'Manage and review customer orders.',
};

export default function OrdersPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <OrdersFeature />
    </div>
  );
}
