'use client';

import { useProducts } from '../hooks/useProducts';
import { ProductActionBar } from './ProductActionBar';
import { ProductGrid } from './ProductGrid';
import { ProductPagination } from './ProductPagination';
import { ProductStats } from './ProductStats';
import { ProductTable } from './ProductTable';

export function ProductListView() {
  const {
    products,
    isLoading,
    isStatsLoading,
    stats,
    totalProducts,
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    toggleProductStatus,
    deleteProduct,
    viewMode,
    setViewMode,
    visibleColumns,
    toggleColumn,
    appliedAdvancedFilters,
    setAppliedAdvancedFilters,
  } = useProducts();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-4 overflow-hidden">
      <ProductStats stats={stats} isLoading={isStatsLoading} products={products} />

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <ProductActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          appliedAdvancedFilters={appliedAdvancedFilters}
          setAppliedAdvancedFilters={setAppliedAdvancedFilters}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {viewMode === 'list' ? (
            <ProductTable
              products={products}
              isLoading={isLoading}
              onToggleStatus={toggleProductStatus}
              onDeleteProduct={deleteProduct}
              sortOption={sortOption}
              setSortOption={setSortOption}
              visibleColumns={visibleColumns}
            />
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onToggleStatus={toggleProductStatus}
              onDeleteProduct={deleteProduct}
              totalProducts={totalProducts}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </div>

        {/* Dynamic Pagination Controls */}
        <ProductPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalProducts}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
