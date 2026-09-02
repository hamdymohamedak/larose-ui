import { useCallback, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { buildLiquidGlassDisplacementMap } from '../liquid-glass/displacement-map';
import { supportsLiquidGlassRefraction } from '../liquid-glass/detect';
import { resolveLiquidGlassOptics } from '../liquid-glass/defaults';
import type { LiquidGlassOptics } from '../liquid-glass/types';

export interface UseLiquidGlassOptions extends LiquidGlassOptics {
  borderRadius?: number;
  onDisplacementMapChange?: (dataUrl: string) => void;
}

export interface UseLiquidGlassResult {
  shellRef: RefObject<HTMLElement | null>;
  filterId: string;
  mapDataUrl: string;
  supportsRefraction: boolean;
  optics: ReturnType<typeof resolveLiquidGlassOptics>;
  backdropFilter: string;
  shellStyle: {
    background: string;
    backdropFilter: string;
    WebkitBackdropFilter: string;
    boxShadow: string;
    overflow: 'hidden';
  };
}

export function useLiquidGlass({
  borderRadius = 30,
  onDisplacementMapChange,
  ...opticsOverrides
}: UseLiquidGlassOptions): UseLiquidGlassResult {
  const uid = useId().replace(/:/g, '');
  const filterId = `lgf-${uid}`;
  const shellRef = useRef<HTMLElement>(null);
  const [mapDataUrl, setMapDataUrl] = useState('');
  const optics = resolveLiquidGlassOptics(opticsOverrides);
  const supportsRefraction = supportsLiquidGlassRefraction();

  const rebuildMap = useCallback(() => {
    const el = shellRef.current;
    if (!el) return;

    const w = Math.max(2, Math.round(el.offsetWidth));
    const h = Math.max(2, Math.round(el.offsetHeight));
    const url = buildLiquidGlassDisplacementMap({
      width: w,
      height: h,
      borderRadius: Math.min(borderRadius, w / 2, h / 2),
      bezelWidth: optics.bezelWidth,
      refractionStrength: optics.refractionStrength,
    });

    setMapDataUrl(url);
    onDisplacementMapChange?.(url);
  }, [
    borderRadius,
    optics.bezelWidth,
    optics.refractionStrength,
    onDisplacementMapChange,
  ]);

  useLayoutEffect(() => {
    if (!supportsRefraction) return;
    rebuildMap();

    const el = shellRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(rebuildMap);
    ro.observe(el);
    return () => ro.disconnect();
  }, [supportsRefraction, rebuildMap]);

  const backdropFilter = supportsRefraction
    ? `url(#${filterId}) saturate(${optics.saturation})`
    : `blur(${optics.blur}px) saturate(${optics.saturation})`;

  const shellStyle = {
    background: supportsRefraction ? optics.tint : optics.tintFallback,
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    boxShadow: [
      optics.shadowIntensity > 0
        ? `0 18px 40px -12px rgba(0, 0, 0, ${(0.55 * optics.shadowIntensity).toFixed(2)})`
        : null,
      `inset 0 0 0 1px ${optics.borderColor}`,
    ]
      .filter(Boolean)
      .join(', '),
    overflow: 'hidden' as const,
  };

  return {
    shellRef,
    filterId,
    mapDataUrl,
    supportsRefraction,
    optics,
    backdropFilter,
    shellStyle,
  };
}
