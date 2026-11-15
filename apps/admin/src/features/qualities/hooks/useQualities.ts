'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';

import {
  createQuality,
  deleteQuality,
  fetchQualities,
  reorderQualities,
  updateQuality,
} from '../services/api';
import { type QualityItem } from '../types';

export function useQualities() {
  const [qualities, setQualities] = useState<QualityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [qualityToEdit, setQualityToEdit] = useState<QualityItem | null>(null);

  const loadQualities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchQualities();
      setQualities(data);
    } catch (err) {
      console.error('Failed to load qualities:', err);
      toast.error('Failed to load qualities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQualities();
  }, [loadQualities]);

  const handleSaveQuality = async (
    name: string,
    description: string,
    categories: string[],
    isEdit: boolean,
    id?: string,
  ) => {
    try {
      if (isEdit && id) {
        const updated = await updateQuality(id, { name, description, categories });
        setQualities((prev) => prev.map((q) => (q.id === id ? { ...q, ...updated } : q)));
        toast.success(`Quality "${name}" updated successfully`);
      } else {
        const created = await createQuality({
          name,
          description,
          categories,
          position: qualities.length,
        });
        setQualities((prev) => [...prev, created]);
        toast.success(`Quality "${name}" created successfully`);
      }
      setIsAddModalOpen(false);
      setQualityToEdit(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save quality';
      toast.error(msg);
      throw err;
    }
  };

  const handleDeleteQuality = async (id: string) => {
    try {
      await deleteQuality(id);
      setQualities((prev) => prev.filter((q) => q.id !== id));
      toast.success('Quality deleted successfully');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete quality';
      toast.error(msg);
      throw err;
    }
  };

  const handleReorderQualities = async (reordered: QualityItem[]) => {
    setQualities(reordered);

    try {
      const payloadItems = reordered.map((item, index) => ({
        id: item.id,
        position: index,
      }));
      await reorderQualities(payloadItems);
      toast.success('Quality order saved');
    } catch (err) {
      console.error('Failed to reorder qualities:', err);
      toast.error('Failed to save order');
      await loadQualities();
    }
  };

  const allAvailableCategories = useMemo(() => {
    const set = new Set<string>(['Footwear', 'Watches', 'Clothing', 'Accessories']);
    qualities.forEach((q) => {
      q.categories.forEach((cat) => {
        if (cat?.trim()) {
          set.add(cat.trim());
        }
      });
    });
    return Array.from(set);
  }, [qualities]);

  const filteredQualities = useMemo(() => {
    let result = [...qualities];

    if (selectedCategory && selectedCategory !== 'All') {
      const target = selectedCategory.toLowerCase();
      result = result.filter((q) => q.categories.some((c) => c.toLowerCase() === target));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.categories.some((c) => c.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [qualities, selectedCategory, searchQuery]);

  return {
    qualities,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    allAvailableCategories,
    filteredQualities,
    isAddModalOpen,
    setIsAddModalOpen,
    qualityToEdit,
    setQualityToEdit,
    handleSaveQuality,
    handleDeleteQuality,
    handleReorderQualities,
    refresh: loadQualities,
  };
}
