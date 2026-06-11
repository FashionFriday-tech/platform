import { type ColumnId, type Product, type SortOption } from '../types';

interface Props {
  allSelected: boolean;
  products: Product[];
  onToggleAllSelection: (ids: string[]) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  visibleColumns: Set<ColumnId>;
  gridTemplateColumns?: string;
}

export function ProductTableHeader({
  allSelected,
  products,
  onToggleAllSelection,
  sortOption,
  setSortOption,
  visibleColumns,
  gridTemplateColumns,
}: Props) {
  return (
    <div className="sticky top-0 z-20 pb-0.5">
      <div
        style={{ gridTemplateColumns }}
        className="grid items-center rounded-xl border border-black/10 bg-black px-6 py-3.5 text-xs font-semibold tracking-wider text-white uppercase shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm"
      >
        {/* Select & Product Info */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => {
              onToggleAllSelection(products.map((p) => p.id));
            }}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${
              allSelected
                ? 'border-white bg-white text-black dark:border-black dark:bg-black dark:text-white'
                : 'border-white/40 hover:border-white dark:border-black/40 dark:hover:border-black'
            }`}
          >
            {allSelected && (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <div
            className="flex cursor-pointer items-center space-x-1 hover:text-white/80 dark:hover:text-black/80"
            onClick={() => {
              setSortOption(sortOption === 'Name: A to Z' ? 'Name: Z to A' : 'Name: A to Z');
            }}
          >
            <span className={sortOption.includes('Name') ? 'font-bold' : ''}>Product info</span>
            <svg
              className={`h-3 w-3 transition-transform ${
                sortOption === 'Name: Z to A'
                  ? 'rotate-180 text-white dark:text-black'
                  : sortOption === 'Name: A to Z'
                    ? 'text-white dark:text-black'
                    : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {visibleColumns.has('Category') && <div>Category</div>}
        {visibleColumns.has('Cost Price') && <div>Cost Price</div>}
        {visibleColumns.has('OG Price') && <div>OG Price</div>}

        {/* Selling Price */}
        <div
          className="flex cursor-pointer items-center space-x-1 hover:text-white/80 dark:hover:text-black/80"
          onClick={() => {
            setSortOption(
              sortOption === 'Price: Low to High' ? 'Price: High to Low' : 'Price: Low to High',
            );
          }}
        >
          <span className={sortOption.includes('Price') ? 'font-bold' : ''}>Selling Price</span>
          <svg
            className={`h-3 w-3 transition-transform ${
              sortOption === 'Price: High to Low'
                ? 'rotate-180 text-white dark:text-black'
                : sortOption === 'Price: Low to High'
                  ? 'text-white dark:text-black'
                  : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {visibleColumns.has('Variants') && <div>Variants</div>}
        {visibleColumns.has('Sales') && <div>Sales</div>}
        {visibleColumns.has('Date Added') && <div>Date Added</div>}

        {/* Status */}
        <div>Status</div>

        {visibleColumns.has('Stock') && <div>Stock</div>}

        {/* Actions */}
        <div className="text-right">Actions</div>
      </div>
    </div>
  );
}
