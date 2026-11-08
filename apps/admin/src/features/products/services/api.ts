import { api } from '@/lib/api-client';

import { type Product } from '../types';

export const mockProducts: Product[] = [];

export interface FetchProductsParams {
  search?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  categoryId?: string;
  categories?: string[];
  status?: string;
  statuses?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductStatsData {
  total: number;
  active: number;
  inactive: number;
  draft: number;
}

export interface PaginatedProductsResponse {
  data: Product[];
  meta: {
    total: number;
    skip: number;
    take: number;
    page: number;
    totalPages: number;
  };
}

export function mapBackendProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    sku: p.id,
    costPrice: Number(p.gettingPrice ?? 0),
    originalPrice: Number(p.ogPrice ?? p.sellingPrice ?? 0),
    sellingPrice: Number(p.sellingPrice ?? 0),
    stock: Math.min(100, Number(p.totalStock ?? 0)),
    maxStock: 100,
    status: p.status === 'PUBLISHED' ? 'Active' : p.status === 'DRAFT' ? 'Draft' : 'Inactive',
    categoryId: p.categoryId ?? '',
    category: p.category?.name ?? 'Unknown',
    store: 'Main Store', // Dummy store
    variants: p.sizes ?? [],
    sales: Math.max(0, Number(p.liveSold ?? 0)),
    dateAdded: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
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
    liveWatching: Math.max(0, Number(p.liveWatching ?? 0)),
    liveSold: Math.max(0, Number(p.liveSold ?? 0)),
    averageRating: Number(p.averageRating ?? 4.0),
    totalReviews: Math.max(0, Number(p.totalReviews ?? 0)),
    rating: {
      average: Number(p.averageRating ?? 4.0),
      count: Math.max(0, Number(p.totalReviews ?? 0)),
    },
    liveMatrix: {
      liveWatching: Math.max(0, Number(p.liveWatching ?? 0)),
      liveSold: Math.max(0, Number(p.liveSold ?? 0)),
    },
  };
}

export async function fetchProductStats(): Promise<ProductStatsData> {
  try {
    const stats = await api.get<ProductStatsData>('/admin/products/stats');
    return {
      total: Number(stats?.total ?? 0),
      active: Number(stats?.active ?? 0),
      inactive: Number(stats?.inactive ?? 0),
      draft: Number(stats?.draft ?? 0),
    };
  } catch (err) {
    console.error('Failed to fetch product stats:', err);
    return { total: 0, active: 0, inactive: 0, draft: 0 };
  }
}

export async function fetchProductsPaginated(
  params: FetchProductsParams = {},
): Promise<PaginatedProductsResponse> {
  try {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.skip !== undefined) query.set('skip', String(params.skip));
    if (params.take !== undefined) query.set('take', String(params.take));
    if (params.search?.trim()) query.set('search', params.search.trim());
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.categories && params.categories.length > 0) {
      query.set('categories', params.categories.join(','));
    }
    if (params.status) query.set('status', params.status);
    if (params.statuses && params.statuses.length > 0) {
      query.set('statuses', params.statuses.join(','));
    }
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      query.set('minPrice', String(params.minPrice));
    }
    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      query.set('maxPrice', String(params.maxPrice));
    }

    const qs = query.toString();
    const endpoint = `/admin/products${qs ? `?${qs}` : ''}`;

    const json = await api.get<{
      data?: any[];
      meta?: {
        total: number;
        skip: number;
        take: number;
        page: number;
        totalPages: number;
      };
    }>(endpoint);

    const rawData = json?.data ?? [];
    const mapped = rawData.map(mapBackendProduct);
    const meta = json?.meta ?? {
      total: mapped.length,
      skip: params.skip ?? 0,
      take: params.take ?? params.limit ?? mapped.length,
      page: params.page ?? 1,
      totalPages: Math.ceil(mapped.length / (params.limit ?? 20)) || 1,
    };

    return { data: mapped, meta };
  } catch (err) {
    console.error('fetchProductsPaginated error:', err);
    return {
      data: [],
      meta: { total: 0, skip: 0, take: params.limit ?? 20, page: 1, totalPages: 1 },
    };
  }
}

export async function fetchProducts(
  searchOrParams?: string | FetchProductsParams,
): Promise<Product[]> {
  try {
    const params: FetchProductsParams =
      typeof searchOrParams === 'string'
        ? { search: searchOrParams, limit: 50 }
        : (searchOrParams ?? { limit: 100 });
    const res = await fetchProductsPaginated(params);
    return res.data;
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
      liveWatching?: number;
      liveSold?: number;
      averageRating?: number;
      totalReviews?: number;
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
      stock: Math.min(100, Number(p.totalStock ?? 0)),
      maxStock: 100,
      status: p.status === 'PUBLISHED' ? 'Active' : p.status === 'DRAFT' ? 'Draft' : 'Inactive',
      categoryId: p.categoryId,
      category: p.category?.name ?? 'Unknown',
      store: 'Main Store',
      variants: p.sizes ?? [],
      sales: Math.max(0, Number(p.liveSold ?? 0)),
      dateAdded: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
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
      liveWatching: Math.max(0, Number(p.liveWatching ?? 0)),
      liveSold: Math.max(0, Number(p.liveSold ?? 0)),
      averageRating: Number(p.averageRating ?? 4.0),
      totalReviews: Math.max(0, Number(p.totalReviews ?? 0)),
      rating: {
        average: Number(p.averageRating ?? 4.0),
        count: Math.max(0, Number(p.totalReviews ?? 0)),
      },
      liveMatrix: {
        liveWatching: Math.max(0, Number(p.liveWatching ?? 0)),
        liveSold: Math.max(0, Number(p.liveSold ?? 0)),
      },
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

export async function updateProductStock(id: string, stock: number): Promise<boolean> {
  await api.patch(`/admin/products/${id}`, { inventory: { totalStock: stock } });
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await api.delete(`/admin/products/${id}`);
  return true;
}

export function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return Promise.resolve(data as Product);
}

export interface PerformanceDataPoint {
  label: string;
  sales: number;
  views: number;
  date?: string;
}

export interface TimeframePerformance {
  totalSales: number;
  totalViews: number;
  avgSales: number;
  points: PerformanceDataPoint[];
}

export interface ProductPerformanceMatrix {
  productId: string;
  productName: string;
  daily: TimeframePerformance;
  weekly: TimeframePerformance;
  monthly: TimeframePerformance;
  yearly: TimeframePerformance;
}

export async function fetchProductPerformance(
  productId: string,
): Promise<ProductPerformanceMatrix | undefined> {
  try {
    return await api.get<ProductPerformanceMatrix>(`/admin/products/${productId}/performance`);
  } catch (err) {
    console.error('fetchProductPerformance error:', err);
    return undefined;
  }
}

export type ProductInteractionType = 'wishlist' | 'cart' | 'notifications' | 'clicks';

export interface CustomerInteractionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: string;
  createdAt: string;
}

export interface CustomerInteractionItem {
  id: string;
  interactionType: ProductInteractionType;
  timestamp: string;
  details?: {
    size?: string;
    color?: string;
    quantity?: number;
    clickCount?: number;
    firstClickedAt?: string;
  };
  user: CustomerInteractionUser;
}

export interface ProductInteractionsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: CustomerInteractionItem[];
}

export interface ProductInteractionsSummary {
  wishlistCount: number;
  cartCount: number;
  notificationsCount: number;
  clicksCount: number;
}

export async function fetchProductInteractionsSummary(
  productId: string,
): Promise<ProductInteractionsSummary> {
  try {
    return await api.get<ProductInteractionsSummary>(
      `/admin/products/${productId}/interactions/summary`,
    );
  } catch (err) {
    console.error('fetchProductInteractionsSummary error:', err);
    return {
      wishlistCount: 0,
      cartCount: 0,
      notificationsCount: 0,
      clicksCount: 0,
    };
  }
}

export async function fetchProductInteractionsList(
  productId: string,
  type: ProductInteractionType,
  page = 1,
  limit = 10,
  search?: string,
): Promise<ProductInteractionsResponse> {
  try {
    const params = new URLSearchParams({
      type,
      page: String(page),
      limit: String(limit),
      ...(search?.trim() ? { search: search.trim() } : {}),
    });
    return await api.get<ProductInteractionsResponse>(
      `/admin/products/${productId}/interactions?${params.toString()}`,
    );
  } catch (err) {
    console.error('fetchProductInteractionsList error:', err);
    return {
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
      data: [],
    };
  }
}
