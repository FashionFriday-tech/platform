import { type Metadata } from 'next';

import { OrdersFeature } from '@/features/orders';

export const metadata: Metadata = {
  title: 'Orders | Admin Panel',
  description: 'Manage and review customer orders.',
};

export default function OrdersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <OrdersFeature />
    </div>
  );
}
