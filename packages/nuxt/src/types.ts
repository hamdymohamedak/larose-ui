import type { Density, ThemeMode } from '@larose-ui/core';
import type { LaRoseAppearance } from './themeScript';

export interface LaRosePublicRuntimeConfig {
  theme: ThemeMode;
  density: Density;
  tenantId?: string;
  runtime: boolean | Record<string, unknown>;
}

export interface ModuleOptions {
  /** Inject shared laRose CSS into Nuxt. */
  css?: boolean;
  /** Inject pre-hydration theme bootstrap script in document head. */
  themeScript?: boolean;
  appearance?: LaRoseAppearance;
  storageKey?: string;
  theme?: ThemeMode;
  density?: Density;
  tenantId?: string;
  /** Enable RuntimeProvider inside LaRoseApp when true or pass initial context object. */
  runtime?: boolean | Record<string, unknown>;
  /** Transpile @larose-ui/vue for SSR/Vite. */
  transpile?: boolean;
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    laRose: LaRosePublicRuntimeConfig;
  }
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    laRose: LaRosePublicRuntimeConfig;
  }
}

export type { LaRoseAppearance, LaRoseThemeScriptOptions } from './themeScript';
export { createLaRoseThemeScriptContent, LAROSE_THEME_SCRIPT_ID } from './themeScript';
