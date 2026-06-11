'use client';

import React from 'react';
import Image from 'next/image';

import { CloseIcon, PackageIcon, ShoppingBagIcon } from '@ff/ui';
import { motion } from 'motion/react';

import {
  type Seller,
  type SellerOrderGroup,
  type SellerOrderItem,
  type SellerOrdersResponse,
} from '../types';

interface SellerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller | null;
  ordersData: SellerOrdersResponse | null;
  isLoading: boolean;
}

export function SellerOrdersModal({
  isOpen,
  onClose,
  seller,
  ordersData,
  isLoading,
}: SellerOrdersModalProps) {
  if (!isOpen || !seller) {
    return null;
  }

  const totalRevenue =
    ordersData?.orders.reduce(
      (acc: number, order: SellerOrderGroup) => acc + (order.sellerTotalAmount ?? 0),
      0,
    ) ?? 0;

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
            Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            Shipped
          </span>
        );
      case 'PROCESSING':
      case 'CONFIRMED':
        return (
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            {s === 'CONFIRMED' ? 'Confirmed' : 'Processing'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
            {status || 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121212]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/10">
              <ShoppingBagIcon className="h-6 w-6 text-black dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-black dark:text-white">{seller.storeName}</h2>
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
                  {seller.name}
                </span>
              </div>
              <p className="text-sm text-black/50 dark:text-white/50">
                Orders containing items supplied by this seller
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 border-b border-black/5 bg-[#fafafa] p-4 text-center dark:border-white/5 dark:bg-[#161616]">
          <div>
            <span className="text-xs font-medium tracking-wider text-black/40 uppercase dark:text-white/40">
              Total Orders
            </span>
            <p className="text-xl font-bold text-black dark:text-white">
              {ordersData?.totalOrders ?? 0}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-black/40 uppercase dark:text-white/40">
              Items Ordered
            </span>
            <p className="text-xl font-bold text-black dark:text-white">
              {ordersData?.totalOrderItems ?? 0}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium tracking-wider text-black/40 uppercase dark:text-white/40">
              Total Fulfilled Volume
            </span>
            <p className="text-xl font-bold text-black dark:text-white">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Orders Content */}
        <div className="scrollbar-hide flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
              <p className="text-sm text-black/50 dark:text-white/50">Fetching orders...</p>
            </div>
          ) : !ordersData || ordersData.orders.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                <PackageIcon className="h-8 w-8 text-black/30 dark:text-white/30" />
              </div>
              <p className="text-base font-semibold text-black dark:text-white">
                No orders found for this seller
              </p>
              <p className="max-w-sm text-sm text-black/40 dark:text-white/40">
                Products from {seller.storeName} haven&apos;t been ordered yet. Once customers place
                orders containing this seller&apos;s products, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersData.orders.map((order: SellerOrderGroup) => (
                <div
                  key={order.orderId}
                  className="overflow-hidden rounded-2xl border border-black/5 bg-[#fafafa] p-5 dark:border-white/5 dark:bg-[#171717]"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4 dark:border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black dark:text-white">
                          #{order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/60 dark:bg-white/10 dark:text-white/60">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                        Placed on{' '}
                        {new Date(order.orderCreatedAt ?? order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.orderCreatedAt ?? order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-black/50 dark:text-white/50">Seller Share</span>
                      <p className="text-lg font-bold text-black dark:text-white">
                        ₹{(order.sellerTotalAmount ?? order.sellerSubtotal ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  {order.customer && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-black/60 dark:text-white/60">
                      <span>
                        <strong className="text-black dark:text-white">Customer:</strong>{' '}
                        {order.customer.name || 'Anonymous'}
                      </span>
                      {order.customer.phone && <span>Tel: {order.customer.phone}</span>}
                      {order.customer.email && <span>Email: {order.customer.email}</span>}
                    </div>
                  )}

                  {/* Items in this order */}
                  <div className="mt-4 divide-y divide-black/5 rounded-xl border border-black/5 bg-white dark:divide-white/5 dark:border-white/5 dark:bg-[#111111]">
                    {order.items.map((item: SellerOrderItem) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <PackageIcon className="h-5 w-5 text-black/20 dark:text-white/20" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-black dark:text-white">{item.name}</p>
                            <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>• Color: {item.color}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-black dark:text-white">
                            ₹{item.subtotal.toLocaleString()}
                          </p>
                          <p className="text-xs text-black/40 dark:text-white/40">
                            ₹{item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-black/5 p-4 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
