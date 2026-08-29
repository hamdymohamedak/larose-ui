# laRose Roadmap

## Phase 1: Runtime 2.0 — Complete

**Target:** Unified context, session, tenant, version, feature flags, density, timezone, accessibility.

| Item | Status |
|------|--------|
| Core runtime contracts | Done |
| Event bus | Done |
| `useRuntime()` | Done |
| Session bridge | Done |
| Feature flag evaluators | Done |
| Network state extensions | Done |
| Tenant resolver | Done |
| Toast decoupling (`@larose/runtime/toast`) | Done |
| Planning docs | Done |

**Exit criteria:** Full quality gate pass, documented examples. Toast moved to `@larose/runtime/toast` (migration: update imports).

## Phase 2: DevTools 2.0 — Complete

| Item | Status |
|------|--------|
| Runtime context panel | Done |
| Event timeline | Done |
| Component inspector (selection + readout) | Done |
| React fiber / props introspection | Done |
| Performance per-component metrics | Done |

## Phase 3: UX Observability — Complete

| Item | Status |
|------|--------|
| User journey tracking | Done |
| Runtime ↔ observability correlation | Done |
| Funnel correlation + drop-off signals | Done |
| Rage click root-cause linking | Done |
| DevTools Journey tab | Done |

## Phase 4: Quality Engine — Complete

| Item | Status |
|------|--------|
| Component quality scores | Done |
| Visual regression CI (story manifest) | Done |
| Browser compatibility matrix | Done |
| Doctor `--ci` and `--json` | Done |

## Phase 5: AI Runtime — Complete

| Item | Status |
|------|--------|
| Secure intent parsing | Done |
| Permission-bound actions | Done |
| HTTP adapter + mock fallback | Done |
| AIProvider integration | Done |

## Phase 6: Migration & Ecosystem — Complete

| Item | Status |
|------|--------|
| Runtime API codemods (toast, provider, tokens) | Done |
| Generators (form, page, feature) | Done |
| Release intelligence | Done |

## Phase Completion Rule

Do not advance until current phase is: implemented, tested, documented, integrated, validated.
