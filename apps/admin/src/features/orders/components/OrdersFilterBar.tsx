'use client';

import React from 'react';

import { DownloadIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomSelect, type SelectOption } from '@/components/ui/CustomSelect';

import { type ViewMode } from '../hooks/useOrders';

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

const STATUS_OPTIONS: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Order Placed', value: 'pending', badge: 'Pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Placed with Seller', value: 'processing', badge: 'Seller' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PAYMENT_OPTIONS: SelectOption[] = [
  { label: 'All Payments', value: 'all' },
  { label: 'Cash on Delivery (COD)', value: 'cod' },
  { label: 'Prepaid', value: 'prepaid' },
];

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
      className="relative z-40 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]"
    >
      {/* Search Input */}
      <div className="relative max-w-md min-w-[240px] flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg
            className="h-4 w-4 text-black/35 dark:text-white/35"
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
          className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-4 pl-10 text-sm text-black placeholder-black/35 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/35 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
          placeholder="Search order ID or customer..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
        />
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Custom Calendar Date Picker */}
        <CustomDatePicker
          value={dateFilter}
          onChange={onDateChange}
          placeholder="Filter by date"
          className="min-w-[150px]"
        />

        {/* Custom Status Dropdown */}
        <CustomSelect
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="All Statuses"
          size="sm"
          className="min-w-[150px]"
        />

        {/* Custom Payment Type Dropdown */}
        <CustomSelect
          options={PAYMENT_OPTIONS}
          value={paymentTypeFilter}
          onChange={onPaymentTypeChange}
          placeholder="All Payments"
          size="sm"
          className="min-w-[150px]"
        />

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-xl border border-black/5 bg-[#f8f9fa] p-1 dark:border-white/5 dark:bg-[#1a1a1a]">
          <button
            type="button"
            onClick={() => {
              onViewModeChange('table');
            }}
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
            }`}
            title="Table View"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              onViewModeChange('grid');
            }}
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
            }`}
            title="Card Grid View"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>

        {/* Export Action */}
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3.5 py-2 text-xs font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-black/85 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </motion.div>
  );
}
