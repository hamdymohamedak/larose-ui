# laRose testing architecture

Multi-framework UI OS needs **layered** verification. Sandboxes alone are not enough.

```
                 laRose UI
                    │
       ┌────────────┴────────────┐
       │                         │
   Shared Cores              Adapters
       │              ┌──────────┼──────────┐
       │            React       Vue       Svelte
       └──────────────┴───────────┴───────────┘
                      │
               Real Sandboxes
                      │
           ┌──────────┼──────────┐
         React       Vue       Svelte
           └──────────┼──────────┘
                      │
                 Playwright
```

| Layer | Tool | Responsibility |
|-------|------|----------------|
| Shared logic / APIs | **Vitest** (packages) | State, data, forms, permissions, i18n, network/offline, keyboard helpers, contracts |
| Adapters | **Vitest** (`*-react` / vue / svelte) | Core ↔ framework wiring |
| Real consumer apps | **Sandboxes** | Portal, fixed, focus, CSS, theme, stacking, runtime |
| Cross-framework user flows | **Playwright** | Same critical intents on React + Vue + Svelte |
| Docs / visual catalog | **Storybook** | Documentation + React-oriented development — **not** parity authority |
| Architecture | **Doctor / contracts** | Neutrality and API surface |

## Sandboxes (kitchen sink, not per-component)

```
apps/sandbox-react|vue|svelte
  #/home #/navigation #/command #/overlays
  #/toast #/theme #/forms #/accelerators #/liquid-glass
```

Same scenario ids and user intent across frameworks. Do **not** add `sandbox-button`, `sandbox-dialog`, …

Meta frameworks (Next / Nuxt / SvelteKit): smoke later, after adapter parity is stable.

## Playwright critical flows

```bash
pnpm test:parity
```

Covers Command palette, Dialog+focus, Toast, Theme, Accelerators × React/Vue/Svelte.

## Commands

```bash
pnpm sandbox:react|vue|svelte   # manual QA
pnpm test                       # Vitest (cores + adapters)
pnpm test:parity                # Playwright critical flows
pnpm dev                        # Storybook docs/catalog
pnpm doctor:ci                  # architectural checks
```

## Contributor scaffold

```bash
make contribute NAME=StatusPill PACKAGE=all
make contribute NAME=StatusPill PACKAGE=all WITH_STORY=1 SANDBOX_HOOK=forms
```

Guided workflow (not a per-component sandbox generator): Core → Styles → Adapters → Vitest → Story → Sandbox if needed → Playwright if critical → Contracts → Changeset.
