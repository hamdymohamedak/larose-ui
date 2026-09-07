# Agent-ready hosting

# Agent-ready docs hosting

laRose docs ship machine-readable discovery files under `apps/docs/public/`:

| Asset | Path |
|-------|------|
| robots.txt | `/robots.txt` |
| sitemap.xml | `/sitemap.xml` |
| API catalog (RFC 9727) | `/.well-known/api-catalog` |
| Agent Skills index | `/.well-known/agent-skills/index.json` |
| MCP Server Card | `/.well-known/mcp/server-card.json` |
| AI catalog | `/.well-known/ai-catalog.json` |
| Markdown pages | `/agent/markdown/*.md` |
| DNS-AID zone example | `/dns-aid.zone.example` |

## Why GitHub Pages project sites fail some checks

RFC 9309 requires `/robots.txt` at the **origin root**. A project site at
`https://user.github.io/larose-ui/` serves robots at `/larose-ui/robots.txt`, while
scanners request `https://user.github.io/robots.txt` → **404**.

GitHub Pages also ignores Cloudflare `_headers` and cannot negotiate
`Accept: text/markdown`.

## Recommended: Cloudflare Pages at site root

1. Deploy with `VITE_BASE_PATH=/` on Cloudflare Pages (or any host at the domain root).
2. Keep `apps/docs/functions/_middleware.js` in the project (copied into `dist/functions`).
3. Set `BASE_PATH=/` in the Pages project environment if needed.
4. Point a custom domain at the Pages project and enable DNSSEC.

Then `/robots.txt`, Link headers, api-catalog MIME type, and Markdown for Agents all work.

## DNS for AI Discovery (DNS-AID)

Publish the records from `/dns-aid.zone.example` (regenerated on docs build) on a
DNSSEC-signed zone you control — typically your custom docs domain, **not**
`github.io`.

Minimum records:

- `_index._agents.<domain>` → SVCB/HTTPS pointing at `/.well-known/api-catalog`
- `_a2a._agents.<domain>` → SVCB pointing at `/llms.txt`
- `_catalog._agents.<domain>` → TXT `url=https://…/.well-known/ai-catalog.json`

## Validate

```bash
curl -sI https://YOUR_DOCS_HOST/robots.txt
curl -sI https://YOUR_DOCS_HOST/sitemap.xml
curl -sI https://YOUR_DOCS_HOST/.well-known/api-catalog
curl -sI -H 'Accept: text/markdown' https://YOUR_DOCS_HOST/
curl -sI https://YOUR_DOCS_HOST/ | grep -i '^link:'
```

Or scan with [isitagentready.com](https://isitagentready.com).
