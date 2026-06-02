'use client';

import { useEffect, useMemo, useState } from 'react';

import { type ProductCollection } from '../types';

export function useCollections() {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/collections`,
      );
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Failed to fetch collections', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleAddCollection = async (name: string, image: string, slug: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/collections`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug, image }),
        },
      );
      if (res.ok) {
        await fetchCollections();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to create collection', error);
    }
  };

  const handleUpdateCollection = async (id: string, name: string, image: string, slug: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/collections/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug, image }),
        },
      );
      if (res.ok) {
        await fetchCollections();
      }
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
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/upload/batch`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ urls: [col.image] }),
            },
          );
        } catch (err) {
          console.error('Failed to cleanup collection image from Cloudflare R2:', err);
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/collections/${id}`,
        {
          method: 'DELETE',
        },
      );
      if (res.ok) {
        await fetchCollections();
      }
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
