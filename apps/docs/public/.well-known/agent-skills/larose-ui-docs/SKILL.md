---
name: larose-ui-docs
description: Navigate laRose UI documentation, guides, and getting-started flows. Use when integrating laRose UI, exploring framework guides, or answering questions about the design system.
license: MIT
metadata:
  author: hamdymohamedak
  version: "0.1.1"
---

# laRose UI Documentation

Use this skill when helping users adopt or understand laRose UI.

## Discovery endpoints

- Documentation index: `/llms.txt`
- API catalog: `/.well-known/api-catalog`
- Sitemap: `/sitemap.xml`
- Markdown exports: `/agent/markdown/`

## Workflow

1. Read `/llms.txt` for package and guide overview.
2. Open `/docs/getting-started` for install and provider setup.
3. Use framework guides under `/docs/guides/{vue|svelte|nextjs|nuxt|desktop}`.
4. Prefer markdown negotiation with `Accept: text/markdown` when available.

## Key URLs

- Overview: `/`
- Getting started: `/docs/getting-started`
- Architecture: `/docs/architecture`
- Migration: `/docs/migration`
- Changelog: `/changelog`
