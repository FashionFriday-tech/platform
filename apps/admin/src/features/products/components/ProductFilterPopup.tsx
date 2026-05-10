import { ProductStatus } from '../types';
import { ProductPriceRangeFilter } from './ProductPriceRangeFilter';

interface Props {
  localFilters: any;
  setLocalFilters: (val: any) => void;
  toggleCategory: (cat: string) => void;
  toggleStore: (store: string) => void;
  toggleStatus: (status: ProductStatus) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export function ProductFilterPopup({
  localFilters,
  setLocalFilters,
  toggleCategory,
  toggleStore,
  toggleStatus,
  clearFilters,
  applyFilters,
}: Props) {
  return (
    <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-3 flex max-h-[70vh] w-[320px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl duration-200 dark:border-white/10 dark:bg-[#111111]/95">
      <div className="scrollbar-hide flex-1 overflow-y-auto p-5">
        <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Detailed Filters
        </h3>

        <div className="space-y-5">
          <ProductPriceRangeFilter
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />

          {/* Categories */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
              Categories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Outerwear', 'Footwear', 'Shirts', 'Sneakers'].map((cat) => (
                <label
                  key={cat}
                  className="group flex cursor-pointer items-center space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory(cat);
                  }}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${localFilters.categories.has(cat) ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/20 group-hover:border-black/60 dark:border-white/20 dark:group-hover:border-white/60'}`}
                  >
                    {localFilters.categories.has(cat) && (
                      <svg
                        className="h-2.5 w-2.5 text-white dark:text-black"
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
                  <span className="text-sm text-black/80 select-none dark:text-white/80">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Store */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
              Store
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Main Store', 'Odama Store'].map((store) => (
                <label
                  key={store}
                  className="group flex cursor-pointer items-center space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleStore(store);
                  }}
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${localFilters.stores?.has(store) ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/20 group-hover:border-black/60 dark:border-white/20 dark:group-hover:border-white/60'}`}
                  >
                    {localFilters.stores?.has(store) && (
                      <svg
                        className="h-2.5 w-2.5 text-white dark:text-black"
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
                  <span className="text-sm text-black/80 select-none dark:text-white/80">
                    {store}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black/70 dark:text-white/70">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Active', 'Inactive', 'Draft'] as ProductStatus[]).map((status) => (
                <div
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${localFilters.statuses.has(status) ? 'border-transparent bg-black text-white dark:bg-white dark:text-black' : 'border-black/10 bg-black/5 text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'}`}
                >
                  {status}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Sticky at bottom */}
      <div className="flex items-center space-x-3 border-t border-black/10 bg-white/5 p-5 backdrop-blur-md dark:border-white/10 dark:bg-black/5">
        <button
          onClick={clearFilters}
          className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
        >
          Clear
        </button>
        <button
          onClick={applyFilters}
          className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
