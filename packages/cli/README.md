# @larose-ui/cli

> CLI for quality gates, migration, and code generation.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Tooling

## Install

```bash
npm install @larose-ui/cli
# or
pnpm add @larose-ui/cli
# or
yarn add @larose-ui/cli
```



## Quick start

```tsx
larose doctor --ci
larose migrate --to 1.0.0 --apply
larose generate feature EmployeeList ./EmployeeList.tsx
```

## Features

- `larose doctor` — a11y, contracts, quality scores
- `larose migrate` — deprecation scan and codemods
- `larose generate` / `contribute` / `release`

## Recommended app stack

Install these first (example for React):

- `@larose-ui/runtime-react`
- `@larose-ui/react`
- `@larose-ui/data-react`
- `@larose-ui/forms-react`
- `@larose-ui/permissions-react`

Internal packages (`core`, `tokens`, `*-core`, …) are pulled in automatically — you usually do not need to depend on them directly.

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
