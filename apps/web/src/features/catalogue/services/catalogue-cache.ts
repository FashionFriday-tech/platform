import { type Product } from '@ff/schemas';

export interface CatalogueCacheEntry {
  key: string;
  products: Product[];
  activeFilters: Record<string, string[]>;
  sortBy: string;
  hasMore: boolean;
  scrollY: number;
  lastClickedProductId?: string | null;
  timestamp: number;
}

const memoryCache = new Map<string, CatalogueCacheEntry>();
const SESSION_STORAGE_PREFIX = 'ff_cat_state_';
const RETURNING_FLAG_KEY = 'ff_returning_catalogue_key';
const LAST_PRODUCT_ID_KEY = 'ff_last_product_id';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generates a normalized catalogue URL key from pathname and search query.
 */
export function getCatalogueKey(pathname?: string, search?: string): string {
  if (typeof window === 'undefined') {
    return 'default';
  }
  const p = (pathname ?? window.location.pathname).replace(/\/$/, '') || '/';
  const s = search ?? window.location.search;
  return `${p}${s}`;
}

/**
 * Saves catalogue state in memory and persists to sessionStorage.
 */
export function saveCatalogueState(entry: {
  key: string;
  products: Product[];
  activeFilters: Record<string, string[]>;
  sortBy: string;
  hasMore: boolean;
  scrollY?: number;
  lastClickedProductId?: string | null;
}): void {
  if (typeof window === 'undefined') {
    return;
  }

  const currentScroll =
    typeof entry.scrollY === 'number' ? entry.scrollY : Math.max(0, window.scrollY);

  const fullEntry: CatalogueCacheEntry = {
    key: entry.key,
    // Keep up to 160 products to cover deep infinite scrolling without memory bloat
    products: entry.products.slice(0, 160),
    activeFilters: entry.activeFilters,
    sortBy: entry.sortBy,
    hasMore: entry.hasMore,
    scrollY: currentScroll,
    lastClickedProductId: entry.lastClickedProductId ?? null,
    timestamp: Date.now(),
  };

  memoryCache.set(entry.key, fullEntry);

  try {
    sessionStorage.setItem(`${SESSION_STORAGE_PREFIX}${entry.key}`, JSON.stringify(fullEntry));
  } catch (err) {
    // Graceful fallback if sessionStorage quota is exceeded or in private mode
    console.warn('[CatalogueCache] Failed to write to sessionStorage:', err);
  }
}

/**
 * Retrieves the saved catalogue state from memory or sessionStorage.
 */
export function getCatalogueState(key: string): CatalogueCacheEntry | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // 1. Check in-memory map
  let entry = memoryCache.get(key);

  // 2. Check sessionStorage
  if (!entry) {
    try {
      const raw = sessionStorage.getItem(`${SESSION_STORAGE_PREFIX}${key}`);
      if (raw) {
        entry = JSON.parse(raw) as CatalogueCacheEntry;
        if (entry) {
          memoryCache.set(key, entry);
        }
      }
    } catch {
      // Ignore JSON parse failure
    }
  }

  if (!entry) {
    return null;
  }

  // Expire entries older than TTL
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    clearCatalogueState(key);
    return null;
  }

  return entry;
}

/**
 * Clears saved catalogue state for a given key.
 */
export function clearCatalogueState(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  memoryCache.delete(key);
  try {
    sessionStorage.removeItem(`${SESSION_STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore
  }
}

/**
 * Called when a product card in a catalogue is clicked before navigating to product details.
 */
export function markNavigatingToProduct(
  catalogueKey: string,
  productId?: string,
  scrollY?: number,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(RETURNING_FLAG_KEY, catalogueKey);
    if (productId) {
      sessionStorage.setItem(LAST_PRODUCT_ID_KEY, productId);
    }
  } catch {
    // Ignore
  }

  const existing = memoryCache.get(catalogueKey);
  if (existing) {
    existing.scrollY = typeof scrollY === 'number' ? scrollY : Math.max(0, window.scrollY);
    if (productId) {
      existing.lastClickedProductId = productId;
    }
    existing.timestamp = Date.now();
    try {
      sessionStorage.setItem(`${SESSION_STORAGE_PREFIX}${catalogueKey}`, JSON.stringify(existing));
    } catch {
      // Ignore
    }
  }
}

/**
 * Checks whether the user is returning back to this catalogue from a product page.
 */
export function isReturningToCatalogue(catalogueKey: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const flag = sessionStorage.getItem(RETURNING_FLAG_KEY);
    if (flag === catalogueKey) {
      return true;
    }
    // Fallback: check document.referrer for /product/
    if (document.referrer?.includes('/product/')) {
      const cached = getCatalogueState(catalogueKey);
      if (cached?.products && cached.products.length > 0) {
        return true;
      }
    }
  } catch {
    // Ignore
  }

  return false;
}

/**
 * Clears the return flag after state restoration has been performed.
 */
export function clearReturningFlag(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    sessionStorage.removeItem(RETURNING_FLAG_KEY);
    sessionStorage.removeItem(LAST_PRODUCT_ID_KEY);
  } catch {
    // Ignore
  }
}

interface WindowWithLenis {
  lenis?: {
    scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean }) => void;
  };
}

/**
 * Executes robust multi-frame scroll restoration supporting Lenis and native scrolling.
 */
export function restoreScrollPosition(
  targetY: number,
  targetProductId?: string | null,
  onComplete?: () => void,
): () => void {
  if (typeof window === 'undefined') {
    return () => {
      /* no-op */
    };
  }

  let isCancelled = false;

  const performScroll = () => {
    if (isCancelled) {
      return;
    }
    const lenis = (window as unknown as WindowWithLenis).lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetY, { immediate: true });
    } else {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    }
  };

  // Immediate attempt
  performScroll();

  // Animation frame sequence to allow React commit and browser DOM layout
  const frameId1 = requestAnimationFrame(() => {
    if (isCancelled) {
      return;
    }
    performScroll();

    const frameId2 = requestAnimationFrame(() => {
      if (isCancelled) {
        return;
      }
      performScroll();

      // If target product ID is known, ensure it is within view if layout drifted
      if (targetProductId) {
        const el = document.getElementById(`product-${targetProductId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const isInView = rect.top >= -100 && rect.bottom <= window.innerHeight + 150;
          if (!isInView) {
            el.scrollIntoView({ block: 'center', behavior: 'instant' });
          }
        }
      }

      onComplete?.();
    });

    frames.push(frameId2);
  });

  const frames: number[] = [frameId1];

  // Defensive timeouts to counter any late asynchronous Next.js router scroll resets
  const t1 = setTimeout(performScroll, 60);
  const t2 = setTimeout(performScroll, 160);
  const t3 = setTimeout(performScroll, 320);

  return () => {
    isCancelled = true;
    frames.forEach((f) => {
      cancelAnimationFrame(f);
    });
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
  };
}
