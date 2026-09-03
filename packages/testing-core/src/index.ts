/**
 * Framework-neutral test scenario matrix for laRose UI.
 * Framework adapters map these scenarios onto their mount helpers.
 */

export type TestMatrixScenario =
  | 'normal'
  | 'loading'
  | 'error'
  | 'empty'
  | 'offline'
  | 'unauthorized'
  | 'slow-network'
  | 'mobile'
  | 'rtl'
  | 'dark';

export interface TestMatrixOptions {
  theme?: 'light' | 'dark';
  density?: 'compact' | 'comfortable' | 'spacious';
  locale?: 'en' | 'ar' | 'de';
  environment?: 'development' | 'staging' | 'production';
  permissions?: string[];
  features?: Record<string, unknown>;
  tenantId?: string;
  enableToasts?: boolean;
}

export interface TestMatrixCase {
  scenario: TestMatrixScenario;
  description: string;
  options?: TestMatrixOptions;
}

export const defaultTestMatrix: TestMatrixCase[] = [
  { scenario: 'normal', description: 'Default happy path' },
  { scenario: 'loading', description: 'Loading / pending state' },
  { scenario: 'error', description: 'Error surface' },
  { scenario: 'empty', description: 'Empty state' },
  {
    scenario: 'offline',
    description: 'Offline / degraded network',
    options: { environment: 'development' },
  },
  {
    scenario: 'unauthorized',
    description: 'Missing permissions',
    options: { permissions: [] },
  },
  { scenario: 'slow-network', description: 'Slow network heuristics' },
  { scenario: 'mobile', description: 'Narrow viewport / touch' },
  { scenario: 'rtl', description: 'RTL locale', options: { locale: 'ar' } },
  { scenario: 'dark', description: 'Dark theme', options: { theme: 'dark' } },
];

export function resolveMatrixOptions(
  scenario: TestMatrixScenario,
  overrides: TestMatrixOptions = {},
): TestMatrixOptions {
  const base =
    defaultTestMatrix.find((c) => c.scenario === scenario)?.options ?? {};
  return { ...base, ...overrides };
}
