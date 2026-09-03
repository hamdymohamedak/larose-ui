import type { CSSProperties } from 'react';
import { splitLiquidGlassLayoutStyle as splitCore } from '@larose-ui/liquid-glass-core';

/** Move flex / padding layout props to the inner content wrapper. */
export function splitLiquidGlassLayoutStyle(style?: CSSProperties): {
  shell: CSSProperties;
  content: CSSProperties;
} {
  const { shell, content } = splitCore(
    style as Record<string, string | number | undefined> | undefined,
  );
  return {
    shell: shell as CSSProperties,
    content: content as CSSProperties,
  };
}
