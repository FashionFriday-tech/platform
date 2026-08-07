'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { type Brand, type BrandCategory, BRAND_LOGOS } from '@ff/schemas';

import { api } from '../../../lib/api-client';

const ALL_CATEGORIES: BrandCategory[] = ['footwear', 'clothing', 'watch', 'accessories', 'eyewear'];

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | BrandCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Brand[]>('/admin/brands');
      if (Array.isArray(data) && data.length > 0) {
        setBrands(data);
      } else {
        setBrands(BRAND_LOGOS);
      }
    } catch (err) {
      console.error('Failed to fetch brands from /admin/brands:', err);
      // Fallback so admin panel always renders brand catalog
      setBrands(BRAND_LOGOS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...ALL_CATEGORIES.map((cat) => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
    })),
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' as const },
    { label: 'Active', value: 'active' as const },
    { label: 'Disabled', value: 'disabled' as const },
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

    if (statusFilter === 'active') {
      result = result.filter((b) => b.isActive !== false);
    } else if (statusFilter === 'disabled') {
      result = result.filter((b) => b.isActive === false);
    }

    // Sort alphabetically by default
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, searchQuery, categoryFilter, statusFilter]);

  const handleSaveBrand = async (savedBrand: Brand, isEdit: boolean, originalSlug?: string) => {
    try {
      if (isEdit && originalSlug) {
        // Find existing brand to get ID or match by slug
        const existingBrand = brands.find((b) => b.slug === originalSlug || (b.id && b.id === (savedBrand as any).id));
        const targetId = existingBrand?.id || (savedBrand as any).id;
        
        if (targetId) {
          const updated = await api.patch<Brand>(
            `/admin/brands/${targetId}`,
            savedBrand,
          );
          setBrands((prev) => prev.map((b) => (b.slug === originalSlug || b.id === targetId ? { ...b, ...updated } : b)));
          if (selectedBrand?.slug === originalSlug || selectedBrand?.id === targetId) {
            setSelectedBrand((prev) => (prev ? { ...prev, ...updated } : updated));
          }
        } else {
          // If no ID exists locally, create or refresh
          const created = await api.post<Brand>('/admin/brands', savedBrand);
          setBrands((prev) => [created, ...prev.filter((b) => b.slug !== originalSlug)]);
        }
      } else {
        const created = await api.post<Brand>('/admin/brands', savedBrand);
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

    const brandWithId = selectedBrand as Brand & { id?: string };

    try {
      if (brandWithId.id) {
        await api.delete(`/admin/brands/${brandWithId.id}`);
      } else {
        // Try to find the brand in current state with an id matching the slug
        const match = brands.find((b) => b.slug === selectedBrand.slug && b.id);
        if (match?.id) {
          await api.delete(`/admin/brands/${match.id}`);
        }
      }

      if (
        selectedBrand.logo &&
        selectedBrand.logo.startsWith('http') &&
        !selectedBrand.logo.includes('localhost')
      ) {
        try {
          await api.delete('/admin/upload/batch', {
            body: JSON.stringify({ urls: [selectedBrand.logo] }),
          });
        } catch (err) {
          console.error('Failed to cleanup brand logo on delete:', err);
        }
      }

      setBrands((prev) => prev.filter((b) => b.slug !== selectedBrand.slug && (!b.id || b.id !== brandWithId.id)));
      setSelectedBrand(null);
    } catch (err) {
      console.error('Failed to delete brand:', err);
    }
  };

  const handleToggleBrandStatus = async (brand: Brand) => {
    const brandWithId = brand as Brand & { id?: string };
    const targetId = brandWithId.id || brands.find((b) => b.slug === brand.slug)?.id;

    if (!targetId) {
      console.warn('Brand has no id to toggle:', brand);
      return;
    }

    const currentActive = brand.isActive !== false;
    const nextActive = !currentActive;

    // Optimistic state update
    setBrands((prev) =>
      prev.map((b) => (b.id === targetId || b.slug === brand.slug ? { ...b, isActive: nextActive } : b)),
    );
    if (selectedBrand && (selectedBrand.id === targetId || selectedBrand.slug === brand.slug)) {
      setSelectedBrand((prev) => (prev ? { ...prev, isActive: nextActive } : null));
    }

    try {
      const updated = await api.patch<Brand>(`/admin/brands/${targetId}/toggle`);
      setBrands((prev) => prev.map((b) => (b.id === targetId || b.slug === brand.slug ? { ...b, ...updated } : b)));
      if (selectedBrand && (selectedBrand.id === targetId || selectedBrand.slug === brand.slug)) {
        setSelectedBrand((prev) => (prev ? { ...prev, ...updated } : updated));
      }
    } catch (err) {
      console.error('Failed to toggle brand status:', err);
      // Rollback
      setBrands((prev) =>
        prev.map((b) => (b.id === targetId || b.slug === brand.slug ? { ...b, isActive: currentActive } : b)),
      );
      if (selectedBrand && (selectedBrand.id === targetId || selectedBrand.slug === brand.slug)) {
        setSelectedBrand((prev) => (prev ? { ...prev, isActive: currentActive } : null));
      }
    }
  };

  return {
    brands,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    statusOptions,
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
    handleToggleBrandStatus,
  };
}
