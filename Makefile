.PHONY: test test-all test-unit lint typecheck build check ci quality help

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

help:
	@echo "laRose Makefile"
	@echo ""
	@echo "  make test       Run all package tests (pnpm test)"
	@echo "  make quality    Full CI suite (same as GitHub quality job)"
	@echo "  make test-all   Alias for make quality"
	@echo "  make test-unit  Same as make test"
	@echo "  make check      Alias for make quality"
	@echo "  make ci         Alias for make quality"
