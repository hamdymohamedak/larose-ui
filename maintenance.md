# Objective: Make laRose UI Truly Framework-Agnostic

> **Progress tracker (live)** — see also [`docs/framework-neutrality-audit.md`](docs/framework-neutrality-audit.md)
>
> - [x] Phase 1 — Audit (`docs/framework-neutrality-audit.md`)
> - [x] Phase 2 — Freeze (`pnpm check:framework-neutrality` + CONTRIBUTING hard rule)
> - [x] Phase 3 — Shared engines (prior: liquid-glass / component-logic / primitives / forms / data)
> - [x] Phase 4 — Platform neutrality + **adapter parity**: `runtime-vue`/`runtime-svelte`, AI Smart*, enterprise UI, `devtools-vue`/`devtools-svelte`, `@larose-ui/sveltekit`
> - [x] Phase 5–6 — Contracts + Storybook domain split (prior pass)
> - [x] Phase 7 — Docs / positioning updated
> - [x] Verification — cores + adapters build (parity packages)
> - [ ] Phase 8 — Full monorepo `pnpm lint/typecheck/test/build/doctor:ci` on a clean agent
>
> Honest status: **React / Vue / Svelte share the same platform APIs** (AI, enterprise, runtime adapters, testing, observability, forms, data, permissions). Remaining asymmetry: React Fiber DevTools + fuller React `@larose-ui/runtime` Network/Offline/Toast composition.

---

# Objective: Make laRose UI Truly Framework-Agnostic

You are working on the `laRose UI` monorepo.

The current architecture has moved toward React, Vue 3, and Svelte 5 support, but the platform is still partially React-first.

Your task is to **fully remove the React-first architecture** and evolve laRose into a **true multi-framework UI Operating System** where React, Vue 3, and Svelte 5 are first-class consumers of the same framework-agnostic core.

The target architecture is:

```text
                    ┌──────────────────────┐
                    │     laRose Core      │
                    │ Framework-Agnostic   │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    React Adapter        Vue 3 Adapter        Svelte 5 Adapter
          │                    │                    │
          ▼                    ▼                    ▼
       React UI              Vue UI              Svelte UI
```

The goal is NOT to make Vue and Svelte copies of the React implementation.

The goal is:

> Shared behavior and intelligence live in framework-agnostic packages. React, Vue, and Svelte only provide framework-specific rendering, lifecycle, reactivity, and integration adapters.

---

# 1. First: Audit the Entire Repository

Before modifying anything, perform a complete architecture audit.

Inspect:

* `packages/*`
* `apps/*`
* `contracts/*`
* `scripts/*`
* Storybook
* playground
* documentation
* tests
* package dependencies
* peerDependencies
* direct dependencies
* exports
* TypeScript types
* framework-specific utilities
* runtime packages
* data packages
* forms packages
* permissions
* observability
* AI
* enterprise
* DevTools
* testing
* Next.js integration
* LiquidGlass
* accelerator system
* primitives
* component logic

Search specifically for:

```text
react
@larose-ui/react
ReactNode
ReactElement
FC
ComponentType
ElementType
useState
useEffect
useMemo
useCallback
useRef
createContext
forwardRef
React.Context
React.ComponentProps
JSX.Element
```

Also search for:

```text
vue
svelte
React-specific imports
framework-specific types
framework-specific lifecycle APIs
framework-specific state management
```

Create a dependency graph showing which packages depend directly or indirectly on React.

Do NOT assume a package is framework-agnostic just because its name contains `core`.

---

# 2. Define the New Architectural Rule

Establish this as a hard architectural rule:

> No framework-agnostic package may depend on React, Vue, Svelte, or any framework-specific runtime.

Framework-specific dependencies are allowed only inside adapters.

The architecture should become:

```text
@larose-ui/core
@larose-ui/primitives
@larose-ui/component-logic
@larose-ui/liquid-glass-core
@larose-ui/data-core
@larose-ui/forms-core
@larose-ui/permissions-core
@larose-ui/observability-core
@larose-ui/runtime-core
...
        │
        ├── @larose-ui/react
        ├── @larose-ui/vue
        └── @larose-ui/svelte
```

React must not be the implicit foundation of these systems.

---

# 3. Remove React Dependencies From Shared Intelligence

Audit and refactor every package where business logic or platform logic currently depends on React.

Pay particular attention to:

* `@larose-ui/data`
* `@larose-ui/forms`
* `@larose-ui/runtime`
* `@larose-ui/permissions`
* `@larose-ui/observability`
* `@larose-ui/ai`
* `@larose-ui/enterprise`
* `@larose-ui/testing`
* `@larose-ui/devtools`
* `@larose-ui/next`

For each package ask:

> Is React actually required for the underlying logic, or is React only being used as the integration layer?

If the underlying logic is framework-independent:

1. Extract it into a `*-core` package.
2. Remove React from the core package.
3. Create React adapter APIs.
4. Create Vue adapter APIs.
5. Create Svelte adapter APIs.

Do not simply rename the existing React package.

---

# 4. Data Architecture

`data-core` should contain all framework-independent data behavior.

It should own things such as:

* query state
* mutation state
* reducers
* cache
* invalidation
* request lifecycle
* retry logic
* stale state
* loading state
* error state
* optimistic updates
* serialization
* normalization
* query keys
* mutation keys

Framework adapters should only expose framework-native APIs.

For example:

```text
data-core
   │
   ├── React → useQuery / useMutation
   ├── Vue → useQuery / useMutation
   └── Svelte → createQuery / createMutation
```

No React dependency inside `data-core`.

---

# 5. Forms Architecture

Create a genuinely framework-neutral forms engine.

The core should own:

* schema validation
* field state
* validation state
* errors
* touched state
* dirty state
* submission state
* reset
* defaults
* field registration
* serialization
* validation lifecycle

Then expose:

```text
forms-core
   │
   ├── React adapter
   ├── Vue adapter
   └── Svelte adapter
```

React-specific hooks must not be the source of truth.

Vue's `v-model`, slots, and reactivity should be handled by the Vue adapter.

Svelte stores/reactivity should be handled by the Svelte adapter.

React hooks should be handled only by the React adapter.

---

# 6. Permissions

Extract all permission logic from React.

The core should contain:

* permission evaluation
* roles
* capabilities
* policies
* resource checks
* authorization decisions
* policy composition

Example:

```text
permissions-core
        │
        ├── React adapter
        ├── Vue adapter
        └── Svelte adapter
```

Do not make React Context the source of truth.

The core should expose a framework-neutral authorization API.

---

# 7. Observability

Observability must become framework-neutral.

Extract:

* event model
* telemetry
* logging
* metrics
* tracing
* instrumentation
* error reporting
* performance measurements

into:

```text
observability-core
```

Framework adapters may integrate lifecycle events, but the underlying telemetry system must not depend on React.

---

# 8. Runtime

This is one of the most important changes.

The current runtime architecture must NOT treat React as the platform runtime.

Create or strengthen:

```text
runtime-core
```

It should contain:

* application state
* lifecycle model
* environment information
* feature flags
* configuration
* events
* runtime services
* plugin registration
* service registry
* platform abstractions

Then create:

```text
runtime-react
runtime-vue
runtime-svelte
```

or equivalent adapter layers.

The framework adapter should translate the framework's lifecycle into the framework-neutral runtime.

React must not be imported by `runtime-core`.

---

# 9. AI

Audit the AI package.

Separate:

```text
AI engine
AI state
AI requests
AI tools
AI agents
AI streaming
AI context
AI orchestration
```

from framework-specific rendering.

Create:

```text
ai-core
```

Then provide:

```text
ai-react
ai-vue
ai-svelte
```

where appropriate.

The core must not import React.

If a feature genuinely cannot be framework-neutral, document exactly why instead of silently coupling it to React.

---

# 10. Enterprise

Perform the same decomposition for Enterprise functionality.

Separate:

```text
enterprise-core
```

from:

```text
enterprise-react
enterprise-vue
enterprise-svelte
```

where applicable.

Enterprise functionality must not automatically imply React.

---

# 11. DevTools

DevTools should also be split.

Separate:

```text
devtools-core
```

from framework-specific integrations.

The core should understand:

* component metadata
* runtime state
* events
* diagnostics
* inspection models
* registry
* debugging protocol

without importing React.

Framework integrations may expose framework-specific inspection information.

---

# 12. Testing

The testing architecture must also stop being React-first.

Create framework-neutral testing utilities where possible.

The testing model should support:

```text
core tests
React adapter tests
Vue adapter tests
Svelte adapter tests
```

Do not define correctness solely through React behavior.

Shared behavior should be tested against the framework-neutral core.

Then each adapter should have its own integration tests.

---

# 13. LiquidGlass

LiquidGlass is a major example of logic that must not be duplicated.

Extract all framework-independent LiquidGlass functionality into:

```text
@larose-ui/liquid-glass-core
```

This package should own:

* optics
* displacement
* refraction
* geometry
* distortion
* defaults
* detection
* configuration
* rendering-independent calculations
* SVG/WebGL logic where possible

React/Vue/Svelte components should only integrate the engine into their respective rendering systems.

Do NOT maintain three copies of the same LiquidGlass engine.

---

# 14. Component Logic

Audit all duplicated `utils.ts` files.

The previous architecture contained many copies of React utility logic inside Vue and Svelte.

Find duplicated implementations using:

* filename comparison
* AST comparison
* hashing
* semantic similarity
* duplicated algorithms
* duplicated state machines

For every duplicated utility ask:

> Is this actually framework-specific?

If not, move it into:

```text
@larose-ui/component-logic
```

or the most appropriate existing core/primitives package.

Adapters should consume the shared implementation.

---

# 15. Expand Primitives

The primitives layer should become the main home for reusable interaction behavior.

Prioritize:

* Tabs
* Disclosure
* Dialog focus management
* focus trap
* typeahead
* keyboard navigation
* selection models
* list navigation
* roving tabindex
* drag-and-drop behavior
* collection models
* menu state
* command palette behavior
* state machines
* interaction state

The framework adapters should translate these primitives into:

```text
React hooks/components
Vue composables/components
Svelte actions/stores/components
```

The algorithm itself must remain framework-independent.

---

# 16. Component API Parity

Do not force React's API onto Vue and Svelte.

Instead define a framework-neutral component contract.

For example, the contract should describe concepts such as:

```text
value
disabled
open
selected
items
events
state
accessibility
slots/content
```

Then map those concepts into each framework naturally.

React:

```text
children
onChange
value
```

Vue:

```text
slots
v-model
@change
```

Svelte:

```text
children/snippets
bind:value
events
```

Do not use `ReactNode` inside shared contracts.

Do not use React-specific types such as:

```text
ReactNode
ReactElement
ComponentType
ElementType
```

inside framework-neutral contracts.

---

# 17. Contract Generation

The current contract generation must not use React as the canonical source.

Replace:

```text
React implementation → contract
```

with:

```text
Framework-neutral contract
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
 React   Vue   Svelte
```

Contracts should define:

* props
* events
* states
* accessibility
* slots/content
* variants
* defaults
* behavioral expectations

They should not encode framework-specific implementation details.

Update:

```text
scripts/generate-component-contracts.mjs
```

so React is no longer treated as the canonical authority.

---

# 18. Storybook / Playground

The current Storybook architecture must stop being React-centric.

The goal is not necessarily to remove React from Storybook.

The goal is to make Storybook a neutral testing and demonstration host.

Refactor the registry so it does not require manually maintaining a huge React-centric registry.

Replace the current model:

```text
manual React registry
       +
manual Vue demos
       +
manual Svelte demos
```

with a metadata-driven system:

```text
component contract
       │
       ├── React story
       ├── Vue story
       └── Svelte story
```

Generate as much registry metadata as practical.

Avoid a giant manually maintained `registry.tsx`.

If some framework-specific Storybook code is unavoidable, keep it inside the framework adapter layer.

---

# 19. Package Dependency Rules

Introduce automated architecture checks.

The following must fail CI:

```text
core → React
core → Vue
core → Svelte

*-core → React
*-core → Vue
*-core → Svelte
```

unless explicitly documented as an intentional exception.

Also detect:

```text
React dependency inside framework-neutral package
React types inside framework-neutral package
React exports from core package
React-only peerDependencies
React-specific contract types
```

Create an architecture doctor rule for this.

For example:

```text
Framework Neutrality
--------------------
core packages importing React: 0
core packages importing Vue: 0
core packages importing Svelte: 0
React-specific contracts: 0
duplicated shared algorithms: 0
```

---

# 20. Package Naming

Normalize package boundaries.

Prefer:

```text
@larose-ui/core
@larose-ui/primitives
@larose-ui/component-logic

@larose-ui/data-core
@larose-ui/data-react
@larose-ui/data-vue
@larose-ui/data-svelte

@larose-ui/forms-core
@larose-ui/forms-react
@larose-ui/forms-vue
@larose-ui/forms-svelte

@larose-ui/permissions-core
@larose-ui/permissions-react
@larose-ui/permissions-vue
@larose-ui/permissions-svelte

@larose-ui/observability-core
@larose-ui/observability-react
@larose-ui/observability-vue
@larose-ui/observability-svelte
```

Use existing package names when possible instead of blindly creating duplicates.

Do not create unnecessary packages just for naming consistency.

---

# 21. Versioning

Audit the current version sprawl.

Define a coherent versioning policy across:

* core
* primitives
* adapters
* framework packages
* platform packages

Changes to shared contracts should propagate correctly to affected adapters.

Use Changesets correctly.

Do not allow one framework adapter to silently drift from the shared contract.

---

# 22. Documentation

Rewrite the architecture documentation so the actual architecture and documentation agree.

Update:

```text
ARCHITECTURE.md
VUE.md
SVELTE.md
PRODUCT_POSITIONING.md
maintenance.md
```

The documentation should clearly state:

> laRose is a multi-framework UI Operating System built around framework-agnostic cores with React, Vue 3, and Svelte 5 adapters.

Document:

* what belongs in core
* what belongs in adapters
* how to add a new component
* how to add shared behavior
* how to add framework-specific behavior
* dependency rules
* contract rules
* testing strategy
* Storybook strategy

Remove outdated statements that describe laRose as three independent UI libraries.

---

# 23. Contribution Rules

Add an explicit architectural rule:

> Never implement the same framework-independent behavior three times.

Before adding logic to React/Vue/Svelte:

1. Determine whether it is framework-independent.
2. If yes, add it to core/primitives/component-logic.
3. Add framework adapters.
4. Add shared tests.
5. Add adapter integration tests.

Only duplicate code when the implementation is inherently framework-specific.

---

# 24. Definition of "Done"

The migration is NOT complete merely because:

```text
Vue works
Svelte works
React works
```

The migration is complete only when:

### Core

```text
Core packages contain zero unnecessary framework dependencies.
```

### UI

```text
React = Vue = Svelte
```

as first-class framework targets.

### Platform

The major platform systems have framework-neutral cores:

```text
runtime
data
forms
permissions
observability
AI
enterprise
DevTools
testing
```

### Contracts

Contracts are framework-neutral.

### LiquidGlass

One shared engine exists.

### Logic

Duplicated framework-independent utilities are eliminated.

### Storybook

React is not the canonical source of component truth.

### CI

Architecture checks automatically prevent React-first regressions.

---

# 25. Important Constraints

Do NOT perform a superficial migration.

Do NOT:

* rename packages without changing architecture
* create empty `*-core` packages
* wrap React code and call it framework-neutral
* copy React implementation into Vue/Svelte
* duplicate logic
* make Vue/Svelte depend on React internally
* put React types in shared contracts
* create unnecessary abstraction layers
* rewrite working framework-specific rendering code merely for aesthetics
* break existing public APIs unnecessarily

Preserve backwards compatibility wherever practical.

If a breaking change is genuinely necessary, document it and use Changesets.

---

# 26. Migration Strategy

Work incrementally.

### Phase 1 — Audit

Produce:

```text
docs/framework-neutrality-audit.md
```

containing:

* React dependencies
* framework-specific packages
* duplicated utilities
* duplicated engines
* React-shaped contracts
* React-first platform packages
* Storybook coupling
* migration plan

Do not modify architecture before understanding it.

### Phase 2 — Freeze Duplication

Add architecture checks preventing new React-first dependencies.

### Phase 3 — Extract Shared Engines

Prioritize:

1. LiquidGlass
2. component logic
3. primitives
4. data
5. forms

### Phase 4 — Platform Neutrality

Migrate:

1. permissions
2. observability
3. runtime
4. testing
5. DevTools
6. AI
7. Enterprise
8. Next.js integration

where technically applicable.

### Phase 5 — Contracts

Make framework-neutral contracts the source of truth.

### Phase 6 — Storybook

Make the registry metadata-driven and framework-neutral.

### Phase 7 — Documentation

Update all architecture and maintenance documentation.

### Phase 8 — Verification

Run the complete quality system.

---

# 27. Required Verification

Run all relevant checks, including:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm doctor:ci
make test-all
```

Also add dedicated checks for:

```text
framework-neutral dependency violations
duplicated core logic
React-specific contract types
React imports inside core packages
Vue imports inside core packages
Svelte imports inside core packages
```

Verify all three frameworks independently:

```text
React
Vue 3
Svelte 5
```

Verify:

* components
* primitives
* data
* forms
* permissions
* observability
* runtime
* LiquidGlass
* accelerators
* contracts
* Storybook
* documentation
* builds
* tests

---

# 28. Final Architecture Target

The final architecture should conceptually look like this:

```text
                         laRose UI OS
                              │
                     Framework-Agnostic
                           Core Layer
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   Core / Primitives     Platform Core          Engines
        │                     │                     │
        │              ┌──────┼──────┐              │
        │              │      │      │              │
        │            Data   Forms  Runtime      LiquidGlass
        │              │      │      │              │
        │            Perms  Obs.   AI              │
        │              │      │      │              │
        └──────────────┴──────┴──────┴──────────────┘
                              │
                    Framework Adapters
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
          React            Vue 3           Svelte 5
             │                │                │
             ▼                ▼                ▼
          React UI          Vue UI          Svelte UI
```

The final product positioning should be:

> **laRose is a true multi-framework UI Operating System for React, Vue 3, and Svelte 5, powered by shared framework-agnostic cores and thin framework adapters.**

The most important architectural principle is:

> **React must become an adapter, not the foundation.**

Do not stop after making the UI layer multi-framework.

The task is complete only when the **core, intelligence, platform, contracts, tooling, and component behavior are no longer architecturally dependent on React.**
