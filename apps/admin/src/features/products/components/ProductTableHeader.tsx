import { type ColumnId, type SortOption } from '../types';

interface Props {
  allSelected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  onToggleAllSelection: (ids: string[]) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  visibleColumns: Set<ColumnId>;
}

export function ProductTableHeader({
  allSelected,
  products,
  onToggleAllSelection,
  sortOption,
  setSortOption,
  visibleColumns,
}: Props) {
  return (
    <thead className="sticky top-0 z-30 border-b border-black/5 bg-[#f8f9fa] dark:bg-[#1a1a1a]">
      <tr className="text-xs font-medium whitespace-nowrap text-black/50 dark:border-white/10 dark:text-white/50">
        {/* Sticky Left: Select & Product Info */}
        <th className="sticky top-0 left-0 z-40 border-r border-black/5 bg-[#f8f9fa] px-4 py-4 shadow-[4px_0_12px_rgba(0,0,0,0.03)] dark:border-white/5 dark:bg-[#1a1a1a] dark:shadow-[4px_0_12px_rgba(255,255,255,0.02)]">
          <div className="flex items-center space-x-4">
            <div
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
                onToggleAllSelection(products.map((p) => p.id));
              }}
              className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${allSelected ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/20 hover:border-black/50 dark:border-white/20 dark:hover:border-white/50'}`}
            >
              {allSelected && (
                <svg
                  className="h-3.5 w-3.5 text-white dark:text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              className="flex cursor-pointer items-center space-x-1 hover:text-black dark:hover:text-white"
              onClick={() => {
                setSortOption(sortOption === 'Name: A to Z' ? 'Name: Z to A' : 'Name: A to Z');
              }}
            >
              <span className={sortOption.includes('Name') ? 'text-black dark:text-white' : ''}>
                Product info
              </span>
              <svg
                className={`h-3 w-3 transition-transform ${sortOption === 'Name: Z to A' ? 'rotate-180 text-black dark:text-white' : sortOption === 'Name: A to Z' ? 'text-black dark:text-white' : ''}`}
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
        </th>

        {visibleColumns.has('Category') && <th className="px-4 py-4 font-medium">Category</th>}

        {visibleColumns.has('Cost Price') && <th className="px-4 py-4 font-medium">Cost Price</th>}
        {visibleColumns.has('OG Price') && <th className="px-4 py-4 font-medium">OG Price</th>}

        {/* Always show Selling Price */}
        <th
          className="cursor-pointer px-4 py-4 font-medium hover:text-black dark:hover:text-white"
          onClick={() => {
            setSortOption(
              sortOption === 'Price: Low to High' ? 'Price: High to Low' : 'Price: Low to High',
            );
          }}
        >
          <div className="flex items-center space-x-1">
            <span className={sortOption.includes('Price') ? 'text-black dark:text-white' : ''}>
              Selling Price
            </span>
            <svg
              className={`h-3 w-3 transition-transform ${sortOption === 'Price: High to Low' ? 'rotate-180 text-black dark:text-white' : sortOption === 'Price: Low to High' ? 'text-black dark:text-white' : ''}`}
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
        </th>

        {visibleColumns.has('Variants') && <th className="px-4 py-4 font-medium">Variants</th>}
        {visibleColumns.has('Sales') && <th className="px-4 py-4 font-medium">Sales</th>}
        {visibleColumns.has('Date Added') && <th className="px-4 py-4 font-medium">Date Added</th>}

        {/* Always show Status */}
        <th className="px-4 py-4 font-medium">Status</th>

        {visibleColumns.has('Stock') && <th className="px-4 py-4 font-medium">Stock</th>}

        {/* Sticky Right: Activation */}
        <th className="sticky top-0 right-0 z-40 border-l border-black/5 bg-[#f8f9fa] px-6 py-4 text-right font-medium shadow-[-4px_0_12px_rgba(0,0,0,0.03)] dark:border-white/5 dark:bg-[#1a1a1a] dark:shadow-[-4px_0_12px_rgba(255,255,255,0.02)]">
          Active
        </th>
      </tr>
    </thead>
  );
}
