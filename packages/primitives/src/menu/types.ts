import type { Accelerator } from '@larose-ui/core';

export type MenuLayout = 'small' | 'medium' | 'large';

export interface MenuItemConfig {
  type?: 'item';
  id: string;
  label: string;
  shortcut?: string;
  accelerator?: Accelerator;
  alternateLabel?: string;
  alternateShortcut?: string;
  alternateAccelerator?: Accelerator;
  destructive?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  selected?: boolean;
  mnemonic?: string;
  onSelect?: () => void;
}

export interface MenuSubmenuConfig {
  type: 'submenu';
  id: string;
  label: string;
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

export interface MenuBarMenuConfig {
  id: string;
  title: string;
  mnemonic?: string;
}
