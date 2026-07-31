'use client';

import React from 'react';

import { BellIcon, CheckCircleIcon, MenuIcon, ShoppingBagIcon, TagIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { useNotifications } from '../hooks/use-notifications';
import { useNotificationsSwipe } from '../hooks/use-notifications-swipe';
import { usePushNotifications } from '../hooks/use-push-notifications';
import { NotificationList } from './notification-list';

const TABS = ['all', 'orders', 'promo'] as const;

export function NotificationsPage() {
  const {
    activeIndex,
    setActiveIndex,
    containerRef,
    containerWidth,
    x,
    indicatorX,
    handleDragEnd,
  } = useNotificationsSwipe(TABS);

  const { allNotifications, isLoading, unreadCount, markRead, markAllRead } = useNotifications();

  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading: isPushLoading,
    subscribe: subscribePush,
  } = usePushNotifications();

  return (
    <div className="bg-background text-foreground fixed inset-0 flex flex-col overflow-hidden overscroll-none pt-16 select-none md:pt-20">
      {/* 1. TOP CONTROLS & TABS HEADER */}
      <header className="border-foreground/10 bg-background relative z-30 shrink-0 border-b">
        <div className="relative mx-auto max-w-md px-4">
          <div className="flex items-center justify-between pt-2 pb-1">
            <span className="text-foreground/50 text-[11px] font-black tracking-widest uppercase">
              Notifications
            </span>

            {/* Mark All Read Action */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="group text-foreground/60 hover:text-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider transition-colors active:scale-95"
              >
                <CheckCircleIcon size={13} className="text-blue-500" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <nav className="flex w-full">
            {TABS.map((tab, i) => {
              const tabCount = allNotifications.filter((n) => {
                if (tab === 'all') {
                  return !n.isRead;
                }
                if (tab === 'orders') {
                  return n.type === 'order' && !n.isRead;
                }
                if (tab === 'promo') {
                  return n.type === 'promo' && !n.isRead;
                }
                return false;
              }).length;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveIndex(i);
                  }}
                  className={cn(
                    'relative flex flex-1 items-center justify-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase transition-colors outline-none',
                    activeIndex === i ? 'text-foreground' : 'text-foreground/40',
                  )}
                >
                  {tab === 'all' ? (
                    <MenuIcon className="w-3.5" />
                  ) : tab === 'orders' ? (
                    <ShoppingBagIcon className="w-3.5" />
                  ) : (
                    <TagIcon className="w-3.5" />
                  )}
                  <span>{tab}</span>

                  {tabCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-black text-white">
                      {tabCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Swipe Indicator Bar */}
          <motion.div
            style={{ x: indicatorX, width: `${100 / TABS.length}%` }}
            className="absolute bottom-0 left-0 px-4"
          >
            <div className="bg-foreground h-0.5 w-full rounded-full" />
          </motion.div>
        </div>
      </header>

      {/* 2. PWA PUSH NOTIFICATION OPT-IN BANNER */}
      {isSupported && !isSubscribed && permission !== 'denied' && (
        <div className="border-foreground/10 bg-foreground/[0.03] border-b px-4 py-2.5">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="bg-foreground/10 text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <BellIcon size={14} />
              </div>
              <div className="min-w-0">
                <h4 className="text-foreground truncate text-[11px] font-bold">
                  Turn On Notifications
                </h4>
                <p className="text-foreground/50 truncate text-[10px]">
                  Live order tracking & exclusive drops
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void subscribePush();
              }}
              disabled={isPushLoading}
              className="bg-foreground text-background shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {isPushLoading ? 'Connecting...' : 'Enable'}
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN SWIPEABLE NOTIFICATION LISTS */}
      <main className="relative w-full flex-1 overflow-hidden" ref={containerRef}>
        <motion.div
          drag="x"
          dragDirectionLock
          dragMomentum={false}
          dragConstraints={{ left: -containerWidth * (TABS.length - 1), right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{
            x,
            width: containerWidth * TABS.length || '300%',
            touchAction: 'pan-y',
          }}
          className="flex h-full cursor-grab active:cursor-grabbing"
        >
          {TABS.map((tabType, i) => {
            const currentTabNotifications = allNotifications.filter((n) => {
              if (tabType === 'all') {
                return true;
              }
              if (tabType === 'orders') {
                return n.type === 'order';
              }
              if (tabType === 'promo') {
                return n.type === 'promo';
              }
              return true;
            });

            return (
              <div
                key={tabType}
                style={{ width: containerWidth || '100vw' }}
                className="relative h-full flex-none"
              >
                <div
                  className="absolute inset-0 overflow-y-auto overscroll-contain scroll-smooth px-2 pt-2"
                  style={{ touchAction: 'pan-y' }}
                >
                  <motion.div
                    animate={{ opacity: activeIndex === i ? 1 : 0.4 }}
                    transition={{ duration: 0.2 }}
                    className="pb-24"
                  >
                    <NotificationList
                      type={tabType}
                      notifications={currentTabNotifications}
                      isLoading={isLoading}
                      onRead={markRead}
                    />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
