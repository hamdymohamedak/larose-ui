/**
 * Host-specific window chrome CSS variables.
 * These are opt-in and do not affect web-only apps.
 */
export const WINDOW_CHROME_CSS_VARS = {
  titlebarHeight: '--larose-titlebar-height',
  trafficLightInset: '--larose-traffic-light-inset',
  dragRegionHeight: '--larose-drag-region-height',
  windowControlsWidth: '--larose-window-controls-width',
} as const;

export type WindowChromeVibrancy = 'none' | 'sidebar' | 'fullscreen' | 'under-window';

export interface WindowChromeOptions {
  titlebarHeight?: number;
  trafficLightInset?: number;
  dragRegionHeight?: number;
  windowControlsWidth?: number;
  vibrancy?: WindowChromeVibrancy;
}

export const DEFAULT_WINDOW_CHROME: Required<WindowChromeOptions> = {
  titlebarHeight: 28,
  trafficLightInset: 12,
  dragRegionHeight: 28,
  windowControlsWidth: 72,
  vibrancy: 'none',
};

/**
 * Apply host window chrome tokens to a DOM target (defaults to `document.documentElement`).
 */
export function applyWindowChromeTokens(
  options: WindowChromeOptions = {},
  target?: HTMLElement | null,
): void {
  if (typeof document === 'undefined') return;

  const merged = { ...DEFAULT_WINDOW_CHROME, ...options };
  const el = target ?? document.documentElement;

  el.style.setProperty(WINDOW_CHROME_CSS_VARS.titlebarHeight, `${merged.titlebarHeight}px`);
  el.style.setProperty(
    WINDOW_CHROME_CSS_VARS.trafficLightInset,
    `${merged.trafficLightInset}px`,
  );
  el.style.setProperty(
    WINDOW_CHROME_CSS_VARS.dragRegionHeight,
    `${merged.dragRegionHeight}px`,
  );
  el.style.setProperty(
    WINDOW_CHROME_CSS_VARS.windowControlsWidth,
    `${merged.windowControlsWidth}px`,
  );
  el.dataset.laroseVibrancy = merged.vibrancy;
}

/** Optional stylesheet snippet for draggable titlebar regions in Electron/Tauri. */
export const WINDOW_CHROME_STYLES = `
.larose-titlebar-drag {
  -webkit-app-region: drag;
  app-region: drag;
  height: var(${WINDOW_CHROME_CSS_VARS.titlebarHeight}, 28px);
  padding-left: var(${WINDOW_CHROME_CSS_VARS.trafficLightInset}, 12px);
}

.larose-titlebar-no-drag {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
`.trim();
