'use client';

import { useProducts } from './hooks/useProducts';
import { ProductActionBar } from './components/ProductActionBar';
import { ProductTable } from './components/ProductTable';
import { ProductGrid } from './components/ProductGrid';

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
    <div className="animate-in fade-in flex h-full min-h-0 w-full flex-col duration-700">
      <div className="glass-panel flex min-h-0 flex-1 flex-col p-6">
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

        <div className="-mx-6 min-h-0 flex-1 px-6 pb-2">
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
