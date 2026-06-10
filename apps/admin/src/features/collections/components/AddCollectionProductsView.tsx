'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { CheckIcon, SearchIcon } from '@ff/ui';
import { toast } from 'sonner';

import { type ProductCollection } from '../types';

interface ApiProduct {
  id: string;
  name: string;
  brand?: string[];
  categoryId?: string;
  category?: { id: string; name: string };
  gender?: string;
  sellingPrice?: number | string;
  ogPrice?: number | string;
  totalStock?: number;
  mainImage?: string;
  status?: string;
  collections?: string[];
}

interface AddCollectionProductsViewProps {
  collection: ProductCollection;
}

export function AddCollectionProductsView({ collection }: AddCollectionProductsViewProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/products`,
        );
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        const items: ApiProduct[] = Array.isArray(data) ? data : (data.data ?? []);
        setProducts(items);
      } catch (err: any) {
        console.error('Error loading products for collection:', err);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.brand?.some((b) => b.toLowerCase().includes(q)) ?? false) ||
        p.id.toLowerCase().includes(q);

      const matchesGender =
        genderFilter === 'All' ||
        (p.gender && p.gender.toUpperCase() === genderFilter.toUpperCase());

      return matchesSearch && matchesGender;
    });
  }, [products, searchQuery, genderFilter]);

  const toggleProductSelection = (id: string, isAlreadyInThisCollection: boolean) => {
    if (isAlreadyInThisCollection) return;
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProductIds(newSelected);
  };

  const handleSelectAllVisible = () => {
    const assignable = filteredProducts.filter(
      (p) => !(p.collections || []).includes(collection.slug),
    );
    const newSelected = new Set(selectedProductIds);
    assignable.forEach((p) => newSelected.add(p.id));
    setSelectedProductIds(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedProductIds(new Set());
  };

  const handleSave = async () => {
    if (selectedProductIds.size === 0) return;
    setIsSaving(true);
    const count = selectedProductIds.size;

    try {
      const updatePromises = Array.from(selectedProductIds).map((productId) => {
        const prod = products.find((p) => p.id === productId);
        const existingCollections = prod?.collections || [];
        const updatedCollections = Array.from(new Set([...existingCollections, collection.slug]));

        return fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/products/${productId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ marketing: { collections: updatedCollections } }),
          },
        ).then((res) => {
          if (!res.ok) throw new Error(`Failed to update product ${productId}`);
          return res.json();
        });
      });

      await Promise.all(updatePromises);
      toast.success(
        `Successfully added ${count} product${count > 1 ? 's' : ''} to ${collection.name}`,
      );
      router.push(`/collections/${collection.slug}`);
      router.refresh();
    } catch (err: any) {
      console.error('Error adding products to collection:', err);
      toast.error(err.message || 'Failed to add products to collection');
      setIsSaving(false);
    }
  };

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-black/5 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Add Products to {collection.name}
            </h1>
          </div>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            Click on products to select them, then click Add to include them in {collection.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              router.back();
            }}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-black hover:bg-black/5 disabled:opacity-50 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedProductIds.size === 0 || isSaving}
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {isSaving ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>
                  Add {selectedProductIds.size} Product{selectedProductIds.size === 1 ? '' : 's'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Bulk select */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search by name, brand, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-10 text-sm text-black placeholder-black/40 outline-none focus:border-black/20 focus:bg-white dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/40 dark:focus:border-white/20 dark:focus:bg-[#222222]"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-black/5 bg-[#f8f9fa] p-1 text-xs font-semibold dark:border-white/5 dark:bg-[#1a1a1a]">
            {(['All', 'Men', 'Women', 'Unisex'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenderFilter(g)}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  genderFilter === g
                    ? 'bg-white text-black shadow-sm dark:bg-[#282828] dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleSelectAllVisible}
            className="font-medium text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Select All Visible
          </button>
          <span className="text-black/20 dark:text-white/20">•</span>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="font-medium text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Clear Selection ({selectedProductIds.size})
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="scrollbar-hide flex-1 overflow-y-auto pb-12">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-24 dark:border-white/10">
            <p className="text-sm font-medium text-black/60 dark:text-white/60">
              No products match your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => {
              const isAlreadyInThisCollection = (product.collections || []).includes(
                collection.slug,
              );
              const isSelected = selectedProductIds.has(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id, isAlreadyInThisCollection)}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                    isAlreadyInThisCollection
                      ? 'cursor-not-allowed border-black/5 bg-black/[0.02] opacity-60 dark:border-white/5 dark:bg-white/[0.02]'
                      : isSelected
                        ? 'cursor-pointer border-black bg-black/5 ring-2 ring-black/20 shadow-md dark:border-white dark:bg-white/5 dark:ring-white/20'
                        : 'cursor-pointer border-black/5 bg-white hover:border-black/20 hover:shadow-md dark:border-white/5 dark:bg-[#141414] dark:hover:border-white/20'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square w-full overflow-hidden bg-black/5 dark:bg-white/5">
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-black/30 dark:text-white/30">
                        No Image
                      </div>
                    )}

                    {/* Selection Checkbox indicator */}
                    <div className="absolute top-2.5 right-2.5">
                      {isAlreadyInThisCollection ? (
                        <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          In Collection
                        </span>
                      ) : (
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                            isSelected
                              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                              : 'border-white/80 bg-black/30 text-transparent backdrop-blur-md hover:border-white'
                          }`}
                        >
                          <CheckIcon className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Gender badge */}
                    {product.gender && (
                      <div className="absolute bottom-2 left-2">
                        <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                          {product.gender}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between p-3.5">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold text-black dark:text-white">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                        {Array.isArray(product.brand)
                          ? product.brand.join(', ')
                          : product.brand || 'No Brand'}
                      </p>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-t border-black/5 pt-2 dark:border-white/5">
                      <span className="text-sm font-bold text-black dark:text-white">
                        ₹{Number(product.sellingPrice || 0).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-black/40 dark:text-white/40">
                        {product.totalStock ?? 0} in stock
                      </span>
                    </div>
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
