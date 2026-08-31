import { describe, expect, it } from 'vitest';
import { createLaRoseThemeScriptContent, LAROSE_THEME_SCRIPT_ID } from './themeScript';

describe('createLaRoseThemeScriptContent', () => {
  it('uses stable script id', () => {
    expect(LAROSE_THEME_SCRIPT_ID).toBe('larose-theme-script');
  });

  it('embeds appearance config', () => {
    const script = createLaRoseThemeScriptContent({ appearance: 'dark' });
    expect(script).toContain('"dark"');
    expect(script).toContain('data-lr-theme');
  });
});
