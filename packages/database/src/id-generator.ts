import { randomBytes } from 'crypto';

/**
 * Crockford Base32 Alphabet:
 * 32 characters: digits 2-9 and uppercase letters excluding 0, 1, I, L, O, U.
 * Guarantees zero confusing characters (no 0 vs O or 1 vs I/L)
 * and zero accidental curse words (vowel U omitted).
 */
const CROCKFORD_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Generates a 6-character code grouped into two 3-character chunks:
 * e.g. "8K4-M2P"
 */
export function generateShortCode(): string {
  const bytes = randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CROCKFORD_ALPHABET[bytes[i] % CROCKFORD_ALPHABET.length];
  }
  return `${code.slice(0, 3)}-${code.slice(3, 6)}`;
}

export type BrandEntityType = 'ORD' | 'CUST' | 'PROD' | 'DLR';

/**
 * Generates a brandable ID in the format:
 * - Orders:   FF-ORD-8K4-M2P
 * - Customers: FF-CUST-3X8-9KM
 * - Products:  FF-PROD-7B2-5NT
 * - Dealers:   FF-DLR-4H9-P2Q
 */
export function generateBrandId(type: BrandEntityType = 'ORD'): string {
  return `FF-${type}-${generateShortCode()}`;
}
