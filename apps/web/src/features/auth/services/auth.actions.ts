'use server';

import { cookies } from 'next/headers';
import type { SendOtpResponse, VerifyOtpResponse, SignupResponse } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  // Set access token cookie
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes
  });

  // Set refresh token cookie
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Function to handle authenticated requests, including refresh token logic
async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  let headers = await getAuthHeaders();
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Attempt token refresh
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
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

        // Retry original request
        headers = await getAuthHeaders();
        response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
            ...options.headers,
          },
        });
      } else {
        // Refresh failed, clear cookies
        await logoutAction();
      }
    }
  }

  return response;
}

export async function sendOtpAction(phone: string): Promise<SendOtpResponse> {
  const res = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to send OTP');
  }
  
  return res.json();
}

export async function verifyOtpAction(phone: string, otp: string): Promise<VerifyOtpResponse> {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to verify OTP');
  }

  const data: VerifyOtpResponse = await res.json();

  if (data.accessToken && data.refreshToken) {
    await setAuthCookies(data.accessToken, data.refreshToken);
  }

  return data;
}

export async function signupAction(
  phone: string,
  name: string,
  email: string,
  otpToken: string
): Promise<SignupResponse> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, name, email, otpToken }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Signup failed');
  }

  const data: SignupResponse = await res.json();

  if (data.accessToken && data.refreshToken) {
    await setAuthCookies(data.accessToken, data.refreshToken);
  }

  return data;
}

export async function sendEmailOtpAction(): Promise<SendOtpResponse> {
  const res = await fetchWithAuth('/auth/email/send-otp', { method: 'POST' });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to send email OTP');
  }
  
  return res.json();
}

export async function verifyEmailOtpAction(
  otp: string
): Promise<{ success: boolean; message: string; user: SignupResponse['user'] }> {
  const res = await fetchWithAuth('/auth/email/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ otp }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to verify email OTP');
  }

  return res.json();
}

export async function getMeAction(): Promise<SignupResponse['user'] | null> {
  const res = await fetchWithAuth('/auth/me', { method: 'GET' });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export async function updateProfileAction(
  data: Partial<{ name: string; email: string; phone: string; avatarUrl: string }>
): Promise<SignupResponse['user']> {
  const res = await fetchWithAuth('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update profile');
  }

  return res.json();
}

export async function deleteAccountAction(): Promise<{ success: boolean; message: string }> {
  const res = await fetchWithAuth('/auth/account', { method: 'DELETE' });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete account');
  }

  await logoutAction();
  return res.json();
}

export async function logoutAction(): Promise<{ success: boolean; message: string }> {
  try {
    // Attempt backend logout, but don't fail if it doesn't work
    await fetchWithAuth('/auth/logout', { method: 'POST' }).catch(() => {});
  } catch (error) {
    // Ignore server error for logout
  }

  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  
  return { success: true, message: 'Logged out successfully' };
}
