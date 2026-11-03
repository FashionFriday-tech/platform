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
  { name: 'Off White', hex: '#FAF9F6' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Khaki', hex: '#C3B091' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Coffee', hex: '#6F4E37' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Green', hex: '#008000' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Sage Green', hex: '#9CAF88' },
  { name: 'Mint Green', hex: '#98FF98' },
  { name: 'Pista Green', hex: '#93C572' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Mustard Yellow', hex: '#E1AD01' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Wine', hex: '#722F37' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Baby Pink', hex: '#F4C2C2' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Violet', hex: '#7F00FF' },
  { name: 'Bronze', hex: '#CD7F32' },
  { name: 'Copper', hex: '#B87333' },
];
