import type { CrossFrameworkComponentDefinition } from './types';
import { foundationRegistry } from './registry/foundation';
import { liquidGlassRegistry } from './registry/liquidGlass';
import { menusRegistry } from './registry/menus';
import { documentRegistry } from './registry/document';
import { demoRegistry } from './registry/demos';

export { foundationRegistry } from './registry/foundation';
export { liquidGlassRegistry } from './registry/liquidGlass';
export { menusRegistry } from './registry/menus';
export { documentRegistry } from './registry/document';
export { demoRegistry } from './registry/demos';
export * from './registry/defaults';

export const crossFrameworkRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  ...foundationRegistry,
  ...liquidGlassRegistry,
  ...menusRegistry,
  ...documentRegistry,
  ...demoRegistry,
};

export function getCrossFrameworkDefinition(
  id: string | undefined,
): CrossFrameworkComponentDefinition | undefined {
  if (!id) return undefined;
  return crossFrameworkRegistry[id];
}
