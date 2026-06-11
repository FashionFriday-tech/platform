'use client';

import React, { useState } from 'react';

import { ShoppingBagIcon } from '@ff/ui';

import { type SellerOrder, type SellerOrderItem } from '../types';

interface SellerOrdersListProps {
  orders: SellerOrder[];
  isLoading: boolean;
  sellerStoreName: string;
}

export function SellerOrdersList({ orders, isLoading, sellerStoreName }: SellerOrdersListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-black/50 dark:text-white/50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          <span>Fetching seller order items...</span>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'ALL' && order.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const totalSellerRevenue = orders.reduce((sum, o) => sum + (o.sellerSubtotal || 0), 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + (o.totalItemsCount || 0), 0);

  const getOrderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'SHIPPED':
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'CONFIRMED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
      case 'CANCELLED':
      case 'RETURNED':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Seller Order Metrics Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs font-semibold tracking-wider text-black/50 uppercase dark:text-white/50">
            Total Orders
          </p>
          <p className="mt-1 text-xl font-black text-black dark:text-white">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs font-semibold tracking-wider text-black/50 uppercase dark:text-white/50">
            Units Ordered
          </p>
          <p className="mt-1 text-xl font-black text-black dark:text-white">{totalItemsSold}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs font-semibold tracking-wider text-black/50 uppercase dark:text-white/50">
            Seller Subtotal
          </p>
          <p className="mt-1 text-xl font-black text-black dark:text-white">
            ₹{totalSellerRevenue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setFilterStatus(st);
              }}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-xs text-black/50 dark:text-white/50">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-black/5 bg-black/[0.01] p-6 text-center dark:border-white/5 dark:bg-white/[0.01]">
          <ShoppingBagIcon className="mb-2 h-8 w-8 text-black/20 dark:text-white/20" />
          <p className="text-sm font-semibold text-black dark:text-white">No orders found</p>
          <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {orders.length === 0
              ? `No customer orders have included items from ${sellerStoreName} yet.`
              : `No orders match status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:border-black/15 dark:border-white/5 dark:bg-[#181818] dark:hover:border-white/15"
            >
              {/* Top Order Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-black dark:text-white">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${getOrderStatusBadge(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-black/50 dark:text-white/50">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="rounded bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-black/70 uppercase dark:bg-white/10 dark:text-white/70">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Customer Info & Items */}
              <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                {/* Items */}
                <div className="flex-1 space-y-2">
                  {order.items.map((item: SellerOrderItem) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-black/30 dark:text-white/30">
                            FF
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-black dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-black/50 dark:text-white/50">
                          Qty:{' '}
                          <span className="font-semibold text-black dark:text-white">
                            {item.quantity}
                          </span>
                          {item.size && item.size !== 'Standard' && (
                            <> &middot; Size: {item.size}</>
                          )}
                          {item.color && item.color !== 'Standard' && (
                            <> &middot; Color: {item.color}</>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-black dark:text-white">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-black/40 dark:text-white/40">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seller Subtotal Box */}
                <div className="flex shrink-0 items-center justify-between rounded-xl bg-black/[0.03] p-3 lg:w-48 lg:flex-col lg:items-end lg:justify-center dark:bg-white/[0.03]">
                  {order.customer && (
                    <div className="mb-1 text-left lg:text-right">
                      <p className="text-xs font-semibold text-black dark:text-white">
                        {order.customer.name}
                      </p>
                      <p className="text-[11px] text-black/50 dark:text-white/50">
                        {order.customer.phone}
                      </p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-black/40 uppercase dark:text-white/40">
                      Seller Share
                    </p>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ₹{order.sellerSubtotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
