export const GLASS_DOC_COMPONENTS = new Set([
  'LiquidGlass',
  'LiquidGlassTabBar',
  'LiquidGlassButton',
  'LiquidGlassTopBar',
  'LiquidGlassSwitch',
  'LiquidGlassProgress',
  'LiquidGlassRange',
  'LiquidGlassCheckbox',
]);

export function isGlassDocComponent(name: string): boolean {
  return GLASS_DOC_COMPONENTS.has(name);
}
