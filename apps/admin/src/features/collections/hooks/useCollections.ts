'use client';

import { useMemo, useState } from 'react';

import { MOCK_COLLECTIONS, type ProductCollection } from '../types';

export function useCollections() {
  const [collections, setCollections] = useState<ProductCollection[]>(MOCK_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCollection = (name: string, image: string, slug: string) => {
    const newCol: ProductCollection = {
      id: `col_${Date.now()}`,
      name,
      slug,
      image:
        image ||
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
      productCount: 0,
    };
    setCollections((prev) => [newCol, ...prev]);
    setIsAddModalOpen(false);
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
    handleAddCollection,
  };
}
