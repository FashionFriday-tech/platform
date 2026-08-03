import React from 'react';
import type { Metadata } from 'next';

import { PrivacyPolicyPage } from '@/features/help';

export const metadata: Metadata = {
  title: 'Privacy Policy | Fashion Friday',
  description:
    'Fashion Friday privacy protocol, encryption standards, data handling, and customer rights archive.',
  alternates: {
    canonical: 'https://fashionfriday.in/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
