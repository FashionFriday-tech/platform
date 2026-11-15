import React from 'react';

import { type OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusColor = (s: OrderStatus) => {
    switch (s?.toLowerCase()) {
      case 'pending':
      case 'stock_check':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'confirmed':
      case 'stock_confirmed':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'processing':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'shipped':
      case 'shipping':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered':
      case 'arrived':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'canceled':
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'border-border text-foreground-muted';
    }
  };

  const getFormattedLabel = (s: OrderStatus, rawLabel?: string) => {
    const norm = (s || '').toLowerCase();
    switch (norm) {
      case 'pending':
        return 'Order Placed';
      case 'stock_check':
        return 'Checking Stock';
      case 'stock_confirmed':
      case 'confirmed':
        return 'Stock Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
      case 'shipping':
        return 'Shipped';
      case 'delivered':
      case 'arrived':
        return 'Delivered';
      case 'canceled':
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      case 'refunded':
        return 'Refunded';
      default:
        return rawLabel || s;
    }
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${getStatusColor(
        status,
      )}`}
    >
      {getFormattedLabel(status, label)}
    </span>
  );
}
