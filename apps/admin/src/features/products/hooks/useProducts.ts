import { useEffect, useMemo, useState } from 'react';

import { fetchProducts } from '../services/api';
import {
  type AdvancedFilters,
  type ColumnId,
  type Product,
  type SortOption,
  StatusFilter,
  type ViewMode,
} from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('Default');

  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState<AdvancedFilters>({
    categories: new Set(),
    statuses: new Set(),
    stores: new Set(),
    minPrice: '',
    maxPrice: '',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnId>>(
    new Set(['Category', 'Stock']),
  );

  const toggleColumn = (col: ColumnId) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(col)) {
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleProductStatus = (id: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          if (p.status === 'Draft') {
            return p;
          } // Never activate drafted products
          return { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' };
        }
        return p;
      }),
    );
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllSelection = (ids: string[]) => {
    if (selectedIds.size === ids.length && ids.length > 0) {
      setSelectedIds(new Set()); // deselect all if all are currently selected
    } else {
      setSelectedIds(new Set(ids)); // select all
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }

    // Advanced Filters
    if (appliedAdvancedFilters.categories.size > 0) {
      result = result.filter((p) => appliedAdvancedFilters.categories.has(p.category));
    }
    if (appliedAdvancedFilters.statuses.size > 0) {
      result = result.filter((p) => appliedAdvancedFilters.statuses.has(p.status));
    }
    if (appliedAdvancedFilters.stores.size > 0) {
      result = result.filter((p) => appliedAdvancedFilters.stores.has(p.store));
    }
    if (appliedAdvancedFilters.minPrice !== '') {
      const min = parseFloat(appliedAdvancedFilters.minPrice);
      if (!isNaN(min)) {
        result = result.filter((p) => p.sellingPrice >= min);
      }
    }
    if (appliedAdvancedFilters.maxPrice !== '') {
      const max = parseFloat(appliedAdvancedFilters.maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p) => p.sellingPrice <= max);
      }
    }

    // Sorting
    switch (sortOption) {
      case 'Price: Low to High':
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'Name: A to Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name: Z to A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, sortOption, appliedAdvancedFilters]);

  return {
    products: filteredProducts,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    toggleProductStatus,
    viewMode,
    setViewMode,
    selectedIds,
    toggleSelection,
    toggleAllSelection,
    visibleColumns,
    toggleColumn,
    appliedAdvancedFilters,
    setAppliedAdvancedFilters,
  };
}
