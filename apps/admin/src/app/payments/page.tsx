import { Suspense } from 'react';
import { type Metadata } from 'next';

import { PaymentsFeature } from '@/features/payments';

export const metadata: Metadata = {
  title: 'Payments & Financial Ledger | Admin Panel',
  description:
    'Track all customer payments, settlement statuses, escrow holds, and gateway refunds.',
};

export default function PaymentsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 sm:p-4 md:p-6">
      <Suspense
        fallback={
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        }
      >
        <PaymentsFeature />
      </Suspense>
    </div>
  );
}
