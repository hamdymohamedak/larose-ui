# Changelog

All notable changes to laRose packages are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Automated codemods in `@larose/migration` (`applyCodemods`, token renames, provider import fixes)
- `larose migrate --apply` CLI flag
- Legacy token alias stylesheet `@larose/tokens/legacy-aliases.css`
- Runtime deprecation warnings via `warnDeprecation()` in `@larose/core`
- `MIGRATION_GUIDE.md` with before/after examples

## [0.1.0] - 2026-08-29

Initial public platform release.

### Added

**Foundation**
- `@larose/core`, `@larose/tokens`, `@larose/react`, `@larose/playground`

**Runtime**
- `@larose/network`, `@larose/offline`, `@larose/runtime`
- i18n (en, ar, de), RTL, AdaptiveTable, OfflineForm

**Intelligence**
- `@larose/permissions`, `@larose/data`, `@larose/forms`
- Feature flags, undo UX, explainable UI

**Observability**
- `@larose/observability` — event collector, funnel metrics, rage click detection

**DevOps**
- `@larose/contracts`, `@larose/migration`, `@larose/testing`, `@larose/cli`, `@larose/devtools`
- CI pipeline, bundle budgets, `larose doctor`

**Enterprise & AI**
- `@larose/enterprise` — audit trails, version compatibility, UI schema IaC, security patterns
- `@larose/ai` — SmartTable, SmartForm, pluggable adapters

**Production readiness**
- `@larose/accessibility` — component source scanner
- Changesets release workflow

[Unreleased]: https://github.com/your-org/larose/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/larose/releases/tag/v0.1.0
