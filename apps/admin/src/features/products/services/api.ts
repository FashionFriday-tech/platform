import { api } from '@/lib/api-client';

import { type Product } from '../types';

export const mockProducts: Product[] = [];

export async function fetchProducts(search?: string): Promise<Product[]> {
  try {
    const query = search?.trim()
      ? `/admin/products?take=50&search=${encodeURIComponent(search.trim())}`
      : '/admin/products?take=200';
    const json = await api.get<{
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
    }>(query);

    const data = json?.data ?? [];

    // Map backend product to frontend Product interface
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.id,
      costPrice: Number(p.gettingPrice ?? 0),
      originalPrice: Number(p.ogPrice ?? p.sellingPrice ?? 0),
      sellingPrice: Number(p.sellingPrice ?? 0),
      stock: Number(p.totalStock ?? 0),
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
    const p = await api.get<{
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
    }>(`/admin/products/${id}`);

    if (!p?.id) {
      return undefined;
    }

    return {
      id: p.id,
      name: p.name,
      sku: p.id,
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
      images: [p.mainImage, p.promoImage, ...(p.liveImages ?? [])].filter(Boolean) as string[],
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

export async function updateProductStatus(
  id: string,
  status: 'Active' | 'Inactive',
): Promise<boolean> {
  const backendStatus = status === 'Active' ? 'PUBLISHED' : 'ARCHIVED';
  await api.patch(`/admin/products/${id}`, { status: backendStatus });
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await api.delete(`/admin/products/${id}`);
  return true;
}

export function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return Promise.resolve(data as Product);
}
