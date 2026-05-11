// eslint-disable-next-line unicorn/filename-case
import { useEffect, useRef, useState } from 'react';

import { type AdvancedFilters, type ProductStatus } from '../types';

export function useProductActionBar(
  appliedAdvancedFilters: AdvancedFilters,
  setAppliedAdvancedFilters: (val: AdvancedFilters) => void,
) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(appliedAdvancedFilters);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalFilters(appliedAdvancedFilters);
    }
  }, [isFilterOpen, appliedAdvancedFilters]);

  const toggleCategory = (cat: string) => {
    const next = new Set(localFilters.categories);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    setLocalFilters({ ...localFilters, categories: next });
  };

  const toggleStore = (store: string) => {
    const next = new Set(localFilters.stores);
    if (next.has(store)) {
      next.delete(store);
    } else {
      next.add(store);
    }
    setLocalFilters({ ...localFilters, stores: next });
  };

  const toggleStatus = (status: ProductStatus) => {
    const next = new Set(localFilters.statuses);
    if (next.has(status)) {
      next.delete(status);
    } else {
      next.add(status);
    }
    setLocalFilters({ ...localFilters, statuses: next });
  };

  const applyFilters = () => {
    setAppliedAdvancedFilters(localFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const empty = {
      categories: new Set<string>(),
      statuses: new Set<ProductStatus>(),
      stores: new Set<string>(),
      minPrice: '',
      maxPrice: '',
    };
    setLocalFilters(empty);
    setAppliedAdvancedFilters(empty);
    setIsFilterOpen(false);
  };

  const isAdvancedActive =
    appliedAdvancedFilters.categories.size > 0 ||
    appliedAdvancedFilters.statuses.size > 0 ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    appliedAdvancedFilters.stores?.size > 0 ||
    appliedAdvancedFilters.minPrice !== '' ||
    appliedAdvancedFilters.maxPrice !== '';

  return {
    isFilterOpen,
    setIsFilterOpen,
    localFilters,
    setLocalFilters,
    popupRef,
    toggleCategory,
    toggleStore,
    toggleStatus,
    applyFilters,
    clearFilters,
    isAdvancedActive,
  };
}
