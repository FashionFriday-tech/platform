'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EditIcon, PackageIcon, PlusIcon, SearchIcon, TrashIcon } from '@ff/ui';

// We simulate fetching all products using the products feature mock
import { mockProducts } from '../../products/services/api';
import { type Product } from '../../products/types';
import { type ProductCollection } from '../types';
import { AddCollectionModal } from './AddCollectionModal';
import { CollectionProductTable } from './CollectionProductTable';

interface CollectionDetailsViewProps {
  initialCollection: ProductCollection;
}

export function CollectionDetailsView({ initialCollection }: CollectionDetailsViewProps) {
  const router = useRouter();
  const [collection, setCollection] = useState<ProductCollection>(initialCollection);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Draft'>('All');

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(initialCollection.name);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch products by collection ID.
    const initialProducts = mockProducts.slice(0, 10);
    setCollectionProducts(initialProducts);
  }, [collection.id]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveProduct = (productId: string) => {
    setCollectionProducts((prev) => prev.filter((p) => p.id !== productId));
    setCollection((prev) => ({ ...prev, productCount: prev.productCount - 1 }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setCollection((prev) => ({ ...prev, image: localUrl }));
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', collection.slug);
      formData.append('folder', 'collections');

      try {
        const uploadRes = await fetch('http://127.0.0.1:3002/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          await fetch(`http://127.0.0.1:3002/admin/collections/${collection.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: url }),
          });
          
          // Cleanup old image
          if (collection.image && collection.image.startsWith('http') && !collection.image.includes('localhost')) {
            try {
              await fetch('http://127.0.0.1:3002/admin/upload/batch', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: [collection.image] }),
              });
            } catch (err) {
              console.error('Failed to cleanup old image:', err);
            }
          }

          setCollection((prev) => ({ ...prev, image: url }));
        }
      } catch (err) {
        console.error('Failed to update image', err);
      }
    }
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleSaveName = async () => {
    if (editNameValue.trim() && editNameValue !== collection.name) {
      setCollection((prev) => ({ ...prev, name: editNameValue.trim() }));
      try {
        await fetch(`http://127.0.0.1:3002/admin/collections/${collection.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editNameValue.trim() }),
        });
      } catch (err) {
        console.error('Failed to update name', err);
      }
    } else {
      setEditNameValue(collection.name);
    }
    setIsEditingName(false);
  };

  const handleDeleteCollection = async () => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await fetch(`http://127.0.0.1:3002/admin/collections/${collection.id}`, {
          method: 'DELETE',
        });
        router.push('/collections');
      } catch (err) {
        console.error('Failed to delete collection', err);
      }
    }
  };

  const handleSaveModal = async (name: string, image: string, slug: string, isEdit: boolean, id?: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:3002/admin/collections/${collection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCollection(updated);
      }
    } catch (err) {
      console.error('Failed to update via modal', err);
    }
  };

  const filteredProducts = useMemo(() => {
    return collectionProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [collectionProducts, searchQuery, statusFilter]);

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      {/* Top Hero Section */}
      <div className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-6 md:flex-row dark:border-white/5 dark:bg-[#111111]">
        {/* Left: Image */}
        <div className="group relative w-32 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleChangeImage}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/40"
              >
                <EditIcon className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Right: Details & Toolbar */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => {
                      setEditNameValue(e.target.value);
                    }}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className="border-b border-black/20 bg-transparent text-3xl font-black text-black outline-none md:text-4xl dark:border-white/20 dark:text-white"
                  />
                </div>
              ) : (
                <div
                  className="group/name flex cursor-pointer items-center gap-3"
                  onClick={() => {
                    setIsEditingName(true);
                  }}
                >
                  <h1 className="text-3xl font-black text-black md:text-4xl dark:text-white">
                    {collection.name}
                  </h1>
                  <button className="p-1 text-black/40 opacity-0 transition-opacity group-hover/name:opacity-100 hover:text-black dark:text-white/40 dark:hover:text-white">
                    <EditIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60">
                <PackageIcon className="h-5 w-5" />
                <span>{collection.productCount} Total Products Assigned</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-black/5 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black/10 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <EditIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDeleteCollection}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/20 active:scale-95"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
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
                href={`/collections/${collection.slug}/add-products`}
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
          <CollectionProductTable
            products={filteredProducts}
            onRemoveProduct={handleRemoveProduct}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <AddCollectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveModal}
        initialData={collection}
      />
    </div>
  );
}
