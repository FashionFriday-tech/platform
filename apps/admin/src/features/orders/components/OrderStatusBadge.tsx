'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
    pending: {
      label: 'Pending',
      classes:
        'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400 border-yellow-500/20',
    },
    processing: {
      label: 'Processing',
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
  };

  const config = statusConfig[status];

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex justify-center items-center rounded-md border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm transition-all',
          config.classes,
        ),
        className,
      )}
    >
      {config.label}
    </span>
  );
}
