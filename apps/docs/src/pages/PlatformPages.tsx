import { Link } from 'react-router-dom';
import { Badge, Card, Typography } from '@larose-ui/react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { docsChangelog } from '@/data/changelog.generated';
import { docsPackages } from '@/data/catalog.generated';
import { PACKAGE_LAYERS } from '@/lib/packages';
import { guideSources } from '@/content/guides';

const ARCHITECTURE = `
# laRose UI architecture

laRose is **modular by design**. Apps do not install a single mega-package — they compose a small stack for their framework, then opt into intelligence packages.

\`\`\`text
Foundation (always)
  @larose-ui/tokens
  @larose-ui/styles
        │
Framework UI (pick one)
  @larose-ui/react  |  @larose-ui/vue  |  @larose-ui/svelte
        │
Runtime (recommended for apps)
  @larose-ui/runtime-react|vue|svelte
        │
        ├── network / offline (transitive)
        │
Intelligence (opt-in)
  data-* · forms-* · permissions-* · observability-*
  ai-* · enterprise-* · devtools-*
        │
Meta-frameworks
  @larose-ui/next · @larose-ui/nuxt · @larose-ui/sveltekit
\`\`\`

## Mental model

- **Install adapters**, not \`*-core\` packages — cores ship transitively unless you are building custom adapters.
- **UI-only** stack = components + tokens + styles.
- **Full runtime** adds toast, network, offline, and i18n via \`runtime-*\`.
- See the [Packages hub](/docs/packages) for every install command and when to use each package.
`;

export function ArchitecturePage() {
  return (
    <div className="docs-content">
      <MarkdownContent source={ARCHITECTURE} />
      <p>
        <Link className="docs-card-link" to="/docs/packages">
          Open Packages hub →
        </Link>
      </p>
      <h2>Packages by layer</h2>
      {PACKAGE_LAYERS.map((layer) => {
        const pkgs = docsPackages
          .filter((pkg) => pkg.layer === layer.id)
          .sort((a, b) => a.name.localeCompare(b.name));
        return (
          <section key={layer.id} className="docs-pkg-section">
            <h3>{layer.label}</h3>
            <p className="docs-pkg-layer-blurb">{layer.blurb}</p>
            <div className="docs-index-grid">
              {pkgs.map((pkg) => (
                <Card key={pkg.id} title={pkg.name} padding="md">
                  <Typography muted className="docs-card-copy">
                    {pkg.role}
                  </Typography>
                  <Link className="docs-card-link" to={`/docs/packages/${pkg.id}`}>
                    View package
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function AccessibilityPage() {
  return (
    <div className="docs-content">
      <h1>Accessibility</h1>
      <p>
        laRose components ship with keyboard support, ARIA patterns, focus management, and reduced-motion
        behavior. Component pages include generated accessibility notes from the TypeScript API.
      </p>
      <ul>
        <li>Keyboard-first navigation across overlays, menus, and command search</li>
        <li>Focus rings and disabled states on interactive controls</li>
        <li>Reduced motion respected via theme motion configuration</li>
        <li>RTL preview available on component playgrounds</li>
      </ul>
      <p>
        See also the <Link to="/docs/guides/customization">customization guide</Link> and{' '}
        <Link to="/docs/design/motion">motion playground</Link>.
      </p>
    </div>
  );
}

export function MigrationPage() {
  const source = guideSources.migration ?? '# Migration\n\nMigration guide unavailable.';
  return (
    <div className="docs-content">
      <MarkdownContent source={source} />
    </div>
  );
}

export function ChangelogPage() {
  return (
    <div className="docs-content">
      <h1>Changelog</h1>
      <p>Generated from package CHANGELOG files in the monorepo.</p>
      {docsChangelog.map((entry) => (
        <section key={`${entry.package}-${entry.version}`} className="docs-changelog-entry">
          <Badge variant="info">{entry.package}</Badge>
          <h2>{entry.heading}</h2>
          <pre className="docs-plain-code">{entry.body || 'No details recorded.'}</pre>
        </section>
      ))}
    </div>
  );
}
