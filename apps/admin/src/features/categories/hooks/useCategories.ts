'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { type ProductCategory } from '../types';

function parseCategoryFilters(params: URLSearchParams | { get: (k: string) => string | null }) {
  const search = params.get('search') ?? '';
  const genderRaw = params.get('gender');
  const selectedGender = (genderRaw === 'Women' ? 'Women' : 'Men') as 'Men' | 'Women';

  return { search, selectedGender };
}

export function useCategories() {
  const searchParams = useSearchParams();
  const initial = useRef<ReturnType<typeof parseCategoryFilters> | null>(null);
  if (!initial.current) {
    initial.current = parseCategoryFilters(searchParams);
  }

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initial.current.search);
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women'>(initial.current.selectedGender);

  const isUpdatingFromUrl = useRef(false);

  // Sync state to URL search params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedGender !== 'Men') params.set('gender', selectedGender);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchQuery, selectedGender]);

  // Handle browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories`,
        );
        const data = (await res.json()) as
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
            };
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

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: payloadItems }),
        },
      );
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
        const existingCat = categories.find((c) => c.slug === originalSlug);
        if (existingCat) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories/${existingCat.id}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(apiPayload),
            },
          );
          if (res.ok) {
            setCategories((prev) => prev.map((c) => (c.slug === originalSlug ? savedCategory : c)));
            toast.success('Category updated successfully!');
          } else {
            toast.error('Failed to update category');
          }
        }
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload),
          },
        );

        if (res.ok) {
          const created = (await res.json()) as {
            id: string;
            name: string;
            slug: string;
            image?: string;
            gender?: string;
          };
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
        } else {
          toast.error('Failed to create category');
        }
      }
    } catch (err) {
      console.error('Failed to save category via API', err);
      toast.error('An error occurred while saving the category');
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/upload/batch`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [cat.image] }),
        }).catch((err: unknown) => {
          console.error('Failed to cleanup category image:', err);
        });
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories/${cat.id}`,
        { method: 'DELETE' },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete category');
      }

      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success('Category deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Failed to delete category via API', err);
      toast.error(err.message || 'Failed to delete category');
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
