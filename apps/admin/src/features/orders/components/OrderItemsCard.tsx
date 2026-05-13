import React from 'react';
import Image from 'next/image';

import { type Order } from '../types';

interface Props {
  order: Order;
  orderStatus: string;
  trackingUrl: string | null;
}

export function OrderItemsCard({ order, orderStatus, trackingUrl }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
      <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-bold text-black dark:text-white">Order Items</h2>
        <span className="text-sm font-bold text-black/50 dark:text-white/50">
          #{order.orderNumber}
        </span>
      </div>

      <div className="flex flex-col gap-6 p-6">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col gap-6 rounded-2xl border border-black/5 bg-black/[0.02] p-4 transition-all hover:bg-black/[0.04] sm:flex-row sm:items-start sm:pr-32 dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
          >
            {/* Sticky Track Button on Right Side */}
            <div className="absolute top-4 right-4 hidden sm:block">
              {(() => {
                if (orderStatus === 'shipped') {
                  return (
                    <a
                      href={trackingUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Track
                    </a>
                  );
                }
                const labels: Record<string, string> = {
                  pending: 'Pending',
                  processing: 'Processing',
                  delivered: 'Delivered',
                  cancelled: 'Cancelled',
                };
                return (
                  <button
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-black/5 px-4 py-2 text-xs font-bold text-black/40 dark:bg-white/5 dark:text-white/40"
                  >
                    {labels[orderStatus] || orderStatus}
                  </button>
                );
              })()}
            </div>

            <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl shadow-sm sm:h-40 sm:w-40">
              <Image
                width={500}
                height={500}
                src={item.productImage}
                alt={item.productName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex w-full flex-col justify-between sm:h-40">
              <div>
                <h3 className="text-xl font-bold text-black sm:text-2xl dark:text-white">
                  {item.productName}
                </h3>
                <p className="mt-1 text-sm font-semibold text-black/40 dark:text-white/40">
                  SKU: {item.sku || 'N/A'}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.size && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-black/50 uppercase dark:text-white/50">
                        Size:
                      </span>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {item.size}
                      </span>
                    </div>
                  )}
                  {item.color && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-black/50 uppercase dark:text-white/50">
                        Color:
                      </span>
                      <span className="text-sm font-bold text-black dark:text-white">
                        {item.color}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-4 pt-4 sm:mt-0 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-black/50 dark:text-white/50">
                    {item.quantity} × ₹
                    {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xl font-black text-black sm:text-2xl dark:text-white">
                    ₹
                    {(item.price * item.quantity).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Mobile Track Button */}
                <div className="sm:hidden">
                  {(() => {
                    if (orderStatus === 'shipped') {
                      return (
                        <a
                          href={trackingUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          Track Package
                        </a>
                      );
                    }
                    const labels: Record<string, string> = {
                      pending: 'Pending',
                      processing: 'Processing',
                      delivered: 'Delivered',
                      cancelled: 'Cancelled',
                    };
                    return (
                      <button
                        disabled
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-black/5 px-4 py-3 text-sm font-bold text-black/40 dark:bg-white/5 dark:text-white/40"
                      >
                        {labels[orderStatus] || orderStatus}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
