import { DUMMY_PRODUCTS } from './products';
import { Product } from '@ff/schemas';

/**
 * 1. SIDEBAR CONFIGURATION
 * Defines the UI labels and options for the sidebar
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
 * O(n) logic for multi-select and price range filtering
 */
export function filterProducts(products: Product[], activeFilters: Record<string, string[]>) {
  return products.filter((product) => {
    for (const [key, selectedOptions] of Object.entries(activeFilters)) {
      if (!selectedOptions || selectedOptions.length === 0) {
        continue;
      }

      // Price Range Check
      if (key === 'priceRange') {
        const [min, max] = selectedOptions[0].split('-').map(Number);
        const price = product.price.sellingPrice;
        if (price < min || (max && price > max)) {
          return false;
        }
        continue;
      }

      // Attribute Check (Root or Nested)
      const targetValue = (product as any)[key] || (product.attributes as any)[key];

      if (targetValue) {
        if (Array.isArray(targetValue)) {
          const match = targetValue.some((val) =>
            selectedOptions.some((opt) => opt.toLowerCase() === val.toString().toLowerCase()),
          );
          if (!match) {
            return false;
          }
        } else {
          const match = selectedOptions.some(
            (opt) => opt.toLowerCase() === targetValue.toString().toLowerCase(),
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
 * 3. DATA FETCHING LOGIC (The "Login" for Data)
 */

// A. Get a single product by its URL slug
export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  // Simulating a delay for a professional API feel
  return DUMMY_PRODUCTS.find((p) => p.slug === slug);
};

// B. Get similar items but exclude the one the user is already viewing
export const getSimilarProducts = async (
  category: string,
  currentProductId?: string,
): Promise<Product[]> => {
  return DUMMY_PRODUCTS.filter((p) => p.category === category && p.id !== currentProductId).slice(
    0,
    10,
  );
};

// C. Find variants sharing a StyleID (e.g., same shoe, different color/quality)
// export const getSiblingVariants = (styleId: string): Product[] => {
//   return DUMMY_PRODUCTS.filter((p) => p.styleId === styleId);
// };

// D. Safety check for the Price Slider
export const getMaxPrice = (products: Product[]): number => {
  if (!products || products.length === 0) {
    return 50000;
  }
  const prices = products.map((p) => p.price.sellingPrice);
  const max = Math.max(...prices);
  return isFinite(max) ? max : 50000;
};
