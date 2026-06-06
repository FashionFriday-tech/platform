'use server';

import { cookies } from 'next/headers';

import { type Address } from '../types';
import { cleanPhoneDigits } from '../utils/phone';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

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

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
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
          console.error('Failed to refresh token during address request:', err);
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`[Address Service Network Error] ${endpoint}:`, error);
    return new Response(JSON.stringify({ error: 'Backend API is currently unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function toApiPayload(address: Partial<Address>) {
  return {
    fullName: address.name?.trim() ?? '',
    phoneNumber: address.phone ? cleanPhoneDigits(address.phone) : '',
    altPhoneNumber: address.altPhone ? cleanPhoneDigits(address.altPhone) : null,
    building: address.addressLine1?.trim() || null,
    street: address.addressLine2?.trim() ?? '',
    landmark: address.landmark?.trim() || null,
    city: address.city?.trim() ?? '',
    district: address.district?.trim() || 'Malappuram',
    state: address.state?.trim() || 'Kerala',
    pincode: address.pincode ? address.pincode.replace(/\D/g, '').slice(0, 6) : '',
    label: address.type ?? 'Home',
    isDefault: address.isDefault ?? false,
  };
}

interface RawDbAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  altPhoneNumber?: string | null;
  building?: string | null;
  street: string;
  landmark?: string | null;
  city: string;
  district: string;
  state: string;
  pincode: string;
  label: string;
  isDefault: boolean;
}

function fromApiRecord(record: RawDbAddress): Address {
  return {
    id: record.id,
    name: record.fullName,
    phone: record.phoneNumber,
    altPhone: record.altPhoneNumber || undefined,
    addressLine1: record.building || '',
    addressLine2: record.street || '',
    landmark: record.landmark || undefined,
    city: record.city,
    district: record.district,
    state: record.state,
    pincode: record.pincode,
    type: record.label === 'Work' || record.label === 'WORK' ? 'Work' : 'Home',
    isDefault: record.isDefault ?? false,
  };
}

/**
 * Fetch all addresses for the authenticated user from the database
 */
export async function fetchUserAddressesAction(): Promise<Address[]> {
  try {
    const res = await fetchWithAuth('/addresses');
    if (!res.ok) {
      console.warn('Fetch addresses returned status:', res.status);
      return [];
    }
    const data = (await res.json()) as RawDbAddress[];
    return data.map(fromApiRecord);
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return [];
  }
}

/**
 * Save a new address into the database
 */
export async function createAddressAction(address: Omit<Address, 'id'>): Promise<Address | null> {
  try {
    const payload = toApiPayload(address);
    const res = await fetchWithAuth('/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.error('Create address error:', res.status, errorText);
      return null;
    }
    const created = (await res.json()) as RawDbAddress;
    return fromApiRecord(created);
  } catch (error) {
    console.error('Failed to create address:', error);
    return null;
  }
}

/**
 * Update an existing address in the database
 */
export async function updateAddressAction(
  id: string,
  address: Partial<Address>,
): Promise<Address | null> {
  try {
    const payload = toApiPayload(address);
    const res = await fetchWithAuth(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.error('Update address error:', res.status, errorText);
      return null;
    }
    const updated = (await res.json()) as RawDbAddress;
    return fromApiRecord(updated);
  } catch (error) {
    console.error('Failed to update address:', error);
    return null;
  }
}

/**
 * Set an address as the default address
 */
export async function setDefaultAddressAction(id: string): Promise<boolean> {
  try {
    const res = await fetchWithAuth(`/addresses/${id}/default`, {
      method: 'PATCH',
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to set default address:', error);
    return false;
  }
}

/**
 * Delete an address from the database
 */
export async function deleteAddressAction(id: string): Promise<boolean> {
  try {
    const res = await fetchWithAuth(`/addresses/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to delete address:', error);
    return false;
  }
}
