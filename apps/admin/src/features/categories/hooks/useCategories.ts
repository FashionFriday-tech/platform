'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import api from '@/lib/api-client';

import { type ProductCategory } from '../types';

function parseCategoryFilters(params: URLSearchParams | { get: (k: string) => string | null }): {
  search: string;
  selectedGender: 'Men' | 'Women';
} {
  const search = params.get('search') ?? '';
  const genderRaw = params.get('gender');
  const selectedGender: 'Men' | 'Women' = genderRaw === 'Women' ? 'Women' : 'Men';

  return { search, selectedGender };
}

export function useCategories() {
  const searchParams = useSearchParams();
  const [initialFilters] = useState(() => parseCategoryFilters(searchParams));

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women'>(
    initialFilters.selectedGender,
  );

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
    if (selectedGender !== 'Men') {
      params.set('gender', selectedGender);
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchQuery, selectedGender]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') {
        return;
      }
      isUpdatingFromUrl.current = true;
      const parsed = parseCategoryFilters(new URLSearchParams(window.location.search));
      setSearchQuery(parsed.search);
      setSelectedGender(parsed.selectedGender);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync when searchParams changes via Next router
  useEffect(() => {
    const parsed = parseCategoryFilters(searchParams);
    if (parsed.search !== searchQuery || parsed.selectedGender !== selectedGender) {
      isUpdatingFromUrl.current = true;
      setSearchQuery(parsed.search);
      setSelectedGender(parsed.selectedGender);
    }
  }, [searchParams]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ProductCategory | null>(null);

  const genders: ('Men' | 'Women')[] = ['Men', 'Women'];

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<
          | {
              id: string;
              name: string;
              slug: string;
              image?: string;
              gender?: string;
              _count?: { products?: number };
              productCount?: number;
            }[]
          | {
              data?: {
                id: string;
                name: string;
                slug: string;
                image?: string;
                gender?: string;
                _count?: { products?: number };
                productCount?: number;
              }[];
            }
        >('/admin/categories');
        const categoriesData = Array.isArray(data) ? data : (data.data ?? []);

        const mapped: ProductCategory[] = categoriesData.map((c) => {
          const rawGender = c.gender ?? 'MEN';
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.image ?? '',
            gender: (rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()) as
              | 'Men'
              | 'Women',
            productCount: c._count?.products ?? c.productCount ?? 0,
          };
        });
        setCategories(mapped);
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  const filteredCategories = useMemo(() => {
    let result = categories.filter((cat) => cat.gender === selectedGender);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((cat) => cat.name.toLowerCase().includes(q));
    }

    return result;
  }, [categories, searchQuery, selectedGender]);

  const handleReorderCategories = async (reorderedFiltered: ProductCategory[]) => {
    // Merge reordered subset into overall categories array
    const otherCategories = categories.filter((c) => c.gender !== selectedGender);
    const newCategories = [...reorderedFiltered, ...otherCategories];

    setCategories(newCategories);

    try {
      const payloadItems = reorderedFiltered.map((c, index) => ({
        id: c.id,
        position: index,
      }));

      await api.patch('/admin/categories/reorder', { items: payloadItems });
      toast.success('Category order saved!');
    } catch (err) {
      console.error('Failed to reorder categories', err);
      toast.error('Failed to save category order');
    }
  };

  const handleSaveCategory = async (
    savedCategory: ProductCategory,
    isEdit: boolean,
    originalSlug?: string,
  ) => {
    try {
      const apiPayload = {
        name: savedCategory.name,
        slug: savedCategory.slug,
        image: savedCategory.image ?? '',
        gender: savedCategory.gender.toUpperCase(),
      };

      if (isEdit) {
        const existingCat = categories.find(
          (c) => c.id === savedCategory.id || (originalSlug && c.slug === originalSlug),
        );
        if (existingCat) {
          const updated = await api.patch<{
            id: string;
            name: string;
            slug: string;
            image?: string;
            gender?: string;
          }>(`/admin/categories/${existingCat.id}`, apiPayload);

          const rawGender = updated.gender ?? savedCategory.gender;
          const normalized: ProductCategory = {
            ...savedCategory,
            id: updated.id,
            name: updated.name,
            slug: updated.slug,
            image: updated.image ?? '',
            gender: (rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()) as
              | 'Men'
              | 'Women',
          };

          setCategories((prev) =>
            prev.map((c) =>
              c.id === existingCat.id || (originalSlug && c.slug === originalSlug) ? normalized : c,
            ),
          );
          toast.success('Category updated successfully!');
        }
      } else {
        const created = await api.post<{
          id: string;
          name: string;
          slug: string;
          image?: string;
          gender?: string;
        }>('/admin/categories', apiPayload);

        const rawGender = created.gender ?? 'MEN';
        setCategories((prev) => [
          {
            id: created.id,
            name: created.name,
            slug: created.slug,
            image: created.image ?? '',
            gender: (rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()) as
              | 'Men'
              | 'Women',
            productCount: 0,
          },
          ...prev,
        ]);
        toast.success('Category created successfully!');
      }
    } catch (err: any) {
      console.error('Failed to save category via API', err);
      toast.error(err?.message || 'An error occurred while saving the category');
    }
  };

  const handleDeleteCategory = async (idOrSlug: string) => {
    try {
      const cat = categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
      if (!cat) {
        return false;
      }

      // Clean up Cloudflare image if remote
      if (cat.image && cat.image.startsWith('http') && !cat.image.includes('localhost')) {
        api
          .delete('/admin/upload/batch', {
            body: JSON.stringify({ urls: [cat.image] }),
          })
          .catch((err: unknown) => {
            console.error('Failed to cleanup category image:', err);
          });
      }

      await api.delete(`/admin/categories/${cat.id}`);

      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success('Category deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Failed to delete category via API', err);
      toast.error(err?.message || 'Failed to delete category');
      return false;
    }
  };

  return {
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedGender,
    setSelectedGender,
    genders,
    filteredCategories,
    isAddModalOpen,
    setIsAddModalOpen,
    categoryToEdit,
    setCategoryToEdit,
    handleReorderCategories,
    handleSaveCategory,
    handleDeleteCategory,
  };
}
