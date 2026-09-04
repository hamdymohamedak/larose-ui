import { describe, expect, it } from 'vitest';
import {
  createLaRoseThemeScriptContent,
  LAROSE_CSS_PATHS,
  resolveLaRoseKitConfig,
} from './index';

describe('@larose-ui/sveltekit', () => {
  it('builds theme script and css paths', () => {
    expect(createLaRoseThemeScriptContent()).toContain('data-lr-theme');
    expect(LAROSE_CSS_PATHS.length).toBe(2);
    expect(resolveLaRoseKitConfig().css).toBe(true);
  });
});
