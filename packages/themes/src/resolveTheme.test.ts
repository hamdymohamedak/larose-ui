import { describe, expect, it } from 'vitest';
import { createTheme } from './createTheme';
import { resolveTheme } from './resolveTheme';

describe('createTheme', () => {
  it('defaults to refined preset', () => {
    const theme = createTheme();
    expect(theme.preset).toBe('refined');
  });

  it('merges shorthand overrides onto preset colors', () => {
    const theme = createTheme({
      base: 'refined',
      colors: { primary: '#6C5CE7' },
      radius: { md: '10px' },
      spacing: { '4': '14px' },
      motion: {
        duration: { normal: '280ms' },
      },
    });

    expect(theme.tokens.colors?.primary).toBe('#6C5CE7');
    expect(theme.tokens.radius?.md).toBe('10px');
    expect(theme.tokens.space?.['4']).toBe('14px');
    expect(theme.tokens.duration?.normal).toBe('280ms');
  });
});

describe('resolveTheme', () => {
  it('applies preset colors and legacy brandColors', () => {
    const resolved = resolveTheme({
      theme: createTheme({ preset: 'ocean' }),
      brandColors: { secondary: '#111111' },
    });

    expect(resolved.preset).toBe('ocean');
    expect(resolved.brandColors.primary).toBe('#0284c7');
    expect(resolved.brandColors.secondary).toBe('#111111');
  });

  it('collects component token overrides', () => {
    const resolved = resolveTheme({
      components: {
        Button: {
          tokens: { radius: '10px' },
        },
        Card: {
          tokens: { shadow: 'none' },
        },
      },
    });

    expect(resolved.componentTokenOverrides.Button?.radius).toBe('10px');
    expect(resolved.componentTokenOverrides.Card?.shadow).toBe('none');
  });
});
