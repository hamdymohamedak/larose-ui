import { Link, Navigate, useParams } from 'react-router-dom';
import { Badge, Card, Typography } from '@larose-ui/react';
import { ApiReference } from '@/components/ApiReference';
import { CodeBlock } from '@/components/CodeBlock';
import { ComponentAnatomySection } from '@/components/ComponentAnatomySection';
import { ComponentExamples } from '@/components/ComponentExamples';
import { ComponentPreview } from '@/components/ComponentPreview';
import { FrameworkCodeTabs } from '@/components/FrameworkCodeTabs';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { StoryCanvas } from '@/components/StoryCanvas';
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
import {
  getImportCode,
  getInstallCommand,
  getSupportedFrameworks,
  getUsageCode,
  PARITY_COMPONENTS,
} from '@/lib/frameworks';

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


function buildUsageSnippets(name: string) {
  return {
    react: getUsageCode(name, 'react'),
    vue: getUsageCode(name, 'vue'),
    svelte: getUsageCode(name, 'svelte'),
  };
}

function buildImportSnippets(name: string) {
  return {
    react: getImportCode(name, 'react'),
    vue: getImportCode(name, 'vue'),
    svelte: getImportCode(name, 'svelte'),
  };
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
  const supported = getSupportedFrameworks(component.name);
  const isParity = PARITY_COMPONENTS.has(component.name);

  return (
    <div className="docs-content docs-component-page docs-sb-page">
      <header className="docs-sb-page__header">
        <div className="docs-sb-page__meta">
          <Badge variant="info">{component.category}</Badge>
          {isParity ? <Badge variant="success">React · Vue · Svelte</Badge> : null}
        </div>
        <h1>{component.name}</h1>
        <p className="docs-sb-page__lede">
          {isParity
            ? 'Foundation component with shared API across React, Vue 3, and Svelte 5.'
            : 'React component from @larose-ui/react with live preview and Storybook-aligned examples.'}
        </p>
        <FrameworkSelector supported={supported} />
      </header>

      <section className="docs-sb-page__primary">
        <h2 className="docs-sb-page__section-label">Preview</h2>
        {controls ? (
          <PropsPlayground componentName={component.name} controls={controls} />
        ) : (
          <StoryCanvas storyName="Default" padded centered>
            <ComponentPreview slug={component.id} />
          </StoryCanvas>
        )}
      </section>

      <section className="docs-sb-page__usage">
        <h2 className="docs-sb-page__section-label">Usage</h2>
        <FrameworkCodeTabs
          componentName={component.name}
          snippets={buildUsageSnippets(component.name)}
          title="Quick usage"
          showSelector={false}
        />
      </section>

      <ComponentExamples componentName={component.name} examples={examples} />

      <details className="docs-sb-page__details">
        <summary>Installation &amp; import</summary>
        <div className="docs-sb-page__details-body">
          <h3>Install</h3>
          <FrameworkCodeTabs
            showSelector={false}
            snippets={{
              react: getInstallCommand('react'),
              vue: getInstallCommand('vue'),
              svelte: getInstallCommand('svelte'),
            }}
            title="Install"
          />
          <h3>Import</h3>
          <FrameworkCodeTabs
            componentName={component.name}
            snippets={buildImportSnippets(component.name)}
            showSelector={false}
          />
        </div>
      </details>

      {api ? <ApiReference api={api} componentName={component.name} /> : null}
      {anatomy ? <ComponentAnatomySection anatomy={anatomy} /> : null}
    </div>
  );
}

export function ComponentsIndexPage() {
  return (
    <div className="docs-content docs-sb-page">
      <header className="docs-sb-page__header">
        <h1>Components</h1>
        <p className="docs-sb-page__lede">
          {docsComponents.length} components from the laRose catalog — each page mirrors Storybook
          with live preview, usage code, and story variants.{' '}
          <strong>{PARITY_COMPONENTS.size}</strong> foundation components ship for React, Vue, and
          Svelte.
        </p>
        <FrameworkSelector />
      </header>

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
                  {PARITY_COMPONENTS.has(item.name) ? (
                    <span className="docs-link-chip__badge">3 frameworks</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
