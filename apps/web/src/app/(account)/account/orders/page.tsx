'use client';

import { useState, useMemo } from 'react';
import { orders, Order, OrderStatus } from '@/data/order';

import { TruckIcon, MapPinIcon, ChevronRightIcon, PackageIcon, CalendarIcon } from '@ff/ui';
import Image from 'next/image';

// --- Sub-Components ---

const StatusBadge = ({ status, label }: { status: OrderStatus; label: string }) => {
  const styles = {
    shipping: 'bg-brand/10 text-brand border-brand/20',
    arrived: 'bg-green-500/10 text-green-500 border-green-500/20',
    canceled: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${styles[status]}`}
    >
      {label}
    </span>
  );
};

const TabButton = ({ isActive, label, count, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all sm:px-8 ${
      isActive
        ? 'bg-background text-foreground scale-[0.98] shadow-sm'
        : 'text-foreground-subtle hover:text-foreground'
    }`}
  >
    {label}
    {count !== undefined && (
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
          isActive
            ? 'bg-brand text-brand-foreground'
            : 'bg-background-elevated text-foreground-subtle border-border border'
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// Updated to accept a single item per card
const OrderCard = ({ order, item }: { order: Order; item: any }) => (
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

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('shipping');

  // Flattening orders so each item becomes a unique "shipment card"
  const flattenedOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === activeTab)
      .flatMap((order) =>
        order.items.map((item) => ({
          ...order,
          uniqueShipmentId: `${order.id}-${item.id}`,
          displayItem: item,
        })),
      );
  }, [activeTab]);

  // Counts based on total items per category
  const getCount = (status: OrderStatus) => {
    return orders
      .filter((o) => o.status === status)
      .reduce((acc, curr) => acc + curr.items.length, 0);
  };

  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground min-h-screen pb-16">
      <header className="bg-background/80 border-border sticky top-0 z-40 border-b backdrop-blur-md lg:top-6">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <h1 className="mb-6 text-center text-xl font-black tracking-widest uppercase sm:text-left">
            My Orders
          </h1>

          <div className="bg-background-muted no-scrollbar flex items-center gap-1 overflow-x-auto rounded-3xl p-1.5 shadow-inner">
            {['shipping', 'arrived', 'canceled'].map((tab) => (
              <TabButton
                key={tab}
                isActive={activeTab === tab}
                label={tab === 'shipping' ? 'Shipping' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                count={tab !== 'canceled' ? getCount(tab as OrderStatus) : undefined}
                onClick={() => setActiveTab(tab as OrderStatus)}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-6 lg:pt-12">
        {flattenedOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {flattenedOrders.map((shipment) => (
              <OrderCard
                key={shipment.uniqueShipmentId}
                order={shipment}
                item={shipment.displayItem}
              />
            ))}
          </div>
        ) : (
          <div className="bg-background-elevated border-border rounded-4xl border border-dashed py-20 text-center opacity-60">
            <PackageIcon className="text-foreground-subtle mx-auto mb-4" size={40} />
            <p className="font-bold">No {activeTab} shipments</p>
          </div>
        )}
      </main>
    </div>
  );
}
