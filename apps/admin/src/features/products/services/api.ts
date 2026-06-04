import { type Product } from '../types';

export const mockProducts: Product[] = [];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/products`,
    );
    const json = (await res.json()) as {
      data?: {
        id: string;
        name: string;
        gettingPrice?: number;
        ogPrice?: number;
        sellingPrice?: number;
        totalStock?: number;
        status?: string;
        categoryId?: string;
        category?: { name?: string };
        sizes?: string[];
        createdAt?: string;
        mainImage?: string;
        promoImage?: string;
        liveImages?: string[];
        description?: string;
        quality?: string;
        brand?: string[];
        gender?: string;
        seoTitle?: string;
        seoDescription?: string;
        slug?: string;
        youtubeId?: string;
      }[];
    };
    const data = json.data ?? [];

    // Map backend product to frontend Product interface
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.id.substring(0, 8).toUpperCase(), // Assuming SKU is not directly available, use ID
      costPrice: p.gettingPrice ?? 0,
      originalPrice: p.ogPrice ?? p.sellingPrice ?? 0,
      sellingPrice: p.sellingPrice ?? 0,
      stock: p.totalStock ?? 0,
      maxStock: 1000,
      status: p.status === 'PUBLISHED' ? 'Active' : p.status === 'DRAFT' ? 'Draft' : 'Inactive',
      categoryId: p.categoryId ?? '',
      category: p.category?.name ?? 'Unknown',
      store: 'Main Store', // Dummy store
      variants: p.sizes ?? [],
      sales: 0,
      dateAdded: p.createdAt
        ? new Date(p.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      imageUrl: p.mainImage,
      images: [p.mainImage, p.promoImage, ...(p.liveImages ?? [])].filter((img): img is string =>
        Boolean(img),
      ),
      description: p.description,
      quality: p.quality,
      brand: p.brand ? p.brand[0] : undefined,
      gender: p.gender,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDescription,
      seoSlug: p.slug,
      videoLink: p.youtubeId ? `https://www.youtube.com/embed/${p.youtubeId}` : undefined,
    }));
  } catch (err) {
    console.error('fetchProducts error:', err);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/admin/products/${id}`,
    );
    const p = (await res.json()) as {
      id: string;
      name: string;
      gettingPrice?: number;
      ogPrice?: number;
      sellingPrice?: number;
      totalStock?: number;
      status?: string;
      categoryId: string;
      category?: { name?: string };
      sizes?: string[];
      createdAt?: string;
      mainImage?: string;
      promoImage?: string;
      liveImages?: string[];
      description?: string;
      quality?: string;
      brand?: string[];
      gender?: string;
      seoTitle?: string;
      seoDescription?: string;
      slug?: string;
      youtubeId?: string;
    };

    return {
      id: p.id,
      name: p.name,
      sku: p.id.substring(0, 8).toUpperCase(),
      costPrice: p.gettingPrice ?? 0,
      originalPrice: p.ogPrice ?? p.sellingPrice ?? 0,
      sellingPrice: p.sellingPrice ?? 0,
      stock: p.totalStock ?? 0,
      maxStock: 1000,
      status: p.status === 'PUBLISHED' ? 'Active' : p.status === 'DRAFT' ? 'Draft' : 'Inactive',
      categoryId: p.categoryId,
      category: p.category?.name ?? 'Unknown',
      store: 'Main Store',
      variants: p.sizes ?? [],
      sales: 0,
      dateAdded: p.createdAt
        ? new Date(p.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      imageUrl: p.mainImage,
      images: [p.mainImage, p.promoImage, ...(p.liveImages ?? [])].filter(Boolean),
      description: p.description,
      quality: p.quality,
      brand: p.brand ? p.brand[0] : undefined,
      gender: p.gender,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDescription,
      seoSlug: p.slug,
      videoLink: p.youtubeId ? `https://www.youtube.com/embed/${p.youtubeId}` : undefined,
    };
  } catch (err) {
    console.error('fetchProductById error:', err);
    return undefined;
  }
}

export function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  // Update would go here, mapping frontend Product updates back to backend Payload.
  // The current AddProductForm does this on its own, so this might not be used.
  return Promise.resolve(data as Product);
}
