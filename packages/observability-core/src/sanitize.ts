const SENSITIVE_KEY = /password|passwd|secret|token|authorization|auth|api[_-]?key|credential|cookie|bearer|ssn|private[_-]?key/i;
const REDACTED = '[REDACTED]';

function sanitizeValue(key: string, value: unknown): unknown {
  if (SENSITIVE_KEY.test(key)) {
    return REDACTED;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return sanitizeMetadata(value as Record<string, unknown>);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(String(index), item));
  }

  if (typeof value === 'string' && SENSITIVE_KEY.test(value)) {
    return REDACTED;
  }

  return value;
}

export function sanitizeMetadata(
  metadata: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!metadata) return metadata;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    out[key] = sanitizeValue(key, value);
  }
  return out;
}

export function sanitizeUIEvent<T extends { metadata?: Record<string, unknown> }>(
  event: T,
): T {
  if (!event.metadata) return event;
  return {
    ...event,
    metadata: sanitizeMetadata(event.metadata),
  };
}
