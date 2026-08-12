'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  createColor as createColorApi,
  deleteColor as deleteColorApi,
  fetchColors,
  updateColor as updateColorApi,
} from '../services/api';
import { type Color, type CreateColorInput, type UpdateColorInput } from '../types';

export function useColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colorToEdit, setColorToEdit] = useState<Color | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadColors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchColors();
      setColors(data);
    } catch (err: any) {
      console.error('Failed to load colors:', err);
      toast.error('Failed to load colors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadColors();
  }, [loadColors]);

  const filteredColors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return colors;
    }
    return colors.filter(
      (c) => c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q),
    );
  }, [colors, searchQuery]);

  const openAddModal = () => {
    setColorToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (color: Color) => {
    setColorToEdit(color);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setColorToEdit(null);
  };

  const handleSaveColor = async (input: CreateColorInput | UpdateColorInput) => {
    setIsSaving(true);
    try {
      if (colorToEdit) {
        const updated = await updateColorApi(colorToEdit.id, input);
        setColors((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success(`Color "${updated.name}" updated successfully`);
      } else {
        const created = await createColorApi(input as CreateColorInput);
        setColors((prev) => [created, ...prev]);
        toast.success(`Color "${created.name}" created successfully`);
      }
      closeModal();
    } catch (err: any) {
      console.error('Error saving color:', err);
      toast.error(err?.message || 'Failed to save color');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteColor = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteColorApi(id);
      setColors((prev) => prev.filter((c) => c.id !== id));
      toast.success('Color deleted successfully');
      setColorToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete color:', err);
      toast.error(err?.message || 'Failed to delete color');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    colors,
    filteredColors,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    colorToEdit,
    isSaving,
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveColor,
    colorToDelete,
    setColorToDelete,
    isDeleting,
    handleDeleteColor,
    refreshColors: loadColors,
  };
}
