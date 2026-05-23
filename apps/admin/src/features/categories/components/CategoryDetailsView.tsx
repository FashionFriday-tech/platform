'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { EditIcon, PackageIcon, PlusIcon, SearchIcon, TrashIcon } from '@ff/ui';
import { useRouter } from 'next/navigation';

// We simulate fetching all products using the products feature mock
import { mockProducts } from '../../products/services/api';
import { type Product } from '../../products/types';
import { type ProductCategory } from '../types';
import { CategoryProductTable } from './CategoryProductTable';
import { AddCategoryModal } from './AddCategoryModal';

interface CategoryDetailsViewProps {
  initialCategory: ProductCategory;
}

export function CategoryDetailsView({ initialCategory }: CategoryDetailsViewProps) {
  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Draft'>('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/products`);
        if (!res.ok) return;
        const data = await res.json();
        const allProducts = data.data || [];
        
        // Filter by category ID and map
        const categoryProds = allProducts.filter((p: any) => p.categoryId === category.id).map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.id.substring(0, 8).toUpperCase(),
          costPrice: Number(p.gettingPrice) || 0,
          originalPrice: Number(p.ogPrice || p.sellingPrice),
          sellingPrice: Number(p.sellingPrice) || 0,
          stock: Number(p.totalStock) || 0,
          maxStock: 1000,
          status: (p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()) as any,
          categoryId: p.categoryId,
          category: p.category?.name || category.name,
          store: 'Main Store',
          variants: p.sizes || [],
          sales: 0,
          dateAdded: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          imageUrl: p.mainImage,
          images: [p.mainImage, p.promoImage, ...(p.liveImages || [])].filter(Boolean),
          description: p.description,
          quality: p.quality,
          brand: p.brand ? p.brand[0] : undefined,
          gender: p.gender,
          seoTitle: p.seoTitle,
          seoDesc: p.seoDescription,
          seoSlug: p.slug,
          videoLink: p.youtubeId ? `https://www.youtube.com/embed/${p.youtubeId}` : undefined,
        }));
        setCategoryProducts(categoryProds);
      } catch (err) {
        console.error('Failed to load category products', err);
      }
    }
    loadProducts();
  }, [category.id, category.name]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveProduct = (productId: string) => {
    setCategoryProducts((prev) => prev.filter((p) => p.id !== productId));
    setCategory((prev) => ({ ...prev, productCount: prev.productCount - 1 }));
  };

  const handleSaveCategory = (savedCategory: ProductCategory) => {
    setCategory(savedCategory);
  };

  const handleDeleteCategory = async () => {
    // 1. Delete image from Cloudflare (if it's not a local placeholder)
    if (category.image && category.image.startsWith('http') && !category.image.includes('localhost')) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/upload/batch`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [category.image] }),
        });
      } catch (err) {
        console.error('Failed to cleanup category image:', err);
      }
    }

    // 2. Delete category from the database
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/categories/${category.id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete category from DB:', err);
    }

    // 3. Redirect back to categories list
    router.push('/categories');
  };

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categoryProducts, searchQuery, statusFilter]);

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Hero Section */}
      <div className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-6 md:flex-row dark:border-white/5 dark:bg-[#111111]">
        {/* Left: Image */}
        <div className="group relative w-32 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Details & Toolbar */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex w-full items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-black md:text-4xl dark:text-white">
                {category.name}
              </h1>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60">
                <PackageIcon className="h-5 w-5" />
                <span>{category.productCount} Total Products Assigned</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg bg-black/5 px-4 py-2 text-sm font-semibold tracking-widest text-black/60 uppercase dark:bg-white/5 dark:text-white/60">
                {category.gender}
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <EditIcon className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex items-center gap-2 rounded-xl bg-[#DC143C]/10 px-4 py-2 text-sm font-semibold text-[#DC143C] transition-colors hover:bg-[#DC143C]/20"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-black/5 pt-6 xl:flex-row xl:items-center xl:justify-between dark:border-white/5">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative max-w-md flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <SearchIcon className="h-4 w-4 text-black/30 dark:text-white/30" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name, id or brand..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="block w-full rounded-xl border border-black/5 bg-[#f8f9fa] py-2.5 pr-4 pl-11 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white dark:placeholder-white/30 dark:focus:border-white/20 dark:focus:bg-[#222222] dark:focus:ring-white/5"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="group relative z-50 flex cursor-pointer items-center space-x-2 rounded-xl border border-black/5 bg-[#f8f9fa] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:border-white/5 dark:bg-[#1a1a1a] dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>

                <div className="invisible absolute top-full right-0 z-50 mt-3 flex w-36 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-1 opacity-0 shadow-2xl backdrop-blur-2xl transition-all group-hover:visible group-hover:opacity-100 dark:border-white/10 dark:bg-[#111111]/95">
                  {['All', 'Active', 'Inactive', 'Draft'].map((status) => (
                    <div
                      key={status}
                      onClick={() => {
                        setStatusFilter(status as any);
                      }}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${statusFilter === status ? 'bg-black/5 font-semibold text-black dark:bg-white/10 dark:text-white' : 'text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10'}`}
                    >
                      {status === 'All' ? 'All Status' : status}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/categories/${category.slug}/add-products`}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-md transition-all hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Products</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="scrollbar-hide flex-1 overflow-auto rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#111111]">
          <CategoryProductTable products={filteredProducts} onRemoveProduct={handleRemoveProduct} />
        </div>
      </div>

      <AddCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={category}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
