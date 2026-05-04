'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersGridProps {
  orders: Order[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'processing': return 'bg-blue-500';
    case 'shipped': return 'bg-purple-500';
    case 'delivered': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-black dark:bg-white';
  }
};

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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order, i) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
          key={order.id}
          onClick={() => router.push(`/orders/${order.id}`)}
          className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white/70 p-6 backdrop-blur-xl shadow-sm transition-all duration-300 dark:border-white/5 dark:bg-[#111111]/80 border-black/5"
        >
          {/* Status-colored background glow effect */}
          <div className={`absolute -right-20 top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full opacity-[0.06] transition-transform duration-700 group-hover:scale-125 group-hover:opacity-[0.08] dark:opacity-[0.04] dark:group-hover:opacity-[0.06] ${getStatusColor(order.status)}`} />
          
          <div className="mb-5 flex items-start justify-between relative z-10">
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

          <div className="flex items-center justify-between border-t border-black/5 py-4 dark:border-white/5 relative z-10">
            <span className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-widest">
              Payment Mode
            </span>
            {order.paymentType === 'cod' ? (
              <span className="inline-flex justify-center min-w-[100px] items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-600/20 ring-inset dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20">
                COD
              </span>
            ) : (
              <span className="inline-flex justify-center min-w-[100px] items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
                Prepaid
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-black/5 pt-4 dark:border-white/5 relative z-10">
            <div>
              <div className="mb-1 text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-widest">Total Amount</div>
              <div className="text-2xl font-black text-black dark:text-white">
                ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
