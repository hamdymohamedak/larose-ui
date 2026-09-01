import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { resolveLens } from '../lens/defaults';
import {
  selectRefractionMode,
  supportsBackdropGlassRefraction,
} from '../capabilities/detect';
import { GlassEngine } from '../engine/glass-engine';
import type { GlassLens } from '../types';
import { glassRuntimeLog } from '../debug/runtime-log';

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
  refractionMode: ReturnType<typeof selectRefractionMode>;
  setBounds: (bounds: LensBounds) => void;
  updateLens: (lens: GlassLens) => void;
}

function applyCssLensFallback(el: HTMLElement, bounds: LensBounds, lens: GlassLens): void {
  const resolved = resolveLens(lens);
  const h = resolved.edgeHighlight;
  const angle = resolved.specularAngle;
  const blurPx = resolved.blur > 0 ? resolved.blur : 8;
  Object.assign(el.style, {
    position: 'absolute',
    left: `${bounds.x}px`,
    top: `${bounds.y}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    borderRadius: `${resolved.borderRadius}px`,
    zIndex: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
    background: `linear-gradient(
      ${angle}deg,
      rgb(255 255 255 / ${0.06 + h * 0.1}) 0%,
      rgb(255 255 255 / ${0.02 + h * 0.04}) 55%,
      transparent 100%
    )`,
    border: `1px solid rgb(255 255 255 / ${0.28 + h * 0.2})`,
    boxShadow: [
      resolved.glow > 0 ? `0 8px 28px rgb(100 80 200 / ${resolved.glow * 0.18})` : null,
      `inset 0 1px 0 rgb(255 255 255 / ${0.35 + h * 0.15})`,
      'inset 0 -0.5px 0 rgb(0 0 0 / 0.04)',
    ]
      .filter(Boolean)
      .join(', '),
    backdropFilter: supportsBackdropGlassRefraction()
      ? `blur(${blurPx}px) saturate(1.15)`
      : 'none',
    WebkitBackdropFilter: supportsBackdropGlassRefraction()
      ? `blur(${blurPx}px) saturate(1.15)`
      : 'none',
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
  const refractionMode = selectRefractionMode('overlay');
  const engineActive = refractionMode === 'backdrop' && !reducedMotion;
  const effectKey = lensEffectKey(lens);

  useEffect(() => {
    const el = lensRef.current;
    if (!el) return undefined;

    // #region agent log
    glassRuntimeLog(
      'useGlassLensOverlay.ts:init',
      'lens overlay init',
      {
        refractionMode,
        engineActive,
        reducedMotion,
        hasInitialBounds: Boolean(initialBounds),
      },
      'A',
      'SourceGraphic-fix',
    );
    // #endregion

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
  }, [engineActive, effectKey, initialBounds, refractionMode]);

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

  return { lensRef, engineActive, refractionMode, setBounds, updateLens };
}
