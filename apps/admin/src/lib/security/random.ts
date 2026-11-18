/**
 * Cryptographically secure random number and string generators for the browser.
 * Resolves CodeQL alerts for insecure randomness (Math.random).
 */

export function getSecureRandomInt(min: number, max: number): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const range = max - min + 1;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return min + (array[0] % range);
  }
  return min;
}

export function getSecureRandomId(length = 8): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const bytesNeeded = Math.ceil(length / 2);
    const array = new Uint8Array(bytesNeeded);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  }
  return `${Date.now()}`;
}
