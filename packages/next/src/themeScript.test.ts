import { describe, expect, it } from 'vitest';
import { createLaRoseThemeScriptContent, LAROSE_THEME_SCRIPT_ID } from './themeScript';

describe('createLaRoseThemeScriptContent', () => {
  it('exports a stable script id', () => {
    expect(LAROSE_THEME_SCRIPT_ID).toBe('larose-theme-script');
  });

  it('embeds appearance and storage configuration', () => {
    const script = createLaRoseThemeScriptContent({
      appearance: 'system',
      storageKey: 'app-theme',
    });

    expect(script).toContain('"system"');
    expect(script).toContain('"app-theme"');
    expect(script).toContain('data-lr-theme');
    expect(script).toContain('colorScheme');
  });

  it('is valid immediately-invoked function syntax', () => {
    const script = createLaRoseThemeScriptContent();
    expect(() => {
      // eslint-disable-next-line no-new-func
      new Function(script);
    }).not.toThrow();
  });
});
