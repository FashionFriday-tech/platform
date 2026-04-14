import { useMemo } from 'react';

import { MOCK_NOTIFICATIONS } from '../data';
import { type TabType } from '../types';

export function useNotifications(type: TabType) {
  const notifications = useMemo(() => {
    if (type === 'all') {
      return MOCK_NOTIFICATIONS;
    }
    return MOCK_NOTIFICATIONS.filter((n) =>
      type === 'orders' ? n.type === 'order' : n.type === 'promo',
    );
  }, [type]);

  return { notifications };
}
