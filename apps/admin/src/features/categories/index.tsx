'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MOCK_CATEGORIES } from './types';
import { CategoryCard } from './components/CategoryCard';
import { SearchIcon } from '@ff/ui';

export default function CategoriesFeature() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All');

  const genders = ['All', 'Men', 'Women'] as const;

  const filteredCategories = useMemo(() => {
    return MOCK_CATEGORIES.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = selectedGender === 'All' || cat.gender === selectedGender;
      return matchesSearch && matchesGender;
    });
  }, [searchQuery, selectedGender]);

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      
      {/* Top Bar for Search and Filtering */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Gender Tabs */}
        <div className="flex space-x-1 rounded-xl bg-black/5 p-1 dark:bg-white/5">
          {genders.map(gender => (
            <button
              key={gender}
              onClick={() => setSelectedGender(gender)}
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

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pl-10 pr-4 text-sm text-black placeholder-black/40 outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-1 flex-col gap-4 overflow-auto scrollbar-hide pb-6">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-24 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">No categories found.</p>
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
    </div>
  );
}
