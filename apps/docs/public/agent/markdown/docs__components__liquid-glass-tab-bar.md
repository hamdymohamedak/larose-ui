# LiquidGlassTabBar

Category: Glass

## Props
- `activeColor` (string)
- `activeKey` (string)
- `aria-label` (string) — Accessible label (recommended for nav/header).
- `as` (string) — HTML tag name for the glass shell (`div`, `footer`, `nav`, …).
- `bezelWidth` (number) — Refracting bezel band width in px.
- `blur` (number) — Backdrop blur radius in px (non-Chromium fallback).
- `borderColor` (string) — Inset border colour.
- `borderRadius` (number)
- `bottom` (number | string)
- `className` (string)
- `defaultActiveKey` (string)
- `displacementScale` (number) — feDisplacementMap scale — higher = stronger refraction.
- `height` (number)
- `inactiveColor` (string)
- `indicatorBackground` (string)
- `indicatorBorderColor` (string)
- `indicatorPadding` (number)
- `innerBottomShadow` (number) — Inner bottom shadow fog opacity.
- `innerTopHighlight` (number) — 1px inner top highlight opacity.
- `items` (LiquidGlassTabItem[])
- `maxHeight` (number | string)
- `maxWidth` (number)
- `minHeight` (number | string)
- `minWidth` (number | string)
- `onDisplacementMapChange` ((dataUrl: string) => void) — Expose the displacement map data URL (for debug / lens lab).
- `position` ('fixed' | 'absolute' | 'relative' | 'static')
- `refractionStrength` (number) — Raw displacement magnitude multiplier (0–2).
- `saturation` (number) — Backdrop saturation multiplier.
- `shadowIntensity` (number) — Drop shadow intensity (0 = off).
- `showIndicator` (boolean)
- `showSpecular` (boolean) — Show conic-gradient specular rim.
- `specularAngle` (number) — Specular conic-gradient start angle (deg).
- `specularEdgeOpacity` (number) — Specular edge/wing opacity.
- `specularTopOpacity` (number) — Brightest specular peak opacity.
- `style` (LiquidGlassStyle) — Inline CSS merged onto the surface. Flex / grid / padding apply to inner content.
- `tint` (string) — Glass fill on Chromium (SVG refraction path).
- `tintFallback` (string) — Glass fill on non-Chromium fallback.
- `width` (number | string)

Metadata: /components/liquid-glass-tab-bar.json
