import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const appSource = readFileSync(join(import.meta.dirname, 'App.tsx'), 'utf8');

const routes = [
  '/',
  '/docs/getting-started',
  '/docs/guides',
  '/docs/packages',
  '/docs/components',
  '/docs/design/theme-builder',
  '/docs/design/tokens',
  '/docs/design/motion',
  '/docs/playground',
  '/docs/accessibility',
  '/docs/architecture',
  '/docs/migration',
  '/changelog',
];

describe('documentation routes', () => {
  it('registers home route', () => {
    expect(appSource.includes('index element')).toBe(true);
  });

  for (const route of routes.filter((route) => route !== '/')) {
    it(`registers ${route}`, () => {
      expect(appSource.includes(`path="${route}"`)).toBe(true);
    });
  }
});
