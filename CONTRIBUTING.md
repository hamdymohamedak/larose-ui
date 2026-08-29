# Contributing to laRose

Thank you for your interest in contributing to laRose — the UI Operating System for Modern SaaS Applications.

This document explains how to set up the project, submit changes, and meet our quality standards.

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Development workflow](#development-workflow)
- [Quality gates](#quality-gates)
- [Pull request guidelines](#pull-request-guidelines)
- [Changesets and releases](#changesets-and-releases)
- [Architecture constraints](#architecture-constraints)
- [Where to ask questions](#where-to-ask-questions)

## Code of conduct

Be respectful, constructive, and inclusive. Focus feedback on the code and design, not the person. We aim to maintain a professional, welcoming environment for all contributors.

## Getting started

### Prerequisites

- **Node.js** 20 or later
- **pnpm** 9 (see `packageManager` in root `package.json`)

### Setup

```bash
git clone <repository-url>
cd laRose
pnpm install
pnpm build
pnpm test
```

Verify your environment:

```bash
pnpm run doctor
pnpm a11y
```

### Storybook playground

```bash
pnpm dev   # http://localhost:6006
```

Use Storybook to develop and validate components across themes, locales, permissions, and network states.

Further integration guidance: [GETTING_STARTED.md](./GETTING_STARTED.md).

## Project structure

laRose is a **pnpm + Turborepo** monorepo.

```text
laRose/
├── packages/          # Publishable @larose/* libraries
├── apps/
│   └── playground/    # Storybook (private, not published)
├── contracts/         # Sample UI/API contract schemas
├── scripts/           # CI helpers (budgets, a11y audit)
└── .github/workflows/ # CI and release automation
```

Package layout and dependency rules: [PACKAGE_STRUCTURE.md](./PACKAGE_STRUCTURE.md).

Platform design: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development workflow

1. **Create a branch** from `main` with a descriptive name (e.g. `feat/smart-form-adapter`, `fix/session-guard-a11y`).
2. **Make focused changes** — one concern per pull request when possible.
3. **Add or update tests** for behavior you introduce or change.
4. **Run quality gates locally** before opening a PR (see below).
5. **Open a pull request** with a clear summary and test plan.

### Working on a single package

```bash
pnpm --filter @larose/react test
pnpm --filter @larose/runtime build
```

Turbo caches builds across packages; run `pnpm build` at the root before testing packages that depend on others.

## Quality gates

All pull requests must pass CI. Run these locally:

| Command | Purpose |
|---------|---------|
| `pnpm typecheck` | TypeScript strict checks |
| `pnpm test` | Unit and component tests |
| `pnpm build` | Build all packages |
| `pnpm run doctor` | Bundle budgets, deprecations, contracts, a11y heuristics |
| `pnpm check-budgets` | Fail on bundle size overages |
| `pnpm a11y` | Accessibility scan of `@larose/react` sources |

Details: [DEVOPS_STRATEGY.md](./DEVOPS_STRATEGY.md) and [TESTING_STRATEGY.md](./TESTING_STRATEGY.md).

### Testing conventions

- Use **Vitest** for unit and component tests.
- Wrap React components with `renderWithLaRose()` from `@larose/testing` when runtime context is required.
- Prefer testing behavior and accessibility over implementation details.

### Accessibility

- Dialogs and modals must have accessible labels (`title`, `aria-labelledby`, or `aria-label`).
- Interactive elements need visible text or an `aria-label`.
- Run `pnpm a11y` after changing components in `@larose/react`.

## Pull request guidelines

### Title format

Use a concise, imperative summary:

```text
feat(ai): add OpenAI adapter for SmartForm
fix(data): dispatch session-expired only on 401
docs: update GETTING_STARTED examples
```

### Description

Include:

1. **What** changed and **why**
2. **How to test** (commands, Storybook stories, screenshots if UI changed)
3. **Breaking changes** (if any) and migration notes

### Scope

- Match existing code style and patterns in the package you edit.
- Avoid unrelated refactors in the same PR.
- Do not commit secrets, `.env` files, or local IDE settings.

## Changesets and releases

Published packages use [Changesets](https://github.com/changesets/changesets) for versioning and changelogs.

When your change affects the public API or behavior of a published `@larose/*` package:

```bash
pnpm changeset
```

Follow the prompts, commit the generated file in `.changeset/`, and include it in your PR.

Maintainers run `pnpm version-packages` and `pnpm release` to publish (requires `NPM_TOKEN` in CI).

## Architecture constraints

Please respect these boundaries:

1. **`@larose/core` has zero dependencies** — keep primitives framework-agnostic.
2. **No circular dependencies** between packages.
3. **`LaRoseProvider` lives in `@larose/runtime`**, not `@larose/react`.
4. **Permissions are resource.action strings** — avoid inline `user.role === "admin"` patterns.
5. **UI is not the authorization layer** — backend must enforce access; UI reflects the model.
6. **Intelligence packages compose at the app layer** — avoid cross-dependencies between `@larose/data`, `@larose/forms`, `@larose/permissions`, etc.

Security patterns: [SECURITY.md](./SECURITY.md).

- [DEVOPS_STRATEGY.md](./DEVOPS_STRATEGY.md) — CI, releases, quality gates

Migration and releases: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md), [CHANGELOG.md](./CHANGELOG.md), [PUBLISHING.md](./PUBLISHING.md).

## Where to ask questions

- Open a **GitHub issue** for bugs, feature requests, or design discussions.
- Reference relevant docs (`ARCHITECTURE.md`, `PACKAGE_STRUCTURE.md`) in your issue for faster triage.

---

Thank you for helping make laRose better.
