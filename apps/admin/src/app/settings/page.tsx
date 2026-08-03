import type { Metadata } from 'next';

import { SettingsView } from '@/features/settings';

export const metadata: Metadata = {
  title: 'Settings | Admin Panel',
  description:
    'Manage admin panel preferences, live order push notifications, and system settings.',
};

export default function SettingsPage() {
  return <SettingsView />;
}
