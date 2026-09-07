# @larose-ui/tokens

> **Internal package** — Design-token engine and CSS variables — bundled into @larose-ui/styles; use directly only for advanced JS theming.

Published only so other `@larose-ui/*` packages can depend on it.
**Do not install this in app code** — start from the public UI + runtime packages instead.

## Use this instead

```bash
pnpm add @larose-ui/runtime-react @larose-ui/react
```

Then import styles once: `@larose-ui/react/styles.css`.

Full guides: [laRose UI Docs](https://hamdymohamedak.github.io/larose-ui/) · [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)

## When this package is appropriate

- You are extending laRose itself (adapters, CLI, custom bindings)
- You need a low-level primitive that is not re-exported yet

Golden rule: if another laRose package already depends on this for you, install the public package — not this one.

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
