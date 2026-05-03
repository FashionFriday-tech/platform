'use client';

import { useProducts } from "./hooks/useProducts";
import { ProductActionBar } from "./components/ProductActionBar";
import { ProductTable } from "./components/ProductTable";
import { ProductGrid } from "./components/ProductGrid";

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
    setAppliedAdvancedFilters
  } = useProducts();

  return (
    <div className="w-full h-full animate-in fade-in duration-700 flex flex-col min-h-0">
      <div className="glass-panel p-6 flex flex-col flex-1 min-h-0">
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
        
        <div className="flex-1 min-h-0 -mx-6 px-6 pb-2">
          {viewMode === "list" ? (
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
