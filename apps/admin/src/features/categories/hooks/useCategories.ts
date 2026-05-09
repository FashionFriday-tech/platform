'use client';

import { useState, useMemo } from 'react';
import { MOCK_CATEGORIES, ProductCategory } from '../types';

export function useCategories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All');

  const genders: ('All' | 'Men' | 'Women')[] = ['All', 'Men', 'Women'];

  const filteredCategories = useMemo(() => {
    let result = [...MOCK_CATEGORIES];

    if (selectedGender !== 'All') {
      result = result.filter(cat => cat.gender === selectedGender);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(cat => cat.name.toLowerCase().includes(q));
    }

    return result;
  }, [searchQuery, selectedGender]);

  return {
    searchQuery,
    setSearchQuery,
    selectedGender,
    setSelectedGender,
    genders,
    filteredCategories,
  };
}
