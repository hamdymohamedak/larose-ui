export type AIIntentType = 'table.filter' | 'form.populate' | 'unknown';

export interface AIIntent {
  type: AIIntentType;
  raw: string;
  sanitized: string;
  confidence: 'high' | 'medium' | 'low';
  keywords: string[];
}

const MAX_PROMPT_LENGTH = 500;
const UNSAFE_PATTERN = /<[^>]+>|javascript:|data:|vbscript:|on\w+\s*=/i;

export function sanitizePrompt(input: string, maxLength = MAX_PROMPT_LENGTH): string {
  const trimmed = input.trim().replace(/\s+/g, ' ');
  const stripped = trimmed.replace(UNSAFE_PATTERN, '');
  return stripped.slice(0, maxLength);
}

export function parseIntent(query: string): AIIntent {
  const sanitized = sanitizePrompt(query);
  const lower = sanitized.toLowerCase();
  const keywords = extractKeywords(lower);

  if (!sanitized) {
    return { type: 'unknown', raw: query, sanitized, confidence: 'low', keywords: [] };
  }

  if (
    lower.includes('create') ||
    lower.includes('add') ||
    lower.includes('new employee') ||
    lower.includes('populate') ||
    lower.includes('fill')
  ) {
    return {
      type: 'form.populate',
      raw: query,
      sanitized,
      confidence: 'high',
      keywords,
    };
  }

  if (
    lower.includes('show') ||
    lower.includes('filter') ||
    lower.includes('find') ||
    lower.includes('late') ||
    lower.includes('department') ||
    lower.includes('who')
  ) {
    return {
      type: 'table.filter',
      raw: query,
      sanitized,
      confidence: lower.length > 8 ? 'high' : 'medium',
      keywords,
    };
  }

  return {
    type: 'unknown',
    raw: query,
    sanitized,
    confidence: 'low',
    keywords,
  };
}

function extractKeywords(lower: string): string[] {
  const stop = new Set(['show', 'the', 'who', 'were', 'this', 'that', 'for', 'and', 'with']);
  return lower
    .split(/\W+/)
    .filter((word) => word.length > 2 && !stop.has(word))
    .slice(0, 8);
}
