# Package Versioning

laRose uses **independent versioning** via [Changesets](https://github.com/changesets/changesets).

## Rules

1. Each publishable `@larose-ui/*` package has its own semver.
2. Add a changeset whenever you change a publishable package.
3. Prefer keeping actively developed packages on the same **minor** band when releasing a coordinated platform cut (for example `0.2.x`), but do **not** force artificial major bumps or downgrades.
4. `-core` packages (`forms-core`, `data-core`, `liquid-glass-core`, …) version independently from their React adapters.
5. Apps (`playground`, `demo`, `docs`) stay private and unversioned for npm.

## Current baseline

Most packages target the `0.2.x` line. A few mature adapters (`runtime`, `devtools`, `ai`) may sit on `1.0.0` when their public API is treated as stable.

## Anti-patterns

- Leaving some packages on stale minors (`0.1.x`) while the rest of the monorepo moved to `0.2.x` without a changeset.
- Releasing UI packages without updating dependent `-core` packages that changed in the same PR.
