# EditMenu

Category: Navigation

## Props
- `context` (EditMenuContext)
- `customActions` (EditMenuItemConfig[]) — Custom commands listed near related system-provided ones.
- `dimBackground` (boolean)
- `includeStandardActions` (boolean) — Include standard Cut, Copy, Paste, etc. Defaults to true.
- `inputMode` (EditMenuInputMode)
- `longPress` (boolean) — Touch-and-hold / long-press to reveal compact edit menu.
- `onAction` ((actionId: string) => void)
- `onOpenChange` ((open: boolean) => void)
- `onStandardAction` ((actionId: StandardEditActionId) => void)
- `open` (boolean)
- `placement` ('above' | 'below' | 'auto')
- `variant` (EditMenuVariant)

Metadata: /components/edit-menu.json
