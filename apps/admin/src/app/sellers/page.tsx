import { Suspense } from 'react';
import { type Metadata } from 'next';

import { SellersFeature } from '@/features/sellers';

export const metadata: Metadata = {
  title: 'Sellers | Fashion Friday Admin',
  description: 'Manage sellers, assign categories, and view seller orders',
};

export default function SellersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        }
      >
        <SellersFeature />
      </Suspense>
    </div>
  );
}
