'use client';

import React from 'react';
import Link from 'next/link';

import { BellOffIcon, ShoppingBagIcon, TagIcon } from '@ff/ui';

import { useAuthStore } from '@/store/auth-store';

import { type Notification, type TabType } from '../types';
import { NotificationItem } from './notification-item';

interface NotificationListProps {
  type: TabType;
  notifications: Notification[];
  isLoading: boolean;
  onRead: (id: string) => void;
}

export function NotificationList({
  type,
  notifications,
  isLoading,
  onRead,
}: NotificationListProps) {
  const user = useAuthStore((state) => state.user);

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="divide-foreground/5 divide-y">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex animate-pulse gap-4 p-5">
            <div className="bg-foreground/10 h-11 w-11 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <div className="flex justify-between">
                <div className="bg-foreground/15 h-4 w-32 rounded" />
                <div className="bg-foreground/10 h-3 w-16 rounded" />
              </div>
              <div className="bg-foreground/10 h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty States
  if (notifications.length === 0) {
    if (type === 'orders') {
      if (!user) {
        return (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="bg-foreground/5 text-foreground/40 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <ShoppingBagIcon size={30} />
            </div>
            <h3 className="text-foreground text-base font-bold">Sign In to Track Orders</h3>
            <p className="text-foreground/50 mt-1.5 max-w-xs text-xs leading-relaxed">
              Log in to your account to view live order dispatches, status tracking, and delivery
              updates.
            </p>
            <Link
              href="/login"
              className="bg-foreground text-background mt-6 rounded-full px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
            >
              Sign In Now
            </Link>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="bg-foreground/5 text-foreground/40 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <ShoppingBagIcon size={30} />
          </div>
          <h3 className="text-foreground text-base font-bold">No Orders Yet</h3>
          <p className="text-foreground/50 mt-1.5 max-w-xs text-xs leading-relaxed">
            Your active order status updates, packing status, and courier tracking numbers will
            appear here.
          </p>
          <Link
            href="/products"
            className="bg-foreground text-background mt-6 rounded-full px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
          >
            Explore Streetwear & Sneakers
          </Link>
        </div>
      );
    }

    if (type === 'promo') {
      return (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="bg-foreground/5 text-foreground/40 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <TagIcon size={30} />
          </div>
          <h3 className="text-foreground text-base font-bold">All Caught Up on Drops</h3>
          <p className="text-foreground/50 mt-1.5 max-w-xs text-xs leading-relaxed">
            Private drop alerts, flash sales, and new seasonal collections drop every Friday at
            12:00 PM.
          </p>
          <Link
            href="/collections/new-arrivals"
            className="bg-foreground text-background mt-6 rounded-full px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
          >
            View New Arrivals
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="bg-foreground/5 text-foreground/40 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <BellOffIcon size={32} />
        </div>
        <h3 className="text-foreground text-base font-bold">No Notifications</h3>
        <p className="text-foreground/50 mt-1.5 max-w-xs text-xs leading-relaxed">
          You are completely caught up on order notifications, dispatches, and weekly drops.
        </p>
      </div>
    );
  }

  // 3. Dynamic Notification List
  return (
    <div className="divide-foreground/5 divide-y">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onRead={onRead} />
      ))}
    </div>
  );
}
