import type { ReactNode } from 'react';
import type { MenuEntry } from '../Menu/types';

export type MenuBarPlatform = 'macos' | 'ipados';

export interface MenuBarMenuConfig {
  id: string;
  title: string;
  entries: MenuEntry[];
  /** App menu title appears bold on macOS. */
  emphasized?: boolean;
  /** Optional icon or symbol shown instead of the title (e.g. Apple menu). */
  trigger?: ReactNode;
  /** Accessible name when `trigger` replaces visible title text. */
  ariaLabel?: string;
}

export interface MenuBarExtraConfig {
  id: string;
  label: string;
  icon: ReactNode;
  entries: MenuEntry[];
}

export interface MenuBarDocumentContext {
  isDocumentOpen?: boolean;
  isDirty?: boolean;
  hasTabs?: boolean;
  toolbarVisible?: boolean;
  sidebarVisible?: boolean;
  isFullScreen?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
  canPaste?: boolean;
  undoLabel?: string;
  redoLabel?: string;
}

export interface StandardMenuBarHandlers {
  about?: () => void;
  settings?: () => void;
  quit?: () => void;
  new?: () => void;
  open?: () => void;
  close?: () => void;
  save?: () => void;
  undo?: () => void;
  redo?: () => void;
  cut?: () => void;
  copy?: () => void;
  paste?: () => void;
  delete?: () => void;
  selectAll?: () => void;
  help?: () => void;
  feedback?: () => void;
  minimize?: () => void;
  zoom?: () => void;
  toggleToolbar?: () => void;
  toggleSidebar?: () => void;
  toggleFullScreen?: () => void;
}

export interface StandardMenuBarOptions {
  appName: string;
  platform?: MenuBarPlatform;
  context?: MenuBarDocumentContext;
  handlers?: Partial<StandardMenuBarHandlers>;
  appSpecificMenus?: MenuBarMenuConfig[];
  openWindows?: string[];
  recentDocuments?: string[];
}

export interface MenuBarProps {
  appName: string;
  menus?: MenuBarMenuConfig[];
  /** Used when `menus` is omitted to build the standard HIG menu set. */
  standardOptions?: StandardMenuBarOptions;
  appSpecificMenus?: MenuBarMenuConfig[];
  extras?: MenuBarExtraConfig[];
  platform?: MenuBarPlatform;
  /** iPadOS: bar hidden until revealed at the top edge. */
  revealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
  /** macOS: show a read-only Apple menu stub (system-provided on real macOS). */
  showAppleMenu?: boolean;
  className?: string;
  onMenuAction?: (menuId: string, entryId: string) => void;
}
