import React from 'react';

import { FaqPage, getFaqs } from '@/features/help';

export default async function Page() {
  const faqs = await getFaqs();
  return <FaqPage faqs={faqs} />;
}
