'use client';

import { PlusIcon, SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useCollections } from '../hooks/useCollections';
import { AddCollectionModal } from './AddCollectionModal';
import { CollectionCard } from './CollectionCard';

export default function CollectionsFeature() {
  const {
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    filteredCollections,
    handleAddCollection,
  } = useCollections();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Bar for Search and Add */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-10 text-sm text-black placeholder-black/40 transition-colors outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
          />
        </div>

        {/* Add Collection Button */}
        <button
          onClick={() => {
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create Collection</span>
        </button>
      </div>

      <AddCollectionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        onSave={handleAddCollection}
      />

      {/* Grid */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-auto pb-6">
        {filteredCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-24 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              No collections found.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredCollections.map((collection, idx) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <CollectionCard collection={collection} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
