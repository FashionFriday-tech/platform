'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { GlobeIcon, InstagramIcon, MailIcon, PhoneIcon, StoreIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { type Seller, type SellerStatus } from '../types';

interface SellersTableProps {
  sellers: Seller[];
  isLoading: boolean;
  onSelectSeller?: (seller: Seller) => void;
  onEditSeller?: (seller: Seller) => void;
  onDeleteSeller?: (id: string) => void;
  onToggleStatus?: (id: string, status: SellerStatus) => void;
  onOpenOrders?: (seller: Seller) => void;
}

export function SellersTable({ sellers, isLoading, onSelectSeller }: SellersTableProps) {
  const router = useRouter();

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

  const getStatusBorder = (status: SellerStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'border-emerald-500 dark:border-emerald-400';
      case 'INACTIVE':
        return 'border-zinc-400 dark:border-zinc-500';
      case 'SUSPENDED':
        return 'border-amber-500 dark:border-amber-400';
      default:
        return 'border-zinc-400 dark:border-zinc-500';
    }
  };

  const getStatusDot = (status: SellerStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-500';
      case 'INACTIVE':
        return 'bg-zinc-400';
      case 'SUSPENDED':
        return 'bg-amber-500';
      default:
        return 'bg-zinc-400';
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-slate-50/50 p-2.5 shadow-xs dark:border-white/10 dark:bg-black/20">
      <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[860px] flex-col gap-2.5 pb-2">
          {/* Header Tab - Fixed / Sticky on Top (Black in Light Mode) */}
          <div className="sticky top-0 z-20 pb-0.5">
            <div className="grid grid-cols-[minmax(240px,2.4fr)_minmax(180px,1.8fr)_minmax(160px,1.5fr)_minmax(80px,0.8fr)_minmax(80px,0.8fr)_minmax(90px,0.9fr)] items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-white shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Store & Contact
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Contact Details
              </div>
              <div className="text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Website
              </div>
              <div className="text-center text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Products
              </div>
              <div className="text-center text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Orders
              </div>
              <div className="text-center text-xs font-semibold tracking-wider text-white/60 uppercase select-none dark:text-black/60">
                Complaints
              </div>
            </div>
          </div>

          {/* Row Tabs (White in Light Mode, Click opens detail page) */}
          {sellers.map((seller) => {
            const productCount = seller._count?.products ?? seller.productCount ?? 0;
            const orderCount = seller._count?.orderItems ?? seller.orderCount ?? 0;
            const complaintsCount = seller.complaintsCount ?? seller._count?.complaints ?? 0;

            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (onSelectSeller) {
                    onSelectSeller(seller);
                  }
                  router.push(`/sellers/${seller.id}`);
                }}
                className="group grid cursor-pointer grid-cols-[minmax(240px,2.4fr)_minmax(180px,1.8fr)_minmax(160px,1.5fr)_minmax(80px,0.8fr)_minmax(80px,0.8fr)_minmax(90px,0.9fr)] items-center rounded-xl border border-black/5 bg-white px-6 py-3.5 text-black shadow-xs transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.995] dark:border-white/10 dark:bg-[#141417] dark:text-white dark:shadow-sm dark:hover:border-white/20"
              >
                {/* Store & Contact */}
                <div className="flex min-w-0 items-center gap-3 pr-4">
                  <div
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed ${getStatusBorder(
                      seller.status,
                    )} p-[2.5px] transition-transform group-hover:scale-105`}
                    title={`Status: ${seller.status}`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-sm font-bold text-white dark:bg-white dark:text-black">
                      {seller.storeName.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#141417] ${getStatusDot(
                        seller.status,
                      )}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-black transition-colors group-hover:underline dark:text-white">
                      {seller.storeName}
                    </p>
                    <p className="truncate text-xs text-black/50 dark:text-white/50">
                      {seller.name}
                    </p>
                  </div>
                </div>

                {/* Contact Info with Call, Email, Instagram */}
                <div
                  className="flex min-w-0 flex-col gap-1 pr-4"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${seller.phone}`}
                      className="flex items-center gap-1.5 truncate text-xs font-medium text-black transition-colors hover:underline dark:text-white"
                      title={`Call ${seller.phone}`}
                    >
                      <PhoneIcon className="h-3.5 w-3.5 text-black/40 dark:text-white/40" />
                      <span className="truncate">{seller.phone}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {seller.email && (
                      <a
                        href={`mailto:${seller.email}`}
                        className="flex items-center gap-1.5 truncate text-xs text-black/50 transition-colors hover:underline dark:text-white/50"
                        title={`Email ${seller.email}`}
                      >
                        <MailIcon className="h-3 w-3 text-black/40 dark:text-white/40" />
                        <span className="truncate">{seller.email}</span>
                      </a>
                    )}
                    {seller.instagram && (
                      <a
                        href={
                          seller.instagram.startsWith('http://') ||
                          seller.instagram.startsWith('https://')
                            ? seller.instagram
                            : `https://instagram.com/${seller.instagram.replace(/^@/, '')}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 transition-transform hover:scale-110 dark:text-pink-400"
                        title={`Instagram: ${seller.instagram}`}
                      >
                        <InstagramIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div
                  className="min-w-0 pr-4"
                  onClick={(e) => {
                    if (seller.website) {
                      e.stopPropagation();
                    }
                  }}
                >
                  {seller.website ? (
                    <a
                      href={
                        seller.website.startsWith('http://') ||
                        seller.website.startsWith('https://')
                          ? seller.website
                          : `https://${seller.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1.5 truncate text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                      title={seller.website}
                    >
                      <GlobeIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">
                        {seller.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </span>
                    </a>
                  ) : (
                    <span className="text-xs text-black/30 dark:text-white/30">-</span>
                  )}
                </div>

                {/* Products Count */}
                <div className="text-center text-sm font-semibold text-black dark:text-white">
                  {productCount}
                </div>

                {/* Orders Count */}
                <div className="text-center text-sm font-semibold text-black dark:text-white">
                  {orderCount}
                </div>

                {/* Complaints Count */}
                <div className="text-center text-sm font-semibold">
                  <span
                    className={
                      complaintsCount > 0
                        ? 'font-bold text-rose-600 dark:text-rose-400'
                        : 'text-black/70 dark:text-white/70'
                    }
                  >
                    {complaintsCount}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
