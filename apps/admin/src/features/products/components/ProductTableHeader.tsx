import { type ColumnId, type Product, type SortOption } from '../types';

interface Props {
  allSelected?: boolean;
  products: Product[];
  onToggleAllSelection?: (ids: string[]) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  visibleColumns: Set<ColumnId>;
  gridTemplateColumns?: string;
}

export function ProductTableHeader({
  sortOption,
  setSortOption,
  visibleColumns,
  gridTemplateColumns,
}: Props) {
  return (
    <div className="sticky top-0 z-20 pb-0.5">
      <div
        style={{ gridTemplateColumns }}
        className="grid items-center rounded-xl border border-black/10 bg-black px-4 py-3.5 text-xs font-semibold tracking-wider text-white uppercase shadow-md backdrop-blur-md sm:px-6 dark:border-white/10 dark:bg-white dark:text-black dark:shadow-sm"
      >
        {/* Product Info */}
        <div className="flex min-w-0 items-center space-x-3">
          <div
            className="flex cursor-pointer items-center space-x-1 hover:text-white/80 dark:hover:text-black/80"
            onClick={() => {
              setSortOption(sortOption === 'Name: A to Z' ? 'Name: Z to A' : 'Name: A to Z');
            }}
          >
            <span className={`truncate ${sortOption.includes('Name') ? 'font-bold' : ''}`}>
              Product info
            </span>
            <svg
              className={`h-3 w-3 shrink-0 transition-transform ${
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

        {visibleColumns.has('Category') && <div className="truncate">Category</div>}
        {visibleColumns.has('Cost Price') && <div className="truncate">Cost Price</div>}
        {visibleColumns.has('OG Price') && <div className="truncate">OG Price</div>}

        {/* Selling Price */}
        <div
          className="flex min-w-0 cursor-pointer items-center space-x-1 hover:text-white/80 dark:hover:text-black/80"
          onClick={() => {
            setSortOption(
              sortOption === 'Price: Low to High' ? 'Price: High to Low' : 'Price: Low to High',
            );
          }}
        >
          <span className={`truncate ${sortOption.includes('Price') ? 'font-bold' : ''}`}>
            Selling Price
          </span>
          <svg
            className={`h-3 w-3 shrink-0 transition-transform ${
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

        {visibleColumns.has('Variants') && <div className="truncate">Variants</div>}
        {visibleColumns.has('Sales') && <div className="truncate">Sales</div>}
        {visibleColumns.has('Date Added') && <div className="truncate">Date Added</div>}

        {/* Status */}
        <div className="truncate">Status</div>

        {visibleColumns.has('Stock') && <div className="truncate">Stock</div>}

        {/* Actions */}
        <div className="truncate text-right">Actions</div>
      </div>
    </div>
  );
}
