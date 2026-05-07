import CollectionsFeature from '../../features/collections';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections | Fashion Friday Admin',
  description: 'Manage product collections',
};

export default function CollectionsPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <CollectionsFeature />
    </div>
  );
}
