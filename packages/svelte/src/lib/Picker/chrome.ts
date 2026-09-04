export function isInlineCssStyle(value: unknown): value is Record<string, string | number> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function resolvePickerChrome<T extends string>(
  appearance: T | undefined,
  style: T | Record<string, string | number> | undefined,
  fallback: T,
): { appearance: T; css?: Record<string, string | number> } {
  const css = isInlineCssStyle(style) ? style : undefined;
  const fromString = typeof style === 'string' ? style : undefined;
  return {
    appearance: appearance ?? fromString ?? fallback,
    css,
  };
}
