# LiquidGlassCheckbox

Category: Glass

## Props
- `'aria-label'` (string)
- `as` (string) — HTML tag name for the glass shell (`div`, `footer`, `nav`, …).
- `bezelWidth` (number) — Refracting bezel band width in px.
- `blur` (number) — Backdrop blur radius in px (non-Chromium fallback).
- `borderColor` (string) — Inset border colour.
- `borderRadius` (number)
- `checkColor` (string)
- `checked` (boolean)
- `checkedTint` (string)
- `className` (string)
- `defaultChecked` (boolean)
- `disabled` (boolean)
- `displacementScale` (number) — feDisplacementMap scale — higher = stronger refraction.
- `height` (number | string)
- `innerBottomShadow` (number) — Inner bottom shadow fog opacity.
- `innerTopHighlight` (number) — 1px inner top highlight opacity.
- `label` (ReactNode)
- `labelColor` (string)
- `maxHeight` (number | string)
- `maxWidth` (number | string)
- `minHeight` (number | string)
- `minWidth` (number | string)
- `onDisplacementMapChange` ((dataUrl: string) => void) — Expose the displacement map data URL (for debug / lens lab).
- `refractionStrength` (number) — Raw displacement magnitude multiplier (0–2).
- `saturation` (number) — Backdrop saturation multiplier.
- `shadowIntensity` (number) — Drop shadow intensity (0 = off).
- `showSpecular` (boolean) — Show conic-gradient specular rim.
- `size` (number) — Box size in px.
- `specularAngle` (number) — Specular conic-gradient start angle (deg).
- `specularEdgeOpacity` (number) — Specular edge/wing opacity.
- `specularTopOpacity` (number) — Brightest specular peak opacity.
- `style` (LiquidGlassStyle) — Inline CSS merged onto the surface. Flex / grid / padding apply to inner content.
- `tint` (string) — Glass fill on Chromium (SVG refraction path).
- `tintFallback` (string) — Glass fill on non-Chromium fallback.
- `width` (number | string)

Metadata: /components/liquid-glass-checkbox.json
