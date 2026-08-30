import type { SearchFieldPlacement } from './types';

export const DEFAULT_SEARCH_PLACEHOLDER = 'Search';

export function warnIfSearchPlacementMismatch(
  placement: SearchFieldPlacement,
  platform: string,
): void {
  if (placement === 'bottom-toolbar' && platform === 'macos') {
    console.warn('Prefer trailing toolbar search on macOS rather than bottom toolbar placement.');
  }
}

export function filterSuggestions(query: string, suggestions: string[], limit = 6): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return suggestions.slice(0, limit);
  return suggestions
    .filter((item) => item.toLowerCase().includes(trimmed))
    .slice(0, limit);
}

export function shouldShowSuggestions(query: string, suggestions: string[]): boolean {
  return suggestions.length > 0;
}

export function resolveSearchFieldPlacement(
  platform: 'ios' | 'ipados' | 'macos' | 'tvos' | 'visionos' | 'watchos',
  placement?: SearchFieldPlacement,
): SearchFieldPlacement {
  if (placement) return placement;
  if (platform === 'macos' || platform === 'ipados') return 'toolbar-trailing';
  return 'inline';
}
