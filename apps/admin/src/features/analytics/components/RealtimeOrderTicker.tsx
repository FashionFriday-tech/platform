'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_REALTIME_ORDERS } from '../types';

export function RealtimeOrderTicker() {
  const [visibleOrders, setVisibleOrders] = useState(MOCK_REALTIME_ORDERS.slice(0, 5));
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Simulate new orders cycling in
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleOrders((prev) => {
        const allOrders = MOCK_REALTIME_ORDERS;
        const nextIndex = (allOrders.indexOf(prev[0]) + 1) % allOrders.length;
        const newOrders = [];
        for (let i = 0; i < 5; i++) {
          newOrders.push(allOrders[(nextIndex + i) % allOrders.length]);
        }
        return newOrders;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (visibleOrders[0]) {
      setHighlightId(visibleOrders[0].id);
      const timer = setTimeout(() => setHighlightId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleOrders]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-lg shadow-black/[0.03] dark:border-white/[0.06] dark:bg-[#141414]">
      <div className="flex items-center gap-3 border-b border-black/[0.06] px-6 py-4 dark:border-white/[0.06]">
        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <h2 className="text-sm font-bold text-black dark:text-white">Live Orders</h2>
        <span className="text-[11px] font-medium text-black/40 dark:text-white/40">
          Real-time order activity
        </span>
      </div>

      <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
        <AnimatePresence mode="popLayout">
          {visibleOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: 1,
                x: 0,
                backgroundColor:
                  highlightId === order.id ? 'rgba(106, 79, 187, 0.06)' : 'transparent',
              }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center justify-between px-6 py-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-[#6a4fbb]">{order.id}</span>
                <span className="text-sm font-semibold text-black dark:text-white">
                  {order.product}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-lg bg-black/[0.04] px-2.5 py-1 text-[11px] font-bold text-black/60 dark:bg-white/[0.06] dark:text-white/60">
                  📍 {order.city}
                </span>
                <span className="text-sm font-black text-black dark:text-white">
                  ₹{order.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-medium text-black/35 dark:text-white/35">
                  {order.timeAgo}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
