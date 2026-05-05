import { ViewMode, ColumnId, AdvancedFilters, ProductStatus } from '../types';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

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

import { useProductActionBar } from '../hooks/useProductActionBar';

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
    <div className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex rounded-xl border border-black/5 bg-[#f8f9fa] p-1 dark:border-white/5 dark:bg-[#1a1a1a]">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-1.5 transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white' : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'}`}
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
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-1.5 transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-black shadow-sm dark:bg-[#2a2a2a] dark:text-white' : 'text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white'}`}
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
            placeholder="Search products by name, SKU or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Columns Dropdown */}
        <div className="group relative z-50 flex cursor-pointer items-center space-x-2 rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <span>Columns</span>

          <div className="invisible absolute top-full right-0 z-50 mt-3 flex w-48 flex-col rounded-2xl border border-black/10 bg-white/95 p-3 opacity-0 shadow-2xl backdrop-blur-2xl transition-all group-hover:visible group-hover:opacity-100 dark:border-white/10 dark:bg-[#111111]/95">
            {(
              [
                'Category',
                'Cost Price',
                'OG Price',
                'Variants',
                'Sales',
                'Date Added',
                'Stock',
              ] as ColumnId[]
            ).map((col) => (
              <label
                key={col}
                className="flex cursor-pointer items-center space-x-3 rounded-lg px-3 py-2 text-sm text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.has(col)}
                  onChange={() => toggleColumn(col)}
                  className="rounded border-black/20 text-black focus:ring-black/20 dark:border-white/20 dark:text-white dark:focus:ring-white/20"
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Filter Pop-up Trigger */}
        <div className="relative z-40" ref={popupRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${isAdvancedActive ? 'border-transparent bg-black text-white shadow-md dark:bg-white dark:text-black' : 'border-black/5 bg-[#f8f9fa] text-black/70 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters</span>
            {isAdvancedActive && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {isFilterOpen && (
            <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-3 flex max-h-[70vh] w-[320px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 dark:border-white/10 dark:bg-[#111111]/95">
              <div className="scrollbar-hide flex-1 overflow-y-auto p-5">
                <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                  Detailed Filters
                </h3>

                <div className="space-y-5">
                  {/* Price Range Dual Slider */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-black/70 dark:text-white/70">
                        Price Range (₹)
                      </label>
                      <div className="flex items-center space-x-1 rounded-md bg-black/5 px-2 py-0.5 text-xs font-bold text-black dark:bg-white/10 dark:text-white">
                        <span>{localFilters.minPrice || '0'}</span>
                        <span className="text-black/30 dark:text-white/30">-</span>
                        <span>{localFilters.maxPrice || '10000'}</span>
                      </div>
                    </div>

                    <div className="relative mt-2 flex h-6 items-center">
                      {/* Track background */}
                      <div className="absolute h-1.5 w-full rounded-lg bg-black/10 dark:bg-white/10"></div>

                      {/* Highlight between min and max */}
                      <div
                        className="absolute h-1.5 rounded-lg bg-black dark:bg-white"
                        style={{
                          left: `${(Number(localFilters.minPrice || 0) / 10000) * 100}%`,
                          right: `${100 - (Number(localFilters.maxPrice || 10000) / 10000) * 100}%`,
                        }}
                      ></div>

                      {/* Min Slider */}
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={localFilters.minPrice || '0'}
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            Number(localFilters.maxPrice || 10000) - 100,
                          );
                          setLocalFilters({ ...localFilters, minPrice: val.toString() });
                        }}
                        className="pointer-events-none absolute z-10 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white dark:[&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:bg-black"
                      />

                      {/* Max Slider */}
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={localFilters.maxPrice || '10000'}
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            Number(localFilters.minPrice || 0) + 100,
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
                    <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
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
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${localFilters.categories.has(cat) ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/20 group-hover:border-black/60 dark:border-white/20 dark:group-hover:border-white/60'}`}
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
                          <span className="text-sm text-black/80 select-none dark:text-white/80">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Store */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
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
                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${localFilters.stores?.has(store) ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/20 group-hover:border-black/60 dark:border-white/20 dark:group-hover:border-white/60'}`}
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
                          <span className="text-sm text-black/80 select-none dark:text-white/80">
                            {store}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['Active', 'Inactive', 'Draft'] as ProductStatus[]).map((status) => (
                        <div
                          key={status}
                          onClick={() => toggleStatus(status)}
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${localFilters.statuses.has(status) ? 'border-transparent bg-black text-white dark:bg-white dark:text-black' : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'}`}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions - Sticky at bottom */}
              <div className="flex items-center space-x-3 border-t border-black/10 bg-white/5 p-5 backdrop-blur-md dark:border-white/10 dark:bg-black/5">
                <button
                  onClick={clearFilters}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Clear
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/products/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 whitespace-nowrap dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add new product</span>
        </Link>
      </div>
    </div>
  );
}
