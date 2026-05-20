import { type Metadata } from 'next';

import { CustomersFeature } from '../../features/customers';

export const metadata: Metadata = {
  title: 'Customers Management | FF Admin',
  description: 'Manage your customers, block users, and view order history',
};

export default function CustomersPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <CustomersFeature />
    </div>
  );
}
