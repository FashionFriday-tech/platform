'use client';

import { useEffect } from 'react';

import { autoSyncCustomerPushSubscription } from '@/features/notifications/services/push-sync';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { useSettingsStore } from '@/store/settings-store';
import { useWishlistStore } from '@/store/wishlist-store';

export function StoreInitializer() {
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const syncSettings = useSettingsStore((state) => state.syncSettings);
  const syncWishlist = useWishlistStore((state) => state.syncWithServer);
  const syncCart = useCartStore((state) => state.syncWithServer);

  useEffect(() => {
    void refreshUser();
    syncSettings();
    void autoSyncCustomerPushSubscription(user?.id);
  }, [refreshUser, syncSettings, user?.id]);

  useEffect(() => {
    if (user?.id) {
      void syncWishlist(true);
      void syncCart(true);
      void autoSyncCustomerPushSubscription(user.id);
    }
  }, [user?.id, syncWishlist, syncCart]);

  return null;
}
