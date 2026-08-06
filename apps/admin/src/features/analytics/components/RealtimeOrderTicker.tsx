'use client';

import React, { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { type AnalyticsPayload, MOCK_REALTIME_ORDERS } from '../types';

interface RealtimeOrderTickerProps {
  liveOrders?: AnalyticsPayload['liveOrders'];
}

export function RealtimeOrderTicker({ liveOrders }: RealtimeOrderTickerProps) {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // If liveOrders prop is provided and has items, use them; otherwise use fallback
  const fallbackOrders = MOCK_REALTIME_ORDERS.slice(0, 6).map((m) => ({
    id: m.id,
    orderNumber: m.id,
    customerName: 'Customer',
    location: m.city,
    amount: m.amount,
    status: 'CONFIRMED',
    itemsCount: 1,
    timestamp: new Date().toISOString(),
    timeAgo: m.timeAgo,
  }));

  const orders = liveOrders && liveOrders.length > 0 ? liveOrders.slice(0, 6) : fallbackOrders;

  // Flash highlight on the newest order when it updates
  useEffect(() => {
    if (orders[0]) {
      setHighlightId(orders[0].id);
      const timer = setTimeout(() => {
        setHighlightId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orders[0]?.id]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-lg shadow-black/[0.03] dark:border-white/[0.06] dark:bg-[#141414]">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <h2 className="text-sm font-bold text-black dark:text-white">Live Orders Feed</h2>
          <span className="text-[11px] font-medium text-black/40 dark:text-white/40">
            Real-time verified purchases
          </span>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          ● Stream Active
        </span>
      </div>

      <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => {
            const isHighlighted = highlightId === order.id;
            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  backgroundColor: isHighlighted ? 'rgba(106, 79, 187, 0.08)' : 'transparent',
                }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="flex items-center justify-between px-6 py-3 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-mono text-[11px] font-bold text-[#6a4fbb]">
                    {order.orderNumber}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-black sm:text-sm dark:text-white">
                      {order.customerName}
                    </span>
                    <span className="ml-2 text-[11px] text-black/40 dark:text-white/40">
                      ({order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="hidden rounded-lg bg-black/[0.04] px-2.5 py-1 text-[11px] font-bold text-black/60 sm:inline-block dark:bg-white/[0.06] dark:text-white/60">
                    📍 {order.location}
                  </span>
                  <span className="font-mono text-xs font-black text-black sm:text-sm dark:text-white">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="min-w-[50px] text-right text-[11px] font-medium text-black/35 dark:text-white/35">
                    {order.timeAgo}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
