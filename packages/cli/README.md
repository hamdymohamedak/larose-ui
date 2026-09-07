# @larose-ui/cli

> CLI for quality gates, migration, and code generation.

**Docs:** [https://hamdymohamedak.github.io/larose-ui](https://hamdymohamedak.github.io/larose-ui/) · **Source:** [laRose UI](https://github.com/hamdymohamedak/larose-ui)

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

## Documentation

- [laRose UI Docs](https://hamdymohamedak.github.io/larose-ui/) — getting started, components, guides
- [Public API surface](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/PUBLIC_API.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
