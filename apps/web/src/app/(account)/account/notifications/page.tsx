import React from 'react';
import type { Metadata } from 'next';

import { NotificationsPage } from '@/features/notifications';

export const metadata: Metadata = {
  title: 'Notifications & Drops | Fashion Friday',
  description:
    'Track your real-time order dispatches, shipping status, and limited Friday streetwear drops.',
};

export default function Page() {
  return <NotificationsPage />;
}
