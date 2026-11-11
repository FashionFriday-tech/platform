'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayersIcon, PlusIcon, SearchIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useProductGroups } from '../hooks/useProductGroups';
import { RenameGroupModal } from './RenameGroupModal';

export function ProductGroupsFeature() {
  const {
    groups,
    isLoading,
    searchQuery,
    setSearchQuery,
    stats,
    groupToRename,
    newGroupName,
    setNewGroupName,
    isRenaming,
    openRenameModal,
    closeRenameModal,
    handleRenameGroup,
  } = useProductGroups();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/5 dark:bg-[#111111]">
          <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            Total Groups
          </p>
          <p className="mt-1 text-2xl font-black text-black dark:text-white">
            {stats.totalGroups}
          </p>
          <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
            Models with colorways
          </span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/5 dark:bg-[#111111]">
          <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            Linked Colorways
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.totalProducts}
          </p>
          <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
            Products connected
          </span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/5 dark:bg-[#111111]">
          <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            Avg Colors / Group
          </p>
          <p className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
            {stats.averageColors}
          </p>
          <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
            Options per model
          </span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-xs dark:border-white/5 dark:bg-[#111111]">
          <p className="text-[10px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
            Total Stock
          </p>
          <p className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">
            {stats.totalStock}
          </p>
          <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
            Units in stock
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
          </div>
          <input
            type="text"
            placeholder="Search groups by model name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-black transition-all outline-none placeholder:text-black/40 focus:border-black/30 sm:text-sm dark:border-white/10 dark:bg-[#111111] dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30"
          />
        </div>

        <Link
          href="/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:opacity-90 sm:text-sm dark:bg-white dark:text-black"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Product to Group</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
        {isLoading ? (
          <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />
            <p className="mt-3 text-xs font-medium text-black/40 dark:text-white/40">
              Loading product groups...
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 p-8 text-center dark:border-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40">
              <LayersIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-black dark:text-white">
              {searchQuery ? 'No matching product groups' : 'No product groups yet'}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-black/50 dark:text-white/50">
              {searchQuery
                ? `No model groups match "${searchQuery}". Try a different keyword.`
                : 'When you create or edit products, specify a "Color Option Group" to link multiple colors together on the product detail page.'}
            </p>
            <Link
              href="/products/add"
              className="mt-4 rounded-full bg-black px-5 py-2 text-xs font-bold text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              Create Product with Group
            </Link>
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {groups.map((group) => (
              <motion.div
                key={group.modelGroup}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white p-4 shadow-xs transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#141417]"
              >
                {/* Group Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 dark:border-white/5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-extrabold text-black dark:text-white">
                      {group.modelGroup}
                    </span>
                    <button
                      type="button"
                      onClick={() => openRenameModal(group)}
                      title="Rename this model group across all products"
                      className="rounded-md border border-black/10 px-2 py-0.5 text-[10px] font-semibold text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10"
                    >
                      Rename
                    </button>
                    {group.brand && group.brand.length > 0 && (
                      <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-bold text-black/70 dark:bg-white/10 dark:text-white/70">
                        {group.brand.join(', ')}
                      </span>
                    )}
                    {group.category?.name && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {group.category.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {group.count} {group.count === 1 ? 'Color' : 'Colors'}
                    </span>
                    <span className="text-[11px] font-semibold text-black/40 dark:text-white/40">
                      {group.totalStock} in stock
                    </span>
                  </div>
                </div>

                {/* Sibling Products Carousel / Tray */}
                <div className="scrollbar-hide flex gap-3 overflow-x-auto pt-3 pb-1">
                  {group.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="group/item flex w-36 shrink-0 flex-col rounded-xl border border-black/5 bg-black/[0.02] p-2 transition-all hover:border-black/20 hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-[#1a1a1f]"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                        {prod.mainImage ? (
                          <Image
                            src={prod.mainImage}
                            alt={prod.name}
                            fill
                            sizes="144px"
                            className="object-cover transition-transform group-hover/item:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-black/30 dark:text-white/30">
                            No Img
                          </div>
                        )}
                        {prod.status !== 'PUBLISHED' && prod.status !== 'Active' && (
                          <span className="absolute top-1 right-1 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                            {prod.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 min-w-0 flex-1">
                        <p
                          className="truncate text-[11px] font-semibold text-black dark:text-white"
                          title={prod.name}
                        >
                          {prod.name}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs font-black text-black dark:text-white">
                            ₹{prod.sellingPrice?.toLocaleString('en-IN') || 0}
                          </span>
                          <span className="text-[10px] font-medium text-black/40 dark:text-white/40">
                            {prod.totalStock} qty
                          </span>
                        </div>

                        {prod.colors && prod.colors.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-1">
                            {prod.colors.slice(0, 3).map((c, i) => (
                              <span
                                key={i}
                                className="h-2.5 w-2.5 rounded-full border border-black/20"
                                style={{
                                  backgroundColor: c.startsWith('#') ? c : '#888',
                                }}
                                title={c}
                              />
                            ))}
                          </div>
                        )}

                        <div className="mt-2 flex items-center gap-1.5 pt-1">
                          <Link
                            href={`/products/${prod.id}/edit`}
                            className="flex-1 rounded-md bg-black/5 py-1 text-center text-[10px] font-bold text-black hover:bg-black hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/products/${prod.slug || prod.id}`}
                            className="rounded-md border border-black/10 px-2 py-1 text-center text-[10px] font-bold text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
                            title="View product details"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      <RenameGroupModal
        group={groupToRename}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        isRenaming={isRenaming}
        onConfirm={() => void handleRenameGroup()}
        onClose={closeRenameModal}
      />
    </div>
  );
}

