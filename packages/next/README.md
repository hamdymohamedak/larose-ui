# @larose-ui/next

Thin Next.js / SSR integration for laRose UI. Components live in `@larose-ui/react` and `@larose-ui/runtime-react`.

## Exports

| Entry | Use |
|-------|-----|
| `@larose-ui/next` | Server-safe: CSS path constants, theme script builder |
| `@larose-ui/next/client` | Client: `LaRoseRoot`, `LaRoseRootLight`, `LaRoseThemeScript` |

## Quick start

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
        <LaRoseThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// app/providers.tsx
'use client';
import { LaRoseRoot } from '@larose-ui/next/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return <LaRoseRoot>{children}</LaRoseRoot>;
}
```

See [docs/ecosystem/NEXTJS.md](../../docs/ecosystem/NEXTJS.md) and [TANSTACK_START.md](../../docs/ecosystem/TANSTACK_START.md).
