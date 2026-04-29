'use client';

import React from 'react';

import { MenuIcon, ShoppingBagIcon, TagIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { useNotificationsSwipe } from '../hooks/use-notifications-swipe';
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

  return (
    <div className="bg-background text-foreground fixed inset-0 flex flex-col overflow-hidden overscroll-none pt-16 select-none md:pt-20">
      <header className="border-foreground/10 bg-background relative z-30 shrink-0 border-b">
        <div className="relative mx-auto max-w-md px-4">
          <nav className="flex w-full">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveIndex(i);
                }}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium capitalize transition-colors outline-none',
                  activeIndex === i ? 'text-foreground' : 'text-foreground/40',
                )}
              >
                {tab === 'all' ? (
                  <MenuIcon className="w-4" />
                ) : tab === 'orders' ? (
                  <ShoppingBagIcon className="w-4" />
                ) : (
                  <TagIcon className="w-4" />
                )}
                {tab}
              </button>
            ))}
          </nav>
          <motion.div
            style={{ x: indicatorX, width: `${100 / TABS.length}%` }}
            className="absolute bottom-0 left-0 px-4"
          >
            <div className="bg-foreground h-0.5 w-full rounded-full" />
          </motion.div>
        </div>
      </header>

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
          {TABS.map((tabType, i) => (
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
                  <NotificationList type={tabType} />
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
