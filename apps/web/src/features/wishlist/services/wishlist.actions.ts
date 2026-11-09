'use server';

import { cookies } from 'next/headers';

import type { ToggleWishlistResponse, WishlistItem } from '@ff/schemas';

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

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response | null> {
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
          console.error('Failed to refresh token during wishlist request:', err);
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`[Wishlist Service Network Error] ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch authenticated user's wishlist from API
 */
export async function fetchUserWishlistAction(): Promise<WishlistItem[]> {
  try {
    const res = await fetchWithAuth('/wishlist');
    if (!res?.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return [];
  }
}

/**
 * Toggle product in database wishlist
 */
export async function toggleWishlistAction(
  productId: string,
): Promise<ToggleWishlistResponse | null> {
  try {
    const res = await fetchWithAuth(`/wishlist/${productId}/toggle`, {
      method: 'POST',
    });
    if (!res?.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
    return null;
  }
}

/**
 * Remove product from database wishlist
 */
export async function removeWishlistItemAction(productId: string): Promise<boolean> {
  try {
    const res = await fetchWithAuth(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return !!res?.ok;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return false;
  }
}

/**
 * Smart merge guest wishlist items upon login
 */
export async function syncWishlistAction(productIds: string[]): Promise<WishlistItem[]> {
  try {
    const res = await fetchWithAuth('/wishlist/sync', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    });
    if (!res?.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Failed to sync wishlist:', error);
    return [];
  }
}
