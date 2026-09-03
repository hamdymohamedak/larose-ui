/**
 * Returns true on Chromium desktop — the only engine that supports
 * `backdrop-filter: url(#svgFilter)` for live refraction.
 */
export function supportsLiquidGlassRefraction(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /\b(?:Chrome|Chromium|Edg)\//.test(ua) &&
    !/\b(?:CriOS|EdgiOS|FxiOS|OPiOS)\b/.test(ua) &&
    !/iPhone|iPad|iPod/.test(ua) &&
    !/Firefox/i.test(ua)
  );
}
