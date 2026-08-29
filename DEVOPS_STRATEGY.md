# laRose DevOps Strategy

## Component Quality Gate

Every important component/package must pass before merge:

```text
✓ Unit tests pass
✓ Component tests pass
✓ Accessibility (axe) — zero critical violations
✓ TypeScript strict — no errors
✓ Lint — no errors
✓ Bundle size within budget
✓ Visual regression — no unexpected diffs
✓ Contract validation — no mismatches
```

## CI/CD Pipeline

### Pull Request

```text
1. Install (pnpm, frozen lockfile)
2. turbo lint typecheck test
3. turbo build
4. Accessibility scan (axe on Storybook)
5. Bundle size report
6. Visual regression (on label or main packages)
```

### Release

```text
1. Changeset version bump
2. Full test matrix
3. Build all packages
4. Publish to npm (@larose/*)
5. Deploy Storybook to static hosting
6. Generate migration report if major
```

## Monorepo Tooling

| Tool | Purpose |
|------|---------|
| pnpm | Package management, workspace linking |
| Turborepo | Cached builds, task orchestration |
| Changesets | Versioning and changelogs |
| tsup | Library bundling |
| Vitest | Unit and component tests |
| ESLint + Prettier | Code quality |
| Storybook | Component playground + visual QA |

## Performance Budgets

| Package | Max ESM Size (gzip) |
|---------|---------------------|
| @larose/core | 5 KB |
| @larose/tokens | 3 KB |
| @larose/react (tree-shaken Button) | 2 KB |
| @larose/react (full) | 70 KB |

CI compares against baseline; >10% increase fails the build.

## Browser Compatibility Matrix

| Browser | Support Level |
|---------|---------------|
| Chrome (last 2) | Full |
| Firefox (last 2) | Full |
| Safari (last 2) | Full |
| Edge (last 2) | Full |
| iOS Safari (last 2) | Full |
| Android Chrome (last 2) | Full |

Partial support documented per component when applicable.

## Release Versioning

- **Patch** — bug fixes, no API change
- **Minor** — new components/features, backward compatible
- **Major** — breaking changes + migration codemods

## Environment Strategy

Runtime environments supported:

```text
development | staging | production | demo | read-only | maintenance
```

Build-time env vars for CI only. Runtime environment set via `EnvironmentProvider`.

## Documentation Deployment

- Storybook → static site (component playground)
- Architecture docs → docs site (future)
- API reference generated from TypeScript (future)

## Security in DevOps

- Dependabot / Renovate for dependency updates
- No secrets in repo — `.env` gitignored
- npm provenance on publish
- SBOM generation on release

## Local Developer Workflow

```bash
pnpm install
pnpm dev          # Storybook playground
pnpm test         # all tests
pnpm lint         # ESLint (packages + apps)
pnpm build        # all packages
pnpm lint         # lint all
pnpm run doctor   # quality gates (budgets, deprecations, contracts, a11y)
```
