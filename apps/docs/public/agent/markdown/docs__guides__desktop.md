# Desktop integration

# Desktop Host Integration

laRose treats **Electron** and **Tauri** as host adapters — not separate UI libraries. Shared components, styles, tokens, and runtime remain in the framework packages (`@larose-ui/react`, `@larose-ui/vue`, etc.).

## Architecture

```text
@larose-ui/core (accelerators, STANDARD_ACCELERATORS)
        ↓
@larose-ui/runtime-core (host detection, capabilities)
        ↓
@larose-ui/desktop-core (native menus, window chrome)
        ↓
@larose-ui/electron  |  @larose-ui/tauri
```

## Host registration

Desktop hosts must register before laRose runtime boot:

```ts
import { registerHost } from '@larose-ui/desktop-core';

registerHost('electron'); // or 'tauri'
```

Or use the bootstrap helpers:

```ts
import { bootstrapLaRoseElectron } from '@larose-ui/electron';
bootstrapLaRoseElectron({ windowChrome: { titlebarHeight: 32 } });
```

The runtime reads `globalThis.__LAROSE_HOST__` and exposes desktop capabilities (`nativeMenus`, `globalShortcuts`, `windowControls`, `vibrancy`).

## React (Electron)

```tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import { LaRoseElectronRoot } from '@larose-ui/electron/client';
import { Button } from '@larose-ui/react';

export function App() {
  return (
    <LaRoseElectronRoot theme="system" locale="en">
      <Button variant="primary">Save</Button>
    </LaRoseElectronRoot>
  );
}
```

## Native menus

Map laRose menu entries to native templates without duplicating behavior:

```ts
import { buildElectronMenuFromMenuBar, STANDARD_ACCELERATORS } from '@larose-ui/electron';

const template = buildElectronMenuFromMenuBar([
  {
    id: 'file',
    title: 'File',
    entries: [
      { id: 'save', label: 'Save', accelerator: STANDARD_ACCELERATORS.save },
      { id: 'quit', label: 'Quit', accelerator: STANDARD_ACCELERATORS.quit },
    ],
  },
]);

// Pass template to Electron Menu.buildFromTemplate(template)
```

Tauri uses the same menu config via `@larose-ui/tauri`:

```ts
import { buildTauriMenuFromMenuBar } from '@larose-ui/tauri';
```

## Window chrome

Optional CSS variables for custom titlebars (traffic lights, drag regions):

```ts
import { applyWindowChromeTokens, WINDOW_CHROME_STYLES } from '@larose-ui/desktop-core';

applyWindowChromeTokens({ titlebarHeight: 32, trafficLightInset: 16 });
// Inject WINDOW_CHROME_STYLES in your shell CSS
```

Use `.larose-titlebar-drag` / `.larose-titlebar-no-drag` classes in your frameless window layout.

## Accelerators

Behavior uses machine-readable `STANDARD_ACCELERATORS` from `@larose-ui/core`. Native hosts convert via:

| Host | Function |
|------|----------|
| Electron | `acceleratorToElectron()` → `CmdOrCtrl+S` |
| Tauri | `acceleratorToTauri()` → `CommandOrControl+S` |

Web apps should not assume browser shortcuts can always override native menus.

See also [ELECTRON.md](./ELECTRON.md) and [TAURI.md](./TAURI.md).
