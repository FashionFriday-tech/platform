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

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
}) {
  if (sortField !== field) {
    return <span className="ml-1 opacity-0 group-hover:opacity-30">↕</span>;
  }
  return (
    <span className="ml-1 text-black dark:text-white">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  );
}

export function OrdersTable({ orders, sortField, sortDirection, onSort }: OrdersTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-black/50">
        <p className="text-black/50 dark:text-white/50">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]">
      <div className="scrollbar-hide flex-1 overflow-auto">
        <table className="relative w-full text-left text-sm text-black/70 dark:text-white/70">
          <thead className="sticky top-0 z-30 bg-[#f8f9fa] text-xs text-black/60 uppercase dark:bg-[#1a1a1a] dark:text-white/60">
            <tr>
              <th
                scope="col"
                className="group cursor-pointer px-6 py-4 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => {
                  onSort('orderNumber');
                }}
              >
                Order ID{' '}
                <SortIcon field="orderNumber" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                scope="col"
                className="group cursor-pointer px-6 py-4 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => {
                  onSort('createdAt');
                }}
              >
                Date{' '}
                <SortIcon field="createdAt" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                scope="col"
                className="group cursor-pointer px-6 py-4 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => {
                  onSort('paymentType');
                }}
              >
                Payment Type{' '}
                <SortIcon field="paymentType" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                scope="col"
                className="group cursor-pointer px-6 py-4 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => {
                  onSort('total');
                }}
              >
                Total <SortIcon field="total" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th
                scope="col"
                className="group cursor-pointer px-6 py-4 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => {
                  onSort('status');
                }}
              >
                Status{' '}
                <SortIcon field="status" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Tracking
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <motion.tr
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={order.id}
                onClick={() => {
                  router.push(`/orders/${order.id}`);
                }}
                className="group cursor-pointer border-b border-black/5 transition-colors last:border-0 hover:bg-black/5 dark:border-white/5 dark:hover:bg-white/5"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Image
                      width={500}
                      height={500}
                      src={order.items[0]?.productImage}
                      alt=""
                      className="h-10 w-10 rounded-lg bg-black/5 object-cover dark:bg-white/5"
                    />
                    <div className="font-medium text-black dark:text-white">
                      {order.orderNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  {order.paymentType === 'cod' ? (
                    <span className="inline-flex min-w-[100px] items-center justify-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-600/20 ring-inset dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20">
                      COD
                    </span>
                  ) : (
                    <span className="inline-flex min-w-[100px] items-center justify-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
                      Prepaid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">
                  <div className="text-black dark:text-white">
                    ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mt-0.5 text-xs font-normal opacity-70">{order.paymentMethod}</div>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
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
                          className="flex w-24 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
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
                      <span className="flex w-24 justify-center text-xs font-bold text-black/20 dark:text-white/20">
                        N/A
                      </span>
                    );
                  })()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
