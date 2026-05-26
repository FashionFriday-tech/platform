'use client';

import { useMemo, useState, useEffect } from 'react';

import { BRAND_LOGOS, type Brand, type BrandCategory } from '@ff/schemas';

const ALL_CATEGORIES: BrandCategory[] = ['footwear', 'clothing', 'watch', 'accessories', 'eyewear'];

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | BrandCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/brands`)
      .then((res) => res.json())
      .then((data) => {
        setBrands(Array.isArray(data) && data.length > 0 ? data : BRAND_LOGOS);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch brands:', err);
        setBrands(BRAND_LOGOS);
        setIsLoading(false);
      });
  }, []);


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

  const handleSaveBrand = async (savedBrand: Brand, isEdit: boolean, originalSlug?: string) => {
    try {
      if (isEdit && originalSlug) {
        // Find existing brand to get ID
        const existingBrand = brands.find((b) => b.slug === originalSlug) as any;
        if (existingBrand?.id) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/brands/${existingBrand.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savedBrand),
          });
          const updated = await res.json();
          setBrands((prev) => prev.map((b) => (b.slug === originalSlug ? updated : b)));
          if (selectedBrand?.slug === originalSlug) {
            setSelectedBrand(updated);
          }
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/brands`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedBrand),
        });
        const created = await res.json();
        setBrands((prev) => [created, ...prev]);
      }
      setBrandToEdit(null);
    } catch (err) {
      console.error('Failed to save brand:', err);
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) {
      return;
    }

    const brandAsAny = selectedBrand as any;

    try {
      if (brandAsAny.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/brands/${brandAsAny.id}`, {
          method: 'DELETE',
        });
      }

      if (
        selectedBrand.logo &&
        selectedBrand.logo.startsWith('http') &&
        !selectedBrand.logo.includes('localhost')
      ) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/upload/batch`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: [selectedBrand.logo] }),
          });
        } catch (err) {
          console.error('Failed to cleanup brand logo on delete:', err);
        }
      }

      setBrands((prev) => prev.filter((b) => b.slug !== selectedBrand.slug));
      setSelectedBrand(null);
    } catch (err) {
      console.error('Failed to delete brand:', err);
    }
  };

  return {
    brands,
    isLoading,
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
