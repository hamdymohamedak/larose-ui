import type { ReactNode } from 'react';
import type { Accelerator } from '@larose-ui/core';

export type MenuLayout = 'small' | 'medium' | 'large';

export interface MenuItemConfig {
  type?: 'item';
  id: string;
  label: string;
  icon?: ReactNode;
  /** Display label for the keyboard shortcut. Overrides automatic formatting. */
  shortcut?: string;
  /** Machine-readable accelerator for keyboard activation. */
  accelerator?: Accelerator;
  /** Label shown when Option (Alt) is held — dynamic menu bar item. */
  alternateLabel?: string;
  alternateShortcut?: string;
  /** Alternate accelerator when Option (Alt) is held. */
  alternateAccelerator?: Accelerator;
  destructive?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  /** Shows a checkmark for toggled/selected state. */
  selected?: boolean;
  /** Access key for mnemonic activation (Windows/Linux). Parsed from `&` in label when omitted. */
  mnemonic?: string;
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
