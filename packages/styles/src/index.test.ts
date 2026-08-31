import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('@larose-ui/styles', () => {
  it('bundles component CSS', () => {
    const cssPath = join(packageRoot, 'dist/styles.css');
    expect(existsSync(cssPath)).toBe(true);
    const css = readFileSync(cssPath, 'utf8');
    expect(css.length).toBeGreaterThan(10_000);
    expect(css).toContain('.lr-Button-button');
    expect(css).toContain('var(--lr-space-2)');
  });

  it('exports stable entry constants', async () => {
    const mod = await import('../src/index.js');
    expect(mod.STYLES_CSS).toBe('@larose-ui/styles/styles.css');
    expect(mod.TOKENS_CSS).toBe('@larose-ui/tokens/styles.css');
  });
});
