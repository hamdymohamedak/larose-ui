# @larose-ui/enterprise-vue

> Enterprise Vue patterns — audit, session guard, schema IaC.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** Features

## Install

```bash
npm install @larose-ui/enterprise-vue
# or
pnpm add @larose-ui/enterprise-vue
# or
yarn add @larose-ui/enterprise-vue
```


**Peer dependency:** `vue >=3`


## Quick start

```tsx
import { SessionGuard, AuditedInput } from '@larose-ui/enterprise-vue';
```

## Features

- Audit trails
- Session guard
- Schema renderer

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
