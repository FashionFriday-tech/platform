"use client";

import { useState } from "react";
import Image from "next/image";
import { Truck, MapPin, ChevronRight, Package, Search, Filter } from "lucide-react";
import { orders, Order, OrderStatus } from "@/data/order"; 
import { Header } from "@/components/layout/Header";

// --- Helper Components ---

const StatusBadge = ({ status, label }: { status: OrderStatus; label: string }) => {
  const styles = {
    shipping: "bg-green-50 text-green-700 border-green-200",
    arrived: "bg-blue-50 text-blue-700 border-blue-200",
    canceled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.shipping}`}>
      {label}
    </span>
  );
};

const TabButton = ({ 
  isActive, 
  label, 
  count, 
  onClick 
}: { 
  isActive: boolean; 
  label: string; 
  count?: number; 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full relative flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-white text-black shadow-[0_2px_10px_rgb(0,0,0,0.08)] ring-black/5"
        : "text-zinc-500 hover:bg-white/50 hover:text-zinc-700"
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
        isActive ? "bg-black text-white" : "bg-zinc-200 text-zinc-600"
      }`}>
        {count}
      </span>
    )}
  </button>
);

// --- Main Order Card Component ---

const OrderCard = ({ order }: { order: Order }) => {
  return (
    <article className="group bg-white rounded-3xl p-5 sm:p-7 border border-zinc-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)]">
      <Header />
      {/* Header: ID, Date, Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Order ID</p>
          <h3 className="text-xl font-bold text-zinc-900">{order.id}</h3>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="hidden sm:block">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Estimated Arrival</p>
            <p className="text-sm font-semibold text-zinc-700">{order.date}</p>
          </div>
          <StatusBadge status={order.status} label={order.statusLabel} />
        </div>
      </div>

      {/* Tracking Visualization */}
      <div className="bg-zinc-50/80 rounded-2xl p-4 mb-2 border border-zinc-100/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden sm:block absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-dashed border-zinc-300 -z-10 -mt-1.5" />
          {/* Connecting Line (Mobile) */}
          <div className="sm:hidden absolute left-4.75 top-8 bottom-8 w-0.5 border-l-2 border-dashed border-zinc-300 -z-10" />

          {/* Origin */}
          <div className="flex items-center gap-4 bg-zinc-50 sm:bg-transparent pr-4 z-10">
            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm shrink-0">
              <Truck size={18} className="text-zinc-600" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">From</p>
              <p className="text-sm font-bold text-zinc-800 text-nowrap">{order.origin}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-4 bg-zinc-50 sm:bg-transparent pl-4 z-10">
             {/* Mobile layout flip: Icon first to match line */}
            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm shrink-0 order-first sm:order-last">
              <MapPin size={18} className="text-zinc-600" />
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-zinc-400 font-medium">To</p>
              <p className="text-sm font-bold text-zinc-800">{order.destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 h-40 overflow-scroll">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
            <div className="relative w-20 aspect-3/3.5 shrink-0 rounded-xl overflow-hidden bg-white">
              <img 
                src={item.image} 
                alt={item.name}
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-zinc-900 line-clamp-1">{item.name}</h4>
              <p className="text-sm text-zinc-500 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-zinc-900 mt-2">₹ {item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Totals & Action */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 pt-6 border-t border-zinc-100">
        <div>
          <p className="text-sm text-zinc-500 font-medium mb-1">Total Amount <span className="text-zinc-300">({order.items.length} Items)</span></p>
          <p className="text-2xl font-bold text-zinc-900">₹ {order.totalPrice.toLocaleString()}</p>
        </div>
        
        <button className="group flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-8 py-3 rounded-full font-medium transition-all active:scale-95">
          Details
          <ChevronRight size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
        </button>
      </div>

    </article>
  );
};

// --- Page Layout ---

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("shipping");

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50/30 py-20 font-sans selection:bg-zinc-900 selection:text-white"> 
      {/* Page Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-20 z-40">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-zinc-900 tracking-tight mb-4">My Orders</h1>
          
          {/* Scrollable Tabs Container */}
          <div className="flex w-full items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mb-2">
            <div className="w-full p-1.5 bg-zinc-100/80 rounded-full flex items-center justify-between gap-1 backdrop-blur-sm">
                <TabButton 
                isActive={activeTab === "shipping"} 
                label="On Shipping" 
                count={orders.filter(o => o.status === "shipping").length}
                onClick={() => setActiveTab("shipping")} 
                />
                <TabButton 
                isActive={activeTab === "arrived"} 
                label="Arrived" 
                count={orders.filter(o => o.status === "arrived").length}
                onClick={() => setActiveTab("arrived")} 
                />
                <TabButton 
                isActive={activeTab === "canceled"} 
                label="Canceled" 
                onClick={() => setActiveTab("canceled")} 
                />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Orders List */}
        <div className="grid grid-cols-3 gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="col-span-1 mb-6 last:mb-0">
                <OrderCard order={order} />
              </div>
            ))
          ) : (
            // Empty State
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 border-dashed">
              <div className="bg-zinc-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-zinc-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">No orders found</h3>
              <p className="text-zinc-500 mt-2">There are no orders in this category yet.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}