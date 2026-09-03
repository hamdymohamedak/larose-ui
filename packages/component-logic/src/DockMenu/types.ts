import type { ContextMenuEntry } from '../ContextMenu/types';

export interface DockWindow {
  id: string;
  title: string;
  subtitle?: string;
}

export type DockMenuEntry = ContextMenuEntry;

export interface DockMenuPosition {
  x: number;
  y: number;
}

export type { QuickActionItem, QuickActionIconPlacement } from '../QuickActions/types';
