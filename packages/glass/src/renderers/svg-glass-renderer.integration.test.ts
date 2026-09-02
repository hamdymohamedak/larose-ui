import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  SVGGlassRenderer,
  removeSharedDefsIfEmpty,
} from '../renderers/svg-glass-renderer';
import type { DisplacementMapData } from '../types';

const MOCK_MAP: DisplacementMapData = {
  width: 40,
  height: 40,
  data: new Uint8ClampedArray(40 * 40 * 4).fill(128),
  dataUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
};

function buildContext(root: HTMLElement, version = 1) {
  return {
    root,
    lens: { width: 80, height: 40, borderRadius: 20, depth: 8, curvature: 35 },
    position: { x: 0, y: 0 },
    displacementMap: MOCK_MAP,
    filterRegion: { x: -4, y: -4, width: 88, height: 48 },
    version,
    reducedMotion: false,
    instanceId: 'test',
    debug: false,
  };
}

describe('SVGGlassRenderer lifecycle', () => {
  beforeEach(() => {
    document.getElementById('larose-glass-defs')?.remove();
  });

  afterEach(() => {
    document.getElementById('larose-glass-defs')?.remove();
  });

  it('creates shared defs and applies content filter to root', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const renderer = new SVGGlassRenderer('t1', 'content');
    renderer.mount();
    renderer.update(buildContext(root));

    const defs = document.getElementById('larose-glass-defs');
    expect(defs).toBeTruthy();
    expect(defs?.querySelector('filter')).toBeTruthy();
    expect(root.style.filter).toMatch(/url\(#larose-glass-t1-v1\)/);

    renderer.destroy();
    root.remove();
    removeSharedDefsIfEmpty();
    expect(document.getElementById('larose-glass-defs')).toBeNull();
  });

  it('reuses displacement map on setBounds without filter version bump', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const renderer = new SVGGlassRenderer('t2', 'backdrop');
    renderer.mount();
    renderer.update(buildContext(root, 2));

    const filterBefore = document.querySelector('#larose-glass-defs filter')?.id;
    renderer.setBounds({ x: 24, y: 8, width: 96, height: 40 });
    const filterAfter = document.querySelector('#larose-glass-defs filter')?.id;

    expect(filterBefore).toBe(filterAfter);
    expect(root.style.left).toBe('24px');
    expect(root.style.top).toBe('8px');

    renderer.destroy();
    root.remove();
    removeSharedDefsIfEmpty();
  });

  it('regenerates filter element when map version changes', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const renderer = new SVGGlassRenderer('t3', 'content');
    renderer.mount();
    renderer.update(buildContext(root, 1));
    const firstId = document.querySelector('#larose-glass-defs filter')?.id;

    renderer.update(buildContext(root, 2));
    const secondId = document.querySelector('#larose-glass-defs filter')?.id;

    expect(firstId).not.toBe(secondId);
    expect(secondId).toContain('v2');

    renderer.destroy();
    root.remove();
    removeSharedDefsIfEmpty();
  });
});
