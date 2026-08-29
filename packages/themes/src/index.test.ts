import { describe, expect, it } from 'vitest';
import { applyThemePreset, getThemePreset, listThemePresets } from './index';

describe('@larose-ui/themes', () => {
  it('lists built-in presets', () => {
    expect(listThemePresets().map((p) => p.id)).toEqual([
      'default',
      'ocean',
      'forest',
      'sunset',
    ]);
  });

  it('applies preset tokens to an element', () => {
    const el = document.createElement('div');
    const preset = applyThemePreset(el, 'ocean');
    expect(preset.id).toBe('ocean');
    expect(el.dataset.lrThemePreset).toBe('ocean');
    expect(el.style.getPropertyValue('--lr-color-primary')).toBe('#0284c7');
  });

  it('returns preset metadata', () => {
    expect(getThemePreset('forest').label).toBe('Forest');
  });
});
