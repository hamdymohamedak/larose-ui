# LiquidGlassTopBar

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
- `className` (string)
- `defaultActiveKey` (string)
- `displacementScale` (number) — feDisplacementMap scale — higher = stronger refraction.
- `height` (number)
- `inactiveColor` (string)
- `innerBottomShadow` (number) — Inner bottom shadow fog opacity.
- `innerTopHighlight` (number) — 1px inner top highlight opacity.
- `insetX` (number)
- `items` (LiquidGlassTopBarItem[])
- `logo` (ReactNode)
- `maxHeight` (number | string)
- `maxWidth` (number | string)
- `minHeight` (number | string)
- `minWidth` (number | string)
- `navActiveBackground` (string) — Active nav pill background.
- `navTrackBackground` (string) — Background of the segmented nav track.
- `onDisplacementMapChange` ((dataUrl: string) => void) — Expose the displacement map data URL (for debug / lens lab).
- `paddingX` (number)
- `position` ('fixed' | 'absolute' | 'relative' | 'sticky' | 'static')
- `refractionStrength` (number) — Raw displacement magnitude multiplier (0–2).
- `saturation` (number) — Backdrop saturation multiplier.
- `shadowIntensity` (number) — Drop shadow intensity (0 = off).
- `showSpecular` (boolean) — Show conic-gradient specular rim.
- `specularAngle` (number) — Specular conic-gradient start angle (deg).
- `specularEdgeOpacity` (number) — Specular edge/wing opacity.
- `specularTopOpacity` (number) — Brightest specular peak opacity.
- `style` (LiquidGlassStyle) — Inline CSS merged onto the surface. Flex / grid / padding apply to inner content.
- `tint` (string) — Glass fill on Chromium (SVG refraction path).
- `tintFallback` (string) — Glass fill on non-Chromium fallback.
- `titleColor` (string)
- `top` (number | string)
- `trailing` (ReactNode)
- `variant` (LiquidGlassTopBarVariant) — `floating` — inset pill bar with rounded corners (modern macOS/iOS style).
`edge` — full-bleed bar flush with the viewport top.
- `width` (number | string)

Metadata: /components/liquid-glass-top-bar.json
