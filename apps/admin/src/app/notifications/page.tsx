import type { Metadata } from 'next';

import { NotificationsView } from '@/features/notifications';

export const metadata: Metadata = {
  title: 'Notifications | Admin Panel',
  description: 'Manage and review system notifications, order alerts, and customer activity.',
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
