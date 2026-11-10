'use client';

import React, { useState } from 'react';

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
import { PlusIcon, SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useQualities } from '../hooks/useQualities';
import { type QualityItem } from '../types';
import { AddQualityModal } from './AddQualityModal';
import { DeleteQualityModal } from './DeleteQualityModal';
import { QualityCard } from './QualityCard';
import { QualityDetailsModal } from './QualityDetailsModal';
import { QualityStats } from './QualityStats';

function SortableQualityItem({
  quality,
  onSelect,
}: {
  quality: QualityItem;
  onSelect: (quality: QualityItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: quality.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <QualityCard
        quality={quality}
        onSelect={onSelect}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function QualitiesFeature() {
  const {
    qualities,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    allAvailableCategories,
    filteredQualities,
    isAddModalOpen,
    setIsAddModalOpen,
    qualityToEdit,
    setQualityToEdit,
    handleSaveQuality,
    handleDeleteQuality,
    handleReorderQualities,
  } = useQualities();

  const [qualityToDelete, setQualityToDelete] = useState<QualityItem | null>(null);
  const [selectedQualityForDetails, setSelectedQualityForDetails] = useState<QualityItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!qualityToDelete) {
      return;
    }
    setIsDeleting(true);
    try {
      await handleDeleteQuality(qualityToDelete.id);
      setQualityToDelete(null);
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
      const oldIndex = filteredQualities.findIndex((q) => q.id === active.id);
      const newIndex = filteredQualities.findIndex((q) => q.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(filteredQualities, oldIndex, newIndex);
        void handleReorderQualities(reordered);
      }
    }
  };

  const categoryFilterTabs = ['All', ...allAvailableCategories];

  return (
    <div className="scrollbar-hide flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-8 sm:gap-5 md:gap-6">
      {/* Top Header & Stats */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h1 className="text-lg font-black tracking-tight text-black sm:text-xl md:text-2xl dark:text-white">
              Quality Management
            </h1>
            <p className="mt-0.5 text-xs text-black/50 sm:text-sm dark:text-white/50">
              Manage quality grades (6A, UA, 7AA, etc.) and assign applicable categories
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setQualityToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-black/90 active:scale-95 sm:self-auto sm:text-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add New Quality</span>
          </button>
        </div>

        {/* Stats */}
        <QualityStats qualities={qualities} />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-2.5 rounded-2xl border border-black/5 bg-white p-2.5 sm:gap-3 sm:p-3 md:flex-row md:items-center md:justify-between md:p-4 dark:border-white/5 dark:bg-[#111111]">
        {/* Category Pills (Horizontal Scrollable) */}
        <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5">
          {categoryFilterTabs.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                }}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-black text-white shadow-xs dark:bg-white dark:text-black'
                    : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full min-w-0 shrink-0 md:w-64 lg:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search qualities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2 pr-8 pl-9 text-xs text-black placeholder-black/40 transition-colors outline-none focus:border-black/20 focus:bg-white sm:py-2.5 sm:text-sm dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
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
      </div>

      {/* Grid of Qualities */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
          </div>
        ) : filteredQualities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-16 text-center sm:py-20 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              No qualities found matching criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-semibold text-black underline underline-offset-4 dark:text-white"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredQualities.map((q) => q.id)}
              strategy={rectSortingStrategy}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              >
                {filteredQualities.map((quality) => (
                  <SortableQualityItem
                    key={quality.id}
                    quality={quality}
                    onSelect={(q) => {
                      setSelectedQualityForDetails(q);
                    }}
                  />
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      <QualityDetailsModal
        isOpen={Boolean(selectedQualityForDetails)}
        onClose={() => {
          setSelectedQualityForDetails(null);
        }}
        quality={selectedQualityForDetails}
        onEdit={() => {
          if (selectedQualityForDetails) {
            const q = selectedQualityForDetails;
            setSelectedQualityForDetails(null);
            setQualityToEdit(q);
            setIsAddModalOpen(true);
          }
        }}
        onDelete={() => {
          if (selectedQualityForDetails) {
            const q = selectedQualityForDetails;
            setSelectedQualityForDetails(null);
            setQualityToDelete(q);
          }
        }}
      />

      <AddQualityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setQualityToEdit(null);
        }}
        onSave={handleSaveQuality}
        initialData={qualityToEdit}
        availableCategories={allAvailableCategories}
      />

      <DeleteQualityModal
        isOpen={Boolean(qualityToDelete)}
        onClose={() => {
          setQualityToDelete(null);
        }}
        onConfirm={confirmDelete}
        qualityName={qualityToDelete?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
