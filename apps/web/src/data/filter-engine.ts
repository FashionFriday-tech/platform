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
 * 2. THE FILTER ENGINE
 */
export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
  return products.filter((product) => {
    for (const [key, selectedOptions] of Object.entries(activeFilters)) {
      if (selectedOptions.length === 0) {
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

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return undefined;
    const p = await res.json();
    return mapDbProductToSchema(p);
  } catch (err) {
    console.error('getProductBySlug error:', err);
    return undefined;
  }
};

export const getSimilarProducts = async (category: string, currentProductId?: string): Promise<Product[]> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
    const res = await fetch(`${API_URL}/products/category/${category.toLowerCase()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
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
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
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
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data || [];
    return data.map(mapDbProductToSchema);
  } catch (err) {
    console.error('getAllProducts error:', err);
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
