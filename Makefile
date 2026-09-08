.PHONY: test test-all test-unit lint typecheck build check ci quality help contribute contribute-list contribute-remove parity-sync

# Run all package tests (Vitest via Turbo)
test: test-unit

test-unit:
	pnpm test

# Full validation suite (matches .github/workflows/ci.yml quality job)
test-all: quality

quality: lint typecheck test-unit build visual-regression doctor a11y verify-publish

# Alias for the CI quality job
check: quality
ci: quality

lint:
	pnpm lint

typecheck:
	pnpm typecheck

build:
	pnpm build

visual-regression:
	pnpm visual-regression

doctor:
	pnpm doctor:ci

a11y:
	pnpm a11y

verify-publish:
	pnpm verify:publish

# ─── Storybook cross-framework parity sync ────────────────────────────────────
#
# Run this after exporting a new component from all three index files to:
#   1. Regenerate cross-framework component maps (vuePackageComponents / sveltePackageComponents)
#   2. Patch curated story files to add fw-vue + fw-svelte tags and crossFramework param
#   3. Update titleRegistry.generated.ts with any new Foundation/ story → registry id mappings
#   4. Update catalog.json
#
# This is called automatically by `make contribute NAME=X PACKAGE=all` (after scaffold).
# Run it manually any time after implementing a component in all three packages.
parity-sync:
	@echo "[larose] Regenerating Storybook cross-framework parity..."
	@node scripts/generate-storybook-parity.mjs
	@echo "[larose] Parity sync complete. Restart pnpm dev if Storybook is running."

# Contributor guided scaffold — stubs + Storybook story + checklist (no implementation).
# Example: make contribute NAME=StatusPill PACKAGE=all
# Optional: DRY_RUN=1 SKIP_STYLES=1 SKIP_CHANGELOG=1 SKIP_STORY=1
#           SANDBOX_HOOK=forms SCENARIO=my-flow
PACKAGE ?= react
NAME ?=
DRY_RUN ?=
SKIP_STYLES ?=
SKIP_CHANGELOG ?=
SKIP_STORY ?=
WITH_STORY ?=
SANDBOX_HOOK ?=
SCENARIO ?=

contribute:
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make contribute NAME=StatusPill PACKAGE=all"; \
		echo "       make contribute NAME=StatusPill PACKAGE=react"; \
		echo "       make contribute NAME=X PACKAGE=all SANDBOX_HOOK=forms"; \
		echo "       make contribute-remove NAME=StatusPill PACKAGE=react"; \
		echo "       make contribute-list"; \
		exit 1; \
	fi
	@pnpm --filter @larose-ui/cli build >/dev/null
	@FORCE_COLOR=1 node packages/cli/dist/cli.js contribute component "$(NAME)" --package "$(PACKAGE)" \
		$(if $(DRY_RUN),--dry-run,) \
		$(if $(SKIP_STYLES),--skip-styles,) \
		$(if $(SKIP_CHANGELOG),--skip-changelog,) \
		$(if $(SKIP_STORY),--skip-story,) \
		$(if $(WITH_STORY),--with-story,) \
		$(if $(SANDBOX_HOOK),--with-sandbox-hook $(SANDBOX_HOOK),) \
		$(if $(SCENARIO),--scenario $(SCENARIO),)
	@# When targeting all packages, auto-sync Storybook wiring so the component
	@# is immediately visible in Vue 3 / Svelte 5 preview once implemented.
	@if [ "$(PACKAGE)" = "all" ] && [ -z "$(DRY_RUN)" ]; then \
		echo "[larose] Running parity-sync for all-package scaffold..."; \
		$(MAKE) parity-sync; \
	fi

contribute-list:
	@pnpm --filter @larose-ui/cli build >/dev/null
	@FORCE_COLOR=1 node packages/cli/dist/cli.js contribute list

contribute-remove:
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make contribute-remove NAME=StatusPill PACKAGE=react"; \
		echo "       make contribute-remove NAME=StatusPill PACKAGE=all"; \
		echo "       make contribute-remove NAME=StatusPill PACKAGE=react DRY_RUN=1"; \
		exit 1; \
	fi
	@pnpm --filter @larose-ui/cli build >/dev/null
	@FORCE_COLOR=1 node packages/cli/dist/cli.js contribute remove "$(NAME)" --package "$(PACKAGE)" \
		$(if $(DRY_RUN),--dry-run,) \
		$(if $(SKIP_STYLES),--skip-styles,) \
		$(if $(SANDBOX_HOOK),--with-sandbox-hook $(SANDBOX_HOOK),) \
		$(if $(SCENARIO),--scenario $(SCENARIO),)

help:
	@echo "laRose Makefile"
	@echo ""
	@echo "  make test       Run all package tests (pnpm test)"
	@echo "  make quality    Full CI suite (same as GitHub quality job)"
	@echo "  make test-all   Alias for make quality"
	@echo "  make test-unit  Same as make test"
	@echo "  make check      Alias for make quality"
	@echo "  make ci         Alias for make quality"
	@echo "  make parity-sync                    Re-sync Storybook cross-framework wiring"
	@echo "  make contribute-list                List packages you can contribute to"
	@echo "  make contribute NAME=X PACKAGE=all  Guided scaffold (react+vue+svelte+story) + auto parity-sync"
	@echo "  make contribute NAME=X PACKAGE=react    Scaffold + Storybook stub"
	@echo "  make contribute-remove NAME=X PACKAGE=react   Remove a contribute scaffold"
