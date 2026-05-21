'use client';

import { SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { AddCategoryModal } from './AddCategoryModal';

export default function CategoriesFeature() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGender,
    setSelectedGender,
    genders,
    filteredCategories,
    isAddModalOpen,
    setIsAddModalOpen,
    categoryToEdit,
    setCategoryToEdit,
    handleSaveCategory,
  } = useCategories();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Bar for Search and Filtering */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Gender Tabs */}
        <div className="flex space-x-1 rounded-xl bg-black/5 p-1 dark:bg-white/5">
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => {
                setSelectedGender(gender);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedGender === gender
                  ? 'bg-white text-black shadow-sm dark:bg-black dark:text-white'
                  : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex w-full items-center gap-3 sm:max-w-md">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-10 text-sm text-black placeholder-black/40 transition-colors outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
            />
          </div>
          <button
            onClick={() => {
              setCategoryToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-auto pb-6">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-24 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              No categories found.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredCategories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialData={categoryToEdit}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
