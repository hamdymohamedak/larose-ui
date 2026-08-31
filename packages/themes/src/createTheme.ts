import type { LaRoseTheme, LaRoseThemeInput } from './types';
import { normalizeThemeInput } from './normalizeTheme';

/**
 * Create a laRose theme by extending a preset and applying overrides.
 *
 * @example
 * ```tsx
 * const theme = createTheme({
 *   base: 'refined',
 *   colors: { primary: '#6C5CE7' },
 *   radius: { md: '10px' },
 * });
 * ```
 */
export function createTheme(input: LaRoseThemeInput = {}): LaRoseTheme {
  return normalizeThemeInput(input);
}
