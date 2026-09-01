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
import type { GlassLens, GlassPosition } from '../types';

export interface GlassHandle {
  setPosition(position: GlassPosition): void;
  setLens(lens: GlassLens): void;
  getEngine(): GlassEngine | null;
}

export interface GlassProps {
  lens: GlassLens;
  position?: GlassPosition;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<GlassHandle>;
  disabled?: boolean;
  debug?: boolean;
}

/** Internal grid pattern — gives the displacement filter vivid content to bend. */
function GlassBackdrop({ specularAngle }: { specularAngle: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        backgroundImage: [
          `linear-gradient(${specularAngle}deg, rgb(255 255 255 / 0.45) 0%, rgb(200 210 255 / 0.2) 50%, rgb(255 200 230 / 0.15) 100%)`,
          'linear-gradient(rgb(100 60 180 / 0.14) 1px, transparent 1px)',
          'linear-gradient(90deg, rgb(100 60 180 / 0.14) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: 'auto, 20px 20px, 20px 20px',
      }}
    />
  );
}

/**
 * Glass lens — SVG feDisplacementMap on SourceGraphic.
 * Internal grid + gradient give the filter visible content to refract at edges.
 */
export function Glass({
  lens,
  children,
  className,
  style,
  ref,
  disabled,
  debug,
}: GlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GlassEngine | null>(null);
  const instanceId = useId();
  const reducedMotion = detectA11yPreferences().reducedMotion;
  const effectiveDisabled = disabled || reducedMotion;
  const resolved = resolveLens(lens);

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
    const target = containerRef.current;
    if (!target || effectiveDisabled) return undefined;

    const engine = new GlassEngine({
      lens: resolved,
      disabled: false,
      debug,
      renderer: 'svg',
      refractionMode: 'content',
    });
    engine.mount(target);
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [effectiveDisabled, debug, instanceId]);

  useEffect(() => {
    engineRef.current?.setLens(resolved);
  }, [
    resolved.width, resolved.height, resolved.borderRadius,
    resolved.depth, resolved.curvature, resolved.splay,
    resolved.scale, resolved.chroma, resolved.blur,
    resolved.glow, resolved.edgeHighlight, resolved.specularAngle,
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
          background: 'rgb(255 255 255 / 0.28)',
          border: '1px solid rgb(255 255 255 / 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
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
        overflow: 'hidden',
        ...style,
      }}
      data-larose-glass=""
      data-larose-glass-debug={debug ? 'true' : undefined}
    >
      <GlassBackdrop specularAngle={resolved.specularAngle} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
