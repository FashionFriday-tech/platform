import { Suspense } from 'react';
import { type Metadata } from 'next';

import { BrandsFeature } from '../../features/brands';

export const metadata: Metadata = {
  title: 'Brands | Fashion Friday Admin',
  description: 'Manage brands and categories',
};

export default function BrandsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        }
      >
        <BrandsFeature />
      </Suspense>
    </div>
  );
}
