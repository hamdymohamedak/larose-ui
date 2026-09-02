import { describe, it, expect, beforeEach } from 'vitest';
import { GlassEngine } from '../engine/glass-engine';
import { clearDisplacementMapCache } from '../displacement/map-cache';

describe('GlassEngine', () => {
  beforeEach(() => {
    clearDisplacementMapCache();
  });

  it('mounts and exposes state', () => {
    const el = document.createElement('div');
    const engine = new GlassEngine({
      lens: { width: 80, height: 40, borderRadius: 20, depth: 8, curvature: 35 },
      refractionMode: 'content',
    });
    engine.mount(el);
    const state = engine.getState();
    expect(state.rendererKind).toBe('svg');
    expect(state.mapVersion).toBeGreaterThan(0);
    expect(state.enabled).toBe(true);
    engine.destroy();
  });

  it('reuses map on setBounds without incrementing version', () => {
    const el = document.createElement('div');
    const engine = new GlassEngine({
      lens: { width: 40, height: 40, borderRadius: 20 },
      refractionMode: 'backdrop',
      position: { x: 0, y: 0 },
    });
    engine.mount(el);
    const v1 = engine.getState().mapVersion;
    engine.setBounds({ x: 10, y: 5, width: 40, height: 40 });
    expect(engine.getState().mapVersion).toBe(v1);
    engine.destroy();
  });

  it('regenerates map when lens geometry changes', () => {
    const el = document.createElement('div');
    const engine = new GlassEngine({
      lens: { width: 80, height: 40, borderRadius: 20 },
      refractionMode: 'content',
    });
    engine.mount(el);
    const v1 = engine.getState().mapVersion;
    engine.setLens({ width: 100, height: 40, borderRadius: 20 });
    expect(engine.getState().mapVersion).toBeGreaterThan(v1);
    engine.destroy();
  });
});
