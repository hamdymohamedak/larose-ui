export { default as LiquidGlass } from './core/LiquidGlass.vue';
export { useLiquidGlass } from './core/useLiquidGlass';
export type { UseLiquidGlassOptions } from './core/useLiquidGlass';
export type {
  LiquidGlassSurfaceProps,
  LiquidGlassOptics,
  LiquidGlassGeometry,
  LiquidGlassChromeProps,
  ResolvedLiquidGlassOptics,
  LiquidGlassTabItem,
  LiquidGlassTopBarItem,
} from './engine/types';

export { default as LiquidGlassButton } from './Button/LiquidGlassButton.vue';
export { default as LiquidGlassSwitch } from './Switch/LiquidGlassSwitch.vue';
export {
  LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
  LIQUID_GLASS_SWITCH_TRACK_GLASS,
} from './Switch/constants';
export type { LiquidGlassSwitchActiveTrackTint } from './Switch/constants';
export { default as LiquidGlassCheckbox } from './Checkbox/LiquidGlassCheckbox.vue';
export { default as LiquidGlassProgress } from './Progress/LiquidGlassProgress.vue';
export { default as LiquidGlassRange } from './Range/LiquidGlassRange.vue';
export { default as LiquidGlassTabBar } from './TabBar/LiquidGlassTabBar.vue';
export { default as LiquidGlassTopBar } from './TopBar/LiquidGlassTopBar.vue';

export {
  buildLiquidGlassDisplacementMap,
  squircleHeightFn,
  roundedRectSDF,
} from './engine/displacement-map';
export type { BuildDisplacementMapOptions } from './engine/displacement-map';
export {
  LIQUID_GLASS_OPTICS_DEFAULTS,
  LIQUID_GLASS_PRESETS,
  resolveLiquidGlassOptics,
} from './engine/defaults';
export { supportsLiquidGlassRefraction } from './engine/detect';
