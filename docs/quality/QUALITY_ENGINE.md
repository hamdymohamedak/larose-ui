# Quality Engine (Phase 4)

Unified validation layer aggregating accessibility, visual regression, browser matrix, performance, contracts, permissions, responsive, i18n, and offline resilience.

## Current State

- `larose doctor`: bundle budgets, deprecations, a11y heuristics, contracts, quality scores
- `larose doctor --ci`: warnings fail (CI gate)
- `larose doctor --json`: structured report for pipelines
- `larose visual-regression`: Storybook manifest vs `quality/visual-baseline.json`
- `quality/browser-matrix.json`: supported browser targets
- `pnpm check-budgets`, `pnpm a11y`, `pnpm visual-regression`
- CI runs full gate suite including doctor CI mode + JSON artifact

## Component Quality Scores

Doctor computes 0–100 scores per component file and package from diagnostics:

- **Errors** −15 points
- **Warnings** −5 points (also fail in `--ci` mode)

JSON output includes `quality.components` and `quality.packages` ranked by score.

## Visual Regression

Manifest-based gate prevents silent Storybook story removal. When adding stories, update `quality/visual-baseline.json`.

Full screenshot diff can be added later (Playwright / Chromatic); the manifest is the first CI layer.

## Browser Matrix

`quality/browser-matrix.json` defines Chrome, Firefox, Safari, Edge minimum versions and Node engine alignment with root `package.json`.

## Killer Feature Triad

Runtime collects → DevTools visualizes → Doctor validates in CI.
