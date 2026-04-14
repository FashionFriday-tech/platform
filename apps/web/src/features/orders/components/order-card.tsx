import React from 'react';
import Image from 'next/image';

import { CalendarIcon, ChevronRightIcon, MapPinIcon, TruckIcon } from '@ff/ui';

import { type Order, type OrderItem } from '../types';
import { StatusBadge } from './status-badge';

interface OrderCardProps {
  order: Order;
  item: OrderItem;
}

export function OrderCard({ order, item }: OrderCardProps) {
  return (
    <article className="bg-background-elevated border-border flex h-full flex-col rounded-4xl border p-5 shadow-sm sm:p-7">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-foreground-subtle text-[10px] font-black tracking-[0.2em] uppercase">
            ID: {order.id}
          </p>
          <div className="text-foreground-muted flex items-center gap-2">
            <CalendarIcon size={14} />
            <span className="text-xs font-bold">{order.date}</span>
          </div>
        </div>
        <StatusBadge status={order.status} label={order.statusLabel} />
      </div>

      {/* Tracking Visualization */}
      <div className="bg-background-muted relative mb-6 overflow-hidden rounded-3xl p-4">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-background border-border flex h-9 w-9 items-center justify-center rounded-full border">
              <TruckIcon size={16} className="text-brand" />
            </div>
            <div className="xs:block hidden">
              <p className="text-foreground-subtle text-[9px] font-bold uppercase">Origin</p>
              <p className="max-w-20 truncate text-xs font-bold">{order.origin}</p>
            </div>
          </div>

          <div className="border-border mx-4 h-px flex-1 border-t-2 border-dashed" />

          <div className="flex items-center gap-3 text-right">
            <div className="xs:block hidden">
              <p className="text-foreground-subtle text-[9px] font-bold uppercase">Destination</p>
              <p className="max-w-20 truncate text-xs font-bold">{order.destination}</p>
            </div>
            <div className="bg-background border-border flex h-9 w-9 items-center justify-center rounded-full border">
              <MapPinIcon size={16} className="text-foreground-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Single Product Showcase */}
      <div className="mb-6 flex-1">
        <p className="text-foreground-subtle mb-3 ml-1 text-[10px] font-bold uppercase">
          Package Content
        </p>
        <div className="bg-background-muted/50 border-border/40 flex items-center gap-4 rounded-2xl border p-3">
          <div className="bg-background border-border relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border">
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0">
            <h4 className="text-foreground truncate text-sm font-bold">{item.name}</h4>
            <p className="text-foreground-subtle mt-1 text-xs">
              Size {item.size} • Qty {item.quantity}
            </p>
            <p className="text-brand mt-2 text-sm font-black">₹{item.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-border mt-auto flex items-center justify-between border-t pt-5">
        <div>
          <p className="text-foreground-subtle text-[10px] font-bold uppercase">Shipment Total</p>
          <p className="text-xl font-black">₹{item.price.toLocaleString()}</p>
        </div>
        <button className="bg-brand text-brand-foreground shadow-brand/10 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-95">
          Track <ChevronRightIcon size={16} />
        </button>
      </div>
    </article>
  );
}
