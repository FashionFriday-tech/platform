'use client';

import React from 'react';
import Link from 'next/link';

import { useProductActionBar } from '../hooks/useProductActionBar';
import { type AdvancedFilters, type ColumnId, type ProductStatus, type ViewMode } from '../types';

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
  visibleColumns: Set<ColumnId>;
  toggleColumn: (col: ColumnId) => void;
  appliedAdvancedFilters: AdvancedFilters;
  setAppliedAdvancedFilters: (val: AdvancedFilters) => void;
}

const ALL_COLUMNS: ColumnId[] = [
  'Category',
  'Cost Price',
  'OG Price',
  'Variants',
  'Sales',
  'Date Added',
  'Stock',
];

export function ProductActionBar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  visibleColumns,
  toggleColumn,
  appliedAdvancedFilters,
  setAppliedAdvancedFilters,
}: Props) {
  const {
    isFilterOpen,
    setIsFilterOpen,
    localFilters,
    setLocalFilters,
    popupRef,
    toggleCategory,
    toggleStore,
    toggleStatus,
    applyFilters,
    clearFilters,
    isAdvancedActive,
  } = useProductActionBar(appliedAdvancedFilters, setAppliedAdvancedFilters);

  return (
    <div className="relative z-30 flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]">
      {/* Left: View Mode (desktop) + Search Input (fills remaining width) */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="hidden rounded-xl border border-black/5 bg-[#f8f9fa] p-1 md:flex dark:border-white/5 dark:bg-[#1a1a1a]">
          <button
            type="button"
            onClick={() => {
              setViewMode('list');
            }}
            aria-label="List View"
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
            }`}
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
            type="button"
            onClick={() => {
              setViewMode('grid');
            }}
            aria-label="Grid View"
            className={`rounded-lg p-1.5 transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white'
                : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'
            }`}
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

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5">
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="block w-full truncate rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-9 text-xs text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 sm:py-2.5 sm:pl-10 sm:text-sm dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
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

      {/* Right Side: Columns (desktop) + Single Filter Button + Add Button */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Columns Dropdown (Desktop Only) */}
        <div className="group relative z-40 hidden cursor-pointer items-center space-x-2 rounded-xl border border-black/5 bg-[#f8f9fa] px-3.5 py-2 text-sm font-medium whitespace-nowrap text-black/70 transition-colors hover:bg-black/5 hover:text-black md:flex dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <span>Columns</span>

          <div className="invisible absolute top-full right-0 z-50 mt-2 flex w-48 flex-col rounded-2xl border border-black/10 bg-white/95 p-3 opacity-0 shadow-2xl backdrop-blur-2xl transition-all group-hover:visible group-hover:opacity-100 dark:border-white/10 dark:bg-[#111111]/95">
            {ALL_COLUMNS.map((col) => (
              <label
                key={col}
                className="flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2 text-sm text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.has(col)}
                  onChange={() => {
                    toggleColumn(col);
                  }}
                  className="rounded border-black/20 text-black focus:ring-black/20 dark:border-white/20 dark:text-white dark:focus:ring-white/20"
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Single Filter Button (Opens Detailed Filters Box) */}
        <div className="relative" ref={popupRef}>
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
            }}
            className={`flex items-center space-x-1 rounded-xl border px-2.5 py-2 text-xs font-medium transition-all sm:space-x-1.5 sm:px-3.5 sm:text-sm ${
              isAdvancedActive
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
            {isAdvancedActive && <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" />}
          </button>

          {/* Detailed Filters Modal (Bottom Drawer on Mobile, Popover on Desktop) */}
          {isFilterOpen && (
            <>
              {/* Mobile Backdrop Overlay */}
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
                  {/* Mobile-Only View Mode Selector */}
                  <div className="md:hidden">
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      View Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('list');
                        }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                          viewMode === 'list'
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
                        <span>List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('grid');
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

                  {/* Mobile-Only Columns Selector */}
                  <div className="md:hidden">
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Visible Columns
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_COLUMNS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => {
                            toggleColumn(col);
                          }}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                            visibleColumns.has(col)
                              ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Dual Slider */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                        Price Range (₹)
                      </label>
                      <div className="flex items-center space-x-1 rounded-md bg-black/5 px-2 py-0.5 text-xs font-bold text-black dark:bg-white/10 dark:text-white">
                        <span>{localFilters.minPrice ?? '0'}</span>
                        <span className="text-black/30 dark:text-white/30">-</span>
                        <span>{localFilters.maxPrice ?? '10000'}</span>
                      </div>
                    </div>

                    <div className="relative mt-2 flex h-6 items-center">
                      <div className="absolute h-1.5 w-full rounded-lg bg-black/10 dark:bg-white/10" />
                      <div
                        className="absolute h-1.5 rounded-lg bg-black dark:bg-white"
                        style={{
                          left: `${(Number(localFilters.minPrice ?? 0) / 10000) * 100}%`,
                          right: `${100 - (Number(localFilters.maxPrice ?? 10000) / 10000) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={localFilters.minPrice ?? '0'}
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            Number(localFilters.maxPrice ?? 10000) - 100,
                          );
                          setLocalFilters({ ...localFilters, minPrice: val.toString() });
                        }}
                        className="pointer-events-none absolute z-10 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white dark:[&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:bg-black"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={localFilters.maxPrice ?? '10000'}
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            Number(localFilters.minPrice ?? 0) + 100,
                          );
                          setLocalFilters({ ...localFilters, maxPrice: val.toString() });
                        }}
                        className="pointer-events-none absolute z-20 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white dark:[&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:bg-black"
                      />
                    </div>

                    <div className="mt-1 flex justify-between px-1 text-[10px] text-black/40 dark:text-white/40">
                      <span>0</span>
                      <span>10K</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Outerwear', 'Footwear', 'Shirts', 'Sneakers'].map((cat) => (
                        <label
                          key={cat}
                          className="group flex cursor-pointer items-center space-x-2"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(cat);
                          }}
                        >
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                              localFilters.categories.has(cat)
                                ? 'border-black bg-black dark:border-white dark:bg-white'
                                : 'border-black/20 group-hover:border-black/60 dark:border-white/20 dark:group-hover:border-white/60'
                            }`}
                          >
                            {localFilters.categories.has(cat) && (
                              <svg
                                className="h-2.5 w-2.5 text-white dark:text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs text-black/80 select-none dark:text-white/80">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Store */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Store
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Main Store', 'Odama Store'].map((store) => (
                        <label
                          key={store}
                          className="group flex cursor-pointer items-center space-x-2"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleStore(store);
                          }}
                        >
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                              localFilters.stores?.has(store)
                                ? 'border-black bg-black dark:border-white dark:bg-white'
                                : 'border-black/20 group-hover:border-black/60 dark:border-white/20 dark:group-hover:border-white/60'
                            }`}
                          >
                            {localFilters.stores?.has(store) && (
                              <svg
                                className="h-2.5 w-2.5 text-white dark:text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs text-black/80 select-none dark:text-white/80">
                            {store}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['Active', 'Inactive', 'Draft'] as ProductStatus[]).map((status) => (
                        <div
                          key={status}
                          onClick={() => {
                            toggleStatus(status);
                          }}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            localFilters.statuses.has(status)
                              ? 'border-transparent bg-black text-white dark:bg-white dark:text-black'
                              : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                          }`}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions - Sticky at bottom */}
                <div className="flex items-center space-x-3 border-t border-black/10 bg-white/5 p-4 backdrop-blur-md dark:border-white/10 dark:bg-black/5">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 rounded-xl px-4 py-2 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Product Button (Rightmost) */}
        <Link
          href="/products/add"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-md transition-all hover:bg-black/90 active:scale-95 sm:px-4 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="hidden sm:inline">Add new product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </div>
  );
}
