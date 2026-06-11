'use client';

import React from 'react';

import { ExternalLinkIcon, PackageIcon, PhoneIcon, ShoppingBagIcon, StoreIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type Seller, type SellerStatus } from '../types';

interface SellersTableProps {
  sellers: Seller[];
  isLoading: boolean;
  onSelectSeller: (seller: Seller) => void;
  onEditSeller: (seller: Seller) => void;
  onDeleteSeller: (id: string) => void;
  onToggleStatus: (id: string, status: SellerStatus) => void;
  onOpenOrders: (seller: Seller) => void;
}

export function SellersTable({
  sellers,
  isLoading,
  onSelectSeller,
  onEditSeller,
  onDeleteSeller,
  onToggleStatus,
  onOpenOrders,
}: SellersTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-xs dark:border-white/10 dark:bg-[#141417]">
        <div className="flex items-center gap-3 text-sm font-medium text-black/50 dark:text-white/50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          <span>Loading sellers...</span>
        </div>
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#141417]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
          <StoreIcon className="h-6 w-6 text-black/40 dark:text-white/40" />
        </div>
        <p className="text-base font-semibold text-black dark:text-white">No sellers found</p>
        <p className="max-w-sm text-sm text-black/50 dark:text-white/50">
          No sellers match your current filters. Try changing your search query or add a new seller.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: SellerStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'INACTIVE':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
      case 'SUSPENDED':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[1050px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(160px,1.3fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)_minmax(110px,1fr)_minmax(180px,1.4fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Store & Contact
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Contact Details
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Categories
              </div>
              <div className="text-center text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Products
              </div>
              <div className="text-center text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Orders
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Status
              </div>
              <div className="text-right text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Actions
              </div>
            </div>
          </div>

          {/* Row Tabs (White in Light Mode) */}
          {sellers.map((seller) => {
            const productCount = seller._count?.products ?? 0;
            const orderCount = seller._count?.orderItems ?? 0;

            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="group grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(160px,1.3fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)_minmax(110px,1fr)_minmax(180px,1.4fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
              >
                {/* Store & Contact */}
                <div
                  onClick={() => {
                    onSelectSeller(seller);
                  }}
                  className="flex min-w-0 cursor-pointer items-center gap-3 pr-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-bold text-black dark:bg-white/10 dark:text-white">
                    {seller.storeName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-black hover:underline dark:text-white">
                      {seller.storeName}
                    </p>
                    <p className="truncate text-xs text-black/50 dark:text-white/50">
                      {seller.name}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex min-w-0 flex-col gap-0.5 pr-4">
                  <span className="flex items-center gap-1.5 truncate text-xs font-medium text-black dark:text-white">
                    <PhoneIcon className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                    {seller.phone}
                  </span>
                  {seller.email && (
                    <span className="truncate text-xs text-black/50 dark:text-white/50">
                      {seller.email}
                    </span>
                  )}
                </div>

                {/* Categories */}
                <div className="flex max-w-xs flex-wrap gap-1.5 pr-4">
                  {seller.categories?.slice(0, 3).map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center rounded-md bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/80 dark:bg-white/10 dark:text-white/80"
                    >
                      {cat.name}
                    </span>
                  ))}
                  {(seller.categories?.length ?? 0) > 3 && (
                    <span className="inline-flex items-center rounded-md bg-black/5 px-1.5 py-0.5 text-[11px] font-bold text-black/50 dark:bg-white/10 dark:text-white/50">
                      +{(seller.categories?.length ?? 0) - 3}
                    </span>
                  )}
                  {(!seller.categories || seller.categories.length === 0) && (
                    <span className="text-xs text-black/40 italic dark:text-white/40">None</span>
                  )}
                </div>

                {/* Products Count */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      onSelectSeller(seller);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/5 bg-black/[0.03] px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-black/10 dark:border-white/5 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/10"
                  >
                    <PackageIcon className="h-3.5 w-3.5 opacity-60" />
                    {productCount}
                  </button>
                </div>

                {/* Orders Count with direct Click */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      onOpenOrders(seller);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                    title="View Orders for this seller"
                  >
                    <ShoppingBagIcon className="h-3.5 w-3.5" />
                    {orderCount}
                  </button>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase ${getStatusBadge(
                      seller.status,
                    )}`}
                  >
                    {seller.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        onOpenOrders(seller);
                      }}
                      title="View Orders"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 bg-black/5 text-black/70 transition-colors hover:bg-black hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white dark:hover:text-black"
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectSeller(seller);
                      }}
                      title="View Details"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/5 bg-black/5 text-black/70 transition-colors hover:bg-black hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white dark:hover:text-black"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        onEditSeller(seller);
                      }}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete seller "${seller.storeName}"?`,
                          )
                        ) {
                          onDeleteSeller(seller.id);
                        }
                      }}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
