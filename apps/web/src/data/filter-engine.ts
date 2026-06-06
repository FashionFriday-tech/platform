import { type Product } from '@ff/schemas';

import { mapDbProductToSchema } from '@/features/product/utils/mapper';

/**
 * 1. SIDEBAR CONFIGURATION
 */
export const CATEGORY_FILTERS: Record<string, { id: string; label: string; options: string[] }[]> =
  {
    Sneakers: [
      { id: 'brand', label: 'Brand', options: ['Nike', 'Adidas', 'Jordan', 'Kobe', 'Yeezy'] },
      { id: 'quality', label: 'Quality', options: ['UA', '7AA', 'Standard'] },
      { id: 'colors', label: 'Colors', options: ['Red', 'White', 'Black', 'Blue', 'Zebra'] },
      { id: 'sizes', label: 'Sizes', options: ['7', '8', '9', '10', '11'] },
    ],
    Watches: [
      { id: 'brand', label: 'Brand', options: ['Seiko', 'Casio', 'Rolex', 'Titan'] },
      { id: 'quality', label: 'Grade', options: ['10A Master', 'Original', 'Super Copy'] },
    ],
    Clothing: [
      { id: 'brand', label: 'Brand', options: ['Zara', 'H&M', 'Fear of God'] },
      { id: 'quality', label: 'Fabric', options: ['Premium Cotton', 'Standard'] },
    ],
    Accessories: [],
    Slippers: [],
  };

/**
 * 1. COLOR PALETTE METADATA (For luxury visual swatches)
 */
export const COLOR_SWATCH_MAP: Record<string, { bg: string; border?: string; isLight?: boolean }> =
  {
    black: { bg: '#000000' },
    white: { bg: '#FFFFFF', border: '#E5E7EB', isLight: true },
    red: { bg: '#EF4444' },
    blue: { bg: '#3B82F6' },
    green: { bg: '#10B981' },
    grey: { bg: '#6B7280' },
    gray: { bg: '#6B7280' },
    yellow: { bg: '#F59E0B', isLight: true },
    gold: { bg: '#D97706' },
    silver: { bg: '#9CA3AF', isLight: true },
    brown: { bg: '#78350F' },
    orange: { bg: '#F97316' },
    pink: { bg: '#EC4899' },
    purple: { bg: '#8B5CF6' },
    zebra: {
      bg: 'linear-gradient(45deg, #000 25%, #fff 25%, #fff 50%, #000 50%, #000 75%, #fff 75%, #fff 100%)',
    },
    multi: { bg: 'linear-gradient(135deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6)' },
  };

/**
 * 2. THE FILTER ENGINE
 */
export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
  return products.filter((product) => {
    for (const [key, selectedOptions] of Object.entries(activeFilters)) {
      if (!selectedOptions || selectedOptions.length === 0) {
        continue;
      }

      // 1. Price Range Check
      if (key === 'priceRange' && selectedOptions[0]) {
        const [min, max] = selectedOptions[0].split('-').map(Number);
        const price = product.price?.sellingPrice ?? 0;
        if (price < (min || 0) || (max && price > max)) {
          return false;
        }
        continue;
      }

      // 2. Brand Array Check
      if (key === 'brand') {
        const productBrands = product.brand || [];
        const match = productBrands.some((b) =>
          selectedOptions.some((opt) => opt.toLowerCase() === b.toLowerCase()),
        );
        if (!match) {
          return false;
        }
        continue;
      }

      // 4. Quality Check
      if (key === 'quality') {
        const quality = product.attributes?.quality;
        if (!quality) {
          return false;
        }
        const match = selectedOptions.some((opt) => opt.toLowerCase() === quality.toLowerCase());
        if (!match) {
          return false;
        }
        continue;
      }

      // 5. Colors Check
      if (key === 'colors') {
        const productColors = product.attributes?.colors || [];
        const match = productColors.some((c) =>
          selectedOptions.some((opt) => opt.toLowerCase() === c.toLowerCase()),
        );
        if (!match) {
          return false;
        }
        continue;
      }

      // 6. Sizes Check
      if (key === 'sizes') {
        const productSizes = product.attributes?.sizes || [];
        const match = productSizes.some((s) =>
          selectedOptions.some((opt) => opt.toLowerCase() === s.toLowerCase()),
        );
        if (!match) {
          return false;
        }
        continue;
      }

      // 7. Generic Fallback Check
      const productObj = product as unknown as Record<string, unknown>;
      const attributesObj = (product.attributes || {}) as unknown as Record<string, unknown>;
      const targetValue =
        (Object.prototype.hasOwnProperty.call(productObj, key) ? productObj[key] : undefined) ??
        (Object.prototype.hasOwnProperty.call(attributesObj, key) ? attributesObj[key] : undefined);

      if (targetValue !== undefined && targetValue !== null) {
        if (Array.isArray(targetValue)) {
          const match = targetValue.some((val) =>
            selectedOptions.some((opt) => opt.toLowerCase() === String(val).toLowerCase()),
          );
          if (!match) {
            return false;
          }
        } else {
          const isPrimitive =
            typeof targetValue === 'string' ||
            typeof targetValue === 'number' ||
            typeof targetValue === 'boolean';

          const stringifiedValue = isPrimitive ? String(targetValue) : '';
          const match = selectedOptions.some(
            (opt) => opt.toLowerCase() === stringifiedValue.toLowerCase(),
          );
          if (!match) {
            return false;
          }
        }
      }
    }
    return true;
  });
}

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

/**
 * Extract available dynamic facets and counts from a list of products
 */
export function extractFacets(products: Product[]) {
  const brandMap = new Map<string, number>();
  const qualityMap = new Map<string, number>();
  const colorMap = new Map<string, number>();
  const sizeMap = new Map<string, number>();

  let inStockCount = 0;
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const product of products) {
    const price = product.price?.sellingPrice ?? 0;
    if (price < minPrice) {
      minPrice = price;
    }
    if (price > maxPrice) {
      maxPrice = price;
    }

    if ((product.inventory?.totalStock ?? 1) > 0) {
      inStockCount++;
    }

    // Brands
    for (const b of product.brand || []) {
      const key = b.trim();
      if (key) {
        brandMap.set(key, (brandMap.get(key) || 0) + 1);
      }
    }

    // Quality
    if (product.attributes?.quality) {
      const q = product.attributes.quality;
      qualityMap.set(q, (qualityMap.get(q) || 0) + 1);
    }

    // Colors
    for (const c of product.attributes?.colors || []) {
      const key = c.trim();
      if (key) {
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }
    }

    // Sizes
    for (const s of product.attributes?.sizes || []) {
      const key = s.trim();
      if (key) {
        sizeMap.set(key, (sizeMap.get(key) || 0) + 1);
      }
    }
  }

  const toFacetList = (map: Map<string, number>): FacetCount[] =>
    Array.from(map.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => b.count - a.count);

  return {
    brands: toFacetList(brandMap),
    qualities: toFacetList(qualityMap),
    colors: toFacetList(colorMap),
    sizes: Array.from(sizeMap.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => {
        const numA = Number(a.value);
        const numB = Number(b.value);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.value.localeCompare(b.value);
      }),
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice: maxPrice === 0 ? 15000 : maxPrice,
  };
}

/**
 * 3. DATA FETCHING LOGIC
 */

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 86400, tags: [`product-${slug}`] },
    });
    if (!res.ok) {
      return undefined;
    }
    const p = await res.json();
    return mapDbProductToSchema(p);
  } catch (err) {
    console.error('getProductBySlug error:', err);
    return undefined;
  }
};

export const getSimilarProducts = async (
  category: string,
  currentProductId?: string,
): Promise<Product[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products/category/${category.toLowerCase()}`, {
      next: { revalidate: 86400, tags: [`similar-products-${category.toLowerCase()}`] },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const data = json.data || [];
    return data
      .map(mapDbProductToSchema)
      .filter((p: Product) => p.id !== currentProductId)
      .slice(0, 10);
  } catch (err) {
    console.error('getSimilarProducts error:', err);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products/category/${category.toLowerCase()}?take=100`, {
      next: { revalidate: 86400, tags: [`category-products-${category.toLowerCase()}`] },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const data = json.data || [];
    return data.map(mapDbProductToSchema);
  } catch (err) {
    console.error('getProductsByCategory error:', err);
    return [];
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products?take=100`, {
      next: { revalidate: 86400, tags: ['all-products'] },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const data = json.data || [];
    return data.map(mapDbProductToSchema);
  } catch (err) {
    console.error('getAllProducts error:', err);
    return [];
  }
};

export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products?brand=${encodeURIComponent(brand)}&take=100`, {
      next: { revalidate: 86400, tags: [`brand-products-${brand.toLowerCase()}`] },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const data = json.data || [];
    return data.map(mapDbProductToSchema);
  } catch (err) {
    console.error('getProductsByBrand error:', err);
    return [];
  }
};

export const getMaxPrice = (products: Product[]): number => {
  if (products.length === 0) {
    return 50000;
  }
  const prices = products.map((p) => p.price.sellingPrice);
  const max = Math.max(...prices);

  return Number.isFinite(max) ? max : 50000;
};
