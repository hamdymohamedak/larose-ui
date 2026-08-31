# Keyboard Accelerators

laRose UI treats keyboard shortcuts as a **platform capability**, not a menu-only feature. Accelerators are machine-readable definitions that drive behavior; display labels are derived separately.

## Concepts

| Property | Purpose |
|----------|---------|
| `accelerator` | Machine-readable chord that triggers an action |
| `shortcut` | Optional display override shown in the menu row |

```tsx
<MenuItem
  label="Save"
  accelerator={{ mod: true, key: 's' }}
  shortcut="Save"           // optional display override
  onSelect={save}
/>
```

When `shortcut` is omitted, laRose formats the accelerator for the current platform:

- macOS → `⌘S`
- Windows/Linux → `Ctrl+S`

Existing `shortcut?: string` usage continues to work. Parseable strings like `⌘C` also activate items when a menu is open.

## Architecture

```
@larose-ui/core
  Accelerator types, parse, match, format, registry
        ↓
@larose-ui/react
  AcceleratorProvider, useAccelerator, Menu integration
        ↓
Menu / MenuBar / CommandPalette / global app actions
```

`LaRoseProvider` includes `AcceleratorProvider` automatically.

## Core API (`@larose-ui/core`)

```ts
import {
  type Accelerator,
  parseAccelerator,
  matchKeyboardEvent,
  formatAccelerator,
  formatAriaKeyshortcuts,
  STANDARD_ACCELERATORS,
  STANDARD_SHORTCUTS,
} from '@larose-ui/core';
```

### Accelerator shape

```ts
interface Accelerator {
  mod?: boolean;    // ⌘ on macOS, Ctrl on Windows/Linux
  ctrl?: boolean;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
  key: string;
}
```

## React API

```tsx
import {
  useAccelerator,
  resolveMenuShortcut,
  STANDARD_ACCELERATORS,
} from '@larose-ui/react';

// Global shortcut
useAccelerator(STANDARD_ACCELERATORS.commandPalette, () => setOpen(true), {
  allowInEditable: true,
});

// Menu item
{
  id: 'save',
  label: 'Save',
  accelerator: STANDARD_ACCELERATORS.save,
  onSelect: save,
}
```

## Menu-local shortcuts

When a menu is open, registered accelerators on visible, enabled items fire through the existing `onSelect` path. Submenu items match only when their submenu is active. Escape still closes the menu.

## Input protection

By default, menu-local shortcuts do not fire when focus is in `input`, `textarea`, `select`, or `[contenteditable]`. Global shortcuts may opt in with `allowInEditable: true` (command palette ⌘K).

## Scope and priority

1. Active menu (highest)
2. Component scope
3. Global scope

Conflicts within the same scope log a development warning.

## Accessibility

Menu items expose `aria-keyshortcuts` using W3C syntax (`Meta+S`), not visual symbols (`⌘S`).

## Customization

Menu shortcut presentation tokens:

- `--lr-menu-shortcut-color`
- `--lr-menu-shortcut-font-size`
- `--lr-menu-shortcut-spacing`

Pass `platform` to `formatAccelerator` or `resolveMenuShortcut` for explicit formatting.

## Standard shortcuts

`STANDARD_ACCELERATORS` provides machine-readable HIG shortcuts. `STANDARD_SHORTCUTS` preserves macOS display strings for backward compatibility.

## MenuBar global shortcuts

`MenuBar` automatically registers top-level item accelerators via `useMenuBarAccelerators`. ⌘S / Ctrl+S fires Save even when the File menu is closed. Submenu-only items remain menu-local.

```tsx
<MenuBar enableGlobalShortcuts appName="App" standardOptions={...} />
```

## Type-ahead

While a menu is open, typing letters jumps to matching items (prefix match, repeated key cycles). Press Enter to activate the highlighted row.

```tsx
<Menu enableTypeAhead entries={...} />
```

## Mnemonics

Windows/Linux: Alt reveals underlined access keys; Alt+letter opens menu bar menus or activates items.

```tsx
{ id: 'save', label: 'Save &As…', mnemonic: 'a' }  // optional explicit key
{ id: 'file', title: '&File' }                     // menu bar menu
```

macOS: Alt/Option continues to swap alternate labels (`alternateLabel` / `alternateShortcut`).

Disable with `enableMnemonics={false}` on `MenuBar` or `Menu`.

## Alternate shortcuts (MenuBar)

When Option (Alt) is held, `alternateAccelerator` / `alternateShortcut` replace the primary binding and label.
