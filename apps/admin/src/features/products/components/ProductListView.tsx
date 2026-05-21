'use client';

import { useProducts } from '../hooks/useProducts';
import { ProductActionBar } from './ProductActionBar';
import { ProductGrid } from './ProductGrid';
import { ProductStats } from './ProductStats';
import { ProductTable } from './ProductTable';

export function ProductListView() {
  const {
    products,
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
  } = useProducts();

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-6 overflow-hidden">
      <ProductStats products={products} />

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
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              onToggleAllSelection={toggleAllSelection}
              sortOption={sortOption}
              setSortOption={setSortOption}
              visibleColumns={visibleColumns}
            />
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onToggleStatus={toggleProductStatus}
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              onToggleAllSelection={toggleAllSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
