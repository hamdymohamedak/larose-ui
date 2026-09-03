const LAYOUT_KEYS = [
  'display', 'flex', 'flexDirection', 'flexWrap', 'flexFlow', 'flexGrow', 'flexShrink', 'flexBasis',
  'alignItems', 'alignContent', 'alignSelf', 'justifyContent', 'justifyItems', 'justifySelf',
  'placeItems', 'placeContent', 'placeSelf', 'order', 'gap', 'rowGap', 'columnGap', 'grid',
  'gridTemplate', 'gridTemplateColumns', 'gridTemplateRows', 'gridTemplateAreas', 'gridAutoFlow',
  'gridAutoColumns', 'gridAutoRows', 'gridColumn', 'gridRow', 'gridArea', 'padding', 'paddingTop',
  'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingInline', 'paddingBlock',
  'paddingInlineStart', 'paddingInlineEnd',
] as const;

type LayoutStyleKey = (typeof LAYOUT_KEYS)[number];
type StyleMap = Record<string, string | number | undefined>;
type LayoutStyle = Partial<Record<LayoutStyleKey, string | number>>;

export function splitLiquidGlassLayoutStyle(style?: StyleMap): {
  shell: StyleMap;
  content: LayoutStyle;
} {
  if (!style) return { shell: {}, content: {} };
  const shell: StyleMap = { ...style };
  const content: LayoutStyle = {};
  for (const key of LAYOUT_KEYS) {
    const value = style[key];
    if (value !== undefined) {
      content[key] = value;
      delete shell[key];
    }
  }
  return { shell, content };
}
