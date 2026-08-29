const UNSAFE_PROTOCOL = /^\s*(javascript|data|vbscript|blob):/i;
const PROTOCOL_RELATIVE = /^\s*\/\//;

function normalizeForCheck(url: string): string {
  return url.trim().replace(/\\/g, '/');
}

/**
 * Returns a safe href for in-app navigation, or undefined when the URL is unsafe.
 * Blocks javascript:, data:, vbscript:, blob:, and protocol-relative URLs.
 */
export function sanitizeNavigationUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();
  if (!trimmed) return undefined;

  const normalized = normalizeForCheck(trimmed);
  if (UNSAFE_PROTOCOL.test(normalized)) return undefined;
  if (PROTOCOL_RELATIVE.test(normalized)) return undefined;

  return trimmed;
}

/**
 * Validates same-origin relative redirect targets (e.g. login paths).
 */
export function isSafeRedirectPath(url: string): boolean {
  const normalized = normalizeForCheck(url);
  if (!normalized.startsWith('/')) return false;
  if (PROTOCOL_RELATIVE.test(normalized)) return false;
  if (UNSAFE_PROTOCOL.test(normalized)) return false;
  return true;
}
