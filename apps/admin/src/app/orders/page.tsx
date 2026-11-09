import { Suspense } from 'react';
import { type Metadata } from 'next';

import { OrdersFeature } from '@/features/orders';

export const metadata: Metadata = {
  title: 'Orders | Admin Panel',
  description: 'Manage and review customer orders.',
};

export default function OrdersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        }
      >
        <OrdersFeature />
      </Suspense>
    </div>
  );
}
