'use client';

import React, { useState } from 'react';

import {
  CloseIcon,
  MailIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  ShoppingBagIcon,
  StoreIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useSellerDetails } from '../hooks/useSellerDetails';
import { type Seller, type SellerStatus } from '../types';
import { SellerOrdersList } from './SellerOrdersList';

interface SellerDetailsModalProps {
  seller: Seller | null;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'overview' | 'products' | 'orders';
  onEdit: (seller: Seller) => void;
  onToggleStatus: (id: string, status: SellerStatus) => void;
}

export function SellerDetailsModal({
  seller,
  isOpen,
  onClose,
  defaultTab = 'overview',
  onEdit,
  onToggleStatus,
}: SellerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>(defaultTab);

  React.useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const { orders, products, isLoadingOrders, isLoadingProducts } = useSellerDetails(seller?.id);

  if (!isOpen || !seller) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121212]"
        >
          {/* Header */}
          <div className="border-b border-black/5 p-6 pb-0 dark:border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-black/5 to-black/15 text-xl font-black text-black dark:from-white/10 dark:to-white/5 dark:text-white">
                  {seller.storeName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-black dark:text-white">
                      {seller.storeName}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                        seller.status === 'ACTIVE'
                          ? 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : seller.status === 'INACTIVE'
                            ? 'border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                            : 'border-rose-500/20 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}
                    >
                      {seller.status}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Contact:{' '}
                    <span className="font-semibold text-black dark:text-white">{seller.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onEdit(seller);
                  }}
                  className="rounded-xl border border-black/10 px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                >
                  Edit Seller
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 flex gap-6">
              {[
                { id: 'overview', label: 'Overview', icon: StoreIcon },
                {
                  id: 'products',
                  label: `Products (${products.length})`,
                  icon: PackageIcon,
                },
                {
                  id: 'orders',
                  label: `Orders (${orders.length})`,
                  icon: ShoppingBagIcon,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as 'overview' | 'products' | 'orders');
                  }}
                  className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'border-black text-black dark:border-white dark:text-white'
                      : 'border-transparent text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact & Store Info Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      <PhoneIcon className="h-3.5 w-3.5" />
                      Phone Number
                    </div>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {seller.phone}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/5 dark:bg-white/[0.02]">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      <MailIcon className="h-3.5 w-3.5" />
                      Email Address
                    </div>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {seller.email ?? 'Not provided'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 sm:col-span-2 dark:border-white/5 dark:bg-white/[0.02]">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      Store / Pickup Address
                    </div>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {seller.address ?? 'No physical address registered'}
                    </p>
                  </div>
                </div>

                {/* Assigned Categories */}
                <div>
                  <h4 className="mb-2.5 text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                    Assigned Selling Categories ({seller.categories?.length ?? 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {seller.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm dark:border-white/10 dark:bg-[#1c1c1c] dark:text-white"
                      >
                        {cat.name}
                        {cat.gender && (
                          <span className="rounded bg-black/5 px-1 text-[10px] text-black/50 uppercase dark:bg-white/10 dark:text-white/50">
                            {cat.gender}
                          </span>
                        )}
                      </span>
                    ))}
                    {(!seller.categories || seller.categories.length === 0) && (
                      <p className="text-sm text-black/40 italic dark:text-white/40">
                        No categories currently assigned.
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Status Control */}
                <div className="rounded-2xl border border-black/5 bg-black/[0.01] p-4 dark:border-white/5 dark:bg-white/[0.01]">
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                    Status Control
                  </h4>
                  <div className="flex items-center gap-3">
                    {(['ACTIVE', 'INACTIVE', 'SUSPENDED'] as SellerStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onToggleStatus(seller.id, st);
                        }}
                        className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold uppercase transition-all ${
                          seller.status === st
                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                            : 'border-black/10 bg-white text-black/60 hover:bg-black/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white/60 dark:hover:bg-white/5'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                {isLoadingProducts ? (
                  <div className="flex h-48 items-center justify-center text-sm text-black/50 dark:text-white/50">
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-black/5 p-6 text-center dark:border-white/5">
                    <PackageIcon className="mb-2 h-8 w-8 text-black/20 dark:text-white/20" />
                    <p className="text-sm font-semibold text-black dark:text-white">
                      No products linked
                    </p>
                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                      No products are currently assigned to this seller. Select this seller when
                      creating or editing products.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-[#181818]"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                          {p.mainImage ? (
                            <img
                              src={p.mainImage}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-black/30 dark:text-white/30">
                              FF
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-black dark:text-white">
                            {p.name}
                          </p>
                          <p className="text-xs text-black/50 dark:text-white/50">
                            ₹{Number(p.sellingPrice).toLocaleString('en-IN')} &middot; Stock:{' '}
                            {p.totalStock}
                          </p>
                        </div>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            p.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <SellerOrdersList
                orders={orders}
                isLoading={isLoadingOrders}
                sellerStoreName={seller.storeName}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
