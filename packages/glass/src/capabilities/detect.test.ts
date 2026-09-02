import { describe, it, expect, beforeEach } from 'vitest';
import {
  supportsSVGGlass,
  supportsBackdropGlassRefraction,
  selectRefractionMode,
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

  it('selects shell content mode in jsdom (non-blink)', () => {
    expect(selectRefractionMode('shell')).toBe('content');
    expect(selectRefractionMode('overlay')).toBe('css');
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
