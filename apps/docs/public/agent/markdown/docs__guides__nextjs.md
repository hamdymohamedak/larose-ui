# Next.js

# Next.js Integration

laRose UI ships as React components with shared CSS. `@larose-ui/next` is a thin integration layer — it does not duplicate components.

## Install

```bash
pnpm add @larose-ui/next @larose-ui/react @larose-ui/runtime-react @larose-ui/tokens
```

## App Router (recommended)

### 1. Root layout — CSS (Server Component)

```tsx
// app/layout.tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';
import { LaRoseThemeScript } from '@larose-ui/next/client';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LaRoseThemeScript appearance="system" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Use `suppressHydrationWarning` on `<html>` when using system appearance — the pre-hydration script may set `data-lr-theme` before React mounts.

### 2. Providers — client boundary

```tsx
// app/providers.tsx
'use client';

import { LaRoseRoot } from '@larose-ui/next/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LaRoseRoot locale="en" permissions={['app.read']} appearance="system">
      {children}
    </LaRoseRoot>
  );
}
```

`LaRoseRoot` wraps `@larose-ui/runtime-react` `LaRoseProvider` (theme, i18n, permissions, network, offline, accelerators).

For theme/motion-only apps without the runtime stack:

```tsx
import { LaRoseRootLight } from '@larose-ui/next/client';

<LaRoseRootLight theme="light">{children}</LaRoseRootLight>
```

### 3. Interactive components

Import laRose components in Client Components:

```tsx
'use client';

import { Button, Dialog } from '@larose-ui/react';
```

Server Components can render static markup, but interactive laRose components require `'use client'`.

## Pages Router

```tsx
// pages/_app.tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';
import type { AppProps } from 'next/app';
import { LaRoseRoot } from '@larose-ui/next/client';
import { LaRoseThemeScript } from '@larose-ui/next/client';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <LaRoseThemeScript />
      <LaRoseRoot>
        <Component {...pageProps} />
      </LaRoseRoot>
    </>
  );
}
```

## CSS paths

Server-safe constants are exported from `@larose-ui/next`:

```ts
import { LAROSE_CSS_IMPORTS_REACT } from '@larose-ui/next';
// ['@larose-ui/tokens/styles.css', '@larose-ui/react/styles.css']
```

Preferred import order:

1. `@larose-ui/tokens/styles.css`
2. `@larose-ui/styles/styles.css` or `@larose-ui/react/styles.css` (backward compatible bundle)

## Custom theme script (SSR frameworks)

For non-Next setups, use the script builder directly:

```ts
import { createLaRoseThemeScriptContent } from '@larose-ui/next';

const inline = createLaRoseThemeScriptContent({ appearance: 'system' });
// inject into <script dangerouslySetInnerHTML={{ __html: inline }} />
```

## RSC boundaries

| Import | Server | Client |
|--------|--------|--------|
| `@larose-ui/next` | ✓ | ✓ |
| `@larose-ui/next/client` | ✗ | ✓ |
| `@larose-ui/react` interactive components | ✗ | ✓ |
| CSS side-effect imports | ✓ (layout) | ✓ |

## Transpilation

Ensure `next.config` transpiles laRose workspace packages when linking locally:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@larose-ui/react', '@larose-ui/runtime-react', '@larose-ui/next'],
};

export default nextConfig;
```
