'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TrashIcon,
  UsersIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useNotifications } from '../hooks/useNotifications';
import { type AdminNotification, type NotificationCategory } from '../types';

export function NotificationsView() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotifications();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const categories: { id: NotificationCategory; label: string; count?: number }[] = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    {
      id: 'orders',
      label: 'Orders & Sales',
      count: notifications.filter((n) => n.category === 'orders').length,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      count: notifications.filter((n) => n.category === 'inventory').length,
    },
    {
      id: 'customers',
      label: 'Customers & Reviews',
      count: notifications.filter((n) => n.category === 'customers').length,
    },
    {
      id: 'system',
      label: 'System',
      count: notifications.filter((n) => n.category === 'system').length,
    },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (unreadOnly && item.read) {
      return false;
    }
    return true;
  });

  const getCategoryIcon = (category: AdminNotification['category']) => {
    switch (category) {
      case 'orders':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <ShoppingBagIcon className="h-5 w-5" />
          </div>
        );
      case 'inventory':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <PackageIcon className="h-5 w-5" />
          </div>
        );
      case 'customers':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <UsersIcon className="h-5 w-5" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <ShieldCheckIcon className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="scrollbar-hide flex h-full w-full flex-col overflow-x-hidden overflow-y-auto px-6 pt-6 pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl dark:text-white">
                Notifications Center
              </h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              Real-time updates regarding store orders, fulfillment alerts, customer activity, and
              system syncs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-black shadow-xs transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#161616] dark:text-white dark:hover:bg-white/5"
              >
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-black/60 shadow-xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-white/10 dark:bg-[#161616] dark:text-white/60 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills & Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                    : 'bg-black/5 text-black/70 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && cat.count > 0 && (
                  <span
                    className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                      activeCategory === cat.id
                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                        : 'bg-black/10 text-black/80 dark:bg-white/10 dark:text-white/80'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Unread Only Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUnreadOnly(!unreadOnly);
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                unreadOnly
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/10 bg-white text-black/70 hover:bg-black/5 dark:border-white/10 dark:bg-[#161616] dark:text-white/70 dark:hover:bg-white/5'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  unreadOnly ? 'bg-red-400' : 'bg-black/30 dark:bg-white/30'
                }`}
              />
              Unread only
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                    notif.read
                      ? 'border-black/5 bg-white/70 backdrop-blur-sm dark:border-white/5 dark:bg-[#141414]/70'
                      : 'border-black/15 bg-white shadow-xs dark:border-white/15 dark:bg-[#191919]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {getCategoryIcon(notif.category)}

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 ring-2 ring-red-500/20" />
                        )}
                        <h3 className="text-sm font-bold text-black dark:text-white">
                          {notif.title}
                        </h3>
                        <span className="text-[11px] text-black/40 dark:text-white/40">
                          • {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-black/70 dark:text-white/70">
                        {notif.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    {notif.actionUrl && (
                      <Link
                        href={notif.actionUrl}
                        className="rounded-xl bg-black/5 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        {notif.actionLabel ?? 'View Details'} →
                      </Link>
                    )}

                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => {
                          markAsRead(notif.id);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 text-black/60 transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:bg-white/5 dark:text-white/60 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        deleteNotification(notif.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 text-black/40 opacity-70 transition-colors group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 dark:bg-white/5 dark:text-white/40 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                      title="Dismiss notification"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white/40 p-12 text-center backdrop-blur-sm dark:border-white/10 dark:bg-[#121212]/40"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40">
                  <BellIcon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-black dark:text-white">
                  No notifications to show
                </h3>
                <p className="mt-1 max-w-sm text-xs text-black/50 dark:text-white/50">
                  {unreadOnly
                    ? 'You have caught up on all pending alerts. Toggle "Unread only" to see historical notifications.'
                    : 'There are currently no notifications matching this category.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
