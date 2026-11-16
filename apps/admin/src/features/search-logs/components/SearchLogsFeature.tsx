'use client';

import React from 'react';

import {
  AlertCircleIcon,
  CheckCircleIcon,
  RefreshCcwIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { type SearchLogFilterType, useSearchLogs } from '../hooks/useSearchLogs';
import { SearchLogsTable } from './SearchLogsTable';

export default function SearchLogsFeature() {
  const {
    filteredLogs,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    refreshLogs,
    stats,
  } = useSearchLogs();

  const statCards = [
    {
      name: 'Total Searches',
      value: stats.totalCount,
      subLabel: 'ALL TIME',
      dotColor: 'bg-violet-400',
      icon: SearchIcon,
      filter: 'all' as SearchLogFilterType,
    },
    {
      name: 'With Results',
      value: stats.hasResultsCount,
      subLabel: 'FOUND MATCHES',
      dotColor: 'bg-emerald-400',
      icon: CheckCircleIcon,
      filter: 'results' as SearchLogFilterType,
    },
    {
      name: 'Zero Results',
      value: stats.noResultsCount,
      subLabel: 'NO MATCHES',
      dotColor: 'bg-rose-400',
      icon: AlertCircleIcon,
      filter: 'no_results' as SearchLogFilterType,
    },
    {
      name: 'Members',
      value: stats.loggedInCount,
      subLabel: 'LOGGED IN',
      dotColor: 'bg-blue-400',
      icon: UsersIcon,
      filter: 'members' as SearchLogFilterType,
    },
    {
      name: 'Guests',
      value: stats.guestCount,
      subLabel: 'ANONYMOUS',
      dotColor: 'bg-amber-400',
      icon: UserIcon,
      filter: 'guests' as SearchLogFilterType,
    },
  ];

  const filterTabs: { label: string; value: SearchLogFilterType; count: number }[] = [
    { label: 'All', value: 'all', count: stats.totalCount },
    { label: 'With Results', value: 'results', count: stats.hasResultsCount },
    { label: 'No Results', value: 'no_results', count: stats.noResultsCount },
    { label: 'Members', value: 'members', count: stats.loggedInCount },
    { label: 'Guests', value: 'guests', count: stats.guestCount },
  ];

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Stats Cards */}
      <div className="scrollbar-hide flex w-full shrink-0 gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
        {statCards.map((stat, i) => {
          const isSelected = activeFilter === stat.filter;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => {
                setActiveFilter(isSelected && stat.filter !== 'all' ? 'all' : stat.filter);
              }}
              className={`group relative flex min-w-[170px] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-200 select-none sm:min-w-0 sm:shrink ${
                isSelected
                  ? 'border-violet-500/50 bg-gradient-to-br from-[#12121c] via-[#1a1728] to-[#141220] text-white shadow-md ring-2 ring-violet-500/30 dark:border-violet-500/40 dark:bg-violet-500/5 dark:text-black'
                  : 'border-white/10 bg-gradient-to-br from-black via-[#0d0d10] to-[#1c1c24] text-white shadow-lg hover:border-white/20 dark:border-black/10 dark:bg-white dark:from-white dark:via-[#fafafa] dark:to-[#f0f0f0] dark:text-black dark:shadow-sm dark:hover:border-black/20'
              }`}
            >
              {/* Watermark */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <stat.icon className="absolute -right-2 -bottom-2 h-16 w-16 text-white/[0.04] dark:text-black/[0.04]" />
                <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.03] blur-xl dark:bg-black/[0.02]" />
              </div>

              {/* Top Row */}
              <div className="relative z-10 flex items-center justify-between">
                <dt className="text-[11px] font-bold tracking-wider text-white/70 uppercase dark:text-black/60">
                  {stat.name}
                </dt>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md dark:bg-black/5 dark:text-black">
                  <stat.icon className="h-3 w-3" />
                </div>
              </div>

              {/* Bottom Row */}
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
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-3.5 md:flex-row md:items-center md:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          {/* Search input & Filter Tabs */}
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
              </div>
              <input
                id="search-logs-filter"
                type="text"
                placeholder="Filter by query, user, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-4 pl-11 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
              />
            </div>

            {/* Quick Filter Tabs */}
            <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setActiveFilter(tab.value);
                    }}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border border-black bg-black text-white shadow-xs dark:border-white dark:bg-white dark:text-black'
                        : 'border border-black/5 bg-slate-50 text-black/60 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                          : 'bg-black/10 text-black/60 dark:bg-white/10 dark:text-white/60'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {/* Count badge */}
            <span className="hidden items-center gap-1.5 rounded-xl border border-black/5 bg-slate-50 px-3 py-2 text-xs font-semibold text-black/50 lg:flex dark:border-white/5 dark:bg-white/5 dark:text-white/50">
              <ZapIcon className="h-3.5 w-3.5" />
              {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}
            </span>

            {/* Refresh */}
            <button
              onClick={refreshLogs}
              id="search-logs-refresh"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 transition-all hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              title="Refresh"
            >
              <RefreshCcwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key="search-logs-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-0 flex-1"
          >
            <SearchLogsTable logs={filteredLogs} isLoading={isLoading} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
