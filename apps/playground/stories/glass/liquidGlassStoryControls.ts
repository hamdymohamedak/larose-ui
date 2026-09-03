import type { ArgTypes } from '@storybook/react';
import { fn } from '@storybook/test';
import { LIQUID_GLASS_OPTICS_DEFAULTS } from '@larose-ui/react';
import type { LiquidGlassOptics } from '@larose-ui/react';
import {
  LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
  LIQUID_GLASS_SWITCH_TRACK_GLASS,
} from '@larose-ui/react';

/** Hide props that cannot be driven from Storybook controls. */
export const hiddenControl = { table: { disable: true } } as const;

export function hiddenProps(...keys: string[]): ArgTypes {
  return Object.fromEntries(keys.map((key) => [key, hiddenControl]));
}

// ─── Shared optics ────────────────────────────────────────────────────────────

export const liquidGlassOpticsArgTypes: ArgTypes = {
  blur: {
    control: { type: 'range', min: 0, max: 40, step: 1 },
    description: 'Backdrop blur (px) — non-Chromium fallback',
    table: { category: 'Optics' },
  },
  saturation: {
    control: { type: 'range', min: 1, max: 3, step: 0.05 },
    description: 'Backdrop saturation multiplier',
    table: { category: 'Optics' },
  },
  tint: {
    control: 'text',
    description: 'Glass fill (Chromium path) — CSS color',
    table: { category: 'Optics' },
  },
  tintFallback: {
    control: 'text',
    description: 'Glass fill (fallback path) — CSS color',
    table: { category: 'Optics' },
  },
  displacementScale: {
    control: { type: 'range', min: 0, max: 80, step: 1 },
    description: 'SVG feDisplacementMap scale',
    table: { category: 'Optics' },
  },
  bezelWidth: {
    control: { type: 'range', min: 4, max: 48, step: 1 },
    description: 'Refracting bezel band width (px)',
    table: { category: 'Optics' },
  },
  refractionStrength: {
    control: { type: 'range', min: 0, max: 2, step: 0.05 },
    description: 'Displacement magnitude multiplier',
    table: { category: 'Optics' },
  },
  showSpecular: {
    control: 'boolean',
    description: 'Conic-gradient specular rim',
    table: { category: 'Optics' },
  },
  specularAngle: {
    control: { type: 'range', min: 0, max: 360, step: 1 },
    description: 'Specular start angle (deg)',
    table: { category: 'Optics' },
  },
  specularTopOpacity: {
    control: { type: 'range', min: 0, max: 1, step: 0.01 },
    description: 'Specular peak opacity',
    table: { category: 'Optics' },
  },
  specularEdgeOpacity: {
    control: { type: 'range', min: 0, max: 1, step: 0.01 },
    description: 'Specular edge opacity',
    table: { category: 'Optics' },
  },
  innerTopHighlight: {
    control: { type: 'range', min: 0, max: 1, step: 0.01 },
    description: 'Inner top highlight opacity',
    table: { category: 'Optics' },
  },
  innerBottomShadow: {
    control: { type: 'range', min: 0, max: 1, step: 0.01 },
    description: 'Inner bottom shadow opacity',
    table: { category: 'Optics' },
  },
  shadowIntensity: {
    control: { type: 'range', min: 0, max: 2, step: 0.05 },
    description: 'Drop shadow intensity (0 = off)',
    table: { category: 'Optics' },
  },
  borderColor: {
    control: 'text',
    description: 'Inset border colour — CSS color',
    table: { category: 'Optics' },
  },
};

export const liquidGlassOpticsDefaults: Required<LiquidGlassOptics> =
  LIQUID_GLASS_OPTICS_DEFAULTS;

// ─── Geometry (LiquidGlass surface) ───────────────────────────────────────────

export const liquidGlassGeometryArgTypes: ArgTypes = {
  width: {
    control: { type: 'range', min: 40, max: 600, step: 4 },
    table: { category: 'Geometry' },
  },
  height: {
    control: { type: 'range', min: 24, max: 320, step: 4 },
    table: { category: 'Geometry' },
  },
  minWidth: {
    control: { type: 'range', min: 0, max: 400, step: 4 },
    table: { category: 'Geometry' },
  },
  maxWidth: {
    control: { type: 'range', min: 0, max: 800, step: 4 },
    table: { category: 'Geometry' },
  },
  minHeight: {
    control: { type: 'range', min: 0, max: 200, step: 4 },
    table: { category: 'Geometry' },
  },
  maxHeight: {
    control: { type: 'range', min: 0, max: 400, step: 4 },
    table: { category: 'Geometry' },
  },
  borderRadius: {
    control: { type: 'range', min: 0, max: 999, step: 1 },
    table: { category: 'Geometry' },
  },
};

// ─── Button ───────────────────────────────────────────────────────────────────

export const liquidGlassButtonArgTypes: ArgTypes = {
  children: { control: 'text', table: { category: 'Content' } },
  color: { control: 'color', table: { category: 'Typography' } },
  fontSize: {
    control: { type: 'range', min: 10, max: 24, step: 0.5 },
    table: { category: 'Typography' },
  },
  fontWeight: {
    control: { type: 'range', min: 400, max: 800, step: 50 },
    table: { category: 'Typography' },
  },
  disabled: { control: 'boolean', table: { category: 'State' } },
  type: {
    control: 'select',
    options: ['button', 'submit', 'reset'],
    table: { category: 'State' },
  },
  width: {
    control: { type: 'range', min: 60, max: 320, step: 4 },
    table: { category: 'Geometry' },
  },
  height: {
    control: { type: 'range', min: 28, max: 72, step: 2 },
    table: { category: 'Geometry' },
  },
  borderRadius: {
    control: { type: 'range', min: 0, max: 48, step: 1 },
    table: { category: 'Geometry' },
  },
  ...liquidGlassOpticsArgTypes,
  onClick: {
    table: { disable: true },
    action: 'click',
  },
  ...hiddenProps(
    'onFocus',
    'onBlur',
    'className',
    'style',
    'ref',
    'form',
    'name',
    'value',
    'autoFocus',
    'tabIndex',
  ),
};

export const liquidGlassButtonDefaults = {
  children: 'Continue',
  width: 160,
  height: 48,
  borderRadius: 24,
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 500,
  disabled: false,
  type: 'button' as const,
  onClick: fn(),
  ...liquidGlassOpticsDefaults,
  displacementScale: 28,
  bezelWidth: 16,
  shadowIntensity: 0.85,
};

// ─── TopBar ───────────────────────────────────────────────────────────────────

export const liquidGlassTopBarArgTypes: ArgTypes = {
  title: { control: 'text', table: { category: 'Content' } },
  showTrailing: {
    control: 'boolean',
    description: 'Show the trailing settings action',
    table: { category: 'Content' },
  },
  variant: {
    control: 'select',
    options: ['floating', 'edge'],
    table: { category: 'Layout' },
  },
  height: {
    control: { type: 'range', min: 44, max: 80, step: 2 },
    table: { category: 'Layout' },
  },
  paddingX: {
    control: { type: 'range', min: 8, max: 40, step: 2 },
    table: { category: 'Layout' },
  },
  insetX: {
    control: { type: 'range', min: 0, max: 48, step: 2 },
    description: 'Horizontal inset when positioned',
    table: { category: 'Layout' },
  },
  top: {
    control: { type: 'range', min: 0, max: 48, step: 2 },
    description: 'Top offset when positioned (px)',
    table: { category: 'Layout' },
  },
  borderRadius: {
    control: { type: 'range', min: 0, max: 32, step: 1 },
    table: { category: 'Layout' },
  },
  position: {
    control: 'select',
    options: ['fixed', 'absolute', 'relative', 'sticky', 'static'],
    table: { category: 'Layout' },
  },
  defaultActiveKey: {
    control: 'select',
    options: ['home', 'discover', 'library'],
    table: { category: 'Navigation' },
  },
  activeColor: { control: 'color', table: { category: 'Colors' } },
  inactiveColor: {
    control: 'text',
    description: 'CSS color (supports rgba)',
    table: { category: 'Colors' },
  },
  titleColor: { control: 'color', table: { category: 'Colors' } },
  navTrackBackground: {
    control: 'text',
    description: 'Segmented nav track — CSS color',
    table: { category: 'Colors' },
  },
  navActiveBackground: {
    control: 'text',
    description: 'Active nav pill — CSS color',
    table: { category: 'Colors' },
  },
  ...liquidGlassOpticsArgTypes,
  onChange: {
    table: { disable: true },
    action: 'change',
  },
  ...hiddenProps(
    'items',
    'activeKey',
    'logo',
    'trailing',
    'className',
    'style',
  ),
};

export const liquidGlassTopBarDefaults = {
  title: 'laRose',
  showTrailing: true,
  variant: 'floating' as const,
  height: 56,
  paddingX: 16,
  insetX: 16,
  top: 14,
  borderRadius: 20,
  position: 'fixed' as const,
  defaultActiveKey: 'home',
  onChange: fn(),
  activeColor: '#ffffff',
  inactiveColor: 'rgba(255, 255, 255, 0.62)',
  titleColor: '#ffffff',
  navTrackBackground: 'rgba(255, 255, 255, 0.08)',
  navActiveBackground: 'rgba(255, 255, 255, 0.18)',
  ...liquidGlassOpticsDefaults,
  displacementScale: 32,
  bezelWidth: 18,
  innerBottomShadow: 0.12,
};

// ─── TabBar ───────────────────────────────────────────────────────────────────

export type TabBarTabPreset = 'full' | 'iconsOnly' | 'badges' | 'threeTabs';

export const liquidGlassTabBarArgTypes: ArgTypes = {
  tabPreset: {
    control: 'select',
    options: ['full', 'iconsOnly', 'badges', 'threeTabs'] satisfies TabBarTabPreset[],
    description: 'Switch tab item configuration',
    table: { category: 'Content' },
  },
  defaultActiveKey: {
    control: 'select',
    options: ['home', 'search', 'create', 'library', 'profile', 'notifs', 'settings'],
    table: { category: 'Navigation' },
  },
  height: {
    control: { type: 'range', min: 40, max: 96, step: 1 },
    table: { category: 'Layout' },
  },
  borderRadius: {
    control: { type: 'range', min: 0, max: 48, step: 1 },
    table: { category: 'Layout' },
  },
  maxWidth: {
    control: { type: 'range', min: 200, max: 600, step: 4 },
    table: { category: 'Layout' },
  },
  indicatorPadding: {
    control: { type: 'range', min: 0, max: 20, step: 1 },
    table: { category: 'Layout' },
  },
  showIndicator: { control: 'boolean', table: { category: 'Indicator' } },
  indicatorBackground: {
    control: 'text',
    table: { category: 'Indicator' },
  },
  indicatorBorderColor: {
    control: 'text',
    table: { category: 'Indicator' },
  },
  activeColor: { control: 'color', table: { category: 'Colors' } },
  inactiveColor: {
    control: 'text',
    table: { category: 'Colors' },
  },
  position: {
    control: 'select',
    options: ['fixed', 'absolute', 'relative', 'static'],
    table: { category: 'Layout' },
  },
  bottom: {
    control: { type: 'range', min: 0, max: 80, step: 1 },
    table: { category: 'Layout' },
  },
  ...liquidGlassOpticsArgTypes,
  onChange: {
    table: { disable: true },
    action: 'change',
  },
  ...hiddenProps('items', 'activeKey', 'className', 'style'),
};

export const liquidGlassTabBarDefaults = {
  tabPreset: 'full' as TabBarTabPreset,
  defaultActiveKey: 'home',
  onChange: fn(),
  height: 64,
  borderRadius: 30,
  maxWidth: 420,
  indicatorPadding: 8,
  showIndicator: true,
  indicatorBackground: 'rgba(255, 255, 255, 0.16)',
  indicatorBorderColor: 'rgba(255, 255, 255, 0.28)',
  activeColor: '#ffffff',
  inactiveColor: 'rgba(255, 255, 255, 0.55)',
  position: 'fixed' as const,
  bottom: 22,
  ...liquidGlassOpticsDefaults,
};

// ─── Surface / Lens Lab ───────────────────────────────────────────────────────

export const liquidGlassSurfaceArgTypes: ArgTypes = {
  label: { control: 'text', table: { category: 'Content' } },
  ...liquidGlassGeometryArgTypes,
  ...liquidGlassOpticsArgTypes,
  onDisplacementMapChange: {
    table: { disable: true },
    action: 'displacementMapChange',
  },
  ...hiddenProps('children', 'className', 'style', 'as', 'aria-label'),
};

export const liquidGlassSurfaceDefaults = {
  label: 'Liquid glass',
  width: 280,
  height: 120,
  borderRadius: 36,
  minWidth: 0,
  maxWidth: 0,
  minHeight: 0,
  maxHeight: 0,
  onDisplacementMapChange: fn(),
  ...liquidGlassOpticsDefaults,
};

/** Remove Storybook action stubs before passing props to components. */
export function stripStorybookCallbacks<T extends Record<string, unknown>>(props: T): T {
  const next = { ...props };
  delete next.onDisplacementMapChange;
  delete next.onChange;
  delete next.onClick;
  return next;
}

/** Zero means unset — strip before passing to component. */
export function stripZeroGeometry<T extends Record<string, unknown>>(props: T): T {
  const next = { ...props };
  for (const key of ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'] as const) {
    if (next[key] === 0) delete next[key];
  }
  return next;
}

/** Prepare surface/lens-lab args for `<LiquidGlass />` (no implicit actions). */
export function prepareSurfaceProps<T extends Record<string, unknown>>(props: T): T {
  return stripZeroGeometry(stripStorybookCallbacks(props));
}

// ─── Form controls ────────────────────────────────────────────────────────────

const formControlHidden = hiddenProps('className', 'style');

export const liquidGlassSwitchArgTypes: ArgTypes = {
  defaultChecked: { control: 'boolean', table: { category: 'State' } },
  disabled: { control: 'boolean', table: { category: 'State' } },
  width: { control: { type: 'range', min: 40, max: 72, step: 2 }, table: { category: 'Geometry' } },
  height: { control: { type: 'range', min: 24, max: 44, step: 2 }, table: { category: 'Geometry' } },
  thumbSize: { control: { type: 'range', min: 20, max: 36, step: 1 }, table: { category: 'Geometry' } },
  activeTrackTint: {
    control: 'select',
    options: [
      LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
      LIQUID_GLASS_SWITCH_TRACK_GLASS,
      'rgba(255, 255, 255, 0.10)',
      'rgba(59, 130, 246, 0.45)',
      'rgba(255, 149, 0, 0.45)',
    ],
    labels: {
      [LIQUID_GLASS_SWITCH_ACTIVE_GREEN]: 'Green (default)',
      [LIQUID_GLASS_SWITCH_TRACK_GLASS]: 'Liquid glass',
      'rgba(255, 255, 255, 0.10)': 'White glass',
      'rgba(59, 130, 246, 0.45)': 'Blue',
      'rgba(255, 149, 0, 0.45)': 'Orange',
    },
    description:
      'Active track color when on. Green by default; choose Liquid glass for no color wash, or any CSS color.',
    table: { category: 'Colors' },
  },
  inactiveTrackTint: { control: 'text', table: { category: 'Colors' } },
  thumbTint: { control: 'text', table: { category: 'Colors' } },
  ...liquidGlassOpticsArgTypes,
  onChange: { table: { disable: true }, action: 'change' },
  ...formControlHidden,
};

export const liquidGlassSwitchDefaults = {
  defaultChecked: true,
  disabled: false,
  width: 52,
  height: 32,
  thumbSize: 28,
  activeTrackTint: LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
  onChange: fn(),
  ...liquidGlassOpticsDefaults,
  displacementScale: 24,
  bezelWidth: 12,
  shadowIntensity: 0.7,
};

export const liquidGlassProgressArgTypes: ArgTypes = {
  value: { control: { type: 'range', min: 0, max: 100, step: 1 }, table: { category: 'State' } },
  max: { control: { type: 'range', min: 1, max: 100, step: 1 }, table: { category: 'State' } },
  indeterminate: { control: 'boolean', table: { category: 'State' } },
  height: { control: { type: 'range', min: 6, max: 24, step: 1 }, table: { category: 'Geometry' } },
  fillColor: { control: 'text', table: { category: 'Colors' } },
  fillGlow: { control: 'text', table: { category: 'Colors' } },
  ...liquidGlassOpticsArgTypes,
  ...formControlHidden,
};

export const liquidGlassProgressDefaults = {
  value: 62,
  max: 100,
  indeterminate: false,
  height: 10,
  fillColor: 'rgba(255, 255, 255, 0.55)',
  fillGlow: 'rgba(255, 255, 255, 0.35)',
  ...liquidGlassOpticsDefaults,
  displacementScale: 18,
  bezelWidth: 10,
  shadowIntensity: 0.6,
};

export const liquidGlassRangeArgTypes: ArgTypes = {
  defaultValue: { control: { type: 'range', min: 0, max: 100, step: 1 }, table: { category: 'State' } },
  min: { control: { type: 'range', min: 0, max: 50, step: 1 }, table: { category: 'State' } },
  max: { control: { type: 'range', min: 50, max: 100, step: 1 }, table: { category: 'State' } },
  step: { control: { type: 'range', min: 1, max: 10, step: 1 }, table: { category: 'State' } },
  disabled: { control: 'boolean', table: { category: 'State' } },
  trackHeight: { control: { type: 'range', min: 4, max: 16, step: 1 }, table: { category: 'Geometry' } },
  thumbSize: { control: { type: 'range', min: 20, max: 40, step: 1 }, table: { category: 'Geometry' } },
  fillColor: { control: 'text', table: { category: 'Colors' } },
  ...liquidGlassOpticsArgTypes,
  onChange: { table: { disable: true }, action: 'change' },
  ...formControlHidden,
};

export const liquidGlassRangeDefaults = {
  defaultValue: 42,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  trackHeight: 8,
  thumbSize: 28,
  fillColor: 'rgba(255, 255, 255, 0.35)',
  onChange: fn(),
  ...liquidGlassOpticsDefaults,
  displacementScale: 22,
  bezelWidth: 12,
  shadowIntensity: 0.75,
};

export const liquidGlassCheckboxArgTypes: ArgTypes = {
  label: { control: 'text', table: { category: 'Content' } },
  defaultChecked: { control: 'boolean', table: { category: 'State' } },
  disabled: { control: 'boolean', table: { category: 'State' } },
  size: { control: { type: 'range', min: 20, max: 36, step: 1 }, table: { category: 'Geometry' } },
  borderRadius: { control: { type: 'range', min: 4, max: 16, step: 1 }, table: { category: 'Geometry' } },
  checkColor: { control: 'color', table: { category: 'Colors' } },
  checkedTint: { control: 'text', table: { category: 'Colors' } },
  labelColor: { control: 'color', table: { category: 'Colors' } },
  ...liquidGlassOpticsArgTypes,
  onChange: { table: { disable: true }, action: 'change' },
  ...formControlHidden,
};

export const liquidGlassCheckboxDefaults = {
  label: 'Enable liquid glass',
  defaultChecked: true,
  disabled: false,
  size: 26,
  borderRadius: 8,
  checkColor: '#ffffff',
  checkedTint: 'rgba(52, 199, 89, 0.42)',
  labelColor: '#ffffff',
  onChange: fn(),
  ...liquidGlassOpticsDefaults,
  displacementScale: 20,
  bezelWidth: 10,
  shadowIntensity: 0.65,
};

