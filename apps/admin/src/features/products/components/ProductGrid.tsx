import { useRouter } from "next/navigation";
import { Product } from "../types";

interface Props {
  products: Product[];
  isLoading: boolean;
  onToggleStatus: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: (ids: string[]) => void;
}

export function ProductGrid({ products, isLoading, onToggleStatus, selectedIds, onToggleSelection, onToggleAllSelection }: Props) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-black/50 dark:text-white/50 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
        No products found.
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedIds.size === products.length;

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide pb-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm font-medium text-black/60 dark:text-white/60">
          Showing {products.length} products
        </div>
        <div 
          onClick={() => onToggleAllSelection(products.map(p => p.id))}
          className="flex items-center space-x-2 cursor-pointer text-sm font-medium hover:text-black/80 dark:hover:text-white/80 transition-colors"
        >
          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${allSelected ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-black/30 dark:border-white/30'}`}>
            {allSelected && <svg className="w-3.5 h-3.5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span>Select All</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-1">
        {products.map((product) => {
          const isSelected = selectedIds.has(product.id);
          return (
            <div 
              key={product.id} 
              onClick={() => router.push(`/products/${product.id}`)}
              className={`flex flex-row relative group rounded-2xl border transition-all duration-300 overflow-hidden h-40 cursor-pointer ${isSelected ? 'border-black/40 dark:border-white/40 ring-2 ring-black/10 dark:ring-white/10 bg-black/[0.03] dark:bg-white/[0.05]' : 'border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 hover:border-black/30 dark:hover:border-white/30 hover:shadow-xl hover:-translate-y-1'}`}
            >
              {/* Checkbox */}
              <div 
                onClick={(e) => { e.stopPropagation(); onToggleSelection(product.id); }}
                className={`absolute top-3 left-3 z-10 w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer transition-all backdrop-blur-md shadow-sm ${isSelected ? 'bg-black dark:bg-white border-black dark:border-white' : 'bg-white/80 dark:bg-black/80 border-black/30 dark:border-white/30 group-hover:border-black/60 dark:group-hover:border-white/60'}`}
              >
                {isSelected && <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3 z-10">
                 <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md shadow-sm ${product.status === "Active" ? 'bg-black/10 border-black/20 text-black dark:bg-white/20 dark:border-white/30 dark:text-white' : product.status === "Draft" ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-800 dark:text-yellow-400' : 'bg-white/80 border-black/10 text-black/50 dark:bg-black/80 dark:border-white/10 dark:text-white/50'}`}>
                    {product.status}
                 </span>
              </div>

              {/* Image Area - Left side */}
              <div className="w-[120px] h-full bg-black/5 dark:bg-white/5 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10">
                    <span className="text-xs font-bold text-black/30 dark:text-white/30 tracking-widest uppercase">IMG</span>
                  </div>
                )}
              </div>

              {/* Content Area - Right side */}
              <div className="p-4 flex flex-col flex-1 min-w-0 justify-between">
                <div>
                  <h3 className="font-semibold text-black dark:text-white text-base leading-tight line-clamp-2 mb-1.5" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-black/50 dark:text-white/50 font-mono mb-2">ID: {product.sku}</p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-lg text-black dark:text-white">₹{product.sellingPrice.toFixed(2)}</span>
                    {product.sellingPrice < product.originalPrice && (
                      <span className="text-xs text-black/40 dark:text-white/40 line-through">₹{product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-2 gap-4">
                  <div className="flex-1 mb-1">
                    <div className="flex items-center justify-between mb-1.5 text-[10px] font-semibold tracking-wider uppercase text-black/50 dark:text-white/50">
                      <span>Stock</span>
                      <span>{product.stock}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${product.stock > 700 ? 'bg-black dark:bg-white' : 'bg-black/40 dark:bg-white/40'}`}
                        style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); product.status !== "Draft" && onToggleStatus(product.id); }}
                    disabled={product.status === "Draft"}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${product.status === "Active" ? 'bg-black/90 dark:bg-white/90 shadow-inner' : 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20'} ${product.status === "Draft" ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={product.status === "Draft" ? "Cannot activate drafted products" : "Toggle Active Status"}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full shadow-md transition-transform ${product.status === "Active" ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white dark:bg-white/80'}`} />
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
