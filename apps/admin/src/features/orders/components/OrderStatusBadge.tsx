'use client';

import React from 'react';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
    pending: {
      label: 'Order Placed',
      classes:
        'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400 border-yellow-500/20',
    },
    processing: {
      label: 'Placed Order',
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
      classes: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 border-indigo-500/20',
    },
    returned: {
      label: 'Returned',
      classes: 'bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400 border-gray-500/20',
    },
    refunded: {
      label: 'Refunded',
      classes: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400 border-teal-500/20',
    },
  };

  const normalizedStatus = status?.toLowerCase() as OrderStatus;
  const config = statusConfig[normalizedStatus] || {
    label: status || 'Unknown',
    classes: 'bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400 border-gray-500/20',
  };
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-all',
          config.classes,
        ),
        className,
      )}
    >
      {config.label}
    </span>
  );
}
