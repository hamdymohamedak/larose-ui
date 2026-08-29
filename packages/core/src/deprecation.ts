const warned = new Set<string>();

/**
 * Log a one-time deprecation warning in non-production environments.
 */
export function warnDeprecation(id: string, message: string, replacement?: string): void {
  const isProd =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
  if (isProd || warned.has(id)) return;

  warned.add(id);
  const suffix = replacement ? ` Use ${replacement} instead.` : '';
  console.warn(`[laRose] Deprecated (${id}): ${message}.${suffix}`);
}

/** Reset warned set — for tests only. */
export function resetDeprecationWarnings(): void {
  warned.clear();
}
