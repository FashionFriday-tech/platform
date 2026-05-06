import CategoriesFeature from '../../features/categories';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | Fashion Friday Admin',
  description: 'Manage product categories',
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <CategoriesFeature />
    </div>
  );
}
