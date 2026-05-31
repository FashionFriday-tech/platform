import { type Metadata } from 'next';
import { FaqsFeature } from '@/features/faqs/components/FaqsFeature';

export const metadata: Metadata = {
  title: 'FAQs Curation | Admin Panel',
  description: 'Manage storefront FAQ items and policies.',
};

export default function FaqsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <FaqsFeature />
    </div>
  );
}
