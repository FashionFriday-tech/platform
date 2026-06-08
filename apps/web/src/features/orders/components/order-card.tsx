import React from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  CopyIcon,
  MapPinIcon,
  PackageIcon,
  TruckIcon,
} from '@ff/ui';

import { type Order, type OrderItem } from '../types';
import { StatusBadge } from './status-badge';
import { TrackingModal } from './tracking-modal';

interface OrderCardProps {
  order: Order;
  item: OrderItem;
}

function getOfficialCourierUrl(courier: string, trackingId: string): string {
  const cleanId = encodeURIComponent(trackingId.trim());
  const cleanCourier = (courier || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (cleanCourier.includes('delhivery')) {
    return 'https://www.delhivery.com/tracking';
  }
  if (cleanCourier.includes('bluedart')) {
    return `https://www.bluedart.com/tracking?handler=tnt&action=custTrack&numbers=${cleanId}`;
  }
  if (cleanCourier.includes('dtdc')) {
    return `https://www.dtdc.com/track-your-shipment/m`;
  }
  if (cleanCourier.includes('xpressbees') || cleanCourier.includes('xpress')) {
    return `https://www.xpressbees.com/shipment/tracking?awb=${cleanId}`;
  }
  if (cleanCourier.includes('shadowfax')) {
    return `https://tracker.shadowfax.in/#/track?awb=${cleanId}`;
  }
  if (cleanCourier.includes('ekart')) {
    return `https://ekartlogistics.com/shipmenttrack/${cleanId}`;
  }
  if (cleanCourier.includes('ecomexpress') || cleanCourier.includes('ecom')) {
    return `https://ecomexpress.in/tracking/?awb=${cleanId}`;
  }
  if (cleanCourier.includes('indiapost') || cleanCourier.includes('speedpost') || cleanCourier.includes('post')) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
  }
  if (cleanCourier.includes('shiprocket')) {
    return `https://shiprocket.co/tracking/${cleanId}`;
  }
  if (cleanCourier.includes('tpc') || cleanCourier.includes('professional')) {
    return `https://www.tpcindia.com/track.aspx`;
  }
  if (cleanCourier.includes('amazon') || cleanCourier.includes('ats')) {
    return `https://track.amazon.in/tracking/${cleanId}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent((courier || 'Courier') + ' tracking')}`;
}

function getUniversalTrackingUrl(trackingId: string): string {
  const cleanId = encodeURIComponent(trackingId.trim());
  return `https://t.17track.net/en#nums=${cleanId}`;
}

export function OrderCard({ order, item }: OrderCardProps) {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = React.useState(false);

  const hasTracking = Boolean(order.trackingNumber);
  const officialTrackUrl = hasTracking ? getOfficialCourierUrl(order.courierPartner || '', order.trackingNumber || '') : '';
  const universalTrackUrl = hasTracking ? getUniversalTrackingUrl(order.trackingNumber || '') : '';

  const normalizedStatus = (order.status || '').toUpperCase();
  const isShipped = normalizedStatus === 'SHIPPED';
  const isDelivered = normalizedStatus === 'DELIVERED';
  const isCancelled = normalizedStatus === 'CANCELLED' || normalizedStatus === 'CANCELED';
  const isProcessing = normalizedStatus === 'PROCESSING';
  const isPlaced = normalizedStatus === 'PENDING' || normalizedStatus === 'CONFIRMED' || !normalizedStatus;

  const handleOpenTracking = () => {
    if (hasTracking) {
      setIsTrackingModalOpen(true);
    } else {
      toast.info('Shipment In Transit', {
        description: order.courierPartner
          ? `Dispatched via ${order.courierPartner}. Tracking ID will be updated shortly.`
          : 'Your order is on the way! Detailed tracking will update soon.',
      });
    }
  };

  const renderActionButton = () => {
    // 1. Shipped -> Show "Track" button
    if (isShipped) {
      return (
        <button
          type="button"
          onClick={handleOpenTracking}
          className="bg-brand text-brand-foreground shadow-brand/20 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition-all hover:opacity-90 active:scale-95 cursor-pointer"
        >
          <TruckIcon size={16} />
          <span>Track</span>
          <ChevronRightIcon size={16} />
        </button>
      );
    }

    // 2. Delivered -> Show "Delivered" button
    if (isDelivered) {
      return (
        <button
          type="button"
          onClick={() => {
            if (hasTracking) {
              setIsTrackingModalOpen(true);
            } else {
              toast.success('Package Delivered', {
                description: 'Your order has been delivered successfully to your destination address.',
              });
            }
          }}
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <CheckCircleIcon size={15} />
          <span>Delivered</span>
          {hasTracking && <ChevronRightIcon size={14} className="opacity-60" />}
        </button>
      );
    }

    // 3. Processing -> Show "Processing" button
    if (isProcessing) {
      return (
        <button
          type="button"
          onClick={() => {
            toast.info('Order Processing', {
              description: 'Your package is being prepared and packed at the warehouse.',
            });
          }}
          className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25 hover:bg-purple-500/20 flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-bold transition-all active:scale-95"
        >
          <ClockIcon size={14} />
          <span>Processing</span>
          <ChevronRightIcon size={14} className="opacity-60" />
        </button>
      );
    }

    // 4. Order Placed / Confirmed -> Show "Order Placed" button
    if (isPlaced) {
      return (
        <button
          type="button"
          onClick={() => {
            toast.info('Order Placed', {
              description: 'Your order has been received and is confirmed. Tracking will be available once shipped.',
            });
          }}
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 hover:bg-amber-500/20 flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-bold transition-all active:scale-95"
        >
          <PackageIcon size={14} />
          <span>Order Placed</span>
          <ChevronRightIcon size={14} className="opacity-60" />
        </button>
      );
    }

    // 5. Cancelled
    if (isCancelled) {
      return (
        <button
          type="button"
          onClick={() => {
            toast.error('Order Cancelled', {
              description: 'This order was cancelled.',
            });
          }}
          className="bg-destructive/10 text-destructive border-destructive/25 hover:bg-destructive/20 flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-bold transition-all active:scale-95"
        >
          <CloseIcon size={14} />
          <span>Cancelled</span>
        </button>
      );
    }

    // Fallback: Returned / Refunded / Other
    return (
      <button
        type="button"
        onClick={() => {
          toast.info('Order Status', {
            description: `Current order status: ${order.status}`,
          });
        }}
        className="bg-background-muted text-foreground-muted hover:bg-background-muted/80 flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all"
      >
        <span>{order.status || 'Order Placed'}</span>
        <ChevronRightIcon size={14} />
      </button>
    );
  };

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
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${isShipped || isDelivered
                ? 'bg-brand text-brand-foreground border-brand'
                : 'bg-background border-border text-brand'
                }`}
            >
              <TruckIcon size={16} />
            </div>
            <div className="xs:block hidden">
              <p className="text-foreground-subtle text-[9px] font-bold uppercase">Origin</p>
              <p className="max-w-20 truncate text-xs font-bold">Warehouse</p>
            </div>
          </div>

          <div
            className={`mx-4 h-px flex-1 border-t-2 transition-colors ${isDelivered
              ? 'border-emerald-500/60 border-solid'
              : isShipped
                ? 'border-brand border-dashed'
                : 'border-border border-dashed'
              }`}
          />

          <div className="flex items-center gap-3 text-right">
            <div className="xs:block hidden">
              <p className="text-foreground-subtle text-[9px] font-bold uppercase">Destination</p>
              <p className="max-w-20 truncate text-xs font-bold">{order.shippingAddress?.city || 'N/A'}</p>
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${isDelivered
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-background border-border text-foreground-muted'
                }`}
            >
              {isDelivered ? <CheckCircleIcon size={16} /> : <MapPinIcon size={16} />}
            </div>
          </div>
        </div>

        {hasTracking && (
          <div className="border-border/50 text-foreground-muted mt-3 flex items-center justify-between border-t pt-2 text-[10px] font-bold">
            <span className="text-brand font-black tracking-wider uppercase">{order.courierPartner || 'Courier'}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (order.trackingNumber) {
                  navigator.clipboard.writeText(order.trackingNumber);
                  toast.success('Tracking ID Copied', {
                    description: `AWB ${order.trackingNumber} copied to clipboard.`,
                  });
                }
              }}
              title="Click to copy tracking number"
              className="hover:text-foreground font-mono group flex cursor-pointer items-center gap-1.5 transition-colors"
            >
              <span>{order.trackingNumber}</span>
              <CopyIcon size={12} className="opacity-60 group-hover:opacity-100" />
            </button>
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
            <Image
              src={item.image || '/images/placeholders/2.png'}
              alt={item.name || ''}
              fill
              className="object-cover"
              sizes="80px"
            />
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
        {renderActionButton()}
      </div>

      {/* Tracking Modal */}
      {hasTracking && (
        <TrackingModal
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          order={order}
          item={item}
          officialTrackUrl={officialTrackUrl}
          universalTrackUrl={universalTrackUrl}
        />
      )}
    </article>
  );
}
