import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { resolveLens } from '../lens/defaults';
import { supportsBackdropSvgDisplacement } from '../capabilities/detect';
import { GlassEngine } from '../engine/glass-engine';
import type { GlassLens } from '../types';

export interface LensBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UseGlassLensOverlayOptions {
  lens: GlassLens;
  /** Initial bounds applied on mount. */
  initialBounds?: LensBounds;
}

export interface UseGlassLensOverlayResult {
  lensRef: RefObject<HTMLDivElement | null>;
  engineActive: boolean;
  setBounds: (bounds: LensBounds) => void;
  updateLens: (lens: GlassLens) => void;
}

function applyCssLensFallback(el: HTMLElement, bounds: LensBounds, lens: GlassLens): void {
  const resolved = resolveLens(lens);
  const h = resolved.edgeHighlight;
  const angle = resolved.specularAngle;
  Object.assign(el.style, {
    position: 'absolute',
    left: `${bounds.x}px`,
    top: `${bounds.y}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    borderRadius: `${resolved.borderRadius}px`,
    zIndex: '2',
    pointerEvents: 'none',
    background: `linear-gradient(
      ${angle}deg,
      rgb(255 255 255 / ${0.55 + h * 0.25}) 0%,
      rgb(255 255 255 / ${0.28 + h * 0.12}) 55%,
      rgb(255 255 255 / 0.12) 100%
    )`,
    border: `1px solid rgb(255 255 255 / ${0.45 + h * 0.35})`,
    boxShadow: [
      resolved.glow > 0 ? `0 8px 28px rgb(100 80 200 / ${resolved.glow * 0.28})` : null,
      `inset 0 1.5px 0 rgb(255 255 255 / ${0.75 + h * 0.2})`,
      'inset 0 -0.5px 0 rgb(0 0 0 / 0.05)',
    ]
      .filter(Boolean)
      .join(', '),
    backdropFilter: resolved.blur > 0
      ? `blur(${resolved.blur}px) saturate(1.35)`
      : 'blur(10px) saturate(1.4)',
    WebkitBackdropFilter: resolved.blur > 0
      ? `blur(${resolved.blur}px) saturate(1.35)`
      : 'blur(10px) saturate(1.4)',
  });
}

function lensEffectKey(lens: GlassLens): string {
  const r = resolveLens(lens);
  return [
    r.width, r.height, r.borderRadius,
    r.depth, r.curvature, r.splay, r.scale, r.chroma,
    r.blur, r.glow, r.edgeHighlight, r.specularAngle,
  ].join(':');
}

export function useGlassLensOverlay({
  lens,
  initialBounds,
}: UseGlassLensOverlayOptions): UseGlassLensOverlayResult {
  const lensRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GlassEngine | null>(null);
  const lensRef_latest = useRef(lens);
  lensRef_latest.current = lens;
  const reducedMotion = detectA11yPreferences().reducedMotion;
  const engineActive = supportsBackdropSvgDisplacement() && !reducedMotion;
  const effectKey = lensEffectKey(lens);

  useEffect(() => {
    const el = lensRef.current;
    if (!el) return undefined;

    if (!engineActive) {
      if (initialBounds) {
        applyCssLensFallback(el, initialBounds, lensRef_latest.current);
      }
      return undefined;
    }

    const engine = new GlassEngine({
      lens: lensRef_latest.current,
      refractionMode: 'backdrop',
      renderer: 'svg',
      position: initialBounds
        ? { x: initialBounds.x, y: initialBounds.y }
        : { x: 0, y: 0 },
    });
    engine.mount(el);
    engineRef.current = engine;

    if (initialBounds) {
      engine.setBounds(initialBounds);
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [engineActive, effectKey, initialBounds]);

  useEffect(() => {
    engineRef.current?.setLens(lens);
  }, [lens, effectKey]);

  const setBounds = useCallback((bounds: LensBounds) => {
    if (engineRef.current) {
      engineRef.current.setBounds(bounds);
    } else if (lensRef.current) {
      applyCssLensFallback(lensRef.current, bounds, lensRef_latest.current);
    }
  }, []);

  const updateLens = useCallback((next: GlassLens) => {
    lensRef_latest.current = next;
    engineRef.current?.setLens(next);
  }, []);

  return { lensRef, engineActive, setBounds, updateLens };
}
