'use client';

import React from 'react';
import Image from 'next/image';

import {
  ActivityIcon,
  CalendarIcon,
  MailIcon,
  PackageIcon,
  PhoneIcon,
  RefreshCcwIcon,
  SearchIcon,
  UsersIcon,
  ZapIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useProductRequests } from '../hooks/useProductRequests';

export function ProductRequestsFeature() {
  const { filteredRequests, isLoading, searchQuery, setSearchQuery, refreshRequests, stats } =
    useProductRequests();

  const statCards = [
    {
      name: 'Total Requests',
      value: stats.total,
      subLabel: 'ALL TIME',
      dotColor: 'bg-rose-400',
      icon: PackageIcon,
    },
    {
      name: 'This Week',
      value: stats.thisWeek,
      subLabel: '7 DAYS',
      dotColor: 'bg-violet-400',
      icon: ZapIcon,
    },
    {
      name: 'This Month',
      value: stats.thisMonth,
      subLabel: '30 DAYS',
      dotColor: 'bg-blue-400',
      icon: ActivityIcon,
    },
    {
      name: 'Unique Customers',
      value: stats.uniqueUsers,
      subLabel: 'USERS',
      dotColor: 'bg-emerald-400',
      icon: UsersIcon,
    },
  ];

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Stats Cards */}
      <div className="scrollbar-hide flex w-full shrink-0 gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="group relative flex min-w-[200px] shrink-0 cursor-default flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] px-4 py-3 text-white shadow-lg sm:min-w-0 sm:shrink dark:border-black/10 dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm"
          >
            {/* Watermark icon */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <stat.icon className="absolute -right-2 -bottom-2 h-16 w-16 text-white/[0.04] dark:text-black/[0.04]" />
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.03] blur-xl dark:bg-black/[0.02]" />
            </div>

            {/* Top row */}
            <div className="relative z-10 flex items-center justify-between">
              <dt className="text-[11px] font-bold tracking-wider text-white/70 uppercase dark:text-black/60">
                {stat.name}
              </dt>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md dark:bg-black/5 dark:text-black">
                <stat.icon className="h-3 w-3" />
              </div>
            </div>

            {/* Bottom row */}
            <div className="relative z-10 mt-2 flex items-baseline justify-between gap-2">
              <dd className="text-2xl font-black tracking-tight text-white md:text-3xl dark:text-black">
                {stat.value}
              </dd>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stat.dotColor}`} />
                <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase dark:text-black/40">
                  {stat.subLabel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              id="product-requests-search"
              type="text"
              placeholder="Search by product name or customer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 outline-none transition-all focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-xl border border-black/5 bg-slate-50 px-3 py-2 text-xs font-semibold text-black/50 sm:flex dark:border-white/5 dark:bg-white/5 dark:text-white/50">
              <PackageIcon className="h-3.5 w-3.5" />
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={refreshRequests}
              id="product-requests-refresh"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 transition-all hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              title="Refresh"
            >
              <RefreshCcwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Grid / Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="product-requests-body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="scrollbar-hide min-h-0 flex-1 overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#141417]">
                <div className="flex flex-col items-center gap-2 text-black/40 dark:text-white/40">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
                  <span className="text-sm">Loading requests...</span>
                </div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#141417]">
                <PackageIcon className="h-8 w-8 text-black/20 dark:text-white/20" />
                <p className="text-base font-semibold text-black/40 dark:text-white/40">
                  No Sourcing Requests Found
                </p>
                <p className="text-xs text-black/30 dark:text-white/30">
                  Customer requests will show up here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRequests.map((request, i) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xs transition-all duration-300 hover:border-black/10 hover:shadow-md dark:border-white/5 dark:bg-[#141417] dark:hover:border-white/10"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                      <Image
                        src={request.imageUrl}
                        alt={request.productName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Tag overlay */}
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-rose-600 uppercase backdrop-blur-sm dark:bg-rose-500/20 dark:text-rose-300">
                          Sourcing Request
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 p-4">
                      <h4 className="truncate text-sm font-black tracking-tight uppercase text-black dark:text-white">
                        {request.productName}
                      </h4>

                      <div className="space-y-2 border-t border-black/5 pt-3 dark:border-white/5">
                        {/* Customer name */}
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-black text-white dark:bg-white dark:text-black">
                            {(request.user?.name ?? 'A').charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate text-xs font-semibold text-black dark:text-white">
                            {request.user?.name ?? 'Anonymous'}
                          </span>
                        </div>

                        {/* Phone */}
                        {request.user?.phone && (
                          <a
                            href={`tel:${request.user.phone}`}
                            className="flex items-center gap-2 truncate text-xs text-black/50 transition-colors hover:text-rose-600 dark:text-white/50 dark:hover:text-rose-400"
                          >
                            <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{request.user.phone}</span>
                          </a>
                        )}

                        {/* Email */}
                        {request.user?.email && (
                          <a
                            href={`mailto:${request.user.email}`}
                            className="flex items-center gap-2 truncate text-xs text-black/50 transition-colors hover:text-rose-600 dark:text-white/50 dark:hover:text-rose-400"
                          >
                            <MailIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{request.user.email}</span>
                          </a>
                        )}

                        {/* Date */}
                        <div className="flex items-center gap-2 pt-0.5 text-[10px] text-black/30 dark:text-white/30">
                          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {new Date(request.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
