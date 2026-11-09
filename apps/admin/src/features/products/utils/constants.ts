export const CATEGORIES = [
  'Clothing',
  'Jacket',
  'Shirts',
  'Pants',
  'Sneakers',
  'Watches',
  'Slippers',
  'Accessories',
];
export const QUALITIES = [
  '7AA',
  'UA',
  'Semi UA',
  '10A',
  '7A',
  '6A',
  '5A',
  'Original',
  'Premium',
  'Standard',
  'Surplus',
];

export const FOOTWEAR_QUALITIES = [
  'UA',
  'Semi UA',
  '10A',
  '7A',
  '6A',
  '5A',
  'Original',
  'Standard',
];

export const WATCH_QUALITIES = ['7AA', '10A', '7A', '5A', 'Original', 'Premium', 'Standard'];

export const GENERAL_QUALITIES = ['Original', 'Premium', 'Standard', 'Surplus', '10A', '7AA', '7A'];

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

export function getCategoryQualities(categoryName?: string | null): string[] {
  if (isWatchCategory(categoryName)) {
    return WATCH_QUALITIES;
  }
  if (isFootwearCategory(categoryName)) {
    return FOOTWEAR_QUALITIES;
  }
  return QUALITIES;
}

export const FOOTWEAR_SIZES_MEN = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

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
    return isMen ? FOOTWEAR_SIZES_MEN : FOOTWEAR_SIZES_WOMEN_UNISEX;
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
      return isMen ? FOOTWEAR_SIZES_MEN : FOOTWEAR_SIZES_WOMEN_UNISEX;
    }
    return SIZE_MAP[directKey];
  }

  return SIZE_MAP.Clothing ?? [];
}
