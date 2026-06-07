import React from 'react';
import Image from 'next/image';

import { CalendarIcon, ChevronRightIcon, MapPinIcon, TruckIcon } from '@ff/ui';

import { type Order, type OrderItem } from '../types';
import { StatusBadge } from './status-badge';

interface OrderCardProps {
  order: Order;
  item: OrderItem;
}

function getTrackingUrl(courier: string, trackingId: string): string {
  const cleanId = trackingId.trim();
  switch (courier?.toLowerCase()) {
    case 'delhivery':
      return `https://www.delhivery.com/track/package/${cleanId}`;
    case 'dtdc':
      return `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${cleanId}`;
    case 'bluedart':
      return `https://www.bluedart.com/tracking?handler=tnt&action=custTrack&numbers=${cleanId}`;
    case 'indiapost':
      return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
    case 'ecom express':
      return `https://ecomexpress.in/tracking/?awb=${cleanId}`;
    case 'shadowfax':
      return `https://tracker.shadowfax.in/#/track?awb=${cleanId}`;
    case 'xpressbees':
      return `https://www.xpressbees.com/shipment/tracking?awb=${cleanId}`;
    case 'ekart':
      return `https://ekartlogistics.com/shipmenttrack/${cleanId}`;
    default:
      return `https://parcelsapp.com/en/tracking/${cleanId}`;
  }
}

export function OrderCard({ order, item }: OrderCardProps) {
  const hasTracking = Boolean(order.trackingNumber);
  const trackUrl = hasTracking ? getTrackingUrl(order.courierPartner || '', order.trackingNumber || '') : null;

  return (
    <article className="bg-background-elevated border-border flex h-full flex-col rounded-4xl border p-5 shadow-sm sm:p-7">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-foreground-subtle text-[10px] font-black tracking-[0.2em] uppercase">
            ID: {order.orderNumber || order.id}
          </p>
          <div className="text-foreground-muted flex items-center gap-2">
            <CalendarIcon size={14} />
            <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <StatusBadge status={order.status.toLowerCase()} label={order.status} />
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
              <p className="max-w-20 truncate text-xs font-bold">Warehouse</p>
            </div>
          </div>

          <div className="border-border mx-4 h-px flex-1 border-t-2 border-dashed" />

          <div className="flex items-center gap-3 text-right">
            <div className="xs:block hidden">
              <p className="text-foreground-subtle text-[9px] font-bold uppercase">Destination</p>
              <p className="max-w-20 truncate text-xs font-bold">{order.shippingAddress?.city || 'N/A'}</p>
            </div>
            <div className="bg-background border-border flex h-9 w-9 items-center justify-center rounded-full border">
              <MapPinIcon size={16} className="text-foreground-muted" />
            </div>
          </div>
        </div>

        {hasTracking && (
          <div className="border-border/50 text-foreground-muted mt-3 flex items-center justify-between border-t pt-2 text-[10px] font-bold">
            <span className="text-brand">{order.courierPartner || 'Courier'}</span>
            <span className="font-mono">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Single Product Showcase */}
      <div className="mb-6 flex-1">
        <p className="text-foreground-subtle mb-3 ml-1 text-[10px] font-bold uppercase">
          Package Content
        </p>
        <div className="bg-background-muted/50 border-border/40 flex items-center gap-4 rounded-2xl border p-3">
          <div className="bg-background border-border relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border">
            <Image src={item.image || '/images/placeholders/2.png'} alt={item.name || ''} fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0">
            <h4 className="text-foreground truncate text-sm font-bold">{item.name}</h4>
            <p className="text-foreground-subtle mt-1 text-xs">
              Size {item.size} • Qty {item.quantity}
            </p>
            <p className="text-brand mt-2 text-sm font-black">₹{Number(item.price).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-border mt-auto flex items-center justify-between border-t pt-5">
        <div>
          <p className="text-foreground-subtle text-[10px] font-bold uppercase">Shipment Total</p>
          <p className="text-xl font-black">₹{(Number(item.price) * item.quantity).toLocaleString()}</p>
        </div>
        {trackUrl ? (
          <a
            href={trackUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-brand text-brand-foreground shadow-brand/10 flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            Track <ChevronRightIcon size={16} />
          </a>
        ) : (
          <button
            onClick={() => {
              alert(
                order.status?.toUpperCase() === 'CONFIRMED'
                  ? 'Your order is confirmed and being prepared for shipment. Tracking details will appear here once dispatched!'
                  : 'Your order is currently being verified & prepared. Tracking details will appear here once dispatched!',
              );
            }}
            className="bg-background-muted text-foreground-muted flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all hover:bg-background-muted/80"
          >
            Processing <ChevronRightIcon size={14} />
          </button>
        )}
      </div>
    </article>
  );
}
