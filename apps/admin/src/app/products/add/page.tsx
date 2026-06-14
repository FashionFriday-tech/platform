import { Suspense } from 'react';

import { AddProductForm } from '@/features/products/components/AddProductForm';

export default function AddProductPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
        <AddProductForm />
      </Suspense>
    </div>
  );
}
