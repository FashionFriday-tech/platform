import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
  type ProductStatus,
  type SortOption,
  type ViewMode,
} from '../types';

const PAGE_SIZE = 40;

function parseFilters(params: URLSearchParams | { get: (k: string) => string | null }): {
  search: string;
  sort: SortOption;
  appliedAdvancedFilters: AdvancedFilters;
  view: ViewMode;
  columns: Set<ColumnId>;
} {
  const search = params.get('search') ?? '';
  const sort = (params.get('sort') as SortOption) ?? 'Default';

  const categoriesRaw = params.get('categories') ?? params.get('category');
  const categories = new Set(
    categoriesRaw
      ? categoriesRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  );

  const statusesRaw = params.get('statuses') ?? params.get('status');
  const statuses = new Set<ProductStatus>(
    statusesRaw
      ? (statusesRaw
          .split(',')
          .map((s) => s.trim())
          .filter((s) => ['Active', 'Inactive', 'Draft'].includes(s)) as ProductStatus[])
      : [],
  );

  const storesRaw = params.get('stores') ?? params.get('store');
  const stores = new Set(
    storesRaw
      ? storesRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  );

  const brandsRaw = params.get('brands') ?? params.get('brand');
  const brands = new Set(
    brandsRaw
      ? brandsRaw
          .split(',')
          .map((b) => b.trim())
          .filter(Boolean)
      : [],
  );

  const qualitiesRaw = params.get('qualities') ?? params.get('quality');
  const qualities = new Set(
    qualitiesRaw
      ? qualitiesRaw
          .split(',')
          .map((q) => q.trim())
          .filter(Boolean)
      : [],
  );

  const minPrice = params.get('minPrice') ?? '';
  const maxPrice = params.get('maxPrice') ?? '';
  const view = params.get('view') === 'grid' ? 'grid' : 'list';

  const colsRaw = params.get('columns');
  const columns = colsRaw
    ? new Set(colsRaw.split(',').map((c) => c.trim()) as ColumnId[])
    : new Set<ColumnId>(['Category', 'Stock']);

  return {
    search,
    sort,
    appliedAdvancedFilters: {
      categories,
      statuses,
      stores,
      brands,
      qualities,
      minPrice,
      maxPrice,
    },
    view,
    columns,
  };
}

export function useProducts() {
  const searchParams = useSearchParams();

  // Parse initial filters from current URL search params
  const [initialFilters] = useState(() => parseFilters(searchParams));

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

  // Filters & sorting initialized from URL
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialFilters.search);
  const [sortOption, setSortOption] = useState<SortOption>(initialFilters.sort);

  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState<AdvancedFilters>(
    initialFilters.appliedAdvancedFilters,
  );

  const [viewMode, setViewMode] = useState<ViewMode>(initialFilters.view);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnId>>(initialFilters.columns);

  const isUpdatingFromUrl = useRef(false);

  // Sync state changes to URL search parameters
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (debouncedSearchQuery.trim()) {
      params.set('search', debouncedSearchQuery.trim());
    }

    if (appliedAdvancedFilters.categories.size > 0) {
      params.set('categories', Array.from(appliedAdvancedFilters.categories).join(','));
    }

    if (appliedAdvancedFilters.statuses.size > 0) {
      params.set('statuses', Array.from(appliedAdvancedFilters.statuses).join(','));
    }

    if (appliedAdvancedFilters.stores && appliedAdvancedFilters.stores.size > 0) {
      params.set('stores', Array.from(appliedAdvancedFilters.stores).join(','));
    }

    if (appliedAdvancedFilters.brands && appliedAdvancedFilters.brands.size > 0) {
      params.set('brands', Array.from(appliedAdvancedFilters.brands).join(','));
    }

    if (appliedAdvancedFilters.qualities && appliedAdvancedFilters.qualities.size > 0) {
      params.set('qualities', Array.from(appliedAdvancedFilters.qualities).join(','));
    }

    if (appliedAdvancedFilters.minPrice) {
      params.set('minPrice', appliedAdvancedFilters.minPrice);
    }

    if (appliedAdvancedFilters.maxPrice) {
      params.set('maxPrice', appliedAdvancedFilters.maxPrice);
    }

    if (sortOption && sortOption !== 'Default') {
      params.set('sort', sortOption);
    }

    if (viewMode && viewMode !== 'list') {
      params.set('view', viewMode);
    }

    const defaultCols = new Set(['Category', 'Stock']);
    const isDefaultCols =
      visibleColumns.size === defaultCols.size &&
      Array.from(visibleColumns).every((c) => defaultCols.has(c));
    if (!isDefaultCols && visibleColumns.size > 0) {
      params.set('columns', Array.from(visibleColumns).join(','));
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [debouncedSearchQuery, appliedAdvancedFilters, sortOption, viewMode, visibleColumns]);

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') {
        return;
      }
      isUpdatingFromUrl.current = true;
      const currentParams = new URLSearchParams(window.location.search);
      const parsed = parseFilters(currentParams);

      setSearchQuery(parsed.search);
      setDebouncedSearchQuery(parsed.search);
      setSortOption(parsed.sort);
      setAppliedAdvancedFilters(parsed.appliedAdvancedFilters);
      setViewMode(parsed.view);
      setVisibleColumns(parsed.columns);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync state when searchParams changes via Next.js router navigation
  useEffect(() => {
    const parsed = parseFilters(searchParams);

    const isSearchDiff = parsed.search !== debouncedSearchQuery;
    const isSortDiff = parsed.sort !== sortOption;
    const isViewDiff = parsed.view !== viewMode;
    const isCatsDiff =
      parsed.appliedAdvancedFilters.categories.size !== appliedAdvancedFilters.categories.size ||
      Array.from(parsed.appliedAdvancedFilters.categories).some(
        (c) => !appliedAdvancedFilters.categories.has(c),
      );
    const isStatusDiff =
      parsed.appliedAdvancedFilters.statuses.size !== appliedAdvancedFilters.statuses.size ||
      Array.from(parsed.appliedAdvancedFilters.statuses).some(
        (s) => !appliedAdvancedFilters.statuses.has(s),
      );
    const isStoresDiff =
      (parsed.appliedAdvancedFilters.stores?.size ?? 0) !==
        (appliedAdvancedFilters.stores?.size ?? 0) ||
      Array.from(parsed.appliedAdvancedFilters.stores ?? []).some(
        (s) => !appliedAdvancedFilters.stores?.has(s),
      );
    const isBrandsDiff =
      (parsed.appliedAdvancedFilters.brands?.size ?? 0) !==
        (appliedAdvancedFilters.brands?.size ?? 0) ||
      Array.from(parsed.appliedAdvancedFilters.brands ?? []).some(
        (b) => !appliedAdvancedFilters.brands?.has(b),
      );
    const isQualitiesDiff =
      (parsed.appliedAdvancedFilters.qualities?.size ?? 0) !==
        (appliedAdvancedFilters.qualities?.size ?? 0) ||
      Array.from(parsed.appliedAdvancedFilters.qualities ?? []).some(
        (q) => !appliedAdvancedFilters.qualities?.has(q),
      );
    const isMinPriceDiff =
      parsed.appliedAdvancedFilters.minPrice !== appliedAdvancedFilters.minPrice;
    const isMaxPriceDiff =
      parsed.appliedAdvancedFilters.maxPrice !== appliedAdvancedFilters.maxPrice;

    if (
      isSearchDiff ||
      isSortDiff ||
      isViewDiff ||
      isCatsDiff ||
      isStatusDiff ||
      isStoresDiff ||
      isBrandsDiff ||
      isQualitiesDiff ||
      isMinPriceDiff ||
      isMaxPriceDiff
    ) {
      isUpdatingFromUrl.current = true;
      setSearchQuery(parsed.search);
      setDebouncedSearchQuery(parsed.search);
      setSortOption(parsed.sort);
      setAppliedAdvancedFilters(parsed.appliedAdvancedFilters);
      setViewMode(parsed.view);
      setVisibleColumns(parsed.columns);
    }
  }, [searchParams]);

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
        brands:
          appliedAdvancedFilters.brands && appliedAdvancedFilters.brands.size > 0
            ? Array.from(appliedAdvancedFilters.brands)
            : undefined,
        qualities:
          appliedAdvancedFilters.qualities && appliedAdvancedFilters.qualities.size > 0
            ? Array.from(appliedAdvancedFilters.qualities)
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
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }
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
        brands:
          appliedAdvancedFilters.brands && appliedAdvancedFilters.brands.size > 0
            ? Array.from(appliedAdvancedFilters.brands)
            : undefined,
        qualities:
          appliedAdvancedFilters.qualities && appliedAdvancedFilters.qualities.size > 0
            ? Array.from(appliedAdvancedFilters.qualities)
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
