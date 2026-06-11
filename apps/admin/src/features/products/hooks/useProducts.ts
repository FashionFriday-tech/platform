import { useEffect, useMemo, useState } from 'react';

import { toast } from 'sonner';

import {
  deleteProduct as deleteProductApi,
  fetchProducts,
  updateProductStatus,
} from '../services/api';
import {
  type AdvancedFilters,
  type ColumnId,
  type Product,
  type SortOption,
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
    void loadData();
  }, []);

  const toggleProductStatus = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) {
      return;
    }
    if (target.status === 'Draft') {
      toast.info('Drafted products cannot be activated directly. Please edit and publish.');
      return;
    }

    const previousStatus = target.status;
    const newStatus: 'Active' | 'Inactive' = previousStatus === 'Active' ? 'Inactive' : 'Active';

    // Optimistic UI update
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));

    try {
      await updateProductStatus(id, newStatus);
      toast.success(`Product marked as ${newStatus}`);
    } catch (err: unknown) {
      console.error('Failed to update product status:', err);
      // Revert on failure
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: previousStatus } : p)));
      toast.error(
        (err instanceof Error ? err.message : null) ??
          'Failed to update product status in database',
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => {
        if (prev.has(id)) {
          const next = new Set(prev);
          next.delete(id);
          return next;
        }
        return prev;
      });
      toast.success('Product deleted successfully');
      return true;
    } catch (err: unknown) {
      console.error('Failed to delete product:', err);
      toast.error(
        (err instanceof Error ? err.message : null) ?? 'Failed to delete product from database',
      );
      return false;
    }
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
    deleteProduct,
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
