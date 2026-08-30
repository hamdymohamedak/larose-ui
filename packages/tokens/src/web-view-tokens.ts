import type { ThemeMode } from '@larose-ui/core';

export interface WebViewTokens {
  frameRadius: string;
  frameBorder: string;
  toolbarBg: string;
  toolbarBorder: string;
  minHeight: string;
}

/**
 * Apple HIG-inspired web view tokens.
 * @see https://developer.apple.com/design/human-interface-guidelines/web-views
 */
export function getWebViewTokens(mode: ThemeMode): WebViewTokens {
  if (mode === 'dark') {
    return {
      frameRadius: '0.625rem',
      frameBorder: 'rgb(255 255 255 / 0.12)',
      toolbarBg: '#2c2c2e',
      toolbarBorder: 'rgb(255 255 255 / 0.1)',
      minHeight: '16rem',
    };
  }

  return {
    frameRadius: '0.625rem',
    frameBorder: 'rgb(0 0 0 / 0.08)',
    toolbarBg: '#ffffff',
    toolbarBorder: 'rgb(0 0 0 / 0.08)',
    minHeight: '16rem',
  };
}

export function webViewTokensToCSSVariables(tokens: WebViewTokens): Record<string, string> {
  return {
    '--lr-web-view-radius': tokens.frameRadius,
    '--lr-web-view-border': tokens.frameBorder,
    '--lr-web-view-toolbar-bg': tokens.toolbarBg,
    '--lr-web-view-toolbar-border': tokens.toolbarBorder,
    '--lr-web-view-min-height': tokens.minHeight,
  };
}
