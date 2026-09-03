# Component contracts

Canonical API surface for laRose UI components. Files in `contracts/components/*.json` are **framework-neutral**.

## Format

| Field | Meaning |
|-------|---------|
| `name` | Component export name |
| `version` | Contract schema version (`"1"`) |
| `framework` | Always `"neutral"` for canonical files |
| `props` | Public props (`type` uses neutral aliases: `Node`, `Style`, `HtmlAttributes`, …) |
| `events` | `on*` handlers with payload types |
| `slots` / `states` | Anatomy metadata when present |
| `defaults` | Default prop values as strings |
| `accessibility` / `keyboard` | A11y requirements |
| `controlled` / `uncontrolled` | Value/`defaultValue` pairs |

## Authoring

Contracts are generated from the React package index (authoring source), then scrubbed:

1. Only PascalCase component exports (no `MAX_*`, `STANDARD_*`, SCREAMING_SNAKE constants)
2. Types normalized (`ReactNode` → `Node`, etc.)
3. `framework` set to `neutral`

```bash
pnpm generate:contracts
```

Doctor (`pnpm doctor`) diffs live extraction against these JSON files. Vue and Svelte adapters should match the same contract; framework-specific wiring stays in adapters, not in the JSON.
