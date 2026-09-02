# DockMenu

Category: Navigation

## Props
- `appName` (string)
- `closedEntries` (ContextMenuEntry[]) — Actions when the app is not running (e.g. Open).
- `icon` (ReactNode)
- `isRunning` (boolean) — Whether the app is currently running (shows window list + running actions).
- `onEntrySelect` ((entry: ContextMenuItemConfig) => void)
- `onOpenChange` ((open: boolean) => void)
- `onWindowSelect` ((window: DockWindow) => void)
- `open` (boolean)
- `openWindows` (DockWindow[])
- `runningEntries` (ContextMenuEntry[]) — High-value actions when the app is running (e.g. New Window, Get New Mail).

Metadata: /components/dock-menu.json
