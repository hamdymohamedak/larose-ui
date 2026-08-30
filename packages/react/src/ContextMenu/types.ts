import type { ReactNode } from 'react';

export interface ContextMenuItemConfig {
  type?: 'item';
  id: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  /** Hide unavailable items instead of dimming them (HIG default). */
  hidden?: boolean;
  /** Clipboard commands may appear disabled when unavailable (macOS). */
  disabled?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuSubmenuConfig {
  type: 'submenu';
  id: string;
  label: string;
  items: ContextMenuItemConfig[];
}

export type ContextMenuSeparatorConfig = { type: 'separator'; id?: string };

export type ContextMenuEntry =
  | ContextMenuItemConfig
  | ContextMenuSubmenuConfig
  | ContextMenuSeparatorConfig;

export interface ContextMenuPosition {
  x: number;
  y: number;
  placement: 'above' | 'below';
}
