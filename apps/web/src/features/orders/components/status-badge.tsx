import React from 'react';

import { type OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStatusColor = (s: OrderStatus) => {
    switch (s) {
      case 'shipping':
        return 'bg-brand/10 text-brand border-brand/20';
      case 'arrived':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'canceled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'border-border';
    }
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${getStatusColor(
        status,
      )}`}
    >
      {label}
    </span>
  );
}
