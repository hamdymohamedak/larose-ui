# Framework sandboxes

**Real consumer environments** for multi-framework integration QA — one kitchen sink per adapter, not per component.

Full layered plan: [TESTING.md](./TESTING.md).

| App | Port | Command |
|-----|------|---------|
| `sandbox-react` | 5173 | `pnpm sandbox:react` |
| `sandbox-vue` | 5174 | `pnpm sandbox:vue` |
| `sandbox-svelte` | 5175 | `pnpm sandbox:svelte` |

Cross-framework E2E: `pnpm test:parity` (Playwright).

Storybook (`pnpm dev`) = documentation + catalog + React visual development — not parity authority.

## Scenarios (aligned)

`#/home` `#/navigation` `#/command` `#/overlays` `#/toast` `#/theme` `#/forms` `#/accelerators`
