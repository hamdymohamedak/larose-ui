import { useEffect, useRef } from 'react';
import { GlassEngine } from '../engine/glass-engine';
import type { GlassEngineOptions, GlassLens, GlassPosition } from '../types';

export interface UseGlassEngineOptions extends GlassEngineOptions {
  /** Element to mount the renderer onto. */
  targetRef: React.RefObject<HTMLElement | HTMLCanvasElement | HTMLVideoElement | null>;
}

export interface UseGlassEngineResult {
  setPosition(position: GlassPosition): void;
  setLens(lens: GlassLens): void;
  engine: GlassEngine | null;
}

export function useGlassEngine(options: UseGlassEngineOptions): UseGlassEngineResult {
  const engineRef = useRef<GlassEngine | null>(null);

  useEffect(() => {
    const target = options.targetRef.current;
    if (!target) return undefined;

    const engine = new GlassEngine(options);
    engine.mount(target);
    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [options.disabled, options.surface, options.renderer]);

  useEffect(() => {
    engineRef.current?.setLens(options.lens);
  }, [options.lens]);

  useEffect(() => {
    if (options.position) {
      engineRef.current?.setPosition(options.position);
    }
  }, [options.position?.x, options.position?.y]);

  return {
    setPosition: (position) => engineRef.current?.setPosition(position),
    setLens: (lens) => engineRef.current?.setLens(lens),
    engine: engineRef.current,
  };
}
