import type { MenuEntry } from '../Menu/types';
import type { MenuBarDocumentContext, MenuBarPlatform } from './types';
import { STANDARD_SHORTCUTS } from '@larose-ui/core';

export { STANDARD_SHORTCUTS };

export function createAppMenu(
  appName: string,
  platform: MenuBarPlatform,
  handlers: {
    onAbout?: () => void;
    onSettings?: () => void;
    onQuit?: () => void;
  },
): MenuEntry[] {
  const entries: MenuEntry[] = [
    { id: 'about', label: `About ${appName}`, onSelect: handlers.onAbout },
    { type: 'separator' },
    { id: 'settings', label: 'Settings…', shortcut: STANDARD_SHORTCUTS.settings, onSelect: handlers.onSettings },
  ];

  if (platform === 'macos') {
    entries.push(
      { type: 'separator' },
      { id: 'services', label: 'Services', disabled: true },
      { type: 'separator' },
      { id: 'hide', label: `Hide ${appName}`, shortcut: '⌘H', disabled: true },
      { id: 'hide-others', label: 'Hide Others', shortcut: '⌥⌘H', disabled: true },
      { id: 'show-all', label: 'Show All', disabled: true },
    );
  }

  entries.push(
    { type: 'separator' },
    {
      id: 'quit',
      label: `Quit ${appName}`,
      shortcut: STANDARD_SHORTCUTS.quit,
      alternateLabel: 'Quit and Keep Windows',
      onSelect: handlers.onQuit,
    },
  );

  return entries;
}

export function createFileMenu(
  context: MenuBarDocumentContext,
  handlers: {
    onNew?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    onSave?: () => void;
  },
  recentDocuments: string[] = [],
): MenuEntry[] {
  const open = context.isDocumentOpen ?? false;
  const dirty = context.isDirty ?? false;
  const hasTabs = context.hasTabs ?? false;

  const recentSubmenu: MenuEntry = {
    type: 'submenu',
    id: 'open-recent',
    label: 'Open Recent',
    items: [
      ...recentDocuments.slice(0, 10).map((name, index) => ({
        id: `recent-${index}`,
        label: name,
      })),
      { id: 'clear-recent', label: 'Clear Menu', disabled: true },
    ],
  };

  const recentItems: MenuEntry[] =
    recentDocuments.length > 0
      ? [recentSubmenu]
      : [{ id: 'open-recent', label: 'Open Recent', disabled: true }];

  return [
    { id: 'new', label: 'New', shortcut: STANDARD_SHORTCUTS.new, onSelect: handlers.onNew },
    { id: 'open', label: 'Open…', shortcut: STANDARD_SHORTCUTS.open, onSelect: handlers.onOpen },
    ...recentItems,
    { type: 'separator' },
    {
      id: 'close',
      label: hasTabs ? 'Close Tab' : 'Close',
      shortcut: STANDARD_SHORTCUTS.close,
      alternateLabel: hasTabs ? 'Close Other Tabs' : 'Close All',
      disabled: !open,
      onSelect: handlers.onClose,
    },
    ...(hasTabs
      ? [{ id: 'close-window', label: 'Close Window', shortcut: '⇧⌘W', disabled: !open }]
      : []),
    { type: 'separator' },
    {
      id: 'save',
      label: 'Save',
      shortcut: STANDARD_SHORTCUTS.save,
      disabled: !open || !dirty,
      onSelect: handlers.onSave,
    },
    { id: 'save-all', label: 'Save All', shortcut: STANDARD_SHORTCUTS.saveAll, disabled: !dirty },
    {
      id: 'duplicate',
      label: 'Duplicate',
      alternateLabel: 'Save As…',
      disabled: !open,
    },
    { type: 'separator' },
    { id: 'page-setup', label: 'Page Setup…', disabled: !open },
    { id: 'print', label: 'Print…', shortcut: '⌘P', disabled: !open },
  ];
}

export function createEditMenu(
  context: MenuBarDocumentContext,
  handlers: {
    onUndo?: () => void;
    onRedo?: () => void;
    onCut?: () => void;
    onCopy?: () => void;
    onPaste?: () => void;
    onDelete?: () => void;
    onSelectAll?: () => void;
  },
): MenuEntry[] {
  const canUndo = context.canUndo ?? false;
  const canRedo = context.canRedo ?? false;
  const hasSelection = context.hasSelection ?? false;
  const canPaste = context.canPaste ?? false;

  return [
    {
      id: 'undo',
      label: context.undoLabel ?? 'Undo',
      shortcut: STANDARD_SHORTCUTS.undo,
      disabled: !canUndo,
      onSelect: handlers.onUndo,
    },
    {
      id: 'redo',
      label: context.redoLabel ?? 'Redo',
      shortcut: STANDARD_SHORTCUTS.redo,
      disabled: !canRedo,
      onSelect: handlers.onRedo,
    },
    { type: 'separator' },
    {
      id: 'cut',
      label: 'Cut',
      shortcut: STANDARD_SHORTCUTS.cut,
      disabled: !hasSelection,
      onSelect: handlers.onCut,
    },
    {
      id: 'copy',
      label: 'Copy',
      shortcut: STANDARD_SHORTCUTS.copy,
      disabled: !hasSelection,
      onSelect: handlers.onCopy,
    },
    {
      id: 'paste',
      label: 'Paste',
      shortcut: STANDARD_SHORTCUTS.paste,
      disabled: !canPaste,
      onSelect: handlers.onPaste,
    },
    { id: 'paste-match-style', label: 'Paste and Match Style', shortcut: '⌥⇧⌘V', disabled: !canPaste },
    {
      id: 'delete',
      label: 'Delete',
      disabled: !hasSelection,
      onSelect: handlers.onDelete,
    },
    { type: 'separator' },
    {
      id: 'select-all',
      label: 'Select All',
      shortcut: STANDARD_SHORTCUTS.selectAll,
      onSelect: handlers.onSelectAll,
    },
    {
      type: 'submenu',
      id: 'find',
      label: 'Find',
      items: [
        { id: 'find-panel', label: 'Find…', shortcut: STANDARD_SHORTCUTS.find },
        { id: 'find-next', label: 'Find Next', shortcut: '⌘G' },
        { id: 'find-previous', label: 'Find Previous', shortcut: '⇧⌘G' },
      ],
    },
    {
      type: 'submenu',
      id: 'spelling',
      label: 'Spelling and Grammar',
      items: [
        { id: 'show-spelling', label: 'Show Spelling and Grammar', shortcut: '⌘:' },
        { id: 'check-document', label: 'Check Document Now', shortcut: '⌘;' },
      ],
    },
    {
      type: 'submenu',
      id: 'substitutions',
      label: 'Substitutions',
      disabled: true,
      items: [{ id: 'smart-quotes', label: 'Smart Quotes', selected: true }],
    },
    {
      type: 'submenu',
      id: 'transformations',
      label: 'Transformations',
      items: [
        { id: 'uppercase', label: 'Make Uppercase' },
        { id: 'lowercase', label: 'Make Lowercase' },
        { id: 'capitalize', label: 'Capitalize' },
      ],
    },
    {
      type: 'submenu',
      id: 'speech',
      label: 'Speech',
      items: [
        { id: 'start-speaking', label: 'Start Speaking' },
        { id: 'stop-speaking', label: 'Stop Speaking', disabled: true },
      ],
    },
    { type: 'separator' },
    { id: 'start-dictation', label: 'Start Dictation', shortcut: 'fn fn', disabled: true },
    { id: 'emoji-symbols', label: 'Emoji & Symbols', shortcut: '⌃⌘Space', disabled: true },
  ];
}

export function createFormatMenu(): MenuEntry[] {
  return [
    {
      type: 'submenu',
      id: 'font',
      label: 'Font',
      items: [
        { id: 'show-fonts', label: 'Show Fonts', shortcut: '⌘T' },
        { id: 'bold', label: 'Bold', shortcut: '⌘B' },
        { id: 'italic', label: 'Italic', shortcut: '⌘I' },
        { id: 'underline', label: 'Underline', shortcut: '⌘U' },
        { id: 'bigger', label: 'Bigger', shortcut: '⌘+' },
        { id: 'smaller', label: 'Smaller', shortcut: '⌘-' },
      ],
    },
    {
      type: 'submenu',
      id: 'text',
      label: 'Text',
      items: [
        { id: 'align-left', label: 'Align Left', shortcut: '⌘{' },
        { id: 'align-center', label: 'Align Center', shortcut: '⌘|' },
        { id: 'align-right', label: 'Align Right', shortcut: '⌘}' },
        { id: 'justify', label: 'Justify' },
        { id: 'show-ruler', label: 'Show Ruler', shortcut: '⌘R' },
      ],
    },
  ];
}

export function createViewMenu(
  context: MenuBarDocumentContext,
  handlers: {
    onToggleToolbar?: () => void;
    onToggleSidebar?: () => void;
    onToggleFullScreen?: () => void;
  },
): MenuEntry[] {
  const toolbarVisible = context.toolbarVisible ?? true;
  const sidebarVisible = context.sidebarVisible ?? true;
  const isFullScreen = context.isFullScreen ?? false;
  const hasTabs = context.hasTabs ?? false;

  const entries: MenuEntry[] = [];

  if (hasTabs) {
    entries.push(
      { id: 'toggle-tab-bar', label: 'Show Tab Bar', selected: true },
      { id: 'tab-overview', label: 'Show All Tabs', shortcut: '⇧⌘\\' },
      { type: 'separator' },
    );
  }

  entries.push(
    {
      id: 'toggle-toolbar',
      label: toolbarVisible ? 'Hide Toolbar' : 'Show Toolbar',
      shortcut: '⌥⌘T',
      onSelect: handlers.onToggleToolbar,
    },
    { id: 'customize-toolbar', label: 'Customize Toolbar…', disabled: !toolbarVisible },
    {
      id: 'toggle-sidebar',
      label: sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar',
      shortcut: '⌃⌘S',
      onSelect: handlers.onToggleSidebar,
    },
    { type: 'separator' },
    {
      id: 'toggle-fullscreen',
      label: isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen',
      shortcut: '⌃⌘F',
      onSelect: handlers.onToggleFullScreen,
    },
  );

  return entries;
}

export function createWindowMenu(
  context: MenuBarDocumentContext,
  openWindows: string[],
  handlers: {
    onMinimize?: () => void;
    onZoom?: () => void;
    onToggleFullScreen?: () => void;
  },
): MenuEntry[] {
  const hasTabs = context.hasTabs ?? false;

  const entries: MenuEntry[] = [
    {
      id: 'minimize',
      label: 'Minimize',
      shortcut: STANDARD_SHORTCUTS.minimize,
      alternateLabel: 'Minimize All',
      onSelect: handlers.onMinimize,
    },
    {
      id: 'zoom',
      label: 'Zoom',
      alternateLabel: 'Zoom All',
      onSelect: handlers.onZoom,
    },
  ];

  if (hasTabs) {
    entries.push(
      { type: 'separator' },
      { id: 'prev-tab', label: 'Show Previous Tab', shortcut: '⇧⌘{' },
      { id: 'next-tab', label: 'Show Next Tab', shortcut: '⇧⌘}' },
      { id: 'move-tab', label: 'Move Tab to New Window' },
      { id: 'merge-windows', label: 'Merge All Windows' },
    );
  }

  entries.push(
    { type: 'separator' },
    {
      id: 'bring-front',
      label: 'Bring All to Front',
      alternateLabel: 'Arrange in Front',
    },
  );

  if (openWindows.length > 0) {
    entries.push({ type: 'separator' });
    entries.push(
      ...[...openWindows].sort((a, b) => a.localeCompare(b)).map((title, index) => ({
        id: `window-${index}`,
        label: title,
      })),
    );
  }

  return entries;
}

export function createHelpMenu(
  appName: string,
  handlers: {
    onHelp?: () => void;
    onFeedback?: () => void;
  },
): MenuEntry[] {
  return [
    {
      id: 'feedback',
      label: `Send ${appName} Feedback to Apple`,
      onSelect: handlers.onFeedback,
    },
    {
      id: 'help',
      label: `${appName} Help`,
      shortcut: STANDARD_SHORTCUTS.help,
      onSelect: handlers.onHelp,
    },
  ];
}
