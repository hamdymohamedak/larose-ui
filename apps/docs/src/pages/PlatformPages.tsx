import { Link } from 'react-router-dom';
import { Badge, Card, Typography } from '@larose-ui/react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { docsChangelog } from '@/data/changelog.generated';
import { docsPackages } from '@/data/catalog.generated';
import { guideSources } from '@/content/guides';

const ARCHITECTURE = `
# laRose UI Operating System

\`\`\`text
@larose-ui/react
        │
        ├── @larose-ui/core
        ├── @larose-ui/tokens
        ├── @larose-ui/themes
        │
        ↓
@larose-ui/runtime
        │
        ├── permissions
        ├── data
        ├── observability
        └── offline
\`\`\`

## Package relationships

- **react** — production UI components and LaRoseProvider
- **tokens** — CSS custom properties and component token registries
- **themes** — \`createTheme\`, presets, component defaults
- **runtime** — network, session, permissions, toasts
- **data / forms / ai / enterprise** — higher-level SaaS capabilities
`;

export function ArchitecturePage() {
  return (
    <div className="docs-content">
      <MarkdownContent source={ARCHITECTURE} />
      <h2>Packages in this monorepo</h2>
      <div className="docs-index-grid">
        {docsPackages.map((pkg) => (
          <Card key={pkg.id} title={pkg.name} padding="md">
            <Typography muted className="docs-card-copy">
              {pkg.tagline}
            </Typography>
            <Link className="docs-card-link" to={`/docs/packages/${pkg.id}`}>
              View package
            </Link>
          </Card>
        ))}
      </div>
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
