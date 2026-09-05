import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Badge, Card, Typography } from '@larose-ui/react';
import { ApiReference } from '@/components/ApiReference';
import { CodeBlock } from '@/components/CodeBlock';
import { ComponentAnatomySection } from '@/components/ComponentAnatomySection';
import { ComponentExamples } from '@/components/ComponentExamples';
import { GlassComponentIntro } from '@/components/GlassComponentIntro';
import { FrameworkCodeTabs } from '@/components/FrameworkCodeTabs';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { LiveFrameworkPlayground } from '@/components/LiveFrameworkPlayground';
import { MarkdownContent } from '@/components/MarkdownContent';
import { guideSources } from '@/content/guides';
import { getComponentApi } from '@/data/api.generated';
import { getComponentExamples } from '@/data/examples.generated';
import { componentAnatomy } from '@/data/playground.generated';
import { getPlaygroundSeed } from '@/data/playgroundSeeds.generated';
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
import type { DocsFramework } from '@/lib/frameworks';
import {
  findRelatedPackages,
  INSTALL_STACKS,
  PACKAGE_LAYERS,
  resolveInstallCommand,
} from '@/lib/packages';
import { useDocsFramework } from '@/theme/FrameworkProvider';
import { isGlassDocComponent } from '@/lib/glassComponents';
import { GLASS_COMPONENT_COPY } from '@/previews/glass/glassComponentCopy';

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
  const { framework } = useDocsFramework();
  const [manager, setManager] = useState<'pnpm' | 'npm' | 'yarn'>('pnpm');

  if (!pkg) {
    return <Navigate to="/docs/packages" replace />;
  }

  const related = findRelatedPackages(pkg);
  const installCmd = resolveInstallCommand(
    pkg,
    pkg.install?.[framework] ? framework : undefined,
    manager,
  );
  const layerLabel = PACKAGE_LAYERS.find((entry) => entry.id === pkg.layer)?.label ?? pkg.layer;

  return (
    <div className="docs-content docs-pkg-detail">
      <div className="docs-pkg-detail__hero">
        <div className="docs-pkg-detail__badges">
          <Badge variant="info">{pkg.name}</Badge>
          <Badge variant="default">{layerLabel}</Badge>
          {pkg.consumerFacing ? (
            <Badge variant="success">Install in apps</Badge>
          ) : (
            <Badge variant="warning">Usually transitive</Badge>
          )}
        </div>
        <h1>{pkg.name}</h1>
        <p className="docs-pkg-detail__role">{pkg.role}</p>
        <p>{pkg.tagline}</p>
      </div>

      <section className="docs-pkg-section">
        <h2>When to install</h2>
        <p>{pkg.whenToInstall}</p>
        {pkg.transitiveNote ? <p className="docs-pkg-note">{pkg.transitiveNote}</p> : null}
        {pkg.peer ? (
          <p>
            <strong>Peer dependency:</strong> <code>{pkg.peer}</code>
          </p>
        ) : null}
      </section>

      <section className="docs-pkg-section">
        <h2>Install</h2>
        <div className="docs-pkg-manager-tabs" role="tablist" aria-label="Package manager">
          {(['pnpm', 'npm', 'yarn'] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={manager === id}
              className={manager === id ? 'is-active' : undefined}
              onClick={() => setManager(id)}
            >
              {id}
            </button>
          ))}
        </div>
        <CodeBlock language="bash" code={installCmd} title="Install" />
        {pkg.install?.react || pkg.install?.vue || pkg.install?.svelte ? (
          <div className="docs-pkg-fw-installs">
            <p className="docs-pkg-fw-label">Framework-specific</p>
            <FrameworkSelector />
            <CodeBlock
              language="bash"
              code={resolveInstallCommand(pkg, framework, manager)}
              title={`${framework} install`}
            />
          </div>
        ) : null}
      </section>

      <section className="docs-pkg-section">
        <h2>Usage</h2>
        <CodeBlock
          code={pkg.example}
          language={pkg.example.includes('<') ? 'tsx' : pkg.example.includes('defineNuxt') ? 'ts' : 'bash'}
          title="Quick start"
        />
      </section>

      <section className="docs-pkg-section">
        <h2>What it provides</h2>
        <ul>
          {pkg.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="docs-pkg-section">
          <h2>Related packages</h2>
          <div className="docs-index-grid">
            {related.map((entry) => (
              <Card key={entry.id} title={entry.name} padding="md">
                <Typography muted className="docs-card-copy">
                  {entry.role}
                </Typography>
                <Link className="docs-card-link" to={`/docs/packages/${entry.id}`}>
                  View package
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function PackagesIndexPage() {
  const [filter, setFilter] = useState<'all' | 'consumer' | DocsFramework>('all');

  const stacks =
    filter === 'all' || filter === 'consumer'
      ? INSTALL_STACKS
      : INSTALL_STACKS.filter((stack) => stack.framework === filter);

  const visible = docsPackages.filter((pkg) => {
    if (filter === 'consumer') return pkg.consumerFacing;
    if (filter === 'react') {
      return pkg.id === 'react' || pkg.id.endsWith('-react') || pkg.id === 'next' || ['tokens', 'styles', 'themes'].includes(pkg.id);
    }
    if (filter === 'vue') {
      return pkg.id === 'vue' || pkg.id.endsWith('-vue') || pkg.id === 'nuxt' || ['tokens', 'styles', 'themes'].includes(pkg.id);
    }
    if (filter === 'svelte') {
      return (
        pkg.id === 'svelte' ||
        pkg.id.endsWith('-svelte') ||
        pkg.id === 'sveltekit' ||
        ['tokens', 'styles', 'themes'].includes(pkg.id)
      );
    }
    return true;
  });

  return (
    <div className="docs-content docs-pkg-hub">
      <header className="docs-pkg-hub__hero">
        <Badge variant="info">Packages</Badge>
        <h1>Install what you need</h1>
        <p>
          laRose is modular on purpose — there is no single mega-package. You load{' '}
          <strong>tokens + styles</strong>, pick a <strong>UI adapter</strong> for your framework, then
          add <strong>runtime</strong> or <strong>intelligence</strong> packages only when you need them.
        </p>
      </header>

      <section className="docs-pkg-section">
        <h2>Starter stacks</h2>
        <p>Copy the stack that matches your app. Add intelligence packages later from the catalog below.</p>
        <div className="docs-pkg-stacks">
          {stacks.map((stack) => (
            <article key={stack.id} className="docs-pkg-stack-card">
              <h3>{stack.title}</h3>
              <p>{stack.description}</p>
              <CodeBlock language="bash" code={stack.command} title="Install" />
            </article>
          ))}
        </div>
      </section>

      <div className="docs-pkg-filters" role="toolbar" aria-label="Filter packages">
        {(
          [
            ['all', 'All'],
            ['consumer', 'App-facing'],
            ['react', 'React'],
            ['vue', 'Vue'],
            ['svelte', 'Svelte'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={filter === id ? 'is-active' : undefined}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {PACKAGE_LAYERS.map((layer) => {
        const pkgs = visible
          .filter((pkg) => pkg.layer === layer.id)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (pkgs.length === 0) return null;
        return (
          <section key={layer.id} className="docs-pkg-section">
            <h2>{layer.label}</h2>
            <p className="docs-pkg-layer-blurb">{layer.blurb}</p>
            <div className="docs-index-grid">
              {pkgs.map((pkg) => (
                <Card key={pkg.id} title={pkg.name} padding="md">
                  <Typography muted className="docs-card-copy">
                    {pkg.role}
                  </Typography>
                  <p className="docs-pkg-when">{pkg.whenToInstall}</p>
                  <CodeBlock
                    language="bash"
                    code={resolveInstallCommand(pkg)}
                    title="Install"
                  />
                  <Link className="docs-card-link" to={`/docs/packages/${pkg.id}`}>
                    Package details
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

function buildUsageSnippets(name: string) {
  const seed = getPlaygroundSeed(name);
  if (seed) {
    return {
      react: seed.react,
      vue: seed.vue ?? getUsageCode(name, 'vue'),
      svelte: seed.svelte ?? getUsageCode(name, 'svelte'),
    };
  }
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
  const anatomy = componentAnatomy[component.name];
  const supported = getSupportedFrameworks(component.name);
  const isParity = PARITY_COMPONENTS.has(component.name);
  const isGlass = isGlassDocComponent(component.name);
  const glassCopy = GLASS_COMPONENT_COPY[component.name];

  return (
    <div className="docs-content docs-component-page docs-sb-page">
      <header className="docs-sb-page__header">
        <div className="docs-sb-page__meta">
          <Badge variant="info">{component.category}</Badge>
          {isGlass ? <Badge variant="success">Liquid glass</Badge> : null}
          {isParity ? <Badge variant="success">React · Vue · Svelte</Badge> : null}
        </div>
        <h1>{component.name}</h1>
        <p className="docs-sb-page__lede">
          {glassCopy?.tagline ??
            (isGlass
              ? 'Liquid glass component from @larose-ui/react — displacement-mapped refraction with full optics tuning.'
              : isParity
                ? 'Foundation component with shared API across React, Vue 3, and Svelte 5.'
                : supported.length > 1
                ? 'Live editable demo across React, Vue 3, and Svelte 5 — switch frameworks, edit the code, reset anytime.'
                : 'Live editable React demo with props API and Storybook-aligned examples.')}
        </p>
        <FrameworkSelector supported={supported} />
      </header>

      {isGlass ? <GlassComponentIntro componentName={component.name} /> : null}

      <section className="docs-sb-page__primary">
        <h2 className="docs-sb-page__section-label">Live playground</h2>
        <LiveFrameworkPlayground
          componentName={component.name}
          supported={supported}
          seeds={getPlaygroundSeed(component.name)}
        />
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
              react: getInstallCommand('react', component.name),
              vue: getInstallCommand('vue', component.name),
              svelte: getInstallCommand('svelte', component.name),
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

      {api ? (
        <ApiReference
          api={api}
          componentName={component.name}
        />
      ) : null}
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
          {docsComponents.length} components with a live code playground — edit React, Vue, or
          Svelte demos and reset anytime.{' '}
          <strong>{PARITY_COMPONENTS.size}</strong> components ship across React, Vue, and Svelte.
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
