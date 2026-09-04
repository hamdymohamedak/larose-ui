import type { Density, Environment, ThemeMode } from '@larose-ui/core';
import type { LaRoseAppearance } from './themeScript';

export type LaRoseLocale = 'en' | 'ar' | 'de';

export interface LaRosePublicRuntimeConfig {
  theme: ThemeMode;
  density: Density;
  tenantId?: string;
  appearance?: LaRoseAppearance;
  enableToasts?: boolean;
  locale?: LaRoseLocale;
  environment?: Environment;
  /** @deprecated Full stack is always composed by runtime-vue LaRoseProvider. */
  runtime?: boolean | Record<string, unknown>;
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
  enableToasts?: boolean;
  locale?: LaRoseLocale;
  environment?: Environment;
  /** @deprecated Full stack is always composed by runtime-vue LaRoseProvider. */
  runtime?: boolean | Record<string, unknown>;
  /** Transpile @larose-ui/vue and @larose-ui/runtime-vue for SSR/Vite. */
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
