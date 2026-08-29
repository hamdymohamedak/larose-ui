# @larose-ui/forms

> Schema-driven forms with validation and conditional fields.

Part of **[laRose UI](https://github.com/hamdymohamedak/larose-ui)** — the UI Operating System for modern SaaS applications.

## Install

```bash
npm install @larose-ui/forms
# or
pnpm add @larose-ui/forms
# or
yarn add @larose-ui/forms
```


**Peer dependency:** `react >=18`


## Quick start

```tsx
import { Form } from '@larose-ui/forms';

<Form
  schema={{ id: 'user', fields: [{ name: 'email', type: 'text', label: 'Email', required: true }] }}
  onSubmit={async (values) => saveUser(values)}
/>
```

## Features

- Declarative field schemas
- Conditional visibility (`showWhen`)
- Observability integration for funnel metrics

## Related packages

| Layer | Packages |
|-------|----------|
| Foundation | `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/react` |
| Runtime | `@larose-ui/runtime`, `@larose-ui/network`, `@larose-ui/offline` |
| Intelligence | `@larose-ui/data`, `@larose-ui/forms`, `@larose-ui/permissions` |
| Platform | `@larose-ui/observability`, `@larose-ui/enterprise`, `@larose-ui/ai` |

## Documentation

- [Monorepo README](https://github.com/hamdymohamedak/larose-ui#readme)
- [Architecture](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/architecture/ARCHITECTURE.md)
- [Roadmap](https://github.com/hamdymohamedak/larose-ui/blob/main/docs/ROADMAP.md)
- [Report an issue](https://github.com/hamdymohamedak/larose-ui/issues)

## License

MIT © [laRose UI](https://github.com/hamdymohamedak/larose-ui)
