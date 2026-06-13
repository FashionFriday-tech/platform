import { type Metadata } from 'next';

import { SellerDetailsFeature } from '@/features/sellers';

export const metadata: Metadata = {
  title: 'Seller Details | FF Admin',
  description: 'View seller profile, assigned categories, products, and orders',
};

export default async function SellerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="scrollbar-hide flex h-full flex-col overflow-y-auto p-6">
      <SellerDetailsFeature sellerId={id} />
    </div>
  );
}
