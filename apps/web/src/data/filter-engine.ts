import { DUMMY_PRODUCTS } from './products';
import { Product } from '@ff/schemas';

/**
 * 1. SIDEBAR CONFIGURATION
 */
export const CATEGORY_FILTERS: Record<string, { id: string; label: string; options: string[] }[]> =
  {
    Shoes: [
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

      // Price Range Check
      if (key === 'priceRange' && selectedOptions[0]) {
        const [min, max] = selectedOptions[0].split('-').map(Number);
        const price = product.price.sellingPrice;
        if (price < min || (max && price > max)) {
          return false;
        }
        continue;
      }

      const productObj = product as unknown as Record<string, unknown>;
      const attributesObj = product.attributes as unknown as Record<string, unknown>;
      const targetValue = productObj[key] ?? attributesObj[key];

      if (targetValue !== undefined && targetValue !== null) {
        if (Array.isArray(targetValue)) {
          const match = targetValue.some((val) =>
            selectedOptions.some((opt) => opt.toLowerCase() === String(val).toLowerCase()),
          );
          if (!match) {
            return false;
          }
        } else {
          // Explicitly check for primitives to satisfy @typescript-eslint/no-base-to-string
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
        continue;
      }
    }
    return true;
  });
}

/**
 * 3. DATA FETCHING LOGIC
 */

export const getProductBySlug = (slug: string): Product | undefined => {
  return DUMMY_PRODUCTS.find((p) => p.slug === slug);
};

export const getSimilarProducts = (category: string, currentProductId?: string): Product[] => {
  return DUMMY_PRODUCTS.filter((p) => p.category === category && p.id !== currentProductId).slice(
    0,
    10,
  );
};

export const getMaxPrice = (products: Product[]): number => {
  if (!products || products.length === 0) {
    return 50000;
  }
  const prices = products.map((p) => p.price.sellingPrice);
  const max = Math.max(...prices);

  return Number.isFinite(max) ? max : 50000;
};
