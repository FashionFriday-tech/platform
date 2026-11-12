/**
 * Product Form Sizing Constants and Helpers.
 * Note: Categories and Qualities are now managed 100% dynamically via database
 * models (`Category`, `Quality`) and backend endpoints (`/categories`, `/qualities`).
 */

export function isWatchCategory(categoryName?: string | null): boolean {
  if (!categoryName) {
    return false;
  }
  const normalized = categoryName.trim().toLowerCase();
  return normalized.includes('watch');
}

export function isFootwearCategory(categoryName?: string | null): boolean {
  if (!categoryName) {
    return false;
  }
  const normalized = categoryName.trim().toLowerCase();
  return (
    normalized.includes('slipper') ||
    normalized.includes('slide') ||
    normalized.includes('croc') ||
    normalized.includes('sneak') ||
    normalized.includes('shoe') ||
    normalized.includes('footwear') ||
    normalized.includes('sandal') ||
    normalized.includes('boot')
  );
}

export const FOOTWEAR_SIZES_MEN = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

export const FOOTWEAR_SIZES_WOMEN = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'];

export const FOOTWEAR_SIZES_WOMEN_UNISEX = [
  'UK 3',
  'UK 4',
  'UK 5',
  'UK 6',
  'UK 7',
  'UK 8',
  'UK 9',
  'UK 10',
  'UK 11',
];

export function sortSizes(sizesList: string[]): string[] {
  const standardAlphaOrder: Record<string, number> = {
    'XXS': 1,
    'XS': 2,
    'S': 3,
    'M': 4,
    'L': 5,
    'XL': 6,
    'XXL': 7,
    '2XL': 7,
    '3XL': 8,
    '4XL': 9,
    '5XL': 10,
    'FREE SIZE': 100,
    'ONE SIZE': 101,
  };

  return [...new Set(sizesList)].sort((a, b) => {
    const cleanA = a.trim();
    const cleanB = b.trim();
    const upperA = cleanA.toUpperCase();
    const upperB = cleanB.toUpperCase();

    // Check UK sizes (e.g. "UK 3", "UK 6.5", "UK 10")
    const ukRegex = /^UK\s*([0-9]+(?:\.[0-9]+)?)$/i;
    const matchUkA = cleanA.match(ukRegex);
    const matchUkB = cleanB.match(ukRegex);
    if (matchUkA && matchUkB) {
      return parseFloat(matchUkA[1]) - parseFloat(matchUkB[1]);
    }
    if (matchUkA) return -1;
    if (matchUkB) return 1;

    // Check pure numbers (e.g. waist sizes 28, 30, 32)
    const numA = Number(cleanA);
    const numB = Number(cleanB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    if (!isNaN(numA)) return -1;
    if (!isNaN(numB)) return 1;

    // Check standard alpha sizes (XS, S, M, L, XL, etc.)
    const orderA = standardAlphaOrder[upperA];
    const orderB = standardAlphaOrder[upperB];
    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;

    // Fallback natural alphanumeric
    return cleanA.localeCompare(cleanB, undefined, { numeric: true });
  });
}

export const SIZE_MAP: Record<string, string[]> = {
  Clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Jacket: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Shirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Pants: ['28', '30', '32', '34', '36', '38'],
  Sneakers: FOOTWEAR_SIZES_WOMEN_UNISEX,
  Watches: ['Free Size'],
  Slippers: FOOTWEAR_SIZES_WOMEN_UNISEX,
  Accessories: ['Free Size'],
};

export function getCategorySizes(categoryName?: string | null, gender?: string | null): string[] {
  if (!categoryName) {
    return SIZE_MAP.Clothing ?? [];
  }
  const normalized = categoryName.trim().toLowerCase();
  const normalizedGender = gender?.trim().toLowerCase();
  const isMen = normalizedGender === 'men' || normalizedGender === 'man';
  const isUnisex = normalizedGender === 'unisex';

  if (normalized.includes('watch')) {
    return SIZE_MAP.Watches ?? ['Free Size'];
  }
  if (normalized.includes('accessori')) {
    return SIZE_MAP.Accessories ?? ['Free Size'];
  }
  if (
    normalized.includes('slipper') ||
    normalized.includes('slide') ||
    normalized.includes('croc') ||
    normalized.includes('sneak') ||
    normalized.includes('shoe') ||
    normalized.includes('footwear') ||
    normalized.includes('sandal') ||
    normalized.includes('boot')
  ) {
    if (isUnisex) {
      return FOOTWEAR_SIZES_WOMEN_UNISEX;
    }
    return isMen ? FOOTWEAR_SIZES_MEN : FOOTWEAR_SIZES_WOMEN;
  }
  if (
    normalized.includes('pant') ||
    normalized.includes('jean') ||
    normalized.includes('trouser')
  ) {
    return SIZE_MAP.Pants ?? [];
  }
  if (
    normalized.includes('jacket') ||
    normalized.includes('hoodie') ||
    normalized.includes('coat')
  ) {
    return SIZE_MAP.Jacket ?? [];
  }
  if (
    normalized.includes('shirt') ||
    normalized.includes('t-shirt') ||
    normalized.includes('tee')
  ) {
    return SIZE_MAP.Shirts ?? [];
  }

  // Direct case-insensitive match
  const directKey = Object.keys(SIZE_MAP).find((k) => k.toLowerCase() === normalized);
  if (directKey && SIZE_MAP[directKey]) {
    if (directKey === 'Sneakers' || directKey === 'Slippers') {
      if (isUnisex) {
        return FOOTWEAR_SIZES_WOMEN_UNISEX;
      }
      return isMen ? FOOTWEAR_SIZES_MEN : FOOTWEAR_SIZES_WOMEN;
    }
    return SIZE_MAP[directKey];
  }

  return SIZE_MAP.Clothing ?? [];
}
