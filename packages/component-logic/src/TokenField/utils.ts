import type { TokenFieldToken } from './types';

export const DEFAULT_SUGGESTION_DELAY_MS = 250;

export function tokenizeInput(value: string, delimiters: string[]): TokenFieldToken[] {
  const pattern = delimiters.length > 0 ? delimiters.map((d) => `\\${d}`).join('|') : ',';
  return value
    .split(new RegExp(pattern))
    .map((part) => part.trim())
    .filter(Boolean)
    .map((label, index) => ({ id: `token-${index}-${label}`, label }));
}

export function mergeUniqueTokens(existing: TokenFieldToken[], incoming: TokenFieldToken[]): TokenFieldToken[] {
  const seen = new Set(existing.map((token) => token.label.toLowerCase()));
  const next = [...existing];
  for (const token of incoming) {
    const key = token.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(token);
  }
  return next;
}

export function filterTokenSuggestions(query: string, suggestions: TokenFieldToken[]): TokenFieldToken[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return suggestions.slice(0, 6);
  return suggestions.filter((item) => item.label.toLowerCase().includes(trimmed)).slice(0, 6);
}

export function shouldCommitToken(key: string, delimiters: string[]): boolean {
  return key === 'Enter' || delimiters.includes(key);
}
