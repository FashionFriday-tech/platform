import { type Metadata } from 'next';

import { CategoriesFeature } from '../../features/categories';

export const metadata: Metadata = {
  title: 'Categories | Fashion Friday Admin',
  description: 'Manage product categories',
};

export default function CategoriesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <CategoriesFeature />
    </div>
  );
}
