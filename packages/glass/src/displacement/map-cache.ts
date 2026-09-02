import type { DisplacementMapData } from '../types';
import { lensGeometryKey, resolveLens } from '../lens/defaults';
import type { GlassLens } from '../types';
import { generateDisplacementMap as generateUncached } from './displacement-map';
import type { DisplacementMapOptions } from '../types';

const MAX_CACHE_SIZE = 32;
const cache = new Map<string, DisplacementMapData>();

function cacheKey(lens: GlassLens, options: DisplacementMapOptions): string {
  const resolved = resolveLens(lens);
  const pixelRatio = options.pixelRatio ?? 1;
  const optimize = options.optimize ?? true;
  return `${lensGeometryKey(resolved)}:dpr${pixelRatio}:opt${optimize ? 1 : 0}`;
}

/** Generate or retrieve a cached displacement map. Identical lens geometry shares the same map. */
export function getCachedDisplacementMap(
  lens: GlassLens,
  options: DisplacementMapOptions = {},
): DisplacementMapData {
  const key = cacheKey(lens, options);
  const hit = cache.get(key);
  if (hit) return hit;

  const map = generateUncached(lens, options);

  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, map);
  return map;
}

/** Clear the displacement map cache (tests / hot reload). */
export function clearDisplacementMapCache(): void {
  cache.clear();
}

export function displacementMapCacheSize(): number {
  return cache.size;
}
