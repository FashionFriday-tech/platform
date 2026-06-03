const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Internal helper for refreshing access token when 401 occurs in client
async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  const refreshToken = localStorage.getItem('adminRefreshToken');

  try {
    const res = await fetch(`${BASE_URL}/admin/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Industry standard: Send HttpOnly cookies automatically
      headers: {
        'Content-Type': 'application/json',
        ...(refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const data = (await res.json()) as { accessToken?: string; refreshToken?: string };
    if (data.accessToken) {
      localStorage.setItem('adminAccessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('adminRefreshToken', data.refreshToken);
    }
    return data.accessToken ?? 'cookie-refreshed';
  } catch {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
}

/**
 * Production-Grade Secure Fetch API Client for Admin Panel
 */
export async function fetcher<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers: customHeaders, credentials = 'include', ...customOptions } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined) {
        searchParams.append(key, String(val));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const buildHeaders = (token?: string | null) => {
    const headers = new Headers(customHeaders);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
  let response = await fetch(url, {
    ...customOptions,
    credentials, // Industry Standard: Automatically attaches HttpOnly cookies
    headers: buildHeaders(token),
  });

  // If 401 Unauthorized, attempt refresh once
  if (response.status === 401 && typeof window !== 'undefined') {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...customOptions,
        credentials,
        headers: buildHeaders(newToken !== 'cookie-refreshed' ? newToken : null),
      });
    }
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message ?? `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Convenience wrapper object matching HTTP methods
export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
