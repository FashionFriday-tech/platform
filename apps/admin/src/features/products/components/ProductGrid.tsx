import { useRouter } from 'next/navigation';
import { Product } from '../types';

interface Props {
  products: Product[];
  isLoading: boolean;
  onToggleStatus: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: (ids: string[]) => void;
}

export function ProductGrid({
  products,
  isLoading,
  onToggleStatus,
  selectedIds,
  onToggleSelection,
  onToggleAllSelection,
}: Props) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 py-20 text-center text-black/50 dark:border-white/10 dark:text-white/50">
        No products found.
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedIds.size === products.length;

  return (
    <div className="scrollbar-hide h-full w-full overflow-y-auto pb-4">
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="text-sm font-medium text-black/60 dark:text-white/60">
          Showing {products.length} products
        </div>
        <div
          onClick={() => onToggleAllSelection(products.map((p) => p.id))}
          className="flex cursor-pointer items-center space-x-2 text-sm font-medium transition-colors hover:text-black/80 dark:hover:text-white/80"
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${allSelected ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/30 dark:border-white/30'}`}
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
          <span>Select All</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => {
          const isSelected = selectedIds.has(product.id);
          return (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className={`group relative flex h-40 cursor-pointer flex-row overflow-hidden rounded-2xl border transition-all duration-300 ${isSelected ? 'border-black/40 bg-black/[0.03] ring-2 ring-black/10 dark:border-white/40 dark:bg-white/[0.05] dark:ring-white/10' : 'border-black/10 bg-white/60 hover:-translate-y-1 hover:border-black/30 hover:shadow-xl dark:border-white/10 dark:bg-black/20 dark:hover:border-white/30'}`}
            >
              {/* Checkbox */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(product.id);
                }}
                className={`absolute top-3 left-3 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border shadow-sm backdrop-blur-md transition-all ${isSelected ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/30 bg-white/80 group-hover:border-black/60 dark:border-white/30 dark:bg-black/80 dark:group-hover:border-white/60'}`}
              >
                {isSelected && (
                  <svg
                    className="h-4 w-4 text-white dark:text-black"
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

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3 z-10">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md ${product.status === 'Active' ? 'border-black/20 bg-black/10 text-black dark:border-white/30 dark:bg-white/20 dark:text-white' : product.status === 'Draft' ? 'border-yellow-500/30 bg-yellow-500/20 text-yellow-800 dark:text-yellow-400' : 'border-black/10 bg-white/80 text-black/50 dark:border-white/10 dark:bg-black/80 dark:text-white/50'}`}
                >
                  {product.status}
                </span>
              </div>

              {/* Image Area - Left side */}
              <div className="relative flex h-full w-[120px] flex-shrink-0 items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10">
                    <span className="text-xs font-bold tracking-widest text-black/30 uppercase dark:text-white/30">
                      IMG
                    </span>
                  </div>
                )}
              </div>

              {/* Content Area - Right side */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                <div>
                  <h3
                    className="mb-1.5 line-clamp-2 text-base leading-tight font-semibold text-black dark:text-white"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <p className="mb-2 font-mono text-xs text-black/50 dark:text-white/50">
                    ID: {product.sku}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-black dark:text-white">
                      ₹{product.sellingPrice.toFixed(2)}
                    </span>
                    {product.sellingPrice < product.originalPrice && (
                      <span className="text-xs text-black/40 line-through dark:text-white/40">
                        ₹{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <div className="mb-1 flex-1">
                    <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold tracking-wider text-black/50 uppercase dark:text-white/50">
                      <span>Stock</span>
                      <span>{product.stock}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${product.stock > 700 ? 'bg-black dark:bg-white' : 'bg-black/40 dark:bg-white/40'}`}
                        style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      product.status !== 'Draft' && onToggleStatus(product.id);
                    }}
                    disabled={product.status === 'Draft'}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${product.status === 'Active' ? 'bg-black/90 shadow-inner dark:bg-white/90' : 'border border-black/20 bg-black/10 dark:border-white/20 dark:bg-white/10'} ${product.status === 'Draft' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    title={
                      product.status === 'Draft'
                        ? 'Cannot activate drafted products'
                        : 'Toggle Active Status'
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full shadow-md transition-transform ${product.status === 'Active' ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white dark:bg-white/80'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
