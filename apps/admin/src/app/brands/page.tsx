import BrandsFeature from '../../features/brands';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brands | Fashion Friday Admin',
  description: 'Manage brands and categories',
};

export default function BrandsPage() {
  return <BrandsFeature />;
}
