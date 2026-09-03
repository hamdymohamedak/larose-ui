import type { ThemeMode } from '@larose-ui/core';
import type { TokenOverrides } from '@larose-ui/tokens';
import { createTheme, type LaRoseTheme } from '@larose-ui/themes';

/** Rich obsidian palette for docs dark mode — deeper than default refined tokens. */
const docsDarkTokens: TokenOverrides = {
  colors: {
    background: '#08080c',
    surface: '#111118',
    surfaceElevated: '#1a1a24',
    border: 'rgb(255 255 255 / 0.09)',
    text: '#f0f0f5',
    textMuted: '#9494a6',
    secondary: '#7c7c8a',
  },
  surfaces: {
    base: '#111118',
    secondary: '#08080c',
    elevated: '#1a1a24',
    floating: '#222230',
    overlay: 'rgb(0 0 0 / 0.65)',
    glassBg: 'rgb(17 17 24 / 0.85)',
    glassBorder: 'rgb(255 255 255 / 0.1)',
    glassShadow: '0 8px 32px rgb(0 0 0 / 0.5)',
  },
  shadow: {
    subtle: '0 1px 2px rgb(0 0 0 / 0.28)',
    sm: '0 1px 2px rgb(0 0 0 / 0.28)',
    md: '0 4px 12px rgb(0 0 0 / 0.32)',
    lg: '0 12px 28px rgb(0 0 0 / 0.4)',
    raised: '0 4px 12px rgb(0 0 0 / 0.32)',
    floating: '0 12px 28px rgb(0 0 0 / 0.4)',
    overlay: '0 24px 48px rgb(0 0 0 / 0.5)',
  },
};

export const DOCS_SURFACE_MUTED: Record<ThemeMode, string> = {
  light: '#ebebef',
  dark: '#16161f',
};

export function getDocsThemeConfig(mode: ThemeMode): LaRoseTheme {
  if (mode === 'dark') {
    return createTheme({ preset: 'refined', tokens: docsDarkTokens });
  }
  return createTheme({ preset: 'refined' });
}
