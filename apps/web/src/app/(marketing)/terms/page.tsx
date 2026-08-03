import React from 'react';
import type { Metadata } from 'next';

import { TermsConditionsPage } from '@/features/help';

export const metadata: Metadata = {
  title: 'Terms of Service | Fashion Friday',
  description:
    'Fashion Friday terms of service, ordering protocols, COD advance policy, unboxing video mandate, and quality tier disclosures.',
  alternates: {
    canonical: 'https://fashionfriday.in/terms',
  },
};

export default function TermsPage() {
  return <TermsConditionsPage />;
}
