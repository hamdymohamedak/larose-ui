'use client';

import Script from 'next/script';
import {
  LAROSE_THEME_SCRIPT_ID,
  createLaRoseThemeScriptContent,
  type LaRoseThemeScriptOptions,
} from './themeScript';

export type { LaRoseThemeScriptOptions };

export interface LaRoseThemeScriptProps extends LaRoseThemeScriptOptions {
  /** Override Next.js script loading strategy. Defaults to `beforeInteractive`. */
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
}

/**
 * Pre-hydration theme bootstrap for Next.js App/Pages Router.
 * Place in the root layout alongside CSS imports.
 */
export function LaRoseThemeScript({
  strategy = 'beforeInteractive',
  ...options
}: LaRoseThemeScriptProps) {
  return (
    <Script
      id={LAROSE_THEME_SCRIPT_ID}
      strategy={strategy}
      dangerouslySetInnerHTML={{ __html: createLaRoseThemeScriptContent(options) }}
    />
  );
}
