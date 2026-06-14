'use client';

import React, { useEffect, useRef, useState } from 'react';

import { type BrandCategory } from '@ff/schemas';
import { PlusIcon, SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { CustomSelect } from '../../../components/ui/CustomSelect';
import { useBrands } from '../hooks/useBrands';
import { AddBrandModal } from './AddBrandModal';
import { BrandCard } from './BrandCard';
import { BrandDetailsModal } from './BrandDetailsModal';
import { BrandStats } from './BrandStats';

export default function BrandsFeature() {
  const {
    brands,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedBrand,
    setSelectedBrand,
    brandToEdit,
    setBrandToEdit,
    categoryOptions,
    filteredBrands,
    handleSaveBrand,
    handleDeleteBrand,
  } = useBrands();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

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

  const hasActiveFilters = categoryFilter !== 'all';

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <BrandStats brands={brands} />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Top Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-40 flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]"
        >
          {/* Left: Search Input (fills remaining space) */}
          <div className="relative flex-1 min-w-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2 sm:py-2.5 pr-8 pl-9 sm:pl-10 text-xs sm:text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5 truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop Inline Controls (xl:flex) */}
          <div className="hidden xl:flex items-center gap-3">
            <CustomSelect
              options={categoryOptions}
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val as 'all' | BrandCategory);
              }}
              className="z-50 w-48"
            />
          </div>

          {/* Right Controls: Unified Filter Button + Add Brand Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Single Filter Button (Visible on screens < xl) */}
            <div className="relative xl:hidden" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-1 sm:space-x-1.5 rounded-xl border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  hasActiveFilters
                    ? 'border-transparent bg-black text-white shadow-md dark:bg-white dark:text-black'
                    : 'border-black/5 bg-[#f8f9fa] text-black/70 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </button>

              {/* Detailed Filters Modal */}
              {isFilterOpen && (
                <>
                  {/* Mobile Backdrop */}
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
                    onClick={() => setIsFilterOpen(false)}
                  />

                  <div className="fixed inset-x-3 bottom-3 z-50 max-h-[85vh] md:absolute md:top-full md:right-0 md:bottom-auto md:left-auto md:mt-2 md:w-[320px] flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 dark:border-white/10 dark:bg-[#111111]/95">
                    <div className="flex items-center justify-between border-b border-black/5 p-4 pb-3 dark:border-white/5">
                      <h3 className="text-base font-bold text-black dark:text-white">
                        Detailed Filters
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-4">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                          Brand Category
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {categoryOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setCategoryFilter(opt.value as 'all' | BrandCategory)}
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                categoryFilter === opt.value
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
                        onClick={() => setCategoryFilter('all')}
                        className="flex-1 rounded-xl px-4 py-2 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Add Brand Button (Rightmost) */}
            <button
              onClick={() => {
                setBrandToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap text-white shadow-md transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add Brand</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </motion.div>

        {/* Brands Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key="brands-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="scrollbar-hide min-h-0 flex-1 overflow-auto pb-6"
          >
            {filteredBrands.length === 0 ? (
              <div className="flex h-full items-center justify-center text-black/40 dark:text-white/40">
                <p>No brands found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredBrands.map((brand, idx) => (
                  <motion.div
                    key={`${brand.slug}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <BrandCard
                      brand={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setBrandToEdit(null);
        }}
        onSave={handleSaveBrand}
        initialData={brandToEdit}
      />

      <BrandDetailsModal
        isOpen={!!selectedBrand}
        onClose={() => {
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onDelete={handleDeleteBrand}
        onEdit={() => {
          setBrandToEdit(selectedBrand);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
}
