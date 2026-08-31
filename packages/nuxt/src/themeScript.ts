export type LaRoseAppearance = 'light' | 'dark' | 'system';

export interface LaRoseThemeScriptOptions {
  appearance?: LaRoseAppearance;
  storageKey?: string;
  themeAttribute?: string;
  appearanceAttribute?: string;
}

export const LAROSE_THEME_SCRIPT_ID = 'larose-theme-script';

const DEFAULT_OPTIONS: Required<LaRoseThemeScriptOptions> = {
  appearance: 'system',
  storageKey: 'larose-theme',
  themeAttribute: 'data-lr-theme',
  appearanceAttribute: 'data-lr-appearance',
};

/** Inline script to prevent theme flash during SSR hydration. */
export function createLaRoseThemeScriptContent(
  options: LaRoseThemeScriptOptions = {},
): string {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return `(function(){try{var appearance=${JSON.stringify(config.appearance)};var storageKey=${JSON.stringify(config.storageKey)};var themeAttr=${JSON.stringify(config.themeAttribute)};var appearanceAttr=${JSON.stringify(config.appearanceAttribute)};var stored=localStorage.getItem(storageKey);var theme=stored==="dark"||stored==="light"?stored:null;if(!theme&&appearance==="system"&&window.matchMedia){theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}theme=theme||"light";document.documentElement.setAttribute(themeAttr,theme);document.documentElement.setAttribute(appearanceAttr,appearance);document.documentElement.style.colorScheme=theme;}catch(e){}})();`;
}
