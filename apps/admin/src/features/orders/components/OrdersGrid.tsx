'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersGridProps {
  orders: Order[];
}

export function OrdersGrid({ orders }: OrdersGridProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-black/50">
        <p className="text-black/50 dark:text-white/50">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {orders.map((order, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          key={order.id}
          onClick={() => router.push(`/orders/${order.id}`)}
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/50 p-5 backdrop-blur-xl transition-all hover:shadow-lg dark:border-white/5 dark:bg-black/50"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={order.items[0]?.productImage}
                alt=""
                className="h-12 w-12 rounded-xl bg-black/5 object-cover shadow-sm dark:bg-white/5"
              />
              <div>
                <div className="text-sm font-bold text-black dark:text-white">
                  {order.orderNumber}
                </div>
                <div className="text-xs text-black/60 dark:text-white/60">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center justify-between border-t border-black/5 py-3 dark:border-white/5">
            <span className="text-xs font-medium text-black/60 dark:text-white/60">
              Payment Mode
            </span>
            {order.paymentType === 'cod' ? (
              <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-600/20 ring-inset dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20">
                COD
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
                Prepaid
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-black/5 pt-3 dark:border-white/5">
            <div>
              <div className="mb-0.5 text-xs text-black/60 dark:text-white/60">Total Amount</div>
              <div className="text-lg font-bold text-black dark:text-white">
                ${order.total.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-0.5 text-xs text-black/60 dark:text-white/60">
                {order.paymentMethod}
              </div>
              <div
                className={`text-xs font-medium ${order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
              >
                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
