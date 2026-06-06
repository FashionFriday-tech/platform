'use server';

import { cookies } from 'next/headers';

import type { ToggleWishlistResponse, WishlistItem } from '@ff/schemas';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value);
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * Fetch authenticated user's wishlist from API
 */
export async function fetchUserWishlistAction(): Promise<WishlistItem[]> {
  try {
    const res = await fetchWithAuth('/wishlist');
    if (!res.ok) {
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
    if (!res.ok) {
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
    return res.ok;
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
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Failed to sync wishlist:', error);
    return [];
  }
}
