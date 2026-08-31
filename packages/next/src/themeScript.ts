export type LaRoseAppearance = 'light' | 'dark' | 'system';

export interface LaRoseThemeScriptOptions {
  /** Resolved appearance mode. `system` reads OS preference when no stored value exists. */
  appearance?: LaRoseAppearance;
  /** localStorage key for persisted user theme preference. */
  storageKey?: string;
  /** DOM attribute written to `<html>` — matches runtime ThemeProvider. */
  themeAttribute?: string;
  /** DOM attribute for appearance mode — matches runtime ThemeProvider. */
  appearanceAttribute?: string;
}

export const LAROSE_THEME_SCRIPT_ID = 'larose-theme-script';

const DEFAULT_OPTIONS: Required<LaRoseThemeScriptOptions> = {
  appearance: 'system',
  storageKey: 'larose-theme',
  themeAttribute: 'data-lr-theme',
  appearanceAttribute: 'data-lr-appearance',
};

/**
 * Inline script that runs before React hydration to avoid theme flash.
 * Safe for Next.js (`next/script` strategy `beforeInteractive`) and TanStack Start root documents.
 */
export function createLaRoseThemeScriptContent(
  options: LaRoseThemeScriptOptions = {},
): string {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return `(function(){try{var appearance=${JSON.stringify(config.appearance)};var storageKey=${JSON.stringify(config.storageKey)};var themeAttr=${JSON.stringify(config.themeAttribute)};var appearanceAttr=${JSON.stringify(config.appearanceAttribute)};var stored=localStorage.getItem(storageKey);var theme=stored==="dark"||stored==="light"?stored:null;if(!theme&&appearance==="system"&&window.matchMedia){theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}theme=theme||"light";document.documentElement.setAttribute(themeAttr,theme);document.documentElement.setAttribute(appearanceAttr,appearance);document.documentElement.style.colorScheme=theme;}catch(e){}})();`;
}
