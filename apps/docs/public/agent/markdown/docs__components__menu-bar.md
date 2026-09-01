# MenuBar

Category: Navigation

## Props
- `appName` (string)
- `appSpecificMenus` (MenuBarMenuConfig[])
- `enableGlobalShortcuts` (boolean) — Register top-level menu accelerators globally. Defaults to true.
- `enableMnemonics` (boolean) — Enable Alt+key mnemonics on Windows/Linux. Defaults to true on non-macOS.
- `enableTypeAhead` (boolean) — Enable type-ahead letter matching in open menus. Defaults to true.
- `extras` (MenuBarExtraConfig[])
- `menus` (MenuBarMenuConfig[])
- `onMenuAction` ((menuId: string, entryId: string) => void)
- `onRevealChange` ((revealed: boolean) => void)
- `platform` (MenuBarPlatform)
- `revealed` (boolean) — iPadOS: bar hidden until revealed at the top edge.
- `showAppleMenu` (boolean) — macOS: show a read-only Apple menu stub (system-provided on real macOS).
- `standardOptions` (StandardMenuBarOptions) — Used when `menus` is omitted to build the standard HIG menu set.

Metadata: /components/menu-bar.json
