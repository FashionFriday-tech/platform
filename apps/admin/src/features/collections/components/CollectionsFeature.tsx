'use client';

import { useState } from 'react';

import { PlusIcon, SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useCollections } from '../hooks/useCollections';
import { type ProductCollection } from '../types';
import { AddCollectionModal } from './AddCollectionModal';
import { CollectionCard } from './CollectionCard';
import { DeleteCollectionModal } from './DeleteCollectionModal';

export default function CollectionsFeature() {
  const {
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    filteredCollections,
    loading,
    handleAddCollection,
    handleUpdateCollection,
    handleDeleteCollection,
  } = useCollections();

  const [editingCollection, setEditingCollection] = useState<ProductCollection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<ProductCollection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveModal = (
    name: string,
    image: string,
    slug: string,
    isEdit: boolean,
    id?: string,
  ) => {
    if (isEdit && id) {
      void handleUpdateCollection(id, name, image, slug);
    } else {
      void handleAddCollection(name, image, slug);
    }
  };

  const openEditModal = (collection: ProductCollection) => {
    setEditingCollection(collection);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setEditingCollection(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteRequest = (id: string) => {
    const target = filteredCollections.find((c) => c.id === id);
    if (target) {
      setCollectionToDelete(target);
    }
  };

  const confirmDelete = async () => {
    if (!collectionToDelete) {
      return;
    }
    setIsDeleting(true);
    try {
      await handleDeleteCollection(collectionToDelete.id);
      setCollectionToDelete(null);
    } catch (err) {
      console.error('Failed to delete collection:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Bar for Search and Add */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]">
        {/* Search Bar */}
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40 sm:left-3.5 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full truncate rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-9 text-xs text-black placeholder-black/40 transition-colors outline-none focus:border-black/20 focus:bg-white sm:py-2.5 sm:pl-10 sm:text-sm dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
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

        {/* Add Collection Button */}
        <button
          onClick={() => {
            setEditingCollection(null);
            setIsAddModalOpen(true);
          }}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-md transition-all hover:bg-black/90 active:scale-95 sm:px-4 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Create Collection</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      <AddCollectionModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSaveModal}
        initialData={editingCollection}
      />

      <DeleteCollectionModal
        isOpen={!!collectionToDelete}
        onClose={() => {
          setCollectionToDelete(null);
        }}
        onConfirm={confirmDelete}
        collectionName={collectionToDelete?.name}
        isDeleting={isDeleting}
      />

      {/* Grid */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-auto pb-6">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        ) : filteredCollections.length === 0 ? (
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
                <CollectionCard
                  collection={collection}
                  onEdit={openEditModal}
                  onDelete={handleDeleteRequest}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
