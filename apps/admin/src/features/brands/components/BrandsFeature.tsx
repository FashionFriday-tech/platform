'use client';

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

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <BrandStats brands={brands} />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Top Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-4 xl:flex-row xl:items-center xl:justify-between dark:border-white/5 dark:bg-[#111111]"
        >
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect
              options={categoryOptions}
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
              }}
              className="z-50 w-48"
            />

            <button
              onClick={() => {
                setBrandToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <PlusIcon className="h-4 w-4" />
              Add Brand
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
