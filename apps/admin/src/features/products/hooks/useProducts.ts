import { useCallback, useEffect, useState } from 'react';

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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState<ProductStatsData>({
    total: 0,
    active: 0,
    inactive: 0,
    draft: 0,
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  // Reset page to 1 when filters, search, sort, or page size change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, appliedAdvancedFilters, sortOption, pageSize]);

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

  // Fetch overall inventory stats (independent of page/filter)
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

  // Load products based on pagination, filters, and sorting
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);

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

      const minPriceNum = appliedAdvancedFilters.minPrice
        ? parseFloat(appliedAdvancedFilters.minPrice)
        : undefined;
      const maxPriceNum = appliedAdvancedFilters.maxPrice
        ? parseFloat(appliedAdvancedFilters.maxPrice)
        : undefined;

      const res = await fetchProductsPaginated({
        page,
        limit: pageSize,
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
      setTotalPages(Math.max(1, res.meta.totalPages));
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearchQuery, appliedAdvancedFilters, sortOption]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

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
      toast.success('Product deleted successfully');
      void loadStats();

      // If we deleted the only item on the page and page > 1, go back one page
      if (products.length <= 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        void loadProducts();
      }
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return {
    products,
    isLoading,
    isStatsLoading,
    stats,
    totalProducts,
    page,
    totalPages,
    pageSize,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
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
    refreshProducts: loadProducts,
    refreshStats: loadStats,
  };
}
