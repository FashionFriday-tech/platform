'use client';

import React from 'react';

import { AlertCircleIcon, DownloadIcon, RefreshCcwIcon, SearchIcon, ShieldCheckIcon } from '@ff/ui';

import { type RiskFilterType } from '../types';

interface PaymentFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  methodFilter: string;
  onMethodChange: (method: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  riskFilter: RiskFilterType;
  onRiskFilterChange: (risk: RiskFilterType) => void;
  autoRefreshInterval: number | null;
  onAutoRefreshChange: (sec: number | null) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onExportCsv: () => void;
  totalCount: number;
}

export function PaymentFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  methodFilter,
  onMethodChange,
  dateRange,
  onDateRangeChange,
  riskFilter,
  onRiskFilterChange,
  autoRefreshInterval,
  onAutoRefreshChange,
  isLoading,
  onRefresh,
  onExportCsv,
  totalCount,
}: PaymentFilterBarProps) {
  const statusPills = [
    { key: 'ALL', label: 'All Transactions' },
    { key: 'CAPTURED', label: 'Captured & Settled', dotColor: 'bg-emerald-500' },
    { key: 'AUTHORIZED', label: 'Authorized (Hold)', dotColor: 'bg-amber-500' },
    { key: 'REFUNDED', label: 'Refunded', dotColor: 'bg-indigo-500' },
    { key: 'FAILED', label: 'Failed / Voided', dotColor: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-3">
      {/* Top Bar: Search & Primary Action Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Order #, Payment ID (pay_...), Customer, Phone, Email, Bank RRN..."
            className="w-full rounded-2xl border border-black/10 bg-white/80 py-2.5 pr-28 pl-11 text-xs font-semibold text-black placeholder:text-black/40 focus:border-black/30 focus:outline-hidden dark:border-white/10 dark:bg-[#121212]/80 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30"
          />
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="rounded-full p-1 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                ×
              </button>
            )}
            <span className="rounded-xl bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/50 dark:bg-white/10 dark:text-white/50">
              {totalCount} txns
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => onMethodChange(e.target.value)}
            className="rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-xs font-bold text-black/70 focus:outline-hidden dark:border-white/10 dark:bg-[#121212]/80 dark:text-white/70"
          >
            <option value="ALL">All Methods</option>
            <option value="RAZORPAY">Razorpay (UPI / Card / NetBanking)</option>
            <option value="COD">Cash on Delivery (Advance Deposit)</option>
            <option value="WALLET">Store Wallet</option>
          </select>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-xs font-bold text-black/70 focus:outline-hidden dark:border-white/10 dark:bg-[#121212]/80 dark:text-white/70"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center rounded-2xl border border-black/10 bg-white/80 p-0.5 text-xs font-bold dark:border-white/10 dark:bg-[#121212]/80">
            <button
              type="button"
              onClick={() => onAutoRefreshChange(null)}
              className={`rounded-xl px-2.5 py-1.5 transition-all ${
                autoRefreshInterval === null
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
              }`}
            >
              Manual
            </button>
            <button
              type="button"
              onClick={() => onAutoRefreshChange(15)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 transition-all ${
                autoRefreshInterval === 15
                  ? 'bg-emerald-600 text-white'
                  : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              15s
            </button>
            <button
              type="button"
              onClick={() => onAutoRefreshChange(30)}
              className={`rounded-xl px-2.5 py-1.5 transition-all ${
                autoRefreshInterval === 30
                  ? 'bg-emerald-600 text-white'
                  : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
              }`}
            >
              30s
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-2xl border border-black/10 bg-white/80 px-3.5 py-2 text-xs font-bold text-black transition-all hover:bg-black/5 active:scale-95 disabled:opacity-50 dark:border-white/10 dark:bg-[#121212]/80 dark:text-white dark:hover:bg-white/5"
            title="Reload live payment transactions"
          >
            <RefreshCcwIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 rounded-2xl bg-black px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar: Status Pills & Risk Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Status Pills */}
        <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusPills.map((pill) => {
            const isActive = statusFilter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => onStatusChange(pill.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                    : 'border border-black/5 bg-white/60 text-black/70 hover:bg-black/5 dark:border-white/10 dark:bg-[#121212]/60 dark:text-white/70 dark:hover:bg-white/5'
                }`}
              >
                {pill.dotColor && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-white dark:bg-black' : pill.dotColor
                    }`}
                  />
                )}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Risk / Ops Quick Filter Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onRiskFilterChange(riskFilter === 'EXPIRING' ? 'ALL' : 'EXPIRING')}
            className={`flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-bold transition-all ${
              riskFilter === 'EXPIRING'
                ? 'bg-red-600 text-white shadow-xs'
                : 'border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            <AlertCircleIcon className="h-3 w-3" />
            <span>Expiring Holds (&gt;48h)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onRiskFilterChange(riskFilter === 'NEEDS_CAPTURE' ? 'ALL' : 'NEEDS_CAPTURE')
            }
            className={`flex items-center gap-1 rounded-2xl px-3 py-1.5 text-xs font-bold transition-all ${
              riskFilter === 'NEEDS_CAPTURE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}
          >
            <ShieldCheckIcon className="h-3 w-3" />
            <span>Needs Capture</span>
          </button>
        </div>
      </div>
    </div>
  );
}
