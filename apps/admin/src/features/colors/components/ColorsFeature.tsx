'use client';

import React from 'react';

import { PlusIcon, SearchIcon, TrashIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { useColors } from '../hooks/useColors';
import { AddColorModal } from './AddColorModal';
import { ColorsTable } from './ColorsTable';
import { ColorStats } from './ColorStats';

export function ColorsFeature() {
  const {
    colors,
    filteredColors,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    colorToEdit,
    isSaving,
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveColor,
    colorToDelete,
    setColorToDelete,
    isDeleting,
    handleDeleteColor,
  } = useColors();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Overview Stats */}
      <ColorStats colors={colors} />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Top Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-30 flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-[#111111]"
        >
          {/* Search Input */}
          <div className="relative min-w-0 flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Search colors by name or hex code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-black/5 py-2.5 pr-4 pl-10 text-xs font-medium text-black outline-none transition-all placeholder:text-black/40 focus:border-black/30 sm:text-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30"
            />
          </div>

          {/* Add Color Action Button */}
          <button
            onClick={openAddModal}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 sm:px-5 sm:text-sm dark:bg-white dark:text-black"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Color</span>
          </button>
        </motion.div>

        {/* Colors Table */}
        <div className="min-h-0 flex-1">
          <ColorsTable
            colors={filteredColors}
            isLoading={isLoading}
            onEditColor={openEditModal}
            onDeleteColor={(color) => setColorToDelete(color)}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AddColorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveColor}
        initialData={colorToEdit}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {colorToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setColorToDelete(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 text-center shadow-2xl dark:border-white/10 dark:bg-[#141417]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
                <TrashIcon className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-black dark:text-white">Delete Color</h3>
              <p className="mt-2 text-xs text-black/60 dark:text-white/60">
                Are you sure you want to delete{' '}
                <strong className="text-black dark:text-white">{colorToDelete.name}</strong> (
                {colorToDelete.hex})? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setColorToDelete(null)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDeleteColor(colorToDelete.id)}
                  className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
