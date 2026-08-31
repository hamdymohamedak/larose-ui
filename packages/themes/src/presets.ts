import type { ThemeMode } from '@larose-ui/core';
import type { ColorTokens } from '@larose-ui/tokens';

export type ThemePresetId = 'default' | 'refined' | 'ocean' | 'forest' | 'sunset';

export interface ThemePreset {
  id: ThemePresetId;
  label: string;
  mode: ThemeMode;
  colors: Partial<ColorTokens>;
}

const presets: Record<ThemePresetId, ThemePreset> = {
  default: {
    id: 'default',
    label: 'Default',
    mode: 'light',
    colors: {},
  },
  refined: {
    id: 'refined',
    label: 'Refined (Apple-inspired)',
    mode: 'light',
    colors: {},
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    mode: 'light',
    colors: {
      primary: '#0284c7',
      primaryHover: '#0369a1',
      primaryActive: '#075985',
      secondary: '#0e7490',
    },
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    mode: 'light',
    colors: {
      primary: '#15803d',
      primaryHover: '#166534',
      primaryActive: '#14532d',
      secondary: '#4d7c0f',
    },
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    mode: 'dark',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      primaryActive: '#c2410c',
      background: '#1c1917',
      surface: '#292524',
      surfaceElevated: '#44403c',
      border: '#57534e',
      text: '#fafaf9',
      textMuted: '#a8a29e',
    },
  },
};

export function listThemePresets(): ThemePreset[] {
  return Object.values(presets);
}

export function getThemePreset(id: ThemePresetId): ThemePreset {
  return presets[id];
}
