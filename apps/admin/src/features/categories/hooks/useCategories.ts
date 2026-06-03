'use client';

import { useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { MOCK_CATEGORIES, type ProductCategory } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women'>('Men');

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

  const handleDeleteCategory = async (slug: string) => {
    try {
      const cat = categories.find((c) => c.slug === slug);
      if (cat) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/categories/${cat.id}`,
          { method: 'DELETE' },
        );
        setCategories((prev) => prev.filter((c) => c.slug !== slug));
        toast.success('Category deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete category via API', err);
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
