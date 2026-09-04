import type { CSSProperties } from 'vue';

/** CSS properties that are unitless when numeric (Vue/React convention). */
const UNITLESS = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zoom',
  'widows',
  'orphans',
  'fillOpacity',
  'strokeOpacity',
  'strokeWidth',
]);

/**
 * Normalize a style map for Vue DOM bindings.
 * Drops nullish keys and suffixes length numbers with `px` (React does this
 * in its style runtime; Vue's auto-px can miss some bindings in SFCs).
 */
export function normalizeGlassStyle(
  map: Record<string, string | number | undefined | null>,
): CSSProperties {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(map)) {
    if (value == null) continue;
    if (typeof value === 'number' && !UNITLESS.has(key)) {
      out[key] = `${value}px`;
    } else {
      out[key] = value;
    }
  }
  return out;
}
