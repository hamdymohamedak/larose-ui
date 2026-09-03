import { LIQUID_GLASS_OPTICS_DEFAULTS } from '@larose-ui/react';
import {
  LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
  LIQUID_GLASS_SWITCH_TRACK_GLASS,
} from '@larose-ui/react';
import type { LiquidGlassPreviewLayout } from '@/previews/glass/LiquidGlassPreviewScene';

export type GlassPlaygroundControlType =
  | 'boolean'
  | 'select'
  | 'text'
  | 'number'
  | 'range'
  | 'color';

export interface GlassPlaygroundControl {
  control: GlassPlaygroundControlType;
  default?: string | number | boolean;
  options?: string[];
  optionLabels?: Record<string, string>;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  category?: string;
}

export interface GlassPlaygroundConfig {
  controls: Record<string, GlassPlaygroundControl>;
  layout: LiquidGlassPreviewLayout;
  showScrollContent?: boolean;
}

const optics = LIQUID_GLASS_OPTICS_DEFAULTS;

function opticsControls(
  overrides: Partial<Record<keyof typeof optics, number | string | boolean>> = {},
): Record<string, GlassPlaygroundControl> {
  const d = { ...optics, ...overrides };
  return {
    displacementScale: {
      control: 'range',
      default: d.displacementScale,
      min: 0,
      max: 80,
      step: 1,
      category: 'Optics',
      label: 'Displacement scale',
    },
    bezelWidth: {
      control: 'range',
      default: d.bezelWidth,
      min: 4,
      max: 48,
      step: 1,
      category: 'Optics',
      label: 'Bezel width',
    },
    tint: {
      control: 'text',
      default: d.tint,
      category: 'Optics',
      label: 'Tint',
    },
    saturation: {
      control: 'range',
      default: d.saturation,
      min: 1,
      max: 3,
      step: 0.05,
      category: 'Optics',
      label: 'Saturation',
    },
    shadowIntensity: {
      control: 'range',
      default: d.shadowIntensity,
      min: 0,
      max: 2,
      step: 0.05,
      category: 'Optics',
      label: 'Shadow intensity',
    },
    showSpecular: {
      control: 'boolean',
      default: d.showSpecular,
      category: 'Optics',
      label: 'Specular rim',
    },
  };
}

export const GLASS_PLAYGROUND_CONFIG: Record<string, GlassPlaygroundConfig> = {
  LiquidGlass: {
    layout: 'center',
    controls: {
      label: { control: 'text', default: 'Liquid glass', category: 'Content', label: 'Label' },
      width: { control: 'range', default: 280, min: 120, max: 480, step: 4, category: 'Geometry' },
      height: { control: 'range', default: 120, min: 48, max: 240, step: 4, category: 'Geometry' },
      borderRadius: { control: 'range', default: 36, min: 0, max: 80, step: 1, category: 'Geometry' },
      ...opticsControls(),
    },
  },
  LiquidGlassButton: {
    layout: 'center',
    showScrollContent: false,
    controls: {
      children: { control: 'text', default: 'Continue', category: 'Content', label: 'Label' },
      disabled: { control: 'boolean', default: false, category: 'State' },
      width: { control: 'range', default: 160, min: 80, max: 320, step: 4, category: 'Geometry' },
      height: { control: 'range', default: 48, min: 32, max: 72, step: 2, category: 'Geometry' },
      borderRadius: { control: 'range', default: 24, min: 0, max: 48, step: 1, category: 'Geometry' },
      color: { control: 'color', default: '#ffffff', category: 'Typography', label: 'Text color' },
      ...opticsControls({ displacementScale: 28, bezelWidth: 16, shadowIntensity: 0.85 }),
    },
  },
  LiquidGlassSwitch: {
    layout: 'center',
    showScrollContent: false,
    controls: {
      defaultChecked: { control: 'boolean', default: true, category: 'State', label: 'Checked' },
      disabled: { control: 'boolean', default: false, category: 'State' },
      activeTrackTint: {
        control: 'select',
        default: LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
        options: [
          LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
          LIQUID_GLASS_SWITCH_TRACK_GLASS,
          'rgba(59, 130, 246, 0.45)',
          'rgba(255, 149, 0, 0.45)',
        ],
        optionLabels: {
          [LIQUID_GLASS_SWITCH_ACTIVE_GREEN]: 'Green (default)',
          [LIQUID_GLASS_SWITCH_TRACK_GLASS]: 'Liquid glass',
          'rgba(59, 130, 246, 0.45)': 'Blue',
          'rgba(255, 149, 0, 0.45)': 'Orange',
        },
        category: 'Colors',
        label: 'Active track',
      },
      width: { control: 'range', default: 52, min: 40, max: 72, step: 2, category: 'Geometry' },
      height: { control: 'range', default: 32, min: 24, max: 44, step: 2, category: 'Geometry' },
      ...opticsControls({ displacementScale: 24, bezelWidth: 12, shadowIntensity: 0.7 }),
    },
  },
  LiquidGlassProgress: {
    layout: 'center',
    showScrollContent: false,
    controls: {
      value: { control: 'range', default: 62, min: 0, max: 100, step: 1, category: 'State' },
      indeterminate: { control: 'boolean', default: false, category: 'State' },
      height: { control: 'range', default: 10, min: 6, max: 24, step: 1, category: 'Geometry' },
      fillColor: {
        control: 'text',
        default: 'rgba(255, 255, 255, 0.55)',
        category: 'Colors',
        label: 'Fill color',
      },
      ...opticsControls({ displacementScale: 18, bezelWidth: 10, shadowIntensity: 0.6 }),
    },
  },
  LiquidGlassRange: {
    layout: 'center',
    showScrollContent: false,
    controls: {
      defaultValue: { control: 'range', default: 42, min: 0, max: 100, step: 1, category: 'State', label: 'Value' },
      disabled: { control: 'boolean', default: false, category: 'State' },
      trackHeight: { control: 'range', default: 8, min: 4, max: 16, step: 1, category: 'Geometry' },
      thumbSize: { control: 'range', default: 28, min: 20, max: 40, step: 1, category: 'Geometry' },
      ...opticsControls({ displacementScale: 22, bezelWidth: 12, shadowIntensity: 0.75 }),
    },
  },
  LiquidGlassCheckbox: {
    layout: 'center',
    showScrollContent: false,
    controls: {
      label: { control: 'text', default: 'Enable liquid glass', category: 'Content' },
      defaultChecked: { control: 'boolean', default: true, category: 'State', label: 'Checked' },
      disabled: { control: 'boolean', default: false, category: 'State' },
      size: { control: 'range', default: 26, min: 20, max: 36, step: 1, category: 'Geometry' },
      checkedTint: {
        control: 'text',
        default: 'rgba(52, 199, 89, 0.42)',
        category: 'Colors',
        label: 'Checked tint',
      },
      ...opticsControls({ displacementScale: 20, bezelWidth: 10, shadowIntensity: 0.65 }),
    },
  },
  LiquidGlassTabBar: {
    layout: 'bottom-bar',
    controls: {
      tabPreset: {
        control: 'select',
        default: 'full',
        options: ['full', 'iconsOnly', 'badges', 'threeTabs'],
        optionLabels: {
          full: 'Full labels',
          iconsOnly: 'Icons only',
          badges: 'With badges',
          threeTabs: 'Three tabs',
        },
        category: 'Content',
        label: 'Tab preset',
      },
      defaultActiveKey: {
        control: 'select',
        default: 'home',
        options: ['home', 'search', 'create', 'library', 'profile', 'notifs', 'settings'],
        category: 'Navigation',
        label: 'Active tab',
      },
      height: { control: 'range', default: 64, min: 48, max: 88, step: 1, category: 'Layout' },
      maxWidth: { control: 'range', default: 420, min: 280, max: 560, step: 4, category: 'Layout' },
      showIndicator: { control: 'boolean', default: true, category: 'Indicator', label: 'Show indicator' },
      ...opticsControls(),
    },
  },
  LiquidGlassTopBar: {
    layout: 'top-bar',
    controls: {
      title: { control: 'text', default: 'laRose', category: 'Content' },
      showTrailing: { control: 'boolean', default: true, category: 'Content', label: 'Trailing action' },
      variant: {
        control: 'select',
        default: 'floating',
        options: ['floating', 'edge'],
        category: 'Layout',
      },
      defaultActiveKey: {
        control: 'select',
        default: 'discover',
        options: ['home', 'discover', 'library'],
        category: 'Navigation',
        label: 'Active section',
      },
      height: { control: 'range', default: 56, min: 44, max: 72, step: 2, category: 'Layout' },
      borderRadius: { control: 'range', default: 20, min: 0, max: 32, step: 1, category: 'Layout' },
      ...opticsControls({ displacementScale: 32, bezelWidth: 18, shadowIntensity: 0.9 }),
    },
  },
};

export function getGlassPlaygroundConfig(componentName: string): GlassPlaygroundConfig | undefined {
  return GLASS_PLAYGROUND_CONFIG[componentName];
}
