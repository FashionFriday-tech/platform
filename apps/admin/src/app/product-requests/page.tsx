import { type Metadata } from 'next';

import { ProductRequestsFeature } from '../../features/product-requests/components/ProductRequestsFeature';

export const metadata: Metadata = {
  title: 'Sourcing Requests | Fashion Friday Admin',
  description: 'Monitor and manage custom product sourcing requests submitted by customers.',
};

export default function ProductRequestsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <ProductRequestsFeature />
    </div>
  );
}
