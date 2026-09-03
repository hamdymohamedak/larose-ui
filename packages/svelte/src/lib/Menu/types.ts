import type {
  MenuLayout,
  MenuPosition,
  MenuSeparatorConfig,
} from '@larose-ui/primitives';
import type { MenuItemConfig as PrimitiveMenuItemConfig } from '@larose-ui/primitives';
import type { MenuSubmenuConfig as PrimitiveMenuSubmenuConfig } from '@larose-ui/primitives';

export type { MenuLayout, MenuPosition, MenuSeparatorConfig };

export interface MenuItemConfig extends PrimitiveMenuItemConfig {
  icon?: unknown;
}

export interface MenuSubmenuConfig extends Omit<PrimitiveMenuSubmenuConfig, 'items'> {
  icon?: unknown;
  items: MenuItemConfig[];
}

export type MenuEntry =
  | MenuItemConfig
  | MenuSubmenuConfig
  | MenuSeparatorConfig;
