import type { CSSProperties } from 'react';

export function isInlineCssStyle(value: unknown): value is CSSProperties {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** `style` may be HIG appearance (string) or inline CSS (object). Use `appearance` when you need both. */
export function resolvePickerChrome<T extends string>(
  appearance: T | undefined,
  style: T | CSSProperties | undefined,
  fallback: T,
): { appearance: T; css?: CSSProperties } {
  const css = isInlineCssStyle(style) ? style : undefined;
  const fromString = typeof style === 'string' ? style : undefined;
  return {
    appearance: appearance ?? fromString ?? fallback,
    css,
  };
}
