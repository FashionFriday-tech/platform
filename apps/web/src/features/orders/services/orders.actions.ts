'use server';

import { cookies } from 'next/headers';

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
      console.warn(`[orders.actions] 401 Unauthorized for ${endpoint}, attempting token refresh...`);
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
            authHeaders = { Authorization: `Bearer ${data.accessToken}` };
            console.log(`[orders.actions] Token refreshed, retrying ${endpoint}...`);
            response = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers: buildHeaders(authHeaders),
            });
          }
        } catch (refreshErr) {
          console.error('[orders.actions] Token refresh error:', refreshErr);
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`[orders.actions] Fetch error for ${endpoint}:`, error);
    return null;
  }
}

export interface CreateOrderPayload {
  paymentMethod: 'COD' | 'STRIPE' | 'RAZORPAY';
}

/**
 * Server Action to place an order securely using authenticated user session
 */
export async function createOrderAction(payload: CreateOrderPayload) {
  console.log('[orders.actions] Executing createOrderAction with payload:', payload);
  try {
    const res = await fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!res) {
      console.error('[orders.actions] No response received from orders API');
      throw new Error('Unable to connect to order processing server');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.message || `Failed to create order (HTTP ${res.status})`;
      console.error('[orders.actions] Order creation failed with response:', errorData);
      throw new Error(message);
    }

    const order = await res.json();
    console.log('[orders.actions] Order successfully created:', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      finalAmount: order.finalAmount,
    });
    return order;
  } catch (err: any) {
    console.error('[orders.actions] Exception in createOrderAction:', err);
    throw err;
  }
}

/**
 * Server Action to fetch current user's orders
 */
export async function fetchUserOrdersAction() {
  console.log('[orders.actions] Fetching user orders...');
  try {
    const res = await fetchWithAuth('/orders/me');
    if (!res || !res.ok) {
      const errorText = res ? await res.text().catch(() => '') : 'No response';
      console.error('[orders.actions] Failed to fetch orders:', res?.status, errorText);
      return [];
    }
    const orders = await res.json();
    console.log(`[orders.actions] Fetched ${Array.isArray(orders) ? orders.length : 0} user orders`);
    return Array.isArray(orders) ? orders : [];
  } catch (err) {
    console.error('[orders.actions] Exception in fetchUserOrdersAction:', err);
    return [];
  }
}
