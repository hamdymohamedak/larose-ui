import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import type { Density, Environment, SessionState, TenantContext, ThemeMode } from '@larose-ui/core';
import { LaRoseProvider } from '@larose-ui/runtime';
import type { FeatureState } from '@larose-ui/runtime';

export interface LaRoseTestOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: ThemeMode;
  density?: Density;
  locale?: 'en' | 'ar' | 'de';
  environment?: Environment;
  permissions?: string[];
  features?: Record<string, FeatureState>;
  tenantId?: string;
  tenant?: TenantContext;
  session?: SessionState;
  enableToasts?: boolean;
}

export function renderWithLaRose(
  ui: ReactElement,
  options: LaRoseTestOptions = {},
): RenderResult {
  const {
    theme = 'light',
    density = 'comfortable',
    locale = 'en',
    environment = 'development',
    permissions = [],
    features = {},
    tenantId,
    tenant,
    session,
    enableToasts = false,
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LaRoseProvider
        theme={theme}
        density={density}
        locale={locale}
        environment={environment}
        permissions={permissions}
        features={features}
        tenantId={tenantId}
        tenant={tenant}
        session={session}
        enableToasts={enableToasts}
        observabilityDebug={false}
      >
        {children}
      </LaRoseProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

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

export interface TestMatrixCase {
  scenario: TestMatrixScenario;
  description: string;
  options?: LaRoseTestOptions;
}

export const defaultTestMatrix: TestMatrixCase[] = [
  { scenario: 'normal', description: 'Default happy path' },
  { scenario: 'dark', description: 'Dark mode', options: { theme: 'dark' } },
  { scenario: 'rtl', description: 'RTL locale', options: { locale: 'ar' } },
  {
    scenario: 'unauthorized',
    description: 'No permissions',
    options: { permissions: [] },
  },
  {
    scenario: 'mobile',
    description: 'Compact density',
    options: { density: 'compact' },
  },
];

export const VISUAL_REGRESSION_GUIDE = `
# Visual Regression Architecture

1. Build Storybook: \`pnpm --filter @larose-ui/playground build\`
2. Capture snapshots with Chromatic or Playwright:
   - Light / dark themes
   - All component states from stories
   - Responsive breakpoints
3. Compare in CI; fail on unexpected diffs
4. Approve intentional visual changes in Chromatic UI

Stories in apps/playground/stories/ are the snapshot source of truth.
`;
