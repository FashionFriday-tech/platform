import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import {
  deleteProduct as deleteProductApi,
  fetchProductsPaginated,
  fetchProductStats,
  type ProductStatsData,
  updateProductStatus,
} from '../services/api';
import {
  type AdvancedFilters,
  type ColumnId,
  type Product,
  type SortOption,
  type ViewMode,
} from '../types';

const PAGE_SIZE = 40;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState<ProductStatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    draft: 0,
  });

  // Dynamic pagination state
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
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

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Fetch overall inventory stats
  const loadStats = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      const data = await fetchProductStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load product stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  // Helper to parse sorting parameters
  const getSortParams = useCallback(() => {
    let sortBy: string | undefined;
    let sortOrder: 'asc' | 'desc' | undefined;

    switch (sortOption) {
      case 'Price: Low to High':
        sortBy = 'price';
        sortOrder = 'asc';
        break;
      case 'Price: High to Low':
        sortBy = 'price';
        sortOrder = 'desc';
        break;
      case 'Name: A to Z':
        sortBy = 'name';
        sortOrder = 'asc';
        break;
      case 'Name: Z to A':
        sortBy = 'name';
        sortOrder = 'desc';
        break;
      default:
        sortBy = 'createdAt';
        sortOrder = 'desc';
        break;
    }
    return { sortBy, sortOrder };
  }, [sortOption]);

  // Initial load or when filters/search/sort change
  const loadInitialProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setPage(1);

      const { sortBy, sortOrder } = getSortParams();
      const minPriceNum = appliedAdvancedFilters.minPrice
        ? parseFloat(appliedAdvancedFilters.minPrice)
        : undefined;
      const maxPriceNum = appliedAdvancedFilters.maxPrice
        ? parseFloat(appliedAdvancedFilters.maxPrice)
        : undefined;

      const res = await fetchProductsPaginated({
        page: 1,
        limit: PAGE_SIZE,
        search: debouncedSearchQuery || undefined,
        categories:
          appliedAdvancedFilters.categories.size > 0
            ? Array.from(appliedAdvancedFilters.categories)
            : undefined,
        statuses:
          appliedAdvancedFilters.statuses.size > 0
            ? Array.from(appliedAdvancedFilters.statuses)
            : undefined,
        minPrice: !isNaN(Number(minPriceNum)) ? minPriceNum : undefined,
        maxPrice: !isNaN(Number(maxPriceNum)) ? maxPriceNum : undefined,
        sortBy,
        sortOrder,
      });

      setProducts(res.data);
      setTotalProducts(res.meta.total);
      setHasMore(res.data.length < res.meta.total);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, appliedAdvancedFilters, getSortParams]);

  useEffect(() => {
    void loadInitialProducts();
  }, [loadInitialProducts]);

  // Dynamic pagination: Load more products when scrolling down
  const pageRef = useRef(page);
  pageRef.current = page;

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;
      const { sortBy, sortOrder } = getSortParams();
      const minPriceNum = appliedAdvancedFilters.minPrice
        ? parseFloat(appliedAdvancedFilters.minPrice)
        : undefined;
      const maxPriceNum = appliedAdvancedFilters.maxPrice
        ? parseFloat(appliedAdvancedFilters.maxPrice)
        : undefined;

      const res = await fetchProductsPaginated({
        page: nextPage,
        limit: PAGE_SIZE,
        search: debouncedSearchQuery || undefined,
        categories:
          appliedAdvancedFilters.categories.size > 0
            ? Array.from(appliedAdvancedFilters.categories)
            : undefined,
        statuses:
          appliedAdvancedFilters.statuses.size > 0
            ? Array.from(appliedAdvancedFilters.statuses)
            : undefined,
        minPrice: !isNaN(Number(minPriceNum)) ? minPriceNum : undefined,
        maxPrice: !isNaN(Number(maxPriceNum)) ? maxPriceNum : undefined,
        sortBy,
        sortOrder,
      });

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = res.data.filter((p) => !existingIds.has(p.id));
        const combined = [...prev, ...newUnique];
        setHasMore(combined.length < res.meta.total);
        return combined;
      });

      setPage(nextPage);
      setTotalProducts(res.meta.total);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoading,
    isLoadingMore,
    hasMore,
    debouncedSearchQuery,
    appliedAdvancedFilters,
    getSortParams,
  ]);

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
      void loadStats();
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
      setTotalProducts((prev) => Math.max(0, prev - 1));
      toast.success('Product deleted successfully');
      void loadStats();
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

  return {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    isStatsLoading,
    stats,
    totalProducts,
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
    refreshProducts: loadInitialProducts,
    refreshStats: loadStats,
  };
}
