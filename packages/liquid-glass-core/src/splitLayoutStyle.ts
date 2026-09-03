export const LIQUID_GLASS_LAYOUT_KEYS = [
  'display',
  'flex',
  'flexDirection',
  'flexWrap',
  'flexFlow',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignItems',
  'alignContent',
  'alignSelf',
  'justifyContent',
  'justifyItems',
  'justifySelf',
  'placeItems',
  'placeContent',
  'placeSelf',
  'order',
  'gap',
  'rowGap',
  'columnGap',
  'grid',
  'gridTemplate',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',
  'gridAutoFlow',
  'gridAutoColumns',
  'gridAutoRows',
  'gridColumn',
  'gridRow',
  'gridArea',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingInline',
  'paddingBlock',
  'paddingInlineStart',
  'paddingInlineEnd',
] as const;

export type LiquidGlassLayoutStyleKey = (typeof LIQUID_GLASS_LAYOUT_KEYS)[number];
export type LiquidGlassStyleMap = Record<string, string | number | undefined>;
export type LiquidGlassLayoutStyle = Partial<
  Record<LiquidGlassLayoutStyleKey, string | number>
>;

/** Move flex / padding layout props to the inner content wrapper. */
export function splitLiquidGlassLayoutStyle(style?: LiquidGlassStyleMap): {
  shell: LiquidGlassStyleMap;
  content: LiquidGlassLayoutStyle;
} {
  if (!style) return { shell: {}, content: {} };

  const shell: LiquidGlassStyleMap = { ...style };
  const content: LiquidGlassLayoutStyle = {};

  for (const key of LIQUID_GLASS_LAYOUT_KEYS) {
    const value = style[key];
    if (value !== undefined) {
      content[key] = value;
      delete shell[key];
    }
  }

  return { shell, content };
}
