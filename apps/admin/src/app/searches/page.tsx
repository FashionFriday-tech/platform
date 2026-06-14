import { type Metadata } from 'next';

import SearchLogsFeature from '../../features/search-logs/components/SearchLogsFeature';

export const metadata: Metadata = {
  title: 'User Searches | Fashion Friday Admin',
  description: 'Monitor what users are searching for across the Fashion Friday storefront.',
};

export default function SearchesPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <SearchLogsFeature />
    </div>
  );
}
