import type { CSSProperties } from 'react';

const LAYOUT_KEYS = [
  'display',
  'flexDirection',
  'flexWrap',
  'flexFlow',
  'alignItems',
  'alignContent',
  'alignSelf',
  'justifyContent',
  'justifyItems',
  'gap',
  'rowGap',
  'columnGap',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const satisfies readonly (keyof CSSProperties)[];

type LayoutStyleKey = (typeof LAYOUT_KEYS)[number];
type LayoutStyle = Partial<Pick<CSSProperties, LayoutStyleKey>>;

/** Move flex / padding layout props to the inner content wrapper. */
export function splitLiquidGlassLayoutStyle(style?: CSSProperties): {
  shell: CSSProperties;
  content: LayoutStyle;
} {
  if (!style) return { shell: {}, content: {} };

  const shell = { ...style };
  const content: LayoutStyle = {};

  for (const key of LAYOUT_KEYS) {
    const value = style[key];
    if (value !== undefined) {
      Object.assign(content, { [key]: value });
      delete shell[key];
    }
  }

  return { shell, content };
}
