import { type Product } from '@ff/schemas';

/**
 * Maps a flat product record returned from the PostgreSQL database API
 * to the nested Zod schema shape expected by the frontend.
 */
export function mapDbProductToSchema(p: any): Product {
  if (!p) return p;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    brand: Array.isArray(p.brand) ? p.brand : p.brand ? [p.brand] : [],
    status: p.status || 'PUBLISHED',
    categoryId: p.category?.name || p.categoryId,
    gender: p.gender || 'UNISEX',
    price: {
      ogPrice: Number(p.ogPrice) || 0,
      sellingPrice: Number(p.sellingPrice) || 0,
      gettingPrice: Number(p.gettingPrice) || 0,
    },
    inventory: {
      totalStock: Number(p.totalStock) || 0,
    },
    media: {
      mainImage: p.mainImage || '',
      promoImage: p.promoImage || undefined,
      liveImages: Array.isArray(p.liveImages) ? p.liveImages : [],
      youtubeId: p.youtubeId || undefined,
    },
    liveMatrix: {
      liveWatching: Number(p.liveWatching) || 0,
      liveSold: Number(p.liveSold) || 0,
    },
    marketing: {
      collections: Array.isArray(p.collections) ? p.collections : [],
      isFeatured: p.isFeatured || false,
      seoTitle: p.seoTitle || undefined,
      seoDescription: p.seoDescription || undefined,
    },
    rating: {
      averageRating: Number(p.averageRating) || 4,
      totalReviews: Number(p.totalReviews) || 0,
    },
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    attributes: p.attributes || {
      colors: Array.isArray(p.colors) ? p.colors : [],
      quality: p.quality || 'STANDARD',
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    },
  };
}
