'use client';

import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib/api-client';
import { type ProductCollection } from '../types';

export function useCollections() {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await api.get<ProductCollection[]>('/admin/collections');
      setCollections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch collections', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCollections();
  }, []);

  const handleAddCollection = async (name: string, image: string, slug: string) => {
    try {
      await api.post('/admin/collections', { name, slug, image });
      await fetchCollections();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create collection', error);
    }
  };

  const handleUpdateCollection = async (id: string, name: string, image: string, slug: string) => {
    try {
      await api.patch(`/admin/collections/${id}`, { name, slug, image });
      await fetchCollections();
    } catch (error) {
      console.error('Failed to update collection', error);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const col = collections.find((c) => c.id === id);

      // Clean up Cloudflare R2 image if applicable
      if (col?.image && col.image.startsWith('http') && !col.image.includes('localhost')) {
        try {
          await api.post('/admin/upload/batch', { urls: [col.image] }, { method: 'DELETE' as any });
        } catch (err) {
          console.error('Failed to cleanup collection image from Cloudflare R2:', err);
        }
      }

      await api.delete(`/admin/collections/${id}`);
      await fetchCollections();
    } catch (error) {
      console.error('Failed to delete collection', error);
    }
  };

  const filteredCollections = useMemo(() => {
    let result = [...collections];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((col) => col.name.toLowerCase().includes(q));
    }
    return result;
  }, [collections, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    filteredCollections,
    loading,
    handleAddCollection,
    handleUpdateCollection,
    handleDeleteCollection,
  };
}
