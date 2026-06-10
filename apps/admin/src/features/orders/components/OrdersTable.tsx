'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { motion } from 'motion/react';

import { type SortField } from '../hooks/useOrders';
import { type Order } from '../types';
import { getTrackingUrl } from '../utils/courier';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrdersTableProps {
  orders: Order[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

function SortHeader({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}) {
  const isActive = sortField === field;

  return (
    <div
      onClick={() => {
        onSort(field);
      }}
      className="group flex cursor-pointer items-center gap-2 font-semibold tracking-wider transition-colors select-none"
    >
      <span
        className={`text-xs uppercase transition-colors ${
          isActive
            ? 'font-black text-white dark:text-black'
            : 'text-white/60 hover:text-white dark:text-black/60 dark:hover:text-black'
        }`}
      >
        {label}
      </span>
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-md transition-all ${
          isActive
            ? 'scale-105 bg-white text-black shadow-xs dark:bg-black dark:text-white'
            : 'bg-white/10 text-white/40 opacity-0 group-hover:opacity-100 dark:bg-black/10 dark:text-black/40'
        }`}
      >
        {isActive ? (
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${
              sortDirection === 'asc' ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export function OrdersTable({ orders, sortField, sortDirection, onSort }: OrdersTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
        <p className="text-black/50 dark:text-white/50">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[880px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(230px,2.2fr)_minmax(120px,1.2fr)_minmax(105px,1fr)_minmax(125px,1.2fr)_minmax(135px,1.3fr)_minmax(105px,1fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <SortHeader
                label="Order ID"
                field="orderNumber"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Date"
                field="createdAt"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Payment"
                field="paymentType"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Total"
                field="total"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Status"
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Tracking
              </div>
            </div>
          </div>

          {/* Row Tabs (White in Light Mode) */}
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              onClick={() => {
                router.push(`/orders/${order.id}`);
              }}
              className="group grid cursor-pointer grid-cols-[minmax(230px,2.2fr)_minmax(120px,1.2fr)_minmax(105px,1fr)_minmax(125px,1.2fr)_minmax(135px,1.3fr)_minmax(105px,1fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
            >
              {/* Order ID & Customer */}
              <div className="flex min-w-0 items-center gap-3 pr-4">
                <Image
                  width={40}
                  height={40}
                  src={order.items[0]?.productImage || '/images/placeholders/2.png'}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-xl bg-black/5 object-cover dark:bg-white/10"
                />
                <div className="min-w-0">
                  <span className="block truncate font-bold text-black transition-colors group-hover:underline dark:text-white">
                    {order.orderNumber}
                  </span>
                  {order.customer?.name && (
                    <p className="truncate text-xs font-medium text-black/50 dark:text-white/50">
                      {order.customer.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="text-xs font-medium whitespace-nowrap text-black/70 dark:text-white/70">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>

              {/* Payment Type */}
              <div>
                {order.paymentType === 'cod' ? (
                  <span className="inline-flex min-w-[72px] items-center justify-center rounded-lg border border-orange-200/80 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:border-orange-500/25 dark:bg-orange-500/15 dark:text-orange-400">
                    COD
                  </span>
                ) : (
                  <span className="inline-flex min-w-[72px] items-center justify-center rounded-lg border border-blue-200/80 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-400">
                    Prepaid
                  </span>
                )}
              </div>

              {/* Total & Payment Method */}
              <div>
                <div className="font-bold text-black dark:text-white">
                  ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-medium text-black/50 uppercase dark:text-white/50">
                  {order.paymentMethod}
                </div>
              </div>

              {/* Status */}
              <div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Tracking */}
              <div>
                {(() => {
                  if (order.status === 'shipped') {
                    const url = getTrackingUrl(
                      order.tracking?.courierService,
                      order.tracking?.trackingId,
                    );
                    return (
                      <a
                        href={url ?? '#'}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-24 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-500 active:scale-95"
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
                  return (
                    <span className="flex w-24 justify-center text-xs font-bold text-black/30 dark:text-white/30">
                      —
                    </span>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
