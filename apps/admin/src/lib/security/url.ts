/**
 * Security utilities to validate and sanitize URLs before rendering in hyperlinks.
 * Prevents DOM-based Cross-Site Scripting (XSS) and CodeQL DOM text reinterpreted as HTML alerts.
 */

const DANGEROUS_PROTOCOLS = /^(?:javascript|data|vbscript):/i;

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
