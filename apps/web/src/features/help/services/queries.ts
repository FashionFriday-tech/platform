import { fetcher } from '@/lib/api-client';

import { type FAQItem } from '../data/faq';

/**
 * Fetch all FAQ items from the database.
 */
export async function getFaqs(): Promise<FAQItem[]> {
  try {
    const data = await fetcher<FAQItem[]>('/faq', {
      next: { revalidate: 86400, tags: ['help-faq'] },
    });
    return data || [];
  } catch (error) {
    console.error('Failed to fetch FAQs from backend:', error);
    return [];
  }
}
