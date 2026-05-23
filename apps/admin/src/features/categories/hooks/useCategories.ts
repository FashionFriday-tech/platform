'use client';

import { useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProductCategory } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women' | 'Unisex'>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ProductCategory | null>(null);

  const genders: ('All' | 'Men' | 'Women' | 'Unisex')[] = ['All', 'Men', 'Women', 'Unisex'];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/categories`);
        const data = await res.json();
        // data usually comes back directly or in data depending on backend
        const categoriesData = Array.isArray(data) ? data : data.data || [];
        
        // Map backend category to frontend ProductCategory
        const mapped = categoriesData.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image,
          gender: c.gender.charAt(0).toUpperCase() + c.gender.slice(1).toLowerCase(),
          productCount: c._count?.products || c.productCount || 0,
        }));
        
        setCategories(mapped);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (selectedGender !== 'All') {
      result = result.filter((cat) => cat.gender === selectedGender);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((cat) => cat.name.toLowerCase().includes(q));
    }

    return result;
  }, [categories, searchQuery, selectedGender]);

  const handleSaveCategory = async (
    savedCategory: ProductCategory,
    isEdit: boolean,
    originalSlug?: string,
  ) => {
    try {
      const apiPayload = {
        ...savedCategory,
        gender: savedCategory.gender.toUpperCase(),
      };

      if (isEdit) {
        // Find existing category to get ID
        const existingCat = categories.find((c) => c.slug === originalSlug);
        if (existingCat) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/categories/${existingCat.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload),
          });
          if (res.ok) {
            setCategories((prev) => prev.map((c) => (c.slug === originalSlug ? savedCategory : c)));
            toast.success('Category updated successfully!');
          } else {
            toast.error('Failed to update category');
          }
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        });
        if (res.ok) {
          const created = await res.json();
          setCategories((prev) => [
            {
              id: created.id,
              name: created.name,
              slug: created.slug,
              image: created.image,
              gender: created.gender.charAt(0).toUpperCase() + created.gender.slice(1).toLowerCase(),
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
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/categories/${cat.id}`, { method: 'DELETE' });
        setCategories((prev) => prev.filter((c) => c.slug !== slug));
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
    handleSaveCategory,
    handleDeleteCategory,
  };
}

