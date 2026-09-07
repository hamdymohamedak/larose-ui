# @larose-ui/core

> **Internal package** — Framework-agnostic types, state machines, and shared contracts.

This package is published so other `@larose-ui/*` packages can depend on it.
**App developers should prefer the public surface** instead of importing this directly.

## Prefer these instead

- `@larose-ui/runtime-react`
- `@larose-ui/react`
- `@larose-ui/data-react`
- `@larose-ui/forms-react`
- `@larose-ui/permissions-react`

See [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md) for the full list.

## When to use this package

- You are extending laRose itself (adapters, CLI, custom bindings)
- You need a low-level primitive that is not re-exported yet

Golden rule: if your only reason to install this is “another laRose package already uses it”, install the public package instead.

## Install (advanced)

```bash
pnpm add @larose-ui/core
```

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
