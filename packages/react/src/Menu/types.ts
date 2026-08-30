import type { ReactNode } from 'react';

export type MenuLayout = 'small' | 'medium' | 'large';

export interface MenuItemConfig {
  type?: 'item';
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  /** Label shown when Option (Alt) is held — dynamic menu bar item. */
  alternateLabel?: string;
  alternateShortcut?: string;
  destructive?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  /** Shows a checkmark for toggled/selected state. */
  selected?: boolean;
  onSelect?: () => void;
}

export interface MenuSubmenuConfig {
  type: 'submenu';
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  hidden?: boolean;
  items: MenuItemConfig[];
}

export type MenuSeparatorConfig = { type: 'separator'; id?: string };

export type MenuEntry = MenuItemConfig | MenuSubmenuConfig | MenuSeparatorConfig;

export interface MenuPosition {
  x: number;
  y: number;
  placement: 'above' | 'below';
}
