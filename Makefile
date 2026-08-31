.PHONY: test test-all test-unit lint typecheck build check ci help

# Run all package tests (Vitest via Turbo)
test: test-unit

test-unit:
	pnpm test

# Full validation suite (matches CI)
test-all: lint typecheck test-unit build visual-regression doctor a11y verify-publish

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

# Shorthand for test-all
check: test-all
ci: test-all

help:
	@echo "laRose Makefile"
	@echo ""
	@echo "  make test       Run all package tests (pnpm test)"
	@echo "  make test-all   Full CI suite (lint, typecheck, test, build, doctor, …)"
	@echo "  make test-unit  Same as make test"
	@echo "  make check      Alias for test-all"
	@echo "  make ci         Alias for test-all"
