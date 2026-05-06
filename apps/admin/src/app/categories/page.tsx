import CategoriesFeature from '../../features/categories';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | Fashion Friday Admin',
  description: 'Manage product categories',
};

export default function CategoriesPage() {
  return <CategoriesFeature />;
}
