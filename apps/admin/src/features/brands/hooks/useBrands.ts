'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { type Brand, type BrandCategory } from '@ff/schemas';

import { api } from '../../../lib/api-client';

const ALL_CATEGORIES: BrandCategory[] = ['footwear', 'clothing', 'watch', 'accessories', 'eyewear'];

function parseBrandFilters(params: URLSearchParams | { get: (k: string) => string | null }) {
  const search = params.get('search') ?? '';
  const categoryRaw = params.get('category') ?? 'all';
  const category = (ALL_CATEGORIES.includes(categoryRaw as BrandCategory) ? categoryRaw : 'all') as
    | 'all'
    | BrandCategory;
  const statusRaw = params.get('status') ?? 'all';
  const status = (['active', 'disabled'].includes(statusRaw) ? statusRaw : 'all') as
    | 'all'
    | 'active'
    | 'disabled';

  return { search, category, status };
}

export function useBrands() {
  const searchParams = useSearchParams();
  const [initialFilters] = useState(() => parseBrandFilters(searchParams));

  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [categoryFilter, setCategoryFilter] = useState<'all' | BrandCategory>(
    initialFilters.category,
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>(
    initialFilters.status,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isUpdatingFromUrl = useRef(false);

  // Sync state to URL search params
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (categoryFilter !== 'all') {
      params.set('category', categoryFilter);
    }
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') {
        return;
      }
      isUpdatingFromUrl.current = true;
      const parsed = parseBrandFilters(new URLSearchParams(window.location.search));
      setSearchQuery(parsed.search);
      setCategoryFilter(parsed.category);
      setStatusFilter(parsed.status);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync when searchParams changes via Next router
  useEffect(() => {
    const parsed = parseBrandFilters(searchParams);
    if (
      parsed.search !== searchQuery ||
      parsed.category !== categoryFilter ||
      parsed.status !== statusFilter
    ) {
      isUpdatingFromUrl.current = true;
      setSearchQuery(parsed.search);
      setCategoryFilter(parsed.category);
      setStatusFilter(parsed.status);
    }
  }, [searchParams]);

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Brand[]>('/admin/brands');
      if (Array.isArray(data)) {
        // Deduplicate any duplicates that might have same slug
        const seenSlugs = new Set<string>();
        const unique = data.filter((b) => {
          if (!b.slug || seenSlugs.has(b.slug)) {
            return false;
          }
          seenSlugs.add(b.slug);
          return true;
        });
        setBrands(unique);
      } else {
        setBrands([]);
      }
    } catch (err) {
      console.error('Failed to fetch brands from /admin/brands:', err);
      setBrands([]);
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
    { label: 'Inactive', value: 'disabled' as const },
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
        const existingBrand = brands.find(
          (b) => b.slug === originalSlug || (b.id && b.id === (savedBrand as any).id),
        );
        const targetId = existingBrand?.id || (savedBrand as any).id;

        if (targetId) {
          const updated = await api.patch<Brand>(`/admin/brands/${targetId}`, savedBrand);
          setBrands((prev) =>
            prev.map((b) =>
              b.slug === originalSlug || b.id === targetId ? { ...b, ...updated } : b,
            ),
          );
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
        setBrands((prev) => [created, ...prev.filter((b) => b.slug !== created.slug)]);
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

    const brandToDelete = selectedBrand;
    const targetId =
      brandToDelete.id || brands.find((b) => b.slug === brandToDelete.slug && b.id)?.id;

    // Immediately remove from local state
    setBrands((prev) =>
      prev.filter((b) => b.slug !== brandToDelete.slug && (!targetId || b.id !== targetId)),
    );
    setSelectedBrand(null);

    try {
      if (targetId) {
        await api.delete(`/admin/brands/${targetId}`);
      }

      // Cleanup uploaded brand logo if applicable
      if (
        brandToDelete.logo &&
        brandToDelete.logo.startsWith('http') &&
        !brandToDelete.logo.includes('localhost')
      ) {
        try {
          await api.post('/admin/upload/batch', { urls: [brandToDelete.logo] });
        } catch {
          // Silently ignore asset cleanup failure
        }
      }
    } catch (err) {
      console.error('Failed to delete brand from database:', err);
      // Re-fetch to synchronize in case of real network failure
      void fetchBrands();
    }
  };

  const handleToggleBrandStatus = async (brand: Brand) => {
    const brandWithId = brand as Brand & { id?: string };
    const targetId = brandWithId.id || brands.find((b) => b.slug === brand.slug)?.id;

    const currentActive = brand.isActive !== false;
    const nextActive = !currentActive;

    // Optimistic state update across all instances
    setBrands((prev) =>
      prev.map((b) =>
        (targetId && b.id === targetId) || b.slug === brand.slug
          ? { ...b, isActive: nextActive }
          : b,
      ),
    );
    if (
      selectedBrand &&
      ((targetId && selectedBrand.id === targetId) || selectedBrand.slug === brand.slug)
    ) {
      setSelectedBrand((prev) => (prev ? { ...prev, isActive: nextActive } : null));
    }

    if (!targetId) {
      console.warn('Brand has no id to toggle on backend:', brand.slug);
      return;
    }

    try {
      const updated = await api.patch<Brand>(`/admin/brands/${targetId}/toggle`);
      setBrands((prev) =>
        prev.map((b) =>
          (targetId && b.id === targetId) || b.slug === brand.slug ? { ...b, ...updated } : b,
        ),
      );
      if (
        selectedBrand &&
        ((targetId && selectedBrand.id === targetId) || selectedBrand.slug === brand.slug)
      ) {
        setSelectedBrand((prev) => (prev ? { ...prev, ...updated } : updated));
      }
    } catch (err) {
      console.error('Failed to toggle brand status:', err);
      // Rollback on failure
      setBrands((prev) =>
        prev.map((b) =>
          (targetId && b.id === targetId) || b.slug === brand.slug
            ? { ...b, isActive: currentActive }
            : b,
        ),
      );
      if (
        selectedBrand &&
        ((targetId && selectedBrand.id === targetId) || selectedBrand.slug === brand.slug)
      ) {
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
