/**
 * Security utilities to validate and sanitize URLs before rendering in the DOM.
 * Prevents DOM-based Cross-Site Scripting (XSS) and "DOM text reinterpreted as HTML" CodeQL alerts.
 */

const DANGEROUS_PROTOCOLS = /^(?:javascript|data|vbscript):/i;
const SAFE_MEDIA_PREFIXES = ['http://', 'https://', 'blob:', 'data:image/', '/'];

/**
 * Sanitizes URLs meant for hyperlinks (<a href="...">).
 * Only accepts valid http: or https: protocols and absolute local paths.
 * Returns fallback (default: '#') if invalid or potentially malicious.
 */
export function sanitizeHref(url: string | null | undefined, fallback = '#'): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();
  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    return fallback;
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Not a valid absolute URL
  }

  return fallback;
}

/**
 * Sanitizes URLs meant for media sources (<img src="...">, <video src="...">).
 * Allows http:, https:, blob:, data:image/, and local paths.
 * Returns empty string if invalid.
 */
export function sanitizeMediaSrc(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Explicitly disallow script executions
  if (/^(?:javascript|vbscript):/i.test(trimmed)) {
    return '';
  }

  // Allow blob:, data:image/, and root-relative paths
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:image/') ||
    (trimmed.startsWith('/') && !trimmed.startsWith('//'))
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'blob:') {
      return trimmed;
    }
  } catch {
    // Malformed URL
  }

  return '';
}
