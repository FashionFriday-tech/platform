import ReviewsFeature from '@/features/reviews';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reviews | Admin Panel',
  description: 'Manage and review customer feedback.',
};

export default function ReviewsPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden p-6">
      <ReviewsFeature />
    </div>
  );
}
