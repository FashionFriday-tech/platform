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
  // 1. Black & Dark Neutrals
  { name: 'Black', hex: '#000000' },
  { name: 'Jet Black', hex: '#0A0A0A' },
  { name: 'Matte Black', hex: '#1C1C1C' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Dark Charcoal', hex: '#222222' },
  { name: 'Anthracite', hex: '#2E3338' },
  { name: 'Onyx', hex: '#353839' },
  { name: 'Gunmetal', hex: '#2A3439' },

  // 2. White & Light Neutrals
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Pure White', hex: '#FEFEFE' },
  { name: 'Off White', hex: '#FAF9F6' },
  { name: 'Snow White', hex: '#FBFBFF' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Vanilla', hex: '#F3E5AB' },
  { name: 'Bone White', hex: '#F9F6EE' },
  { name: 'Pearl White', hex: '#F0EAD6' },
  { name: 'Eggshell', hex: '#F0EFEA' },

  // 3. Grey / Gray (Light & Dark)
  { name: 'Light Grey', hex: '#D3D3D3' },
  { name: 'Very Light Grey', hex: '#E5E5E5' },
  { name: 'Heather Grey', hex: '#B4B4B4' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Slate Grey', hex: '#708090' },
  { name: 'Ash Grey', hex: '#B2BEB5' },
  { name: 'Dark Grey', hex: '#4F4F4F' },
  { name: 'Steel Grey', hex: '#71797E' },
  { name: 'Smoke Grey', hex: '#738276' },
  { name: 'Silver', hex: '#C0C0C0' },

  // 4. Blue (Main, Light, Dark & Popular)
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Pale Blue', hex: '#AFEEEE' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Baby Blue', hex: '#89CFF0' },
  { name: 'Powder Blue', hex: '#B0E0E6' },
  { name: 'Ice Blue', hex: '#99E8F0' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Cobalt Blue', hex: '#0047AB' },
  { name: 'Cerulean Blue', hex: '#2A52BE' },
  { name: 'Electric Blue', hex: '#7DF9FF' },
  { name: 'Dark Blue', hex: '#00008B' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Deep Ocean Blue', hex: '#0B3C5D' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Denim Blue', hex: '#1560BD' },
  { name: 'Indigo', hex: '#4B0082' },

  // 5. Teal & Cyan & Aqua
  { name: 'Teal', hex: '#008080' },
  { name: 'Dark Teal', hex: '#005656' },
  { name: 'Light Teal', hex: '#66B2B2' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Aqua', hex: '#00E5FF' },
  { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Sea Green', hex: '#2E8B57' },
  { name: 'Petrol Blue', hex: '#00607A' },

  // 6. Green (Main, Light, Dark & Earthy)
  { name: 'Green', hex: '#008000' },
  { name: 'Light Green', hex: '#90EE90' },
  { name: 'Pale Green', hex: '#98FB98' },
  { name: 'Mint Green', hex: '#98FF98' },
  { name: 'Pista Green', hex: '#93C572' },
  { name: 'Lime Green', hex: '#32CD32' },
  { name: 'Neon Green', hex: '#39FF14' },
  { name: 'Sage Green', hex: '#9CAF88' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Army Green', hex: '#4B5320' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Dark Green', hex: '#006400' },
  { name: 'Bottle Green', hex: '#004225' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Emerald', hex: '#046307' },
  { name: 'Moss Green', hex: '#8A9A5B' },
  { name: 'Khaki Green', hex: '#8F9779' },
  { name: 'Jade Green', hex: '#00A86B' },

  // 7. Red & Burgundy (Main, Light & Dark)
  { name: 'Red', hex: '#FF0000' },
  { name: 'Light Red', hex: '#FF7276' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Scarlet', hex: '#FF2400' },
  { name: 'Cherry Red', hex: '#D2042D' },
  { name: 'Ruby Red', hex: '#E0115F' },
  { name: 'Brick Red', hex: '#CB4154' },
  { name: 'Blood Red', hex: '#660000' },
  { name: 'Dark Red', hex: '#8B0000' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Wine', hex: '#722F37' },
  { name: 'Oxblood', hex: '#4A0000' },
  { name: 'Berry', hex: '#8E2B59' },

  // 8. Pink & Rose (Main, Light, Dark & Pastels)
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Light Pink', hex: '#FFB6C1' },
  { name: 'Baby Pink', hex: '#F4C2C2' },
  { name: 'Pastel Pink', hex: '#FFD1DC' },
  { name: 'Blush Pink', hex: '#DE5D83' },
  { name: 'Rose Pink', hex: '#FF66CC' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
  { name: 'Salmon Pink', hex: '#FF91A4' },
  { name: 'Coral Pink', hex: '#F88379' },
  { name: 'Dark Pink', hex: '#E75480' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Deep Pink', hex: '#FF1493' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Fuchsia', hex: '#C154C1' },
  { name: 'Rose Gold', hex: '#B76E79' },

  // 9. Yellow & Gold
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Light Yellow', hex: '#FFFFE0' },
  { name: 'Pale Yellow', hex: '#FFFACD' },
  { name: 'Lemon Yellow', hex: '#FFF44F' },
  { name: 'Canary Yellow', hex: '#FFEF00' },
  { name: 'Dark Yellow', hex: '#CCCC00' },
  { name: 'Mustard Yellow', hex: '#E1AD01' },
  { name: 'Mustard', hex: '#FFDB58' },
  { name: 'Ochre', hex: '#CC7722' },
  { name: 'Golden Yellow', hex: '#FFDF00' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Honey', hex: '#FFC30B' },

  // 10. Orange, Peach & Coral
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Light Orange', hex: '#FFD8B1' },
  { name: 'Dark Orange', hex: '#FF8C00' },
  { name: 'Tangerine', hex: '#F28500' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Light Peach', hex: '#FFE5B4' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Light Coral', hex: '#F08080' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Burnt Orange', hex: '#CC5500' },
  { name: 'Terracotta', hex: '#E2725B' },
  { name: 'Apricot', hex: '#FBCEB1' },
  { name: 'Amber', hex: '#FFBF00' },

  // 11. Brown, Tan & Earth Tones
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Light Brown', hex: '#B5651D' },
  { name: 'Dark Brown', hex: '#654321' },
  { name: 'Chocolate Brown', hex: '#3D1F0D' },
  { name: 'Coffee', hex: '#6F4E37' },
  { name: 'Espresso', hex: '#2E1503' },
  { name: 'Mocha', hex: '#967969' },
  { name: 'Caramel', hex: '#AF6E4D' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Light Beige', hex: '#FAF0E6' },
  { name: 'Dark Beige', hex: '#AC9B7E' },
  { name: 'Khaki', hex: '#C3B091' },
  { name: 'Sand', hex: '#C2B280' },
  { name: 'Taupe', hex: '#483C32' },
  { name: 'Bronze', hex: '#CD7F32' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Cinnamon', hex: '#D2691E' },

  // 12. Purple, Violet & Lilac
  { name: 'Purple', hex: '#800080' },
  { name: 'Light Purple', hex: '#CBC3E3' },
  { name: 'Dark Purple', hex: '#301934' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Violet', hex: '#7F00FF' },
  { name: 'Dark Violet', hex: '#9400D3' },
  { name: 'Plum', hex: '#8E4585' },
  { name: 'Eggplant', hex: '#614051' },
  { name: 'Amethyst', hex: '#9966CC' },
  { name: 'Grape', hex: '#6F2DA8' },
  { name: 'Mulberry', hex: '#C54B8C' },
];
