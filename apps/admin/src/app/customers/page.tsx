import { Metadata } from 'next';
import CustomersFeature from '../../features/customers';

export const metadata: Metadata = {
  title: 'Customers Management | FF Admin',
  description: 'Manage your customers, block users, and view order history',
};

export default function CustomersPage() {
  return (
    <div className="flex h-full flex-col p-6">      
      <div className="flex-1">
        <CustomersFeature />
      </div>
    </div>
  );
}
