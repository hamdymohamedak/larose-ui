import type { CSSProperties } from 'react';

/** className + inline CSS accepted by every visual laRose component. */
export interface StyleProps {
  className?: string;
  style?: CSSProperties;
}

/** Merge inline styles; later arguments win. */
export function mergeStyles(
  ...parts: Array<CSSProperties | undefined>
): CSSProperties | undefined {
  const next: CSSProperties = {};
  let assigned = false;
  for (const part of parts) {
    if (!part) continue;
    Object.assign(next, part);
    assigned = true;
  }
  return assigned ? next : undefined;
}
