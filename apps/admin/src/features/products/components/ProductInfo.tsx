import { Product } from '../types';

interface Props {
  product: Product;
  onEdit: () => void;
  liveSold: number;
}

export function ProductInfo({ product, onEdit, liveSold }: Props) {
  return (
    <div className="space-y-8 lg:py-6 lg:col-span-7">
      {/* Badges & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black tracking-widest text-black/60 uppercase dark:text-white/60">
          {product.brand && (
            <span className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/5 dark:bg-black">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] text-white dark:bg-white dark:text-black">
                {product.brand.charAt(0)}
              </div>
              {product.brand}
            </span>
          )}
          {product.quality && (
            <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/10 bg-yellow-50 px-3 py-1.5 text-yellow-600 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-yellow-500/10 dark:text-yellow-500">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {product.quality}
            </span>
          )}
        </div>

        <button
          onClick={onEdit}
          className="flex items-center space-x-2 rounded-full bg-black px-5 py-2 text-xs font-bold text-white shadow-lg shadow-black/20 transition-all hover:scale-105 hover:shadow-xl dark:bg-white dark:text-black dark:shadow-white/20"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit</span>
        </button>
      </div>

      {/* Title */}
      <div>
        <h1 className="mb-4 text-5xl leading-[1.1] font-black tracking-tighter uppercase md:text-2xl lg:text-4xl">
          {product.name}
        </h1>
        <p className="pr-4 text-base leading-relaxed font-medium text-black/60 dark:text-white/60 md:text-lg">
          {product.description || 'Premium quality product featuring stunning design and top-tier materials. Fits perfectly into your modern wardrobe.'}
        </p>
      </div>

      {/* Price & Availability Card */}
      <div className="flex flex-col gap-4 rounded-[2rem] bg-black/5 p-6 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-black/50 uppercase dark:text-white/50">Price</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-black dark:text-white">
              ₹{product.sellingPrice.toFixed(2)}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span className="text-lg font-bold text-black/40 line-through dark:text-white/40">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="h-px w-full bg-black/10 dark:bg-white/10 sm:h-12 sm:w-px"></div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-sm font-bold text-black/50 uppercase dark:text-white/50">Availability</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 shadow-sm dark:border-white/5 dark:bg-black">
              <div className={`h-2.5 w-2.5 animate-pulse rounded-full ${product.stock < 100 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : product.stock < 500 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
              <span className="text-xs font-black uppercase text-black dark:text-white">{product.stock} in stock</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-bold text-black/60 dark:bg-white/5 dark:text-white/60">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {liveSold} sold
            </div>
          </div>
        </div>
      </div>

      {/* Variants / Sizes */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-4 pt-4">
            <span className="text-sm font-black tracking-widest text-black/80 uppercase dark:text-white/80">
              Select Size
            </span>
          <div className="flex flex-wrap gap-3 mt-4">
            {product.variants.map((v) => (
              <button
                key={v}
                className="group relative overflow-hidden rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black shadow-sm transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-md active:translate-y-0 dark:border-white/10 dark:bg-black dark:text-white dark:hover:border-white"
              >
                <span className="relative z-10">{v}</span>
                <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/5"></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
