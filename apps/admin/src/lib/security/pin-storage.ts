// Cryptographic 4-Digit PIN Storage using Web Crypto API

const PIN_STORAGE_KEY = 'ff_admin_pin_meta';
export const DEFAULT_ADMIN_PIN = '1234';

interface PinMeta {
  hash: string;
  salt: string;
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hash PIN with PBKDF2 and device-specific salt
async function hashPin(pin: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const derivedKey = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return bufferToHex(derivedKey);
}

export const PinStorage = {
  // Check if a PIN is registered on this device (always true with default 1234)
  hasPin(userPhone?: string): boolean {
    return true;
  },

  // Store new 4-digit PIN securely for a specific admin user
  async setupPin(pin: string, userPhone?: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const randomSalt = new Uint8Array(16);
    window.crypto.getRandomValues(randomSalt);
    const saltHex = bufferToHex(randomSalt.buffer);

    const hash = await hashPin(pin, saltHex);
    const meta: PinMeta = { hash, salt: saltHex };

    if (userPhone) {
      localStorage.setItem(`ff_admin_pin_${userPhone}`, JSON.stringify(meta));
    }
    localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(meta));
  },

  // Verify PIN against backend Argon2-encrypted DB, with local PBKDF2 & default 1234 fallback
  async verifyPin(pin: string, userPhone?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // 1. First attempt to verify with Backend Database
    if (userPhone) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(`${apiUrl}/auth/admin/verify-pin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: userPhone, pin }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = (await res.json()) as { valid: boolean };
          if (data.valid) {
            // Keep local cache synced for offline access
            void this.setupPin(pin, userPhone);
            return true;
          }
          return false;
        }
      } catch {
        // Network timeout / offline fallback to local verification
      }
    }

    // 2. Offline / local fallback using salted PBKDF2 hash or default 1234
    const key = userPhone ? `ff_admin_pin_${userPhone}` : PIN_STORAGE_KEY;
    const raw = localStorage.getItem(key) || localStorage.getItem(PIN_STORAGE_KEY);

    if (!raw) {
      return pin === DEFAULT_ADMIN_PIN;
    }

    try {
      const meta: PinMeta = JSON.parse(raw);
      const computedHash = await hashPin(pin, meta.salt);
      return computedHash === meta.hash;
    } catch {
      return pin === DEFAULT_ADMIN_PIN;
    }
  },

  // Super Admin only: update user's PIN on backend and local cache
  async updateBackendPin(
    adminPhone: string,
    targetPhone: string,
    newPin: string,
  ): Promise<{ success: boolean; message: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
    const res = await fetch(`${apiUrl}/auth/admin/update-pin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPhone, targetPhone, newPin }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update admin PIN');
    }

    // Update local cache for target user
    await this.setupPin(newPin, targetPhone);
    return { success: true, message: data.message || 'PIN updated successfully' };
  },

  // Reset PIN back to default
  removePin(userPhone?: string): void {
    if (typeof window === 'undefined') return;
    if (userPhone) {
      localStorage.removeItem(`ff_admin_pin_${userPhone}`);
    }
    localStorage.removeItem(PIN_STORAGE_KEY);
  },
};

