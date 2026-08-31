# Tauri Integration

`@larose-ui/tauri` is a thin host adapter over `@larose-ui/desktop-core` and `@larose-ui/runtime`.

## Install

```bash
pnpm add @larose-ui/tauri @larose-ui/react @larose-ui/runtime
```

Optional peer for native menu APIs:

```bash
pnpm add @tauri-apps/api
```

## Webview bootstrap

```tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import { LaRoseTauriRoot } from '@larose-ui/tauri/client';

createRoot(document.getElementById('root')!).render(
  <LaRoseTauriRoot theme="system" locale="en">
    <App />
  </LaRoseTauriRoot>,
);
```

## Host registration

```ts
import { bootstrapLaRoseTauri } from '@larose-ui/tauri';

bootstrapLaRoseTauri({ windowChrome: { titlebarHeight: 30 } });
```

## Native menu

```ts
import { buildTauriMenuFromMenuBar, STANDARD_ACCELERATORS } from '@larose-ui/tauri';

const items = buildTauriMenuFromMenuBar([
  {
    id: 'file',
    title: 'File',
    entries: [
      { id: 'save', label: 'Save', accelerator: STANDARD_ACCELERATORS.save, onSelect: save },
    ],
  },
]);

// Pass items to Tauri Menu APIs (@tauri-apps/api/menu)
```

## Global shortcuts

Convert laRose accelerators for Tauri global shortcuts:

```ts
import { acceleratorToTauri, STANDARD_ACCELERATORS } from '@larose-ui/tauri';

const shortcut = acceleratorToTauri(STANDARD_ACCELERATORS.commandPalette);
// "CommandOrControl+K" on Windows/Linux
```

See [DESKTOP.md](./DESKTOP.md) for shared desktop architecture.
