'use server';

import { cookies } from 'next/headers';

import { type CartItem, type SyncCartItem } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response | null> {
  let authHeaders = await getAuthHeaders();

  const buildHeaders = (baseAuthHeaders: Record<string, string>) => {
    const h = new Headers(options.headers);
    if (!h.has('Content-Type')) {
      h.set('Content-Type', 'application/json');
    }
    for (const [key, value] of Object.entries(baseAuthHeaders)) {
      h.set(key, value);
    }
    return h;
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: buildHeaders(authHeaders),
    });

    if (response.status === 401) {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refreshToken')?.value;

      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            await setAuthCookies(data.accessToken, data.refreshToken);

            authHeaders = await getAuthHeaders();
            response = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers: buildHeaders(authHeaders),
            });
          }
        } catch (err) {
          console.error('Failed to refresh token during cart request:', err);
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`[Cart Service Network Error] ${endpoint}:`, error);
    return null;
  }
}

interface RawCartItem {
  id: string;
  userId: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    brand?: string[];
    ogPrice: number;
    sellingPrice: number;
    mainImage: string;
    totalStock: number;
    sizes?: string[];
    colors?: string[];
    status?: string;
  } | null;
}

function fromRawCartItem(raw: RawCartItem): CartItem | null {
  if (!raw.product) {
    return null;
  }
  return {
    id: raw.id,
    productId: raw.productId,
    size: raw.size,
    color: raw.color,
    quantity: raw.quantity,
    product: {
      id: raw.product.id,
      name: raw.product.name,
      slug: raw.product.slug,
      brand: raw.product.brand || [],
      ogPrice: raw.product.ogPrice,
      sellingPrice: raw.product.sellingPrice,
      mainImage: raw.product.mainImage,
      totalStock: raw.product.totalStock ?? 0,
      sizes: raw.product.sizes || [],
      colors: raw.product.colors || [],
      status: raw.product.status || 'PUBLISHED',
    },
  };
}

/**
 * Fetch cart items for the authenticated user from database
 */
export async function fetchUserCartAction(): Promise<CartItem[]> {
  try {
    const res = await fetchWithAuth('/cart');
    if (!res || !res.ok) {
      return [];
    }
    const data = (await res.json()) as RawCartItem[];
    return data.map(fromRawCartItem).filter((item): item is CartItem => item !== null);
  } catch (error) {
    console.error('Failed to fetch user cart:', error);
    return [];
  }
}

/**
 * Add an item to user's database cart
 */
export async function addToCartAction(input: {
  productId: string;
  size?: string;
  color?: string;
  quantity?: number;
}): Promise<CartItem[]> {
  try {
    const res = await fetchWithAuth('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: input.productId,
        size: input.size || 'Standard',
        color: input.color || 'Standard',
        quantity: input.quantity || 1,
      }),
    });
    if (!res || !res.ok) {
      return [];
    }
    const data = (await res.json()) as RawCartItem[];
    return data.map(fromRawCartItem).filter((item): item is CartItem => item !== null);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return [];
  }
}

/**
 * Update quantity of a cart item in database
 */
export async function updateCartQuantityAction(
  itemId: string,
  quantity: number,
): Promise<CartItem[]> {
  try {
    const res = await fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    if (!res || !res.ok) {
      return [];
    }
    const data = (await res.json()) as RawCartItem[];
    return data.map(fromRawCartItem).filter((item): item is CartItem => item !== null);
  } catch (error) {
    console.error('Failed to update cart quantity:', error);
    return [];
  }
}

/**
 * Remove an item from user's database cart
 */
export async function removeCartItemAction(itemId: string): Promise<CartItem[]> {
  try {
    const res = await fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
    if (!res || !res.ok) {
      return [];
    }
    const data = (await res.json()) as RawCartItem[];
    return data.map(fromRawCartItem).filter((item): item is CartItem => item !== null);
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    return [];
  }
}

/**
 * Clear user's entire cart in database
 */
export async function clearCartAction(): Promise<boolean> {
  try {
    const res = await fetchWithAuth('/cart', {
      method: 'DELETE',
    });
    return res ? res.ok : false;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return false;
  }
}

/**
 * Merge guest cart items into user's database cart
 */
export async function syncCartAction(items: SyncCartItem[]): Promise<CartItem[] | null> {
  try {
    const res = await fetchWithAuth('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    if (!res || !res.ok) {
      const errorText = res ? await res.text() : 'No response';
      console.error('Failed to sync guest cart:', errorText);
      return null;
    }
    const data = (await res.json()) as RawCartItem[];
    return data.map(fromRawCartItem).filter((item): item is CartItem => item !== null);
  } catch (error) {
    console.error('Failed to sync guest cart:', error);
    return null;
  }
}
