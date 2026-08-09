export type BrandCategory =
  | 'footwear'
  | 'clothing'
  | 'watch'
  | 'accessories'
  | 'eyewear';

export interface Brand {
  id?: string;
  name: string;
  slug: string;
  color: string;
  logo: string;
  poster?: string;
  categories: BrandCategory[];
  isActive?: boolean;
}

export const MAJOR_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Beige', hex: '#F5F5DC' },
];
