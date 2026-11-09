import { Suspense } from 'react';
import { type Metadata } from 'next';

import { CustomersFeature } from '../../features/customers';

export const metadata: Metadata = {
  title: 'Customers Management | FF Admin',
  description: 'Manage your customers, block users, and view order history',
};

export default function CustomersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        }
      >
        <CustomersFeature />
      </Suspense>
    </div>
  );
}
