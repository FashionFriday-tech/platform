import { type Metadata } from 'next';

import ReviewsFeature from '@/features/reviews';

export const metadata: Metadata = {
  title: 'Reviews | Admin Panel',
  description: 'Manage and review customer feedback.',
};

export default function ReviewsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <ReviewsFeature />
    </div>
  );
}
