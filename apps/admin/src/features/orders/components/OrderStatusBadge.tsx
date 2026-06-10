'use client';

import React from 'react';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  inverted?: boolean;
}

export function OrderStatusBadge({ status, className, inverted = false }: OrderStatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
    pending: {
      label: 'Order Placed',
      classes:
        'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400 border-yellow-500/20',
    },
    processing: {
      label: 'Placed with Seller',
      classes:
        'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border-blue-500/20',
    },
    shipped: {
      label: 'Shipped',
      classes:
        'bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 border-purple-500/20',
    },
    delivered: {
      label: 'Delivered',
      classes:
        'bg-green-500/10 text-green-600 dark:bg-green-400/10 dark:text-green-400 border-green-500/20',
    },
    cancelled: {
      label: 'Cancelled',
      classes: 'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400 border-red-500/20',
    },
    confirmed: {
      label: 'Confirmed',
      classes:
        'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 border-indigo-500/20',
    },
    returned: {
      label: 'Returned',
      classes:
        'bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400 border-gray-500/20',
    },
    refunded: {
      label: 'Refunded',
      classes:
        'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400 border-teal-500/20',
    },
  };

  const invertedStatusConfig: Record<OrderStatus, { label: string; classes: string }> = {
    pending: {
      label: 'Order Placed',
      classes:
        'bg-yellow-400/15 text-yellow-300 border-yellow-400/30 dark:bg-yellow-50 dark:text-yellow-700 dark:border-yellow-600/20',
    },
    processing: {
      label: 'Placed with Seller',
      classes:
        'bg-blue-400/15 text-blue-300 border-blue-400/30 dark:bg-blue-50 dark:text-blue-700 dark:border-blue-600/20',
    },
    shipped: {
      label: 'Shipped',
      classes:
        'bg-purple-400/15 text-purple-300 border-purple-400/30 dark:bg-purple-50 dark:text-purple-700 dark:border-purple-600/20',
    },
    delivered: {
      label: 'Delivered',
      classes:
        'bg-green-400/15 text-green-300 border-green-400/30 dark:bg-green-50 dark:text-green-700 dark:border-green-600/20',
    },
    cancelled: {
      label: 'Cancelled',
      classes:
        'bg-red-400/15 text-red-300 border-red-400/30 dark:bg-red-50 dark:text-red-700 dark:border-red-600/20',
    },
    confirmed: {
      label: 'Confirmed',
      classes:
        'bg-indigo-400/15 text-indigo-300 border-indigo-400/30 dark:bg-indigo-50 dark:text-indigo-700 dark:border-indigo-600/20',
    },
    returned: {
      label: 'Returned',
      classes:
        'bg-gray-400/15 text-gray-300 border-gray-400/30 dark:bg-gray-100 dark:text-gray-700 dark:border-gray-300',
    },
    refunded: {
      label: 'Refunded',
      classes:
        'bg-teal-400/15 text-teal-300 border-teal-400/30 dark:bg-teal-50 dark:text-teal-700 dark:border-teal-600/20',
    },
  };

  const activeConfig = inverted ? invertedStatusConfig : statusConfig;
  const normalizedStatus = status?.toLowerCase() as OrderStatus;
  const config = activeConfig[normalizedStatus] || {
    label: status || 'Unknown',
    classes: inverted
      ? 'bg-gray-400/15 text-gray-300 border-gray-400/30 dark:bg-gray-100 dark:text-gray-700 dark:border-gray-300'
      : 'bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400 border-gray-500/20',
  };
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm transition-all',
          config.classes,
        ),
        className,
      )}
    >
      {config.label}
    </span>
  );
}
