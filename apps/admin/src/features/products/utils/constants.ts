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
export const QUALITIES = ['Original', '10A', '7A', '5A', 'Premium', 'Standard'];

export const SIZE_MAP: Record<string, string[]> = {
  Clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Jacket: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Shirts: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Pants: ['28', '30', '32', '34', '36', '38'],
  Sneakers: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  Watches: ['Free Size'],
  Slippers: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  Accessories: ['Free Size'],
};

export function getCategorySizes(categoryName?: string | null): string[] {
  if (!categoryName) return SIZE_MAP.Clothing ?? [];
  const normalized = categoryName.trim().toLowerCase();

  if (normalized.includes('watch')) {
    return SIZE_MAP.Watches ?? ['Free Size'];
  }
  if (normalized.includes('accessori')) {
    return SIZE_MAP.Accessories ?? ['Free Size'];
  }
  if (
    normalized.includes('slipper') ||
    normalized.includes('slide') ||
    normalized.includes('croc')
  ) {
    return SIZE_MAP.Slippers ?? [];
  }
  if (normalized.includes('sneak') || normalized.includes('shoe')) {
    return SIZE_MAP.Sneakers ?? [];
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
    return SIZE_MAP[directKey];
  }

  return SIZE_MAP.Clothing ?? [];
}
