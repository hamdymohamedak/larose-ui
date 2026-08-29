import { describe, expect, it } from 'vitest';
import { densityMultipliers, getTokens, tokensToCSSVariables } from './index';

describe('getTokens', () => {
  it('returns light tokens by default', () => {
    const tokens = getTokens('light');
    expect(tokens.colors.background).toBe('#ffffff');
  });

  it('returns dark tokens', () => {
    const tokens = getTokens('dark');
    expect(tokens.colors.background).toBe('#0f172a');
  });
});

describe('tokensToCSSVariables', () => {
  it('generates CSS custom properties', () => {
    const vars = tokensToCSSVariables(getTokens(), 'comfortable');
    expect(vars['--lr-color-primary']).toBe('#2563eb');
    expect(vars['--lr-density-multiplier']).toBe('1');
  });

  it('scales spacing by density', () => {
    const compact = tokensToCSSVariables(getTokens(), 'compact');
    const spacious = tokensToCSSVariables(getTokens(), 'spacious');
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
