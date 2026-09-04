import { buildLiquidGlassDisplacementMap } from '../engine/displacement-map';
import { supportsLiquidGlassRefraction } from '../engine/detect';
import { resolveLiquidGlassOptics } from '../engine/defaults';
import type { LiquidGlassOptics } from '../engine/types';

export interface UseLiquidGlassOptions extends LiquidGlassOptics {
  borderRadius?: number;
  onDisplacementMapChange?: (dataUrl: string) => void;
}

let filterIdCounter = 0;

export function createLiquidGlassRuntime(
  getOptions: () => UseLiquidGlassOptions,
  getShell: () => HTMLElement | null,
) {
  const filterId = `lgf-${++filterIdCounter}`;
  const supportsRefraction = supportsLiquidGlassRefraction();
  let mapDataUrl = $state('');

  function rebuildMap() {
    const options = getOptions();
    const el = getShell();
    if (!el) return;
    const borderRadius = options.borderRadius ?? 30;
    const optics = resolveLiquidGlassOptics(options);
    const w = Math.max(2, Math.round(el.offsetWidth));
    const h = Math.max(2, Math.round(el.offsetHeight));
    const url = buildLiquidGlassDisplacementMap({
      width: w,
      height: h,
      borderRadius: Math.min(borderRadius, w / 2, h / 2),
      bezelWidth: optics.bezelWidth,
      refractionStrength: optics.refractionStrength,
    });
    mapDataUrl = url;
    options.onDisplacementMapChange?.(url);
  }

  $effect(() => {
    const options = getOptions();
    getShell();
    // Track resolved optics deps like React's useLayoutEffect dependency list.
    const resolved = resolveLiquidGlassOptics(options);
    void resolved.bezelWidth;
    void resolved.refractionStrength;
    void options.borderRadius;
    if (!supportsRefraction) return;
    rebuildMap();
    const el = getShell();
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(rebuildMap);
    observer.observe(el);
    return () => observer.disconnect();
  });

  const optics = $derived(resolveLiquidGlassOptics(getOptions()));
  const backdropFilter = $derived(
    supportsRefraction
      ? `url(#${filterId}) saturate(${optics.saturation})`
      : `blur(${optics.blur}px) saturate(${optics.saturation})`,
  );
  const shellStyle = $derived({
    background: supportsRefraction ? optics.tint : optics.tintFallback,
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    boxShadow: [
      optics.shadowIntensity > 0
        ? `0 18px 40px -12px rgba(0, 0, 0, ${(0.55 * optics.shadowIntensity).toFixed(2)})`
        : null,
      `inset 0 0 0 1px ${optics.borderColor}`,
    ].filter(Boolean).join(', '),
    overflow: 'hidden' as const,
  });

  return {
    filterId,
    supportsRefraction,
    get mapDataUrl() { return mapDataUrl; },
    get optics() { return optics; },
    get shellStyle() { return shellStyle; },
  };
}
