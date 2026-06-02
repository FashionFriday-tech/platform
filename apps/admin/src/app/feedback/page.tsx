import { type Metadata } from 'next';

import { FeedbackFeature } from '@/features/feedback';

export const metadata: Metadata = {
  title: 'Feedback & Suggestions | Admin Panel',
  description: 'View customer feedback and suggestions.',
};

export default function FeedbackPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <FeedbackFeature />
    </div>
  );
}
