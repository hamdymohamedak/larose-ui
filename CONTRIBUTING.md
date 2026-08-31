# Contributing to laRose

Thank you for contributing to laRose. This guide covers local setup, the branch workflow, quality checks, and how releases reach npm.

## Prerequisites

- **Node.js** 20 or later (CI uses 22)
- **pnpm** 9 (`corepack enable` if needed)
- Git

## Getting started

```bash
git clone https://github.com/hamdymohamedak/larose-ui.git
cd laRose
pnpm install
pnpm build
```

Useful commands during development:

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Storybook playground at http://localhost:6006 |
| `pnpm demo` | Vite demo app at http://localhost:5173 |
| `pnpm test` | Run all package tests |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript across the monorepo |
| `pnpm run doctor` | Quality gates (deprecations, contracts, a11y) |
| `make test-all` | Full CI suite locally |

## Branch workflow

1. Branch from **`dev`** (not `main`).
2. Make focused changes with tests and Storybook stories where relevant.
3. Open a pull request targeting **`dev`**.
4. When ready for release, merge **`dev`** into **`main`**.

CI runs on pushes and pull requests to `dev`. Releases are published only when changes land on `main` (see [Releases](#releases)).

## Making changes

### Packages and apps

- **`packages/*`** — publishable libraries (`@larose-ui/react`, `@larose-ui/runtime`, etc.)
- **`apps/playground`** — Storybook; add or update stories for UI changes
- **`apps/demo`** — integration demo app

After changing a component in `@larose-ui/react`, rebuild if Storybook reads from `dist`:

```bash
pnpm --filter @larose-ui/react build
```

### Code style

- Match existing patterns in the file you edit (naming, imports, CSS modules).
- Keep diffs focused; avoid unrelated refactors.
- Run `pnpm lint` before pushing.
- Fix type errors — `pnpm typecheck` must pass.

### Tests

- Add or update tests for behavior you change (`vitest` in each package).
- Run `pnpm test` or `make test-all` before opening a PR.

### Storybook

- New or changed components should have stories under `apps/playground/stories/`.
- If you add or rename a story file or its `title`, update `quality/visual-baseline.json` (or run `pnpm visual-regression` and follow the report).

## Pull requests

Include:

1. **Summary** — what changed and why
2. **Test plan** — commands run and what you verified manually
3. **Changeset** — required when publishable packages change (see below)

Target **`dev`**. Ensure CI is green before requesting review.

## Changesets and releases

Published packages use [Changesets](https://github.com/changesets/changesets). **Merging to `main` without a changeset does not publish to npm.**

### When you need a changeset

Add one when you change any publishable package under `packages/` (except private apps). Include every package you touched that should ship, including dependencies such as `@larose-ui/tokens` and `@larose-ui/core` when they change alongside `@larose-ui/react`.

### Creating a changeset

```bash
pnpm changeset
```

1. Select affected packages.
2. Choose bump type:
   - **patch** — bug fixes, internal fixes
   - **minor** — new features, new components (backward compatible)
   - **major** — breaking API changes
3. Write a clear summary (it becomes the changelog entry).

Commit the generated file in `.changeset/` with your PR.

### What happens on merge to `main`

The [Release workflow](.github/workflows/release.yml) will:

1. Build and test
2. If pending changesets exist, run `changeset version` and `changeset publish`
3. Push version bumps and tags to `main`

Maintainers must configure the **`NPM_TOKEN`** repository secret for npm publish to succeed.

## Quality gates

`make test-all` mirrors CI:

- lint
- typecheck
- tests
- build
- visual regression manifest
- doctor (CI mode)
- a11y audit
- publish readiness (`pnpm verify:publish`)

Run this before merging significant work when possible.

## Documentation

- Architecture: [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md)
- Runtime: [`docs/runtime/RUNTIME_2.md`](docs/runtime/RUNTIME_2.md)
- Migration: [`docs/ecosystem/MIGRATION.md`](docs/ecosystem/MIGRATION.md)
- Design language: [`docs/design/REFINED_DESIGN_LANGUAGE.md`](docs/design/REFINED_DESIGN_LANGUAGE.md)

Update package READMEs when public APIs change.

## Questions

Open a [GitHub issue](https://github.com/hamdymohamedak/larose-ui/issues) for bugs or feature discussion before large changes.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
