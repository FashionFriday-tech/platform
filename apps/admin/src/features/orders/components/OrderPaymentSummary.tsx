import React from 'react';

import { type Order } from '../types';

export function OrderPaymentSummary({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
      <div className="border-b border-black/5 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-bold text-black dark:text-white">Payment Summary</h2>
      </div>
      <div className="flex flex-col gap-3 p-6 text-sm font-medium text-black/70 dark:text-white/70">
        <div className="flex justify-between">
          <span>Subtotal ({order.items.length} items)</span>
          <span>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹0.00</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-black/5 pt-4 text-lg font-black text-black dark:border-white/5 dark:text-white">
          <span>Total</span>
          <span>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      <div className="rounded-b-2xl bg-black/5 px-6 py-4 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-black/50 dark:text-white/50">Mode</span>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase ${order.paymentType === 'cod' ? 'bg-orange-500/20 text-orange-700 dark:bg-orange-500/30 dark:text-orange-300' : 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300'}`}
          >
            {order.paymentType === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
          </span>
        </div>
      </div>
    </div>
  );
}
