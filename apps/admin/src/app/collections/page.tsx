import { type Metadata } from 'next';

import { CollectionsFeature } from '../../features/collections';

export const metadata: Metadata = {
  title: 'Collections | Fashion Friday Admin',
  description: 'Manage product collections',
};

export default function CollectionsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <CollectionsFeature />
    </div>
  );
}
