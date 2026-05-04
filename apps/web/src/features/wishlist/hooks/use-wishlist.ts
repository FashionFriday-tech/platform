'use client';
import { useMemo } from 'react';

import { type Product } from '../types';

export function useWishlist() {
  const wishlistItems: Product[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Oversized Wool Blazer',
        category: 'Outerwear',
        price: 189,
        originalPrice: 250,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a5d6c45d-49fa-4f41-805c-9eb0d02d0e82/NIKE+CORTEZ+SE.png',
        color: 'Charcoal Grey',
        size: 'M',
        inStock: true,
        slug: 'oversized-wool-blazer',
      },
      {
        id: '2',
        name: 'Pleated Midi Skirt',
        category: 'Skirts',
        price: 85,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/46ce62c0-c7ea-4184-831c-c31899257e9b/W+NIKE+AIR+MAX+MOTO+2K.png',
        color: 'Cream',
        size: 'S',
        inStock: true,
        slug: 'pleated-midi-skirt',
      },
      {
        id: '3',
        name: 'Leather Chelsea Boots',
        category: 'Footwear',
        price: 210,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/128904c9-6281-4d00-8ff0-ed791031c0bd/W+NIKE+AIR+MAX+MOTO+2K.png',
        color: 'Black',
        size: 'EU 39',
        inStock: false,
        slug: 'leather-chelsea-boots',
      },
      {
        id: '4',
        name: 'Technical Windbreaker',
        category: 'Outerwear',
        price: 145,
        originalPrice: 190,
        image:
          'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc86b60b-1be1-4db2-9ca0-901b1889ba45/W+NIKE+AIR+MAX+MOTO+2K.png',
        color: 'Deep Navy',
        size: 'L',
        inStock: true,
        slug: 'technical-windbreaker',
      },
    ],
    [],
  );

  const hasItems = wishlistItems.length > 0;

  return {
    wishlistItems,
    hasItems,
  };
}
