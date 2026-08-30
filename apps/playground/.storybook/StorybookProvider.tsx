import { lazy, memo, Suspense, type ReactNode } from 'react';
import {
  LaRoseProvider as ReactLaRoseProvider,
  type MotionConfig,
} from '@larose-ui/react';
import type { Density, Environment, ThemeMode } from '@larose-ui/core';

const RuntimeLaRoseProvider = lazy(() =>
  import('@larose-ui/runtime').then((module) => ({ default: module.LaRoseProvider })),
);

export type StorybookLocale = 'en' | 'ar' | 'de';

export interface StorybookProviderProps {
  children: ReactNode;
  runtime?: boolean;
  theme?: ThemeMode;
  density?: Density;
  locale?: StorybookLocale;
  environment?: Environment;
  motion?: MotionConfig;
  providerOverrides?: Record<string, unknown>;
}

export const StorybookProvider = memo(function StorybookProvider({
  children,
  runtime = false,
  theme = 'light',
  density = 'comfortable',
  locale = 'en',
  environment = 'development',
  motion = { reducedMotion: 'never' },
  providerOverrides = {},
}: StorybookProviderProps) {
  if (runtime) {
    return (
      <Suspense fallback={children}>
        <RuntimeLaRoseProvider
          theme={theme}
          appearance={theme}
          density={density}
          locale={locale}
          environment={environment}
          motion={motion}
          enableToasts={false}
          {...providerOverrides}
        >
          {children}
        </RuntimeLaRoseProvider>
      </Suspense>
    );
  }

  return (
    <ReactLaRoseProvider theme={theme} density={density} motion={motion} {...providerOverrides}>
      {children}
    </ReactLaRoseProvider>
  );
});
