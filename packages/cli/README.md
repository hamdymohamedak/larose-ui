# @larose-ui/cli

> CLI for quality gates, migration, and code generation.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

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
# After global install or npx:
larose doctor --ci
larose migrate --to 1.0.0 --apply
larose generate feature EmployeeList ./EmployeeList.tsx
```

## Features

- `larose doctor` — budgets, a11y, contracts, quality scores
- `larose migrate` — deprecation scan and codemods
- `larose generate` — form, page, and feature scaffolds
- `larose release` — monorepo release intelligence

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime-react`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data-react`, `@larose-ui/forms-react`, `@larose-ui/permissions-react` |
| Platform | `@larose-ui/observability-react`, `@larose-ui/enterprise-react`, `@larose-ui/ai-react` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Package docs](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/quality/QUALITY_ENGINE.md)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
