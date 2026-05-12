'use client';

import { useMemo, useState } from 'react';

import { type Brand, BRAND_LOGOS, type BrandCategory } from '@ff/schemas';

const ALL_CATEGORIES: BrandCategory[] = ['footwear', 'clothing', 'watch', 'accessories', 'eyewear'];

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>(BRAND_LOGOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | BrandCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...ALL_CATEGORIES.map((cat) => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
    })),
  ];

  const filteredBrands = useMemo(() => {
    let result = [...brands];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'all') {
      result = result.filter((b) => b.categories.includes(categoryFilter));
    }

    // Sort alphabetically by default
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, searchQuery, categoryFilter]);

  const handleSaveBrand = (savedBrand: Brand, isEdit: boolean, originalSlug?: string) => {
    if (isEdit && originalSlug) {
      setBrands((prev) => prev.map((b) => (b.slug === originalSlug ? savedBrand : b)));
      if (selectedBrand?.slug === originalSlug) {
        setSelectedBrand(savedBrand);
      }
    } else {
      setBrands((prev) => [savedBrand, ...prev]);
    }
    setBrandToEdit(null);
  };

  const handleDeleteBrand = () => {
    if (!selectedBrand) {
      return;
    }
    setBrands((prev) => prev.filter((b) => b.slug !== selectedBrand.slug));
    setSelectedBrand(null);
  };

  return {
    brands,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedBrand,
    setSelectedBrand,
    brandToEdit,
    setBrandToEdit,
    categoryOptions,
    filteredBrands,
    handleSaveBrand,
    handleDeleteBrand,
  };
}
