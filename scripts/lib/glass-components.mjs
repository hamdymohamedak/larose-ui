/** Liquid glass components shipped from @larose-ui/react. */
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

export function isGlassDocComponent(name) {
  return GLASS_DOC_COMPONENTS.has(name);
}

export function glassImportStatement(name) {
  return `import { ${name} } from '@larose-ui/react';`;
}
