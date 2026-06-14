'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SearchIcon, TrashIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useCategories } from '../hooks/useCategories';
import { type ProductCategory } from '../types';
import { AddCategoryModal } from './AddCategoryModal';
import { CategoryCard } from './CategoryCard';

function SortableCategoryItem({
  category,
  onDelete,
}: {
  category: ProductCategory;
  onDelete?: (category: ProductCategory) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Drag Handle Icon */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="absolute top-3 right-3 z-30 flex h-8 w-8 cursor-grab items-center justify-center rounded-xl bg-black/70 text-white opacity-75 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-black active:cursor-grabbing"
        title="Drag to reorder category"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>
      <CategoryCard category={category} onDelete={onDelete} />
    </div>
  );
}

export default function CategoriesFeature() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGender,
    setSelectedGender,
    genders,
    filteredCategories,
    handleReorderCategories,
    isAddModalOpen,
    setIsAddModalOpen,
    categoryToEdit,
    setCategoryToEdit,
    handleSaveCategory,
    handleDeleteCategory,
  } = useCategories();

  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await handleDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredCategories.findIndex((c) => c.id === active.id);
      const newIndex = filteredCategories.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(filteredCategories, oldIndex, newIndex);
        void handleReorderCategories(reordered);
      }
    }
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Bar for Search and Filtering */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white p-2.5 sm:p-3 md:p-4 dark:border-white/5 dark:bg-[#111111]">
        {/* Desktop Gender Tabs (Only Men & Women) */}
        <div className="hidden sm:flex space-x-1 rounded-xl bg-black/5 p-1 dark:bg-white/5 shrink-0">
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

        {/* Search Bar (Fills remaining space) */}
        <div className="relative flex-1 min-w-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-3.5">
            <SearchIcon className="h-4 w-4 text-black/40 dark:text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2 sm:py-2.5 pr-8 pl-9 sm:pl-10 text-xs sm:text-sm text-black placeholder-black/40 transition-colors outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222] truncate"
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

        {/* Right Controls: Unified Filter Button (mobile) + Add Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Filter Button */}
          <div className="relative sm:hidden" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-1 rounded-xl border border-black/5 bg-[#f8f9fa] px-2.5 py-2 text-xs font-medium text-black/70 hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span>{selectedGender}</span>
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="fixed inset-x-3 bottom-3 z-50 flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 dark:border-white/10 dark:bg-[#111111]/95">
                  <div className="flex items-center justify-between border-b border-black/5 p-4 pb-3 dark:border-white/5">
                    <h3 className="text-base font-bold text-black dark:text-white">
                      Select Gender
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
                  <div className="p-4 space-y-2">
                    {genders.map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => {
                          setSelectedGender(gender);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                          selectedGender === gender
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add Category Button */}
          <button
            onClick={() => {
              setCategoryToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap text-white shadow-md transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Grid with Drag and Drop */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-auto pb-6">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-24 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              No categories found.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredCategories.map((c) => c.id)}
              strategy={rectSortingStrategy}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredCategories.map((category) => (
                  <SortableCategoryItem
                    key={category.id}
                    category={category}
                    onDelete={setCategoryToDelete}
                  />
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        initialData={categoryToEdit}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18181b]">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <TrashIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Delete Category</h3>
            </div>
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                Are you sure you want to delete <strong className="text-black dark:text-white">{categoryToDelete.name}</strong>?
              </p>
              {categoryToDelete.productCount > 0 ? (
                <p className="mt-2 rounded-lg bg-blue-500/10 p-2.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                  ℹ️ {categoryToDelete.productCount} product(s) in this category will be unassigned. The products will remain intact in your catalog.
                </p>
              ) : (
                <p className="mt-1 text-xs text-zinc-500">This action cannot be undone.</p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setCategoryToDelete(null);
                }}
                className="rounded-xl bg-black/5 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-black/10 disabled:opacity-50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
