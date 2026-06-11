import { type Metadata } from 'next';

import { SellersFeature } from '@/features/sellers';

export const metadata: Metadata = {
  title: 'Sellers | Fashion Friday Admin',
  description: 'Manage sellers, assign categories, and view seller orders',
};

export default function SellersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <SellersFeature />
    </div>
  );
}
