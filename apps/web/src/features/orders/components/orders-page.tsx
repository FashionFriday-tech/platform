'use client';

import React from 'react';

import { PackageIcon } from '@ff/ui';

import { useOrders } from '../hooks/use-orders';
import { type OrderStatus } from '../types';
import { OrderCard } from './order-card';
import { TabButton } from './tab-button';

export function OrdersPage() {
  const { activeTab, setActiveTab, flattenedOrders, getCount } = useOrders();

  return (
    <div className="bg-background text-foreground selection:bg-brand selection:text-brand-foreground min-h-screen pb-16">
      <header className="bg-background/80 border-border sticky top-0 z-40 border-b backdrop-blur-md lg:top-6">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <h1 className="mb-6 text-center text-xl font-black tracking-widest uppercase sm:text-left">
            My Orders
          </h1>

          <div className="bg-background-muted no-scrollbar flex items-center gap-1 overflow-x-auto rounded-3xl p-1.5 shadow-inner">
            {(['shipping', 'arrived', 'canceled'] as const).map((tab) => (
              <TabButton
                key={tab}
                isActive={activeTab === tab}
                label={tab === 'shipping' ? 'Shipping' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                count={tab !== 'canceled' ? getCount(tab as OrderStatus) : undefined}
                onClick={() => {
                  setActiveTab(tab as OrderStatus);
                }}
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
