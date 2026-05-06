import { useRouter } from 'next/navigation';
import { Product } from '../types';
import Image from 'next/image';

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
              className={`group relative flex h-[180px] cursor-pointer flex-row overflow-hidden rounded-[24px] transition-all duration-300 ${isSelected ? 'bg-black/5 ring-2 ring-black/20 dark:bg-white/5 dark:ring-white/20 shadow-md' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] dark:bg-[#161616] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] dark:hover:shadow-[0_12px_40px_rgb(255,255,255,0.04)]'}`}
            >
              {/* Checkbox */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(product.id);
                }}
                className={`absolute top-4 left-4 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md backdrop-blur-md transition-all ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'bg-white/90 text-transparent hover:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:bg-black/80 dark:hover:bg-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.05)] group-hover:text-black/20 dark:group-hover:text-white/20'}`}
              >
                <svg
                  className="h-4 w-4"
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
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-4 left-4 z-20">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-widest uppercase shadow-lg backdrop-blur-md transition-colors ${product.status === 'Active' ? 'bg-black/90 text-white dark:bg-white/90 dark:text-black' : product.status === 'Draft' ? 'bg-yellow-400 text-yellow-900 dark:bg-yellow-500' : 'bg-white/90 text-black/60 dark:bg-black/90 dark:text-white/60'}`}
                >
                  {product.status}
                </span>
              </div>

              {/* Image Area - Left side */}
              <div className="relative flex h-full w-[110px] flex-shrink-0 items-center justify-center overflow-hidden bg-black/5 dark:bg-white/5">
                {product.imageUrl ? (
                  <>
                    <Image width={500} height={500}
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                  </>
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
                    className="mb-1 line-clamp-2 text-base leading-tight font-bold text-black dark:text-white"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <p className="mb-2 font-mono text-[10px] font-medium text-black/40 dark:text-white/40">
                    ID: {product.sku}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-black dark:text-white">
                      ₹{product.sellingPrice.toFixed(2)}
                    </span>
                    {product.sellingPrice < product.originalPrice && (
                      <span className="text-xs font-semibold text-black/30 line-through dark:text-white/30">
                        ₹{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-end justify-between gap-3">
                  <div className="mb-1 flex-1">
                    <div className="mb-1.5 flex items-center justify-between text-[9px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40">
                      <span>Stock</span>
                      <span className={product.stock < 100 ? "text-red-500" : product.stock < 500 ? "text-yellow-500" : "text-green-500"}>{product.stock}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${product.stock < 100 ? 'bg-red-500' : product.stock < 500 ? 'bg-yellow-500' : 'bg-green-500'}`}
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
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-300 ${product.status === 'Active' ? 'bg-black shadow-md dark:bg-white' : 'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20'} ${product.status === 'Draft' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    title={
                      product.status === 'Draft'
                        ? 'Cannot activate drafted products'
                        : 'Toggle Active Status'
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-300 ease-out ${product.status === 'Active' ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white'}`}
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
