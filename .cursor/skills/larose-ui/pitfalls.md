# laRose pitfalls (agents must avoid)

## 1. Invalid hook call / `useMemo` of null

**Symptom:** Console: Invalid hook call; `Cannot read properties of null (reading 'useMemo')` inside `LaRoseProvider`.

**Cause:** Two React copies (e.g. app React 18 + parent monorepo React 19 via Vite hoisting). Vite may also embed React inside an optimized `@larose-ui/*` chunk.

**Fix:**

```ts
// vite.config.ts
resolve: {
  dedupe: ['react', 'react-dom'],
  alias: {
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
  },
},
optimizeDeps: {
  include: ['react', 'react-dom', '@larose-ui/react', '@larose-ui/runtime-react'],
},
```

Delete `node_modules/.vite` and restart. Verify with `npm ls react` — one version only.

## 2. Missing or double CSS

- Always import styles once in the app entry.
- React: `@larose-ui/react/styles.css`
- Vue/Svelte: `@larose-ui/styles/styles.css`
- Do not also import `@larose-ui/tokens` CSS.
- Published JS entry must **not** be relied on for CSS injection; explicit import is required.

## 3. Wrong provider import

```ts
// ❌
import { LaRoseProvider } from '@larose-ui/react';

// ✅
import { LaRoseProvider } from '@larose-ui/runtime-react';
```

## 4. SecureField controlled `value`

`SecureField` warns in dev when `value` is non-empty (Apple HIG — never prepopulate passwords). For controlled login/reset forms use `Input type="password"` (optionally with a visibility toggle). Use `SecureField` uncontrolled (name + form submit) when possible.

## 5. Dual toast systems

If the app already uses `react-hot-toast` (or similar), set `enableToasts={false}` on `LaRoseProvider`. Otherwise use `@larose-ui/runtime-react/toast`.

## 6. Theme double sources

laRose applies `--lr-*` on the provider DOM node (`data-lr-provider`). App themes using `data-theme` on `<html>` are separate. Bridge app dark mode into `theme={isDark ? 'dark' : 'light'}` on `LaRoseProvider`.

## 7. Variant / tone naming

| App habit | laRose |
|-----------|--------|
| Button `danger` | `destructive` |
| Badge `danger` | `error` |
| Badge `neutral` | `default` |

## 8. Linking the git clone into an app

Prefer npm. `file:` / workspace links often reintroduce duplicate React. Keep `larose-ui/` clone for contribution; gitignore it inside consumer apps if nested.

## 9. Importing internal packages

Never `import … from '@larose-ui/core'` (etc.) in product apps — breaks the public API contract and may pull unstable surfaces.
