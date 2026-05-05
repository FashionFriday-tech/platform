'use client';

import React from 'react';
import { motion } from 'motion/react';
import { DownloadIcon } from '@ff/ui';
import { ViewMode } from '../hooks/useOrders';

interface OrdersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  dateFilter: string;
  onDateChange: (date: string) => void;
  paymentTypeFilter: string;
  onPaymentTypeChange: (type: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function OrdersFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  paymentTypeFilter,
  onPaymentTypeChange,
  viewMode,
  onViewModeChange,
}: OrdersFilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]"
    >
      <div className="relative max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-4 w-4 text-black/30 dark:text-white/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
          placeholder="Search by order ID or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="cursor-pointer rounded-xl border border-black/5 bg-[#f8f9fa] px-3 py-2 text-sm text-black/70 transition-all outline-none hover:bg-black/5 focus:border-black/30 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:focus:border-white/30"
            title="Filter by date"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="cursor-pointer appearance-none rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-3 text-sm text-black/70 transition-all outline-none hover:bg-black/5 focus:border-black/30 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:focus:border-white/30"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentTypeFilter}
          onChange={(e) => onPaymentTypeChange(e.target.value)}
          className="cursor-pointer appearance-none rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-3 text-sm text-black/70 transition-all outline-none hover:bg-black/5 focus:border-black/30 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:focus:border-white/30"
        >
          <option value="all">All Payment Types</option>
          <option value="cod">Cash on Delivery (COD)</option>
          <option value="prepaid">Prepaid</option>
        </select>

        <div className="flex items-center rounded-xl border border-black/5 bg-[#f8f9fa] p-1 dark:border-white/5 dark:bg-[#1a1a1a]">
          <button
            onClick={() => onViewModeChange('table')}
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
            }`}
            title="Table View"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
            }`}
            title="Card Grid View"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 whitespace-nowrap dark:bg-white dark:text-black dark:hover:bg-white/90">
          <DownloadIcon className="h-4 w-4" />
          Export CSV
        </button>
      </div>
    </motion.div>
  );
}
