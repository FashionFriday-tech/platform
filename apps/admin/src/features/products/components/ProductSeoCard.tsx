import { type Product } from '../types';

export function ProductSeoCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col justify-between rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:border-white/5 dark:bg-black">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-black tracking-widest uppercase">Search Engine Visibility</h3>
          <div className="rounded-full bg-green-500/10 p-2 text-green-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-black/5 bg-black/5 p-6 transition-colors group-hover:bg-black/10 dark:border-white/5 dark:bg-white/5 dark:group-hover:bg-white/10">
          <div className="mb-2 text-xs font-medium break-all text-black/60 dark:text-white/60">
            fashionfriday.in &rsaquo; product &rsaquo; {product.seoSlug || 'item'}
          </div>
          <div className="mb-2 cursor-pointer text-xl leading-tight font-medium text-blue-600 hover:underline dark:text-blue-400">
            {product.seoTitle || product.name}
          </div>
          <div className="text-sm leading-relaxed text-black/70 dark:text-white/70">
            {product.seoDesc ||
              product.description ||
              'View this product on Fashion Friday. Discover the best styles and premium quality items.'}
          </div>
        </div>
      </div>

      {product.tags && product.tags.length > 0 && (
        <div>
          <span className="mb-3 block text-[10px] font-black tracking-widest text-black/50 uppercase dark:text-white/50">
            Indexed Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-black/5 bg-black/5 px-3 py-1.5 text-xs font-bold text-black/80 transition-colors hover:bg-black hover:text-white dark:border-white/5 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white dark:hover:text-black"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
