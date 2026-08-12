import { type Metadata } from 'next';

import { ColorsFeature } from '@/features/colors';

export const metadata: Metadata = {
  title: 'Colors | Fashion Friday Admin',
  description: 'Manage product colors catalog',
};

export default function ColorsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <ColorsFeature />
    </div>
  );
}
