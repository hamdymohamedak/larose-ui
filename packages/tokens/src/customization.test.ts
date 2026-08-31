import { describe, expect, it } from 'vitest';
import {
  applyResolvedTheme,
  mergeTokenOverrides,
  resolveThemeCSSVariables,
} from './index';

describe('theme customization tokens', () => {
  it('merges global token overrides', () => {
    const vars = resolveThemeCSSVariables({
      mode: 'light',
      density: 'comfortable',
      tokenOverrides: {
        radius: { md: '12px' },
        space: { '4': '14px' },
      },
    });

    expect(vars['--lr-radius-md']).toBe('12px');
    expect(vars['--lr-space-4']).toBe('14px');
  });

  it('merges component token overrides into CSS variables', () => {
    const vars = resolveThemeCSSVariables({
      mode: 'light',
      tokenOverrides: {},
      componentTokenOverrides: {
        Button: { radius: '8px' },
        Card: { shadow: 'none' },
      },
    });

    expect(vars['--lr-button-radius']).toBe('8px');
    expect(vars['--lr-card-shadow']).toBe('none');
  });

  it('applies resolved theme to a DOM element', () => {
    const element = document.createElement('div');

    applyResolvedTheme(element, {
      mode: 'light',
      tokenOverrides: {
        colors: { primary: '#6C5CE7' },
      },
      componentTokenOverrides: {
        Modal: { radius: '20px' },
      },
      presetId: 'refined',
    });

    expect(element.style.getPropertyValue('--lr-color-primary')).toBe('#6C5CE7');
    expect(element.style.getPropertyValue('--lr-modal-radius')).toBe('20px');
    expect(element.dataset.lrThemePreset).toBe('refined');
  });

  it('exports mergeTokenOverrides for layered themes', () => {
    const base = mergeTokenOverrides(
      {
        colors: {
          primary: '#0071e3',
          primaryHover: '#0077ed',
          primaryActive: '#006edb',
          secondary: '#6e6e73',
          success: '#34c759',
          warning: '#ff9500',
          error: '#ff3b30',
          info: '#5ac8fa',
          background: '#f5f5f7',
          surface: '#ffffff',
          surfaceElevated: '#ffffff',
          border: '#d2d2d7',
          text: '#1d1d1f',
          textMuted: '#6e6e73',
          textInverse: '#ffffff',
        },
      } as never,
      { colors: { primary: '#6C5CE7' } },
    );

    expect(base.colors.primary).toBe('#6C5CE7');
  });
});
