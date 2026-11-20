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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 180 * 24 * 60 * 60, // 180 days
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
      console.warn(
        `[orders.actions] 401 Unauthorized for ${endpoint}, attempting token refresh...`,
      );
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
    console.error('[orders.actions] Fetch error for endpoint:', endpoint, error);
    return null;
  }
}

export interface CreateOrderPayload {
  paymentMethod: 'COD' | 'STRIPE' | 'RAZORPAY';
  addressId?: string;
  shippingAddress?: {
    id?: string;
    fullName: string;
    phoneNumber: string;
    altPhoneNumber?: string | null;
    building?: string | null;
    street: string;
    city: string;
    district?: string;
    state?: string;
    pincode: string;
    landmark?: string | null;
    label?: string;
  };
  items?: {
    productId: string;
    size?: string;
    color?: string;
    quantity: number;
  }[];
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
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
      return {
        success: false,
        error: 'Unable to connect to order processing server. Please check your network.',
      };
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message =
        errorData.message ||
        (Array.isArray(errorData.errors) ? errorData.errors.join(', ') : null) ||
        `Failed to create order (HTTP ${res.status})`;
      console.error('[orders.actions] Order creation failed with response:', errorData);
      return {
        success: false,
        error: message,
      };
    }

    const result = await res.json();
    console.log('[orders.actions] Order successfully created / initiated:', result);
    return {
      success: true,
      ...result,
    };
  } catch (err: any) {
    console.error('[orders.actions] Exception in createOrderAction:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while creating order.',
    };
  }
}

/**
 * Server Action to verify online payment signature cryptographically
 */
export async function verifyPaymentAction(payload: VerifyPaymentPayload) {
  console.log('[orders.actions] Executing verifyPaymentAction with payload:', payload);
  try {
    const res = await fetchWithAuth('/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!res) {
      return {
        success: false,
        error: 'Unable to connect to payment verification server.',
      };
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.message || 'Payment verification failed';
      console.error('[orders.actions] Payment verification failed:', errorData);
      return {
        success: false,
        error: message,
      };
    }

    const result = await res.json();
    console.log('[orders.actions] Payment verified successfully:', result);
    return {
      success: true,
      ...result,
    };
  } catch (err: any) {
    console.error('[orders.actions] Exception in verifyPaymentAction:', err);
    return {
      success: false,
      error: err.message || 'Payment verification encountered an unexpected error.',
    };
  }
}

/**
 * Server Action to cancel/clean up an unconfirmed pending checkout session
 */
export async function cancelPendingOrderAction(orderId: string) {
  console.log('[orders.actions] Cancelling unconfirmed pending order:', orderId);
  try {
    const res = await fetchWithAuth(`/orders/${orderId}/cancel-pending`, {
      method: 'POST',
    });
    if (!res?.ok) {
      console.warn('[orders.actions] cancelPendingOrder returned non-ok:', res?.status);
    }
    return { success: true };
  } catch (err: any) {
    console.warn('[orders.actions] Exception in cancelPendingOrderAction:', err);
    return { success: false };
  }
}

/**
 * Server Action to fetch current user's orders
 */
export async function fetchUserOrdersAction() {
  console.log('[orders.actions] Fetching user orders...');
  try {
    const res = await fetchWithAuth('/orders/me');
    if (!res?.ok) {
      const errorText = res ? await res.text().catch(() => '') : 'No response';
      console.error('[orders.actions] Failed to fetch orders:', res?.status, errorText);
      return [];
    }
    const orders = await res.json();
    console.log(
      `[orders.actions] Fetched ${Array.isArray(orders) ? orders.length : 0} user orders`,
    );
    return Array.isArray(orders) ? orders : [];
  } catch (err) {
    console.error('[orders.actions] Exception in fetchUserOrdersAction:', err);
    return [];
  }
}

export interface RefundTimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  timestamp: string | null;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  bankRrn?: string | null;
  expectedBy?: string | null;
}

export interface RefundTimelineResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentId: string | null;
  refundId: string | null;
  refundAmount: number;
  refundStatus: string;
  bankRrn: string | null;
  paymentMethod: string;
  paymentAccount: string | null;
  timeline: RefundTimelineItem[];
  estimatedSla: string;
  issuedAt: string;
  error?: string;
}

/**
 * Server Action to fetch refund timeline and bank RRN details
 */
export async function fetchOrderRefundTimelineAction(
  orderId: string,
): Promise<RefundTimelineResponse | null> {
  try {
    const res = await fetchWithAuth(`/orders/${orderId}/refund-timeline`);
    if (!res?.ok) {
      return null;
    }
    return (await res.json()) as RefundTimelineResponse;
  } catch (err) {
    console.error('[orders.actions] fetchOrderRefundTimelineAction error:', err);
    return null;
  }
}
