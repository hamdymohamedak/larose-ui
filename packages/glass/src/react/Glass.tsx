import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { detectA11yPreferences } from '@larose-ui/core';
import { GlassEngine } from '../engine/glass-engine';
import { resolveLens } from '../lens/defaults';
import {
  selectRefractionMode,
  supportsBackdropGlassRefraction,
} from '../capabilities/detect';
import type { GlassLens, GlassPosition } from '../types';
import { glassRuntimeLog } from '../debug/runtime-log';

export interface GlassHandle {
  setPosition(position: GlassPosition): void;
  setLens(lens: GlassLens): void;
  getEngine(): GlassEngine | null;
}

export interface GlassProps {
  lens: GlassLens;
  position?: GlassPosition;
  /** Painted layer the lens bends (required for WebKit scene refraction). */
  refract?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<GlassHandle>;
  disabled?: boolean;
  debug?: boolean;
}

function applyCssGlassShell(
  el: HTMLElement,
  resolved: ReturnType<typeof resolveLens>,
): void {
  const h = resolved.edgeHighlight;
  const angle = resolved.specularAngle;
  const blurPx = resolved.blur > 0 ? resolved.blur : 8;
  Object.assign(el.style, {
    position: 'absolute',
    inset: '0',
    borderRadius: 'inherit',
    zIndex: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
    background: `linear-gradient(
      ${angle}deg,
      rgb(255 255 255 / ${0.05 + h * 0.1}) 0%,
      rgb(255 255 255 / ${0.02 + h * 0.04}) 50%,
      transparent 100%
    )`,
    border: `1px solid rgb(255 255 255 / ${0.3 + h * 0.2})`,
    boxShadow: [
      resolved.glow > 0 ? `0 8px 32px rgb(100 60 200 / ${resolved.glow * 0.2})` : null,
      `inset 0 1px 0 rgb(255 255 255 / ${0.4 + h * 0.2})`,
      'inset 0 -0.5px 0 rgb(0 0 0 / 0.04)',
    ]
      .filter(Boolean)
      .join(', '),
    backdropFilter: supportsBackdropGlassRefraction()
      ? `blur(${blurPx}px) saturate(1.25)`
      : 'none',
    WebkitBackdropFilter: supportsBackdropGlassRefraction()
      ? `blur(${blurPx}px) saturate(1.25)`
      : 'none',
  });
}

function ensureNeutralLensSurface(el: HTMLElement): void {
  let surface = el.querySelector<HTMLElement>('[data-larose-glass-neutral]');
  if (!surface) {
    surface = document.createElement('div');
    surface.setAttribute('data-larose-glass-neutral', '');
    Object.assign(surface.style, {
      position: 'absolute',
      inset: '0',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    });
    el.appendChild(surface);
  }
  surface.style.background = 'rgb(255 255 255 / 0.12)';
}

/**
 * Glass lens — Chromium uses backdrop displacement; WebKit uses filter on a neutral frosted layer.
 * Children render crisp above the lens (liquid-glass pattern).
 */
export function Glass({
  lens,
  refract,
  children,
  className,
  style,
  ref,
  disabled,
  debug,
}: GlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GlassEngine | null>(null);
  const instanceId = useId();
  const reducedMotion = detectA11yPreferences().reducedMotion;
  const effectiveDisabled = disabled || reducedMotion;
  const resolved = resolveLens(lens);
  const refractionMode = selectRefractionMode('shell');
  const engineMode = refractionMode === 'css' ? null : refractionMode;
  const rimOpacity = 0.35 + resolved.edgeHighlight * 0.3;

  useImperativeHandle(ref, () => ({
    setPosition(pos: GlassPosition) {
      engineRef.current?.setPosition(pos);
    },
    setLens(next: GlassLens) {
      engineRef.current?.setLens(next);
    },
    getEngine() {
      return engineRef.current;
    },
  }));

  useEffect(() => {
    const target = lensRef.current;
    if (!target || effectiveDisabled) return undefined;

    // #region agent log
    glassRuntimeLog(
      'Glass.tsx:mount',
      'glass mount path',
      {
        refractionMode,
        reducedMotion,
        effectiveDisabled,
        hasRefract: Boolean(refract),
        ua: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 140) : 'ssr',
        lensW: resolved.width,
        lensH: resolved.height,
      },
      'A',
      'SourceGraphic-fix',
    );
    // #endregion

    if (!engineMode) {
      applyCssGlassShell(target, resolved);
      return () => {
        target.style.cssText = '';
      };
    }

    if (engineMode === 'content') {
      ensureNeutralLensSurface(target);
    }

    const engine = new GlassEngine({
      lens: resolved,
      disabled: false,
      debug,
      renderer: 'svg',
      refractionMode: engineMode,
      position: { x: 0, y: 0 },
    });
    engine.mount(target);
    engine.setBounds({
      x: 0,
      y: 0,
      width: resolved.width,
      height: resolved.height,
    });
    engineRef.current = engine;

    // #region agent log
    requestAnimationFrame(() => {
      if (!target) return;
      const cs = getComputedStyle(target);
      const state = engine.getState();
      glassRuntimeLog(
        'Glass.tsx:engine-mounted',
        'svg engine mounted',
        {
          refractionMode,
          rendererKind: state.rendererKind,
          backdropFilter: cs.backdropFilter,
          filter: cs.filter,
          zIndex: cs.zIndex,
          mapVersion: state.mapVersion,
        },
        'B',
        'SourceGraphic-fix',
      );
    });
    // #endregion

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [effectiveDisabled, debug, instanceId, engineMode]);

  useEffect(() => {
    if (!engineRef.current) {
      const target = lensRef.current;
      if (target && !effectiveDisabled && !engineMode) {
        applyCssGlassShell(target, resolved);
      }
      return;
    }
    engineRef.current.setLens(resolved);
    engineRef.current.setBounds({
      x: 0,
      y: 0,
      width: resolved.width,
      height: resolved.height,
    });
  }, [
    refractionMode,
    engineMode,
    effectiveDisabled,
    resolved.width,
    resolved.height,
    resolved.borderRadius,
    resolved.depth,
    resolved.curvature,
    resolved.splay,
    resolved.scale,
    resolved.chroma,
    resolved.blur,
    resolved.glow,
    resolved.edgeHighlight,
    resolved.specularAngle,
  ]);

  if (effectiveDisabled) {
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          width: resolved.width,
          height: resolved.height,
          borderRadius: resolved.borderRadius,
          background: 'rgb(255 255 255 / 0.18)',
          border: '1px solid rgb(255 255 255 / 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: resolved.width,
        height: resolved.height,
        borderRadius: resolved.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(refractionMode === 'backdrop' ? {} : { isolation: 'isolate' as const }),
        overflow: 'hidden',
        background: 'transparent',
        ...style,
      }}
      data-larose-glass=""
      data-larose-glass-mode={refractionMode}
      data-larose-glass-debug={debug ? 'true' : undefined}
    >
      <div
        ref={lensRef}
        aria-hidden="true"
        data-larose-glass-lens=""
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        data-larose-glass-rim=""
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: `1px solid rgb(255 255 255 / ${rimOpacity})`,
          boxShadow: `inset 0 1px 0 rgb(255 255 255 / ${0.45 + resolved.edgeHighlight * 0.35})`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          transform: 'translateZ(0)',
          isolation: 'isolate',
        }}
      >
        {children}
      </div>
    </div>
  );
}
