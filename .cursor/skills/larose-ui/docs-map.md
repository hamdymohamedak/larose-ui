# laRose docs map (for agents)

**Hosted docs:** https://hamdymohamedak.github.io/larose-ui  
**Source app:** `apps/docs` (local: `pnpm webdocs` → http://localhost:5174)

## Primary routes

| Section | Path |
|---------|------|
| Overview | `/` |
| Getting started | `/docs/getting-started` |
| Packages | `/docs/packages` |
| Package | `/docs/packages/{id}` e.g. `/docs/packages/react` |
| Components index | `/docs/components` |
| Component | `/docs/components/{id}` e.g. `/docs/components/button` |
| Component metadata JSON | `/components/{id}.json` |
| Guide: Vue | `/docs/guides/vue` |
| Guide: Svelte | `/docs/guides/svelte` |
| Guide: Next.js | `/docs/guides/nextjs` |
| Guide: Nuxt | `/docs/guides/nuxt` |
| Theme builder | `/docs/design/theme-builder` |
| Design tokens | `/docs/design/tokens` |
| Motion | `/docs/design/motion` |
| Architecture | `/docs/architecture` |
| Accessibility | `/docs/accessibility` |
| Playground | `/docs/playground` |
| Migration | `/docs/migration` |
| Changelog | `/changelog` |

Navigation source of truth: `apps/docs/src/navigation.ts`.

## Component IDs (kebab-case → docs path)

Prefix all with `/docs/components/`.

**Actions:** `button`, `async-button`, `button-group`, `square-button`, `help-button`, `activity-share-button`, `collaboration-button`  
**Forms:** `input`, `secure-field`, `textarea`, `select`, `checkbox`, `radio`, `switch`, `file-upload`, `token-field`, `date-picker`, `date-range-picker`, `date-time-picker`, `time-picker`, `calendar-grid`, `picker`, `wheel-picker`, `wheel-column`  
**Feedback:** `alert`, `alert-dialog`, `badge`, `empty-state`, `progress`, `skeleton`, `spinner`, `tooltip`  
**Layout:** `card`, `box`, `collection`, `column-view`, `lockup`, `split-view`, `ornament`, …  
**Navigation:** `tabs`, `tab-view`, `breadcrumb`, `menu`, `menu-bar`, `pagination`, `header`, `dock-bar`, …  
**Overlay:** `modal`, `dialog`, `drawer`, `popover`, `command-palette`, `context-menu`  
**Data:** `table`, `data-table`, `list`, `chart`, `outline-view`  
**Glass:** `liquid-glass`, `liquid-glass-button`, `liquid-glass-switch`, …  
**Toolbar / Files / DragDrop:** see catalog (`apps/docs/src/data/catalog.generated.ts`) — ~137 components total.

## Repo markdown docs

| Topic | Path |
|-------|------|
| Public API | `docs/PUBLIC_API.md` |
| Architecture | `docs/architecture/ARCHITECTURE.md` |
| Runtime | `docs/runtime/RUNTIME_2.md` |
| Observability | `docs/observability/OBSERVABILITY_2.md` |
| Migration | `docs/ecosystem/MIGRATION.md` |
| Quality | `docs/quality/QUALITY_ENGINE.md` |
| AI runtime | `docs/ai/AI_RUNTIME.md` |
| Roadmap | `docs/ROADMAP.md` |
| Contributing | `CONTRIBUTING.md` |
| README quick start | `README.md` |

## WebMCP tools (docs site)

When the docs site is open in a WebMCP-capable browser, tools in `apps/docs/src/webmcp/docs-tools.ts`:

| Tool | Purpose |
|------|---------|
| `search_docs` | Full-text search → `{ title, type, path, excerpt }` |
| `navigate_docs` | Client navigate to a docs path |
| `list_packages` | Package catalog |
| `list_components` | Optional `category` filter |
| `get_component_metadata` | Fetch `/components/{id}.json` |
| `get_current_page` | Current docs path/title |

Prefer these when the user has docs open; otherwise use hosted URLs or repo markdown.

## Storybook / sandboxes (local monorepo)

| Command | URL |
|---------|-----|
| `pnpm dev` | Storybook http://localhost:6006 |
| `pnpm demo` / `pnpm sandbox:react` | http://localhost:5173 |
| `pnpm sandbox:vue` | http://localhost:5174 |
| `pnpm sandbox:svelte` | http://localhost:5175 |
| `pnpm webdocs` | Docs http://localhost:5174 (when not conflicting) |
