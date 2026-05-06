'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../products/types';
import { ProductCategory } from '../types';
import { SearchIcon, CheckIcon } from '@ff/ui';
// We simulate fetching all products using the products feature mock
import { mockProducts } from '../../products/services/api';

interface AddCategoryProductsViewProps {
  category: ProductCategory;
}

export function AddCategoryProductsView({ category }: AddCategoryProductsViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  // Simulate existing assigned products based on category slug
  const existingAssignedProductIds = useMemo(() => {
    return new Set(mockProducts
      .filter(p => parseInt(p.id.replace(/\D/g, '')) % 2 === (category.gender === 'Men' ? 0 : 1))
      .slice(0, 10)
      .map(p => p.id));
  }, [category.gender]);

  const unassignedProducts = mockProducts.filter(p => !existingAssignedProductIds.has(p.id));

  const filteredProducts = unassignedProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleProductSelection = (id: string) => {
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProductIds(newSelected);
  };

  const handleSave = () => {
    // In a real app, send API request to save
    // alert(`Assigned ${selectedProductIds.size} products to ${category.name}`);
    router.push(`/categories/${category.slug}`);
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">Add Products to {category.name}</h1>
            <p className="text-sm text-black/60 dark:text-white/60">{category.gender} Category</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedProductIds.size === 0}
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            Add {selectedProductIds.size} Products
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
        <input
          type="text"
          placeholder="Search products by name, id or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-3 pl-10 pr-4 text-sm text-black placeholder-black/40 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
        />
      </div>

      {/* Product Grid / List */}
      <div className="scrollbar-hide flex-1 overflow-y-auto pb-8">
        {filteredProducts.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-black/40 dark:text-white/40">
            <p>No unassigned products found.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(product => {
              const isSelected = selectedProductIds.has(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-black bg-black/5 dark:border-white dark:bg-white/5'
                      : 'border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]'
                  }`}
                >
                  <div className="relative aspect-square w-full bg-black/5 dark:bg-white/5">
                    <Image
                      src={product.imageUrl || product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute right-3 top-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border shadow-sm ${
                        isSelected 
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-white/40 bg-white/40 backdrop-blur-md dark:border-black/40 dark:bg-black/40'
                      }`}>
                        {isSelected && <CheckIcon className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="font-semibold text-black dark:text-white">{product.name}</h3>
                    <p className="text-xs text-black/50 dark:text-white/50">{product.brand}</p>
                    <p className="mt-1 text-sm font-bold text-black dark:text-white">${product.sellingPrice.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
