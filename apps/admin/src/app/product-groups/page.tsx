import { type Metadata } from 'next';

import { ProductGroupsFeature } from '@/features/product-groups';

export const metadata: Metadata = {
  title: 'Product Groups | Fashion Friday Admin',
  description: 'Manage product model groups and linked colorway options',
};

export default function ProductGroupsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <ProductGroupsFeature />
    </div>
  );
}
