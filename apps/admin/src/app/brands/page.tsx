import { type Metadata } from 'next';

import BrandsFeature from '../../features/brands';

export const metadata: Metadata = {
  title: 'Brands | Fashion Friday Admin',
  description: 'Manage brands and categories',
};

export default function BrandsPage() {
  return <BrandsFeature />;
}
