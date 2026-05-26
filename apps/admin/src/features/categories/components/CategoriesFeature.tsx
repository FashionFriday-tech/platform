'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { AddCategoryModal } from './AddCategoryModal';
import { ProductCategory } from '../types';

function SortableCategoryItem({ category }: { category: ProductCategory }) {
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
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle Icon */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="absolute top-3 right-3 z-30 flex h-8 w-8 cursor-grab items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur-md transition-opacity group-hover:opacity-100 opacity-75 hover:bg-black active:cursor-grabbing"
        title="Drag to reorder category"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <CategoryCard category={category} />
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
  } = useCategories();

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
        handleReorderCategories(reordered);
      }
    }
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Bar for Search and Filtering */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Gender Tabs (Only Men & Women) */}
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

      {/* Grid with Drag and Drop */}
      <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-auto pb-6">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-24 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              No categories found.
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredCategories.map((c) => c.id)} strategy={rectSortingStrategy}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredCategories.map((category) => (
                  <SortableCategoryItem key={category.id} category={category} />
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>
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

