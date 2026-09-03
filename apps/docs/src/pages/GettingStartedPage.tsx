import { Button, Badge, Card, Input } from '@larose-ui/react';
import { LaRoseProvider } from '@larose-ui/runtime';
import { FrameworkCodeTabs } from '@/components/FrameworkCodeTabs';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { PreviewFrame } from '@/components/PreviewFrame';
import {
  getGettingStartedExample,
  getInstallCommand,
  getProviderSetup,
} from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  {
    n: 1,
    title: 'Install the package',
    hint: (fw: string) =>
      fw === 'vue'
        ? 'Adds @larose-ui/vue plus shared tokens and styles.'
        : fw === 'svelte'
          ? 'Adds @larose-ui/svelte plus shared tokens and styles.'
          : 'Adds the React package plus shared tokens and styles.',
  },
  {
    n: 2,
    title: 'Set up your provider',
    hint: () =>
      'Import the CSS once, then wrap your root component with the framework provider. This activates theming and design tokens.',
  },
  {
    n: 3,
    title: 'Use your first component',
    hint: () =>
      'Import any component from the package and drop it into your JSX, template, or Svelte file. It renders correctly with zero extra styling.',
  },
];

export function GettingStartedPage() {
  const { framework } = useDocsFramework();
  const navigate = useNavigate();

  const snippets = {
    install: {
      react: getInstallCommand('react'),
      vue: getInstallCommand('vue'),
      svelte: getInstallCommand('svelte'),
    },
    setup: {
      react: getProviderSetup('react'),
      vue: getProviderSetup('vue'),
      svelte: getProviderSetup('svelte'),
    },
    usage: {
      react: getGettingStartedExample('react'),
      vue: getGettingStartedExample('vue'),
      svelte: getGettingStartedExample('svelte'),
    },
  };

  return (
    <div className="docs-gs">

      {/* ——— Hero ——— */}
      <div className="docs-gs__hero">
        <Badge variant="info">Start here</Badge>
        <h1>Getting started</h1>
        <p>
          Three steps from zero to your first laRose UI component in the browser.
          Choose your framework below — all code samples update automatically.
        </p>

        <div className="docs-gs__fw-bar">
          <p className="docs-gs__fw-label">I am using…</p>
          <FrameworkSelector />
        </div>
      </div>

      {/* ——— Step wizard ——— */}
      <div className="docs-gs__steps">

        {/* Step 1 */}
        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num">1</div>
            <div className="docs-gs__step-line" />
          </div>
          <div className="docs-gs__step-body">
            <h3>Install the package</h3>
            <p className="docs-gs__step-hint">
              {STEPS[0]!.hint(framework)}
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.install} title="Terminal" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num">2</div>
            <div className="docs-gs__step-line" />
          </div>
          <div className="docs-gs__step-body">
            <h3>Set up your provider</h3>
            <p className="docs-gs__step-hint">
              Import the CSS once at the top of your app, then wrap your root component with the
              provider. This enables theming, design tokens, and component context — nothing works
              without it.
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.setup} />
          </div>
        </div>

        {/* Step 3 */}
        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num">3</div>
            <div className="docs-gs__step-line" />
          </div>
          <div className="docs-gs__step-body">
            <h3>Use your first component</h3>
            <p className="docs-gs__step-hint">
              Import any component and drop it into your template. Here&apos;s a complete example
              with a Card, Input, and two Buttons — the same code works across all frameworks.
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.usage} />

            <PreviewFrame title="Live result">
              <LaRoseProvider theme="light">
                <Card title="Getting started demo" padding="md">
                  <p style={{ margin: '0 0 0.875rem', fontSize: '0.9rem', color: 'var(--lr-color-text-muted)' }}>
                    This is rendered by laRose UI. No extra CSS, no extra config.
                  </p>
                  <Input label="Your name" placeholder="Enter your name…" />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <Button>Continue</Button>
                    <Button variant="secondary">Back</Button>
                  </div>
                </Card>
              </LaRoseProvider>
            </PreviewFrame>
          </div>
        </div>

        {/* Step 4 – done! */}
        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num" style={{ background: 'var(--lr-color-primary)', color: '#fff', border: 'none' }}>
              ✓
            </div>
          </div>
          <div className="docs-gs__step-body">
            <h3>You're set up 🎉</h3>
            <p className="docs-gs__step-hint">
              Any component from the catalog works exactly the same way. Head to the component
              browser and find the one you need — each page shows the exact import and usage code.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button onClick={() => navigate('/docs/components')}>
                Browse components →
              </Button>
              <Button variant="outline" onClick={() => navigate('/docs/design/theme-builder')}>
                Customize theme
              </Button>
              <Button variant="ghost" onClick={() => navigate('/docs/guides')}>
                Read guides
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* ——— Host-specific tips ——— */}
      <section style={{ marginTop: '3rem' }}>
        <h2>Platform-specific setup</h2>
        <p style={{ color: 'var(--lr-color-text-muted)', marginBottom: '1rem' }}>
          Using a meta-framework? These adapters add SSR safety and auto-imports for Next.js and Nuxt.
        </p>

        <div className="docs-callout-grid">
          <div className="docs-callout">
            <h3>Next.js</h3>
            <p>
              The <code>@larose-ui/next</code> adapter provides SSR-safe providers and a theme
              bootstrap script that prevents flash.
            </p>
            <Button
              variant="ghost"
              size="sm"
              style={{ marginTop: '0.75rem' }}
              onClick={() => navigate('/docs/guides/nextjs')}
            >
              Next.js guide →
            </Button>
          </div>
          <div className="docs-callout">
            <h3>Nuxt</h3>
            <p>
              The <code>@larose-ui/nuxt</code> module injects CSS, the theme script, and
              auto-imports every component — zero manual setup.
            </p>
            <Button
              variant="ghost"
              size="sm"
              style={{ marginTop: '0.75rem' }}
              onClick={() => navigate('/docs/guides/nuxt')}
            >
              Nuxt guide →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
