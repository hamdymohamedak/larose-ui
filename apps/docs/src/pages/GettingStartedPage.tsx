import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input } from '@larose-ui/react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { FrameworkCodeTabs } from '@/components/FrameworkCodeTabs';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { PreviewFrame } from '@/components/PreviewFrame';
import {
  getCssImportOrder,
  getGettingStartedExample,
  getInstallCommand,
  getProviderSetup,
  type InstallStackMode,
} from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';

export function GettingStartedPage() {
  const { framework } = useDocsFramework();
  const navigate = useNavigate();
  const [stack, setStack] = useState<InstallStackMode>('runtime');

  const runtimePkg =
    framework === 'vue'
      ? '@larose-ui/runtime-vue'
      : framework === 'svelte'
        ? '@larose-ui/runtime-svelte'
        : '@larose-ui/runtime-react';
  const uiPkg =
    framework === 'vue' ? '@larose-ui/vue' : framework === 'svelte' ? '@larose-ui/svelte' : '@larose-ui/react';

  const snippets = {
    install: {
      react: getInstallCommand('react', undefined, stack),
      vue: getInstallCommand('vue', undefined, stack),
      svelte: getInstallCommand('svelte', undefined, stack),
    },
    css: {
      react: getCssImportOrder('react'),
      vue: getCssImportOrder('vue'),
      svelte: getCssImportOrder('svelte'),
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
      <div className="docs-gs__hero">
        <Badge variant="info">Start here</Badge>
        <h1>Getting started</h1>
        <p>
          laRose ships as focused packages — not one mega-install. Pick your framework, choose a UI-only
          or full-runtime stack, then add intelligence packages when you need them.
        </p>

        <div className="docs-gs__fw-bar">
          <p className="docs-gs__fw-label">I am using…</p>
          <FrameworkSelector />
        </div>

        <div className="docs-gs__stack" role="group" aria-label="Install stack">
          <p className="docs-gs__fw-label">Install stack</p>
          <div className="docs-pkg-filters">
            <button
              type="button"
              className={stack === 'ui' ? 'is-active' : undefined}
              onClick={() => setStack('ui')}
            >
              UI only
            </button>
            <button
              type="button"
              className={stack === 'runtime' ? 'is-active' : undefined}
              onClick={() => setStack('runtime')}
            >
              Full runtime
            </button>
          </div>
          <p className="docs-pkg-note">
            UI only installs {uiPkg} with tokens and styles. Full runtime also adds {runtimePkg} for
            toast, network, offline, and i18n.
          </p>
        </div>
      </div>

      <div className="docs-gs__steps">
        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num">1</div>
            <div className="docs-gs__step-line" />
          </div>
          <div className="docs-gs__step-body">
            <h3>Install the stack</h3>
            <p className="docs-gs__step-hint">
              {stack === 'runtime'
                ? `Adds ${uiPkg} plus ${runtimePkg} with shared tokens and styles.`
                : `Adds ${uiPkg} plus shared tokens and styles.`}
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.install} title="Terminal" />
          </div>
        </div>

        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num">2</div>
            <div className="docs-gs__step-line" />
          </div>
          <div className="docs-gs__step-body">
            <h3>Import CSS, then wrap your app</h3>
            <p className="docs-gs__step-hint">
              Always import tokens before styles. For full platform features, wrap the root with the
              runtime provider.
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.css} title="CSS order" />
            <FrameworkCodeTabs showSelector={false} snippets={snippets.setup} title="Provider" />
          </div>
        </div>

        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div className="docs-gs__step-num">3</div>
            <div className="docs-gs__step-line" />
          </div>
          <div className="docs-gs__step-body">
            <h3>Use your first component</h3>
            <p className="docs-gs__step-hint">
              Import any component from the UI package. Need forms, data, or AI later? Add those from
              the Packages hub.
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.usage} />
            <PreviewFrame title="Live result">
              <LaRoseProvider theme="light">
                <Card title="Getting started demo" padding="md">
                  <p
                    style={{
                      margin: '0 0 0.875rem',
                      fontSize: '0.9rem',
                      color: 'var(--lr-color-text-muted)',
                    }}
                  >
                    Rendered by laRose UI — modular packages, one design system.
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

        <div className="docs-gs__step">
          <div className="docs-gs__step-connector">
            <div
              className="docs-gs__step-num"
              style={{ background: 'var(--lr-color-primary)', color: '#fff', border: 'none' }}
            >
              ✓
            </div>
          </div>
          <div className="docs-gs__step-body">
            <h3>Next steps</h3>
            <p className="docs-gs__step-hint">
              Browse components for imports and live previews, or open the Packages hub for every
              install command and when to use each package.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button onClick={() => navigate('/docs/packages')}>Explore packages</Button>
              <Button variant="outline" onClick={() => navigate('/docs/components')}>
                Browse components
              </Button>
              <Button variant="ghost" onClick={() => navigate('/docs/guides/nextjs')}>
                Next.js / Nuxt / SvelteKit
              </Button>
              <Link className="docs-card-link" to="/docs/packages/react">
                @larose-ui/react details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
