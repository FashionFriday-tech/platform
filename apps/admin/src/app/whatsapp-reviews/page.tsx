import { type Metadata } from 'next';

import { WhatsAppReviewsFeature } from '@/features/whatsapp-reviews/components/WhatsAppReviewsFeature';

export const metadata: Metadata = {
  title: 'WhatsApp Reviews | Admin Panel',
  description: 'Manage WhatsApp review cards.',
};

export default function WhatsAppReviewsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <WhatsAppReviewsFeature />
    </div>
  );
}
