import { describe, expect, it } from 'vitest';
import { densityMultipliers, getTokens, tokensToCSSVariables } from './index';

describe('getTokens', () => {
  it('returns Apple-inspired light tokens by default', () => {
    const tokens = getTokens('light');
    expect(tokens.colors.background).toBe('#f5f5f7');
    expect(tokens.colors.primary).toBe('#0071e3');
  });

  it('returns Apple-inspired dark tokens', () => {
    const tokens = getTokens('dark');
    expect(tokens.colors.background).toBe('#1c1c1e');
    expect(tokens.colors.primary).toBe('#0a84ff');
  });

  it('includes dark chrome tokens in CSS variables', () => {
    const vars = tokensToCSSVariables(getTokens('dark'), 'comfortable', 'dark');
    expect(vars['--lr-toolbar-bg']).toBe('rgb(30 30 30 / 0.72)');
    expect(vars['--lr-sidebar-fg']).toBe('#f5f5f7');
    expect(vars['--lr-menu-backdrop']).toBe('rgb(0 0 0 / 0.45)');
    expect(vars['--lr-dock-bg']).toBe('rgb(44 44 46 / 0.72)');
    expect(vars['--lr-color-on-accent']).toBe('#ffffff');
  });

  it('includes button tokens in CSS variables', () => {
    const vars = tokensToCSSVariables(getTokens('light'), 'comfortable', 'light');
    expect(vars['--lr-button-height-md']).toBe('2.75rem');
    expect(vars['--lr-button-radius']).toBe('9999px');
  });
});

describe('tokensToCSSVariables', () => {
  it('generates CSS custom properties', () => {
    const vars = tokensToCSSVariables(getTokens(), 'comfortable', 'light');
    expect(vars['--lr-color-primary']).toBe('#0071e3');
    expect(vars['--lr-density-multiplier']).toBe('1');
  });

  it('scales spacing by density', () => {
    const compact = tokensToCSSVariables(getTokens(), 'compact', 'light');
    const spacious = tokensToCSSVariables(getTokens(), 'spacious', 'light');
    expect(parseFloat(compact['--lr-space-4']!)).toBeLessThan(
      parseFloat(spacious['--lr-space-4']!),
    );
  });
});

describe('densityMultipliers', () => {
  it('has expected values', () => {
    expect(densityMultipliers.compact).toBe(0.85);
    expect(densityMultipliers.spacious).toBe(1.15);
  });
});
