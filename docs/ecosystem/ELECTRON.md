# Electron Integration

`@larose-ui/electron` is a thin host adapter over `@larose-ui/desktop-core` and `@larose-ui/runtime`. It does not duplicate React components.

## Install

```bash
pnpm add @larose-ui/electron @larose-ui/react @larose-ui/runtime electron
```

## Renderer bootstrap

```tsx
// main.tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
import { LaRoseElectronRoot } from '@larose-ui/electron/client';

createRoot(document.getElementById('root')!).render(
  <LaRoseElectronRoot theme="system" locale="en">
    <App />
  </LaRoseElectronRoot>,
);
```

## Preload / early registration

For menu registration before React hydrates, call in preload or the HTML shell:

```ts
import { bootstrapLaRoseElectron } from '@larose-ui/electron';

bootstrapLaRoseElectron();
```

## Application menu

```ts
import { Menu } from 'electron';
import { buildElectronMenuFromMenuBar, STANDARD_ACCELERATORS } from '@larose-ui/electron';

const template = buildElectronMenuFromMenuBar([
  {
    id: 'file',
    title: 'File',
    entries: [
      { id: 'new', label: 'New', accelerator: STANDARD_ACCELERATORS.new, onSelect: () => createDoc() },
      { id: 'save', label: 'Save', accelerator: STANDARD_ACCELERATORS.save, onSelect: () => saveDoc() },
    ],
  },
]);

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

`onSelect` handlers from laRose menu entries are preserved on native `click` callbacks.

## Frameless window chrome

```ts
import { applyWindowChromeTokens, WINDOW_CHROME_STYLES } from '@larose-ui/desktop-core';

bootstrapLaRoseElectron({
  windowChrome: { titlebarHeight: 32, trafficLightInset: 14 },
});
```

Add drag regions in your shell:

```html
<div class="larose-titlebar-drag">
  <span class="larose-titlebar-no-drag">Toolbar buttons here</span>
</div>
```

See [DESKTOP.md](./DESKTOP.md) for the shared desktop model.
