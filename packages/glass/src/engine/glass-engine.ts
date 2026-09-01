import { detectA11yPreferences } from '@larose-ui/core';
import type {
  DisplacementMapData,
  GlassEngineOptions,
  GlassEngineState,
  GlassLens,
  GlassPosition,
  GlassRenderer,
  GlassSurface,
} from '../types';
import { getCachedDisplacementMap } from '../displacement/map-cache';
import { lensesGeometryEqual, resolveLens } from '../lens/defaults';
import { computeFilterRegion } from '../lens/filter-region';
import { selectRenderer } from './renderer-selector';
import { FallbackGlassRenderer } from '../renderers/fallback-renderer';
import {
  SVGGlassRenderer,
  removeSharedDefsIfEmpty,
  type SVGGlassMode,
} from '../renderers/svg-glass-renderer';
import { WebGLGlassRenderer } from '../renderers/webgl-glass-renderer';
import {
  renderGlassDebugPanel,
  removeGlassDebugPanel,
  setGlassDebugEnabled,
} from '../debug/glass-debug';

let instanceCounter = 0;

function createRendererSync(
  kind: ReturnType<typeof selectRenderer>,
  instanceId: string,
  refractionMode: SVGGlassMode,
): GlassRenderer {
  switch (kind) {
    case 'svg':
      return new SVGGlassRenderer(instanceId, refractionMode);
    case 'webgl':
      return new WebGLGlassRenderer();
    case 'fallback':
    default:
      return new FallbackGlassRenderer();
  }
}

/**
 * Central glass orchestrator.
 * Separates geometry updates (regenerate map) from position updates (move map).
 */
export class GlassEngine {
  private readonly instanceId: string;
  private renderer: GlassRenderer | null = null;
  private root: HTMLElement | HTMLCanvasElement | HTMLVideoElement | null = null;
  private options: GlassEngineOptions;
  private lens: Required<GlassLens>;
  private position: GlassPosition;
  private surface: GlassSurface;
  private refractionMode: SVGGlassMode;
  private displacementMap: DisplacementMapData | null = null;
  private mapVersion = 0;
  private mounted = false;
  private reducedMotion = false;
  private lastMapGenMs = 0;

  constructor(options: GlassEngineOptions) {
    this.instanceId = `g${++instanceCounter}`;
    this.options = options;
    this.lens = resolveLens(options.lens);
    this.position = options.position ?? { x: 0, y: 0 };
    this.surface = options.surface ?? 'dom';
    this.refractionMode = options.refractionMode ?? 'content';
    this.reducedMotion = detectA11yPreferences().reducedMotion;
    if (options.debug) setGlassDebugEnabled(true);
  }

  get id(): string {
    return this.instanceId;
  }

  mount(root: HTMLElement | HTMLCanvasElement | HTMLVideoElement): void {
    this.root = root;
    const kind = this.options.disabled || this.reducedMotion
      ? 'fallback'
      : selectRenderer(this.surface, this.options.renderer);

    this.renderer = createRendererSync(kind, this.instanceId, this.refractionMode);
    this.renderer.mount();
    this.regenerateMap();
    this.pushUpdate();
    this.mounted = true;
  }

  /** Regenerate displacement map when lens geometry or optical params change. */
  setLens(lens: GlassLens): void {
    const next = resolveLens(lens);
    if (lensesGeometryEqual(this.lens, next)) {
      this.lens = next;
      return;
    }
    this.lens = next;
    this.regenerateMap();
    this.pushUpdate();
  }

  /** Move lens without regenerating the displacement map. */
  setPosition(position: GlassPosition): void {
    this.position = position;
    this.renderer?.setPosition(position);
  }

  /**
   * Move/resize overlay lens without regenerating displacement map.
   * Used during spring animations (toggle group indicator morph).
   */
  setBounds(bounds: { x: number; y: number; width: number; height: number }): void {
    this.position = { x: bounds.x, y: bounds.y };
    this.renderer?.setBounds?.(bounds);
  }

  resize(): void {
    this.renderer?.resize();
    this.pushUpdate();
  }

  getState(): GlassEngineState {
    return {
      lens: this.lens,
      position: this.position,
      mapVersion: this.mapVersion,
      rendererKind: this.renderer?.kind ?? 'fallback',
      enabled: !this.options.disabled && !this.reducedMotion,
    };
  }

  getDisplacementMap(): DisplacementMapData | null {
    return this.displacementMap;
  }

  destroy(): void {
    if (this.options.debug) {
      removeGlassDebugPanel(this.instanceId);
    }
    this.renderer?.destroy();
    removeSharedDefsIfEmpty();
    this.renderer = null;
    this.root = null;
    this.displacementMap = null;
    this.mounted = false;
  }

  private regenerateMap(): void {
    this.mapVersion += 1;
    const pixelRatio = typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 1;
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    this.displacementMap = getCachedDisplacementMap(this.lens, {
      optimize: true,
      pixelRatio,
    });
    this.lastMapGenMs = typeof performance !== 'undefined' ? performance.now() - t0 : 0;
  }

  private pushUpdate(): void {
    if (!this.renderer || !this.root || !this.displacementMap) return;

    const context = {
      root: this.root,
      lens: this.lens,
      position: this.position,
      displacementMap: this.displacementMap,
      filterRegion: computeFilterRegion(this.lens, this.position),
      version: this.mapVersion,
      reducedMotion: this.reducedMotion,
      instanceId: this.instanceId,
      debug: this.options.debug,
    };

    this.renderer.update(context);

    if (this.options.debug) {
      renderGlassDebugPanel(
        this.instanceId,
        context,
        this.renderer.kind,
        this.lastMapGenMs,
      );
    }
  }
}

export function createGlassEngine(options: GlassEngineOptions): GlassEngine {
  return new GlassEngine(options);
}
