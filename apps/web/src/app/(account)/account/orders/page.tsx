"use client";

import { useState, useMemo } from "react";
import { orders, Order, OrderStatus } from "@/data/order";

import { 
  TruckIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  PackageIcon, 
  CalendarIcon 
} from "@ff/ui";

// --- Sub-Components ---

const StatusBadge = ({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) => {
  const styles = {
    shipping: "bg-brand/10 text-brand border-brand/20",
    arrived: "bg-green-500/10 text-green-500 border-green-500/20",
    canceled: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${styles[status]}`}
    >
      {label}
    </span>
  );
};

const TabButton = ({ isActive, label, count, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 min-w-fit flex items-center justify-center gap-2 px-4 sm:px-8 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
      isActive
        ? "bg-background text-foreground shadow-sm scale-[0.98]"
        : "text-foreground-subtle hover:text-foreground"
    }`}
  >
    {label}
    {count !== undefined && (
      <span
        className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
          isActive
            ? "bg-brand text-brand-foreground"
            : "bg-background-elevated text-foreground-subtle border border-border"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// Updated to accept a single item per card
const OrderCard = ({ order, item }: { order: Order; item: any }) => (
  <article className="bg-background-elevated rounded-4xl p-5 sm:p-7 border border-border shadow-sm flex flex-col h-full">
    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-1">
        <p className="text-[10px] text-foreground-subtle font-black uppercase tracking-[0.2em]">
          ID: {order.id}
        </p>
        <div className="flex items-center gap-2 text-foreground-muted">
          <CalendarIcon size={14} />
          <span className="text-xs font-bold">{order.date}</span>
        </div>
      </div>
      <StatusBadge status={order.status} label={order.statusLabel} />
    </div>

    {/* Tracking Visualization */}
    <div className="bg-background-muted rounded-3xl p-4 mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center">
            <TruckIcon size={16} className="text-brand" />
          </div>
          <div className="hidden xs:block">
            <p className="text-[9px] text-foreground-subtle uppercase font-bold">
              Origin
            </p>
            <p className="text-xs font-bold truncate max-w-20">
              {order.origin}
            </p>
          </div>
        </div>

        <div className="flex-1 mx-4 h-px border-t-2 border-dashed border-border" />

        <div className="flex items-center gap-3 text-right">
          <div className="hidden xs:block">
            <p className="text-[9px] text-foreground-subtle uppercase font-bold">
              Destination
            </p>
            <p className="text-xs font-bold truncate max-w-20">
              {order.destination}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center">
            <MapPinIcon size={16} className="text-foreground-muted" />
          </div>
        </div>
      </div>
    </div>

    {/* Single Product Showcase */}
    <div className="mb-6 flex-1">
      <p className="text-[10px] text-foreground-subtle font-bold uppercase mb-3 ml-1">
        Package Content
      </p>
      <div className="bg-background-muted/50 border border-border/40 p-3 rounded-2xl flex gap-4 items-center">
        <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-background border border-border">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold truncate text-foreground">
            {item.name}
          </h4>
          <p className="text-xs text-foreground-subtle mt-1">
            Size {item.size} • Qty {item.quantity}
          </p>
          <p className="text-sm font-black mt-2 text-brand">
            ₹{item.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
      <div>
        <p className="text-[10px] text-foreground-subtle font-bold uppercase">
          Shipment Total
        </p>
        <p className="text-xl font-black">₹{item.price.toLocaleString()}</p>
      </div>
      <button className="bg-brand text-brand-foreground py-2 px-6 rounded-full font-bold text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand/10">
        Track <ChevronRightIcon size={16} />
      </button>
    </div>
  </article>
);

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("shipping");

  // Flattening orders so each item becomes a unique "shipment card"
  const flattenedOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === activeTab)
      .flatMap((order) =>
        order.items.map((item) => ({
          ...order,
          uniqueShipmentId: `${order.id}-${item.id}`,
          displayItem: item,
        }))
      );
  }, [activeTab]);

  // Counts based on total items per category
  const getCount = (status: OrderStatus) => {
    return orders
      .filter((o) => o.status === status)
      .reduce((acc, curr) => acc + curr.items.length, 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand selection:text-brand-foreground pb-16">
      <header className="sticky top-0 lg:top-6 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
          <h1 className="text-xl font-black uppercase tracking-widest mb-6 text-center sm:text-left">
            My Orders
          </h1>

          <div className="bg-background-muted p-1.5 rounded-3xl flex items-center gap-1 overflow-x-auto no-scrollbar shadow-inner">
            {["shipping", "arrived", "canceled"].map((tab) => (
              <TabButton
                key={tab}
                isActive={activeTab === tab}
                label={
                  tab === "shipping"
                    ? "Shipping"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)
                }
                count={
                  tab !== "canceled" ? getCount(tab as OrderStatus) : undefined
                }
                onClick={() => setActiveTab(tab as OrderStatus)}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-6 lg:pt-12">
        {flattenedOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flattenedOrders.map((shipment) => (
              <OrderCard
                key={shipment.uniqueShipmentId}
                order={shipment}
                item={shipment.displayItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-background-elevated rounded-4xl border border-dashed border-border opacity-60">
            <PackageIcon
              className="mx-auto mb-4 text-foreground-subtle"
              size={40}
            />
            <p className="font-bold">No {activeTab} shipments</p>
          </div>
        )}
      </main>
    </div>
  );
}
