import { type Product } from '@ff/schemas';

/**
 * Appends a version query parameter based on product's updatedAt timestamp.
 * This guarantees browser & CDN image cache busting when images are edited,
 * while maintaining 100% cache efficiency when the product is unchanged.
 */
function withVersion(url: string | undefined | null, version?: number): string {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return url || '';
  }
  if (!version) {
    return url;
  }
  const sep = url.includes('?') ? '&' : '?';
  if (url.includes('v=')) {
    return url;
  }
  return `${url}${sep}v=${version}`;
}

/**
 * Maps a flat product record returned from the PostgreSQL database API
 * to the nested Zod schema shape expected by the frontend.
 */
export function mapDbProductToSchema(p: any): Product {
  if (!p) {
    return p;
  }

  const version = p.updatedAt ? new Date(p.updatedAt).getTime() : undefined;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    brand: Array.isArray(p.brand) ? p.brand : p.brand ? [p.brand] : [],
    status: p.status || 'PUBLISHED',
    categoryId: p.category?.name || p.categoryId,
    sellerId: p.sellerId || p.seller?.id || undefined,
    sellerIds: Array.isArray(p.sellerIds) ? p.sellerIds : p.sellerId ? [p.sellerId] : [],
    gender: p.gender || 'UNISEX',
    modelGroup: p.modelGroup || undefined,
    colorVariants: Array.isArray(p.colorVariants)
      ? p.colorVariants.map((v: any) => ({
          id: v.id,
          name: v.name,
          slug: v.slug,
          mainImage: withVersion(v.mainImage, version) || '',
          colors: Array.isArray(v.colors) ? v.colors : [],
          totalStock: Number(v.totalStock) || 0,
          sellingPrice: Number(v.sellingPrice) || 0,
          isCurrent: Boolean(v.isCurrent),
        }))
      : [],
    price: {
      ogPrice: Number(p.ogPrice) || 0,
      sellingPrice: Number(p.sellingPrice) || 0,
      gettingPrice: Number(p.gettingPrice) || 0,
    },
    inventory: {
      totalStock: Number(p.totalStock) || 0,
    },
    media: {
      mainImage:
        withVersion(
          p.mainImage || p.media?.mainImage || (Array.isArray(p.images) ? p.images[0] : ''),
          version,
        ) || '',
      promoImage:
        p.promoImage ||
        p.media?.promoImage ||
        (Array.isArray(p.images) && p.images.length > 1 ? p.images[1] : undefined)
          ? withVersion(
              p.promoImage ||
                p.media?.promoImage ||
                (Array.isArray(p.images) ? p.images[1] : ''),
              version,
            )
          : undefined,
      liveImages:
        Array.isArray(p.liveImages) && p.liveImages.length > 0
          ? p.liveImages.map((img: string) => withVersion(img, version))
          : Array.isArray(p.media?.liveImages) && p.media.liveImages.length > 0
            ? p.media.liveImages.map((img: string) => withVersion(img, version))
            : Array.isArray(p.images) && p.images.length > 2
              ? p.images.slice(2).map((img: string) => withVersion(img, version))
              : [],
      youtubeId: p.youtubeId || p.media?.youtubeId || undefined,
    },
    liveMatrix: {
      liveWatching: Math.max(0, Number(p.liveWatching) || 0),
      liveSold: Math.max(0, Number(p.liveSold) || 0),
    },
    marketing: {
      collections: Array.isArray(p.collections) ? p.collections : [],
      isFeatured: p.isFeatured || false,
      seoTitle: p.seoTitle || undefined,
      seoDescription: p.seoDescription || undefined,
    },
    rating: {
      averageRating:
        p.averageRating !== undefined && p.averageRating !== null
          ? Math.min(5, Math.max(0, Number(p.averageRating)))
          : 4,
      totalReviews: Math.max(0, Number(p.totalReviews) || 0),
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
