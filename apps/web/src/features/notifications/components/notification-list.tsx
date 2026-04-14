import React from 'react';

import { BellOffIcon } from '@ff/ui';

import { useNotifications } from '../hooks/use-notifications';
import { type TabType } from '../types';
import { NotificationItem } from './notification-item';

interface NotificationListProps {
  type: TabType;
}

export function NotificationList({ type }: NotificationListProps) {
  const { notifications } = useNotifications(type);

  if (notifications.length === 0) {
    return (
      <div className="text-foreground/30 py-32 text-center">
        <BellOffIcon className="mx-auto mb-4 opacity-10" size={48} />
        <p className="text-sm">No {type} notifications</p>
      </div>
    );
  }

  return (
    <div className="divide-foreground/5 divide-y">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
