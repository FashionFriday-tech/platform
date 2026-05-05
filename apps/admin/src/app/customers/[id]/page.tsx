import { Metadata } from 'next';
import { CustomerDetailsFeature } from '../../../features/customers/components/CustomerDetailsFeature';

export const metadata: Metadata = {
  title: 'Customer Details | FF Admin',
  description: 'View specific customer profile, orders, and reviews',
};

// Use the standard App Router page signature where params is a Promise
export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 scrollbar-hide">
      <CustomerDetailsFeature customerId={id} />
    </div>
  );
}
