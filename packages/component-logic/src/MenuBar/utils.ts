import type { MenuEntry, MenuItemConfig } from '../Menu/types';
import { isMenuItem, isMenuSubmenu } from '../Menu/utils';
import type { MenuBarMenuConfig, MenuBarPlatform, StandardMenuBarOptions } from './types';
import {
  createAppMenu,
  createEditMenu,
  createFileMenu,
  createFormatMenu,
  createHelpMenu,
  createViewMenu,
  createWindowMenu,
} from './standardMenus';

export const STANDARD_MENU_SLOTS = [
  'app',
  'file',
  'edit',
  'format',
  'view',
  'window',
  'help',
] as const;

export function resolveDynamicMenuEntries(
  entries: MenuEntry[],
  modifiers: { optionKey: boolean },
): MenuEntry[] {
  return entries.map((entry) => {
    if (isMenuSubmenu(entry)) {
      return {
        ...entry,
        items: resolveDynamicMenuEntries(entry.items, modifiers) as MenuItemConfig[],
      };
    }

    if (isMenuItem(entry) && modifiers.optionKey && entry.alternateLabel) {
      return {
        ...entry,
        label: entry.alternateLabel,
        shortcut: entry.alternateShortcut ?? entry.shortcut,
      };
    }

    return entry;
  });
}

export function warnIfMenuTitleTooLong(title: string, menuId: string): void {
  if (title.trim().split(/\s+/).length > 1) {
    console.warn(
      `Menu bar menu "${menuId}" uses a multi-word title ("${title}"). Prefer short, one-word titles.`,
    );
  }
}

export function validateMenuBarOrder(menus: MenuBarMenuConfig[]): void {
  const ids = menus.map((menu) => menu.id);
  const appIndex = ids.indexOf('app');
  const fileIndex = ids.indexOf('file');
  const editIndex = ids.indexOf('edit');
  const viewIndex = ids.indexOf('view');
  const windowIndex = ids.indexOf('window');
  const helpIndex = ids.indexOf('help');

  if (appIndex > 0 && appIndex !== -1) {
    console.warn('App menu should appear first in the menu bar.');
  }
  if (fileIndex !== -1 && editIndex !== -1 && fileIndex > editIndex) {
    console.warn('File menu should appear before Edit in the menu bar.');
  }
  if (viewIndex !== -1 && windowIndex !== -1 && viewIndex > windowIndex) {
    console.warn('View menu should appear before Window in the menu bar.');
  }
  if (helpIndex !== -1 && helpIndex !== ids.length - 1) {
    console.warn('Help menu should appear last in the menu bar.');
  }

  for (const menu of menus) {
    warnIfMenuTitleTooLong(menu.title, menu.id);
  }
}

export function buildStandardMenuBar(options: StandardMenuBarOptions): MenuBarMenuConfig[] {
  const {
    appName,
    platform = 'macos',
    context = {},
    handlers = {},
    appSpecificMenus = [],
    openWindows = [],
    recentDocuments = [],
  } = options;

  const withHandler = (id: string, handler?: () => void) =>
    handler ? () => handler() : undefined;

  const menus: MenuBarMenuConfig[] = [
    {
      id: 'app',
      title: appName,
      emphasized: true,
      entries: createAppMenu(appName, platform, {
        onAbout: withHandler('about', handlers.about),
        onSettings: withHandler('settings', handlers.settings),
        onQuit: withHandler('quit', handlers.quit),
      }),
    },
    {
      id: 'file',
      title: 'File',
      entries: createFileMenu(context, {
        onNew: withHandler('new', handlers.new),
        onOpen: withHandler('open', handlers.open),
        onClose: withHandler('close', handlers.close),
        onSave: withHandler('save', handlers.save),
      }, recentDocuments),
    },
    {
      id: 'edit',
      title: 'Edit',
      entries: createEditMenu(context, {
        onUndo: withHandler('undo', handlers.undo),
        onRedo: withHandler('redo', handlers.redo),
        onCut: withHandler('cut', handlers.cut),
        onCopy: withHandler('copy', handlers.copy),
        onPaste: withHandler('paste', handlers.paste),
        onDelete: withHandler('delete', handlers.delete),
        onSelectAll: withHandler('selectAll', handlers.selectAll),
      }),
    },
    {
      id: 'format',
      title: 'Format',
      entries: createFormatMenu(),
    },
    {
      id: 'view',
      title: 'View',
      entries: createViewMenu(context, {
        onToggleToolbar: withHandler('toggleToolbar', handlers.toggleToolbar),
        onToggleSidebar: withHandler('toggleSidebar', handlers.toggleSidebar),
        onToggleFullScreen: withHandler('toggleFullScreen', handlers.toggleFullScreen),
      }),
    },
    ...appSpecificMenus,
    {
      id: 'window',
      title: 'Window',
      entries: createWindowMenu(context, openWindows, {
        onMinimize: withHandler('minimize', handlers.minimize),
        onZoom: withHandler('zoom', handlers.zoom),
        onToggleFullScreen: withHandler('toggleFullScreen', handlers.toggleFullScreen),
      }),
    },
    {
      id: 'help',
      title: 'Help',
      entries: createHelpMenu(appName, {
        onHelp: withHandler('help', handlers.help),
        onFeedback: withHandler('feedback', handlers.feedback),
      }),
    },
  ];

  validateMenuBarOrder(menus);
  return menus;
}

export function createAppleMenuStub(): MenuEntry[] {
  return [
    { id: 'about-mac', label: 'About This Mac', disabled: true },
    { type: 'separator' },
    { id: 'system-settings', label: 'System Settings…', disabled: true },
    { id: 'app-store', label: 'App Store', disabled: true },
    { type: 'separator' },
    { id: 'recent-items', label: 'Recent Items', disabled: true },
    { type: 'separator' },
    { id: 'force-quit', label: 'Force Quit…', shortcut: '⌥⌘⎋', disabled: true },
    { id: 'sleep', label: 'Sleep', disabled: true },
    { id: 'restart', label: 'Restart…', disabled: true },
    { id: 'shut-down', label: 'Shut Down…', disabled: true },
  ];
}

export function resolveMenuBarAlignment(platform: MenuBarPlatform): 'start' | 'center' {
  return platform === 'ipados' ? 'center' : 'start';
}
