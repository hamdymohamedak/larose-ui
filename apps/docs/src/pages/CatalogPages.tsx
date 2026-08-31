import { Link, Navigate, useParams } from 'react-router-dom';
import { Badge, Card, Typography } from '@larose-ui/react';
import { ApiReference } from '@/components/ApiReference';
import { CodeBlock } from '@/components/CodeBlock';
import { ComponentAnatomySection } from '@/components/ComponentAnatomySection';
import { ComponentExamples } from '@/components/ComponentExamples';
import { ComponentPreview } from '@/components/ComponentPreview';
import { CopyButton } from '@/components/CopyButton';
import { MarkdownContent } from '@/components/MarkdownContent';
import { PropsPlayground } from '@/components/PropsPlayground';
import { guideSources } from '@/content/guides';
import { getComponentApi } from '@/data/api.generated';
import { getComponentExamples } from '@/data/examples.generated';
import { componentAnatomy, playgroundControls } from '@/data/playground.generated';
import {
  docsComponentCategories,
  docsComponents,
  docsPackages,
  findComponent,
  findGuide,
  findPackage,
} from '@/data/catalog.generated';

export function GuidePage() {
  const { guideId } = useParams();
  const guide = guideId ? findGuide(guideId) : undefined;
  const source = guideId ? guideSources[guideId] : undefined;

  if (!guide || typeof source !== 'string' || !source.trim()) {
    return <Navigate to="/docs/guides" replace />;
  }

  return <MarkdownContent source={source} />;
}

export function GuidesIndexPage() {
  return (
    <div className="docs-content">
      <h1>Guides</h1>
      <p>Architecture, runtime, design system, migration, and platform documentation.</p>
      <div className="docs-index-grid">
        {Object.keys(guideSources).map((id) => {
          const guide = findGuide(id);
          if (!guide) return null;
          return (
            <Card key={id} title={guide.title} padding="md">
              <Typography muted className="docs-card-copy">
                Full guide with IDE-style syntax highlighting.
              </Typography>
              <Link className="docs-card-link" to={`/docs/guides/${id}`}>
                Open guide
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function PackagePage() {
  const { packageId } = useParams();
  const pkg = packageId ? findPackage(packageId) : undefined;

  if (!pkg) {
    return <Navigate to="/docs/packages" replace />;
  }

  return (
    <div className="docs-content">
      <Badge variant="info">{pkg.name}</Badge>
      <h1>{pkg.name}</h1>
      <p>{pkg.tagline}</p>
      {pkg.peer ? (
        <p>
          <strong>Peer dependency:</strong> <code>{pkg.peer}</code>
        </p>
      ) : null}

      <h2>Install</h2>
      <CodeBlock language="bash" code={`pnpm add ${pkg.name}`} title="Install" />

      <h2>Usage</h2>
      <CodeBlock
        code={pkg.example}
        language={pkg.example.includes('<') ? 'tsx' : 'bash'}
        title="Quick start"
      />

      <h2>Features</h2>
      <ul>
        {pkg.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}

export function PackagesIndexPage() {
  return (
    <div className="docs-content">
      <h1>Packages</h1>
      <p>All publishable packages in the laRose monorepo.</p>
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

function basicUsage(name: string): string {
  const voidElements = new Set(['Spinner', 'Skeleton']);
  if (voidElements.has(name)) {
    return `<${name} />`;
  }
  return `<${name}>Example</${name}>`;
}

export function ComponentDocPage() {
  const { componentId } = useParams();
  const component = componentId ? findComponent(componentId) : undefined;

  if (!component) {
    return <Navigate to="/docs/components" replace />;
  }

  const api = getComponentApi(component.name);
  const examples = getComponentExamples(component.name);
  const controls = playgroundControls[component.name];
  const anatomy = componentAnatomy[component.name];
  const importCode = `import { ${component.name} } from '@larose-ui/react';`;
  const usageCode = basicUsage(component.name);

  return (
    <div className="docs-content docs-component-page">
      <Badge variant="info">{component.category}</Badge>
      <h1>{component.name}</h1>
      <p>
        React component from <code>@larose-ui/react</code> with generated API reference, interactive
        controls, and live preview.
      </p>

      <ComponentPreview slug={component.id} />

      {controls ? <PropsPlayground componentName={component.name} controls={controls} /> : null}

      <section id="installation">
        <h2>Installation</h2>
        <CodeBlock code="pnpm add @larose-ui/react @larose-ui/tokens" language="bash" title="Install" />
      </section>

      <section id="import">
        <h2>Import</h2>
        <div className="docs-code-toolbar">
          <span />
          <CopyButton value={importCode} />
        </div>
        <CodeBlock code={importCode} language="tsx" title="Import" />
      </section>

      <ComponentExamples componentName={component.name} examples={examples} />

      {api ? <ApiReference api={api} componentName={component.name} /> : null}

      {anatomy ? <ComponentAnatomySection anatomy={anatomy} /> : null}

      <section id="usage">
        <h2>Basic usage</h2>
        <div className="docs-code-toolbar">
          <span />
          <CopyButton value={usageCode} />
        </div>
        <CodeBlock code={usageCode} language="tsx" title="Basic usage" />
      </section>
    </div>
  );
}

export function ComponentsIndexPage() {
  return (
    <div className="docs-content">
      <h1>Components</h1>
      <p>
        {docsComponents.length} exported React components from <code>@larose-ui/react</code>.
      </p>
      {docsComponentCategories.map((category) => {
        const items = docsComponents.filter((entry) => entry.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="docs-category-section">
            <h2>{category}</h2>
            <div className="docs-link-grid">
              {items.map((item) => (
                <Link key={item.id} className="docs-link-chip" to={`/docs/components/${item.id}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
