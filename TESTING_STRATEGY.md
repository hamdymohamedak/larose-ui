# laRose Testing Strategy

## Philosophy

Quality is measured by **behavior coverage**, not component count.

Every important feature must consider:

```text
Behavior | Accessibility | Visual | Performance
Network | Permission | Error | Offline
Responsive | i18n | RTL | Dark mode
```

## Test Matrix

Example: Employee Creation

| Scenario | Type | Priority |
|----------|------|----------|
| Normal flow | Integration | P0 |
| Validation errors | Unit + Integration | P0 |
| Server error (500) | Integration | P0 |
| Offline submit | Integration | P1 |
| Retry after failure | Integration | P1 |
| Permission denied | Integration | P0 |
| Slow network (skeleton) | Visual + Integration | P1 |
| Mobile viewport | Visual | P1 |
| RTL layout | Visual | P1 |
| Dark mode | Visual regression | P1 |
| Accessibility (axe) | Automated | P0 |
| Visual regression | Snapshot | P1 |

## Test Layers

### Unit Tests (Vitest)

- `@larose/core` state machines, error classifiers, utilities
- Token generation and density scaling
- Permission evaluators
- Pure functions only — no DOM unless necessary

### Component Tests (Vitest + Testing Library)

- Render all UI states (loading, error, disabled, etc.)
- User interactions (click, type, keyboard)
- ARIA attributes and roles
- Focus management for overlays

### Integration Tests

- `<DataView />` with mock API
- `<Form />` with server validation
- `<Can />` with permission provider
- Offline queue sync flow

### Accessibility Tests

- axe-core in every component test suite
- `@larose/accessibility` validation utilities
- CI gate: zero critical violations

### Visual Regression

- Storybook stories as snapshot source
- Chromatic or Playwright screenshot comparison
- Matrix: light/dark × densities × breakpoints × states

### Performance Tests

- Bundle size budgets per package
- Render time benchmarks for DataTable, Form
- CI fails on >10% regression

### Contract Tests

- `@larose/contracts` validates UI expectations against API schemas
- Runs in CI on schema changes

## Package Test Requirements

| Package | Unit | Component | A11y | Visual |
|---------|------|-----------|------|--------|
| core | ✅ | — | — | — |
| tokens | ✅ | — | — | — |
| react | ✅ | ✅ | ✅ | ✅ |
| data | ✅ | ✅ | ✅ | — |
| permissions | ✅ | ✅ | ✅ | — |
| forms | ✅ | ✅ | ✅ | ✅ |
| runtime | ✅ | ✅ | ✅ | — |

## CI Pipeline

```text
lint → typecheck → unit → component → a11y → visual → perf budgets → contracts
```

## Testing Utilities (`@larose/testing`)

Provides:

```tsx
import { renderWithLaRose, mockPermissions, mockNetwork } from '@larose/testing';

renderWithLaRose(<EmployeeTable />, {
  permissions: ['employees.read'],
  network: 'slow',
  theme: 'dark',
  density: 'compact',
});
```

## Coverage Targets

- `@larose/core`: 90%+ line coverage
- `@larose/react` foundation components: 80%+ with state matrix
- Intelligence packages: 85%+ on public API paths

## What We Don't Test

- Third-party library internals
- Trivial prop forwarding without logic
- Snapshot-only tests without behavioral assertions
