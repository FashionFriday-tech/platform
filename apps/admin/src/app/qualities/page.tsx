import { type Metadata } from 'next';

import { QualitiesFeature } from '@/features/qualities';

export const metadata: Metadata = {
  title: 'Qualities | Fashion Friday Admin',
  description: 'Manage product quality tiers and category associations',
};

export default function QualitiesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 md:p-6">
      <QualitiesFeature />
    </div>
  );
}
