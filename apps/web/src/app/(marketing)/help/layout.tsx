'use client';
import React from 'react';

import { HelpLayout } from '@/features/help';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <HelpLayout>{children}</HelpLayout>;
}
