'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close popup on click outside (desktop)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const hasActiveFilters =
    Boolean(statusFilter && statusFilter !== 'all') ||
    Boolean(dateFilter) ||
    Boolean(paymentTypeFilter && paymentTypeFilter !== 'all');

  const activeFilterCount =
    (statusFilter && statusFilter !== 'all' ? 1 : 0) +
    (dateFilter ? 1 : 0) +
    (paymentTypeFilter && paymentTypeFilter !== 'all' ? 1 : 0);

  const handleClear = () => {
    onStatusChange('all');
    onDateChange('');
    onPaymentTypeChange('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-40 flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]"
    >
      {/* Left: View Mode (desktop) + Search Input (fills remaining space) */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="hidden items-center rounded-xl border border-black/5 bg-[#f8f9fa] p-1 md:flex dark:border-white/5 dark:bg-[#1a1a1a]">
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

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5">
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
            className="block w-full truncate rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-9 text-xs text-black placeholder-black/35 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:py-2.5 sm:pl-10 sm:text-sm dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/35 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Inline Filters (xl:flex) */}
      <div className="hidden items-center gap-2.5 xl:flex">
        <CustomDatePicker
          value={dateFilter}
          onChange={onDateChange}
          placeholder="Filter by date"
          className="min-w-[150px]"
        />
        <CustomSelect
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="All Statuses"
          size="sm"
          className="min-w-[150px]"
        />
        <CustomSelect
          options={PAYMENT_OPTIONS}
          value={paymentTypeFilter}
          onChange={onPaymentTypeChange}
          placeholder="All Payments"
          size="sm"
          className="min-w-[150px]"
        />
      </div>

      {/* Right: Unified Filters Button + Export Button */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Single Filter Button (Visible on screens < xl) */}
        <div className="relative xl:hidden" ref={filterRef}>
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
            }}
            className={`flex items-center space-x-1 rounded-xl border px-2.5 py-2 text-xs font-medium transition-all sm:space-x-1.5 sm:px-3 sm:text-sm ${
              hasActiveFilters
                ? 'border-transparent bg-black text-white shadow-md dark:bg-white dark:text-black'
                : 'border-black/5 bg-[#f8f9fa] text-black/70 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
          >
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Detailed Filters Modal */}
          {isFilterOpen && (
            <>
              {/* Mobile Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
                onClick={() => {
                  setIsFilterOpen(false);
                }}
              />

              <div className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:mt-2 md:w-[340px] dark:border-white/10 dark:bg-[#111111]/95">
                <div className="flex items-center justify-between border-b border-black/5 p-4 pb-3 dark:border-white/5">
                  <h3 className="text-base font-bold text-black dark:text-white">
                    Detailed Filters
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFilterOpen(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                  {/* Mobile-Only View Mode */}
                  <div className="md:hidden">
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      View Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onViewModeChange('table');
                        }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                          viewMode === 'table'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60'
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        <span>Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onViewModeChange('grid');
                        }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                          viewMode === 'grid'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60'
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                        <span>Grid</span>
                      </button>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Date Range
                    </label>
                    <CustomDatePicker
                      value={dateFilter}
                      onChange={onDateChange}
                      placeholder="Select date"
                      className="w-full"
                    />
                  </div>

                  {/* Order Status */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Order Status
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onStatusChange(opt.value);
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            statusFilter === opt.value
                              ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Payment Type
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onPaymentTypeChange(opt.value);
                          }}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            paymentTypeFilter === opt.value
                              ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center space-x-3 border-t border-black/10 bg-white/5 p-4 backdrop-blur-md dark:border-white/10 dark:bg-black/5">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 rounded-xl px-4 py-2 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFilterOpen(false);
                    }}
                    className="flex-1 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export Action Button (Rightmost) */}
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-sm transition-all hover:bg-black/85 active:scale-95 sm:px-4 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <DownloadIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </motion.div>
  );
}
