import { describe, it, expect, beforeEach } from 'vitest';
import {
  supportsSVGGlass,
  supportsBackdropGlassRefraction,
  supportsBackdropSvgDisplacement,
  supportsWebGLGlass,
  resetCapabilityCache,
} from '../capabilities/detect';
import { selectRenderer } from '../engine/renderer-selector';

describe('capabilities', () => {
  beforeEach(() => {
    resetCapabilityCache();
  });

  it('detects SVG support in jsdom', () => {
    expect(typeof supportsSVGGlass()).toBe('boolean');
  });

  it('detects backdrop refraction support', () => {
    expect(typeof supportsBackdropGlassRefraction()).toBe('boolean');
  });

  it('restricts SVG backdrop displacement to Safari engine', () => {
    expect(typeof supportsBackdropSvgDisplacement()).toBe('boolean');
    // jsdom UA is not Safari
    expect(supportsBackdropSvgDisplacement()).toBe(false);
  });

  it('detects WebGL support in jsdom', () => {
    expect(supportsWebGLGlass()).toBe(false);
  });

  it('selects svg renderer for dom surface when supported', () => {
    const kind = selectRenderer('dom');
    expect(['svg', 'fallback']).toContain(kind);
  });

  it('selects webgl for canvas surface when supported', () => {
    const kind = selectRenderer('canvas');
    expect(['webgl', 'fallback']).toContain(kind);
  });
});
