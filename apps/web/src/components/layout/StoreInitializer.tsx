'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

export function StoreInitializer() {
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const syncSettings = useSettingsStore((state) => state.syncSettings);

  useEffect(() => {
    void refreshUser();
    syncSettings();
  }, [refreshUser, syncSettings]);

  return null;
}
