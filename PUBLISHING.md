# Publishing laRose to npm

This monorepo publishes scoped packages under `@larose/*` using [Changesets](https://github.com/changesets/changesets).

## Prerequisites

1. npm account with access to the `@larose` scope
2. `NPM_TOKEN` set in CI (GitHub secret) for automated releases
3. Update repository URLs if needed:

```bash
LAROSE_REPO_URL=https://github.com/YOUR_ORG/laRose.git node scripts/sync-publish-metadata.mjs
```

## Verify readiness

```bash
pnpm build
pnpm test
pnpm run doctor
pnpm verify:publish
```

## Release workflow (maintainers)

### 1. Record changes

```bash
pnpm changeset
```

Select affected packages and bump type (patch/minor/major). Commit the generated `.changeset/*.md` file.

### 2. Version packages

```bash
pnpm version-packages
```

Updates package versions and changelogs. Commit the result.

### 3. Publish to npm

```bash
pnpm release:publish
```

Runs build and `changeset publish`. Requires `npm login` locally or `NPM_TOKEN` in CI.

## CI automation

`.github/workflows/release.yml` runs on push to `main` when Changesets are present. It opens a "Version Packages" PR or publishes when merged.

## Package list

All packages in `packages/*` are published except private apps:

- `@larose/playground` (Storybook)
- `@larose/demo` (Vite integration demo)

## First-time npm setup

```bash
npm login
npm access public @larose   # if scope is new
pnpm verify:publish
pnpm release:publish
```

## After publish

Consumers install with:

```bash
pnpm add @larose/runtime @larose/react @larose/tokens
```

See [GETTING_STARTED.md](./GETTING_STARTED.md) for integration patterns.
