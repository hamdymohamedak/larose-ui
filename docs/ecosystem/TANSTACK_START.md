# TanStack Start Integration

TanStack Start uses Vite + React SSR. laRose does **not** ship a separate component library for Start — use the same packages as React:

```text
@larose-ui/core
@larose-ui/tokens
@larose-ui/styles
@larose-ui/primitives
@larose-ui/react
@larose-ui/runtime-react
@larose-ui/runtime-core
@larose-ui/next   ← theme script + CSS path helpers only
```

## Install

```bash
pnpm add @larose-ui/react @larose-ui/runtime-react @larose-ui/tokens @larose-ui/next
```

## CSS

Import shared styles once in your root route or client entry:

```tsx
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';
```

For Vite-based apps, CSS imports in the root `__root.tsx` (or equivalent) are bundled automatically.

## Provider placement

Create a client providers module and wrap your router outlet:

```tsx
// app/providers/LaRoseProviders.tsx
'use client';

import { LaRoseRoot } from '@larose-ui/next/client';

export function LaRoseProviders({ children }: { children: React.ReactNode }) {
  return (
    <LaRoseRoot locale="en" appearance="system">
      {children}
    </LaRoseRoot>
  );
}
```

```tsx
// app/routes/__root.tsx
import { LaRoseProviders } from '../providers/LaRoseProviders';
import { createLaRoseThemeScriptContent } from '@larose-ui/next';
import { Outlet, Scripts, HeadContent } from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    scripts: [
      {
        children: createLaRoseThemeScriptContent({ appearance: 'system' }),
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <LaRoseProviders>
          <Outlet />
        </LaRoseProviders>
        <Scripts />
      </body>
    </html>
  ),
});
```

Adjust `head`/`scripts` API to match your TanStack Start version — the goal is running `createLaRoseThemeScriptContent` **before** client hydration.

## SSR and hydration

1. **Theme flash** — inject the laRose theme script in document `<head>` via `createLaRoseThemeScriptContent`.
2. **Provider once** — mount `LaRoseRoot` at the root route, not per-page.
3. **Client-only widgets** — Dialog, Menu, CommandPalette, and other interactive components must render under a client boundary (`'use client'` or TanStack Start client route modules).
4. **Runtime state** — `@larose-ui/runtime-core` store is framework-agnostic; `@larose-ui/runtime-react` binds it to React via `useSyncExternalStore`.

## Runtime initialization

Pass tenant, locale, and permissions to `LaRoseRoot` on the server when data is available:

```tsx
<LaRoseRoot
  locale={loaderData.locale}
  tenantId={loaderData.tenantId}
  permissions={loaderData.permissions}
  session={loaderData.session}
>
  {children}
</LaRoseRoot>
```

Loader data can come from TanStack Start route loaders; keep permission enforcement on the server — client permissions are UX gates only.

## Accelerators and menus

`LaRoseRoot` includes `AcceleratorProvider`. MenuBar global shortcuts work without extra wiring.

For SSR routes that never render menus on the server, no special handling is required — keyboard handlers attach on the client.

## DevTools and Doctor

- Run `larose doctor` in CI against the same monorepo or app root.
- Configure framework paths in `larose.config.json` if component roots differ from defaults.
- DevTools (`@larose-ui/devtools-react`) mount as a client-only panel inside `LaRoseRoot`.

## Comparison with Next.js

| Concern | Next.js | TanStack Start |
|---------|---------|----------------|
| CSS | `app/layout.tsx` imports | Root route / Vite entry imports |
| Theme script | `LaRoseThemeScript` (`next/script`) | `createLaRoseThemeScriptContent` in route `head` |
| Providers | `app/providers.tsx` | Root route wrapper |
| Client boundary | `'use client'` directive | Client route modules / `'use client'` |

See also [NEXTJS.md](./NEXTJS.md) for shared concepts (CSS order, RSC boundaries, runtime vs light provider).
