import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input, ToastProvider, useToast } from '@larose-ui/react';
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


function GettingStartedLiveDemo() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <ToastProvider>
      <GettingStartedLiveDemoInner
        name={name}
        submitted={submitted}
        onNameChange={setName}
        onSubmitted={setSubmitted}
      />
    </ToastProvider>
  );
}

function GettingStartedLiveDemoInner({
  name,
  submitted,
  onNameChange,
  onSubmitted,
}: {
  name: string;
  submitted: string | null;
  onNameChange: (value: string) => void;
  onSubmitted: (value: string | null) => void;
}) {
  const { toast } = useToast();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast({
        title: 'Name required',
        message: 'Type a name, then press Continue.',
        variant: 'warning',
      });
      return;
    }
    onSubmitted(trimmed);
    toast({
      title: 'Saved',
      message: `Hello, ${trimmed} — this preview is interactive.`,
      variant: 'success',
    });
  };

  return (
    <Card title="Getting started demo" padding="md" style={{ width: '100%', maxWidth: '28rem' }}>
      <p
        style={{
          margin: '0 0 0.875rem',
          fontSize: '0.9rem',
          color: 'var(--lr-color-text-muted)',
        }}
      >
        Type in the field and press Continue — state, validation, and toast all run in the browser.
      </p>
      <form onSubmit={onSubmit}>
        <Input
          label="Your name"
          placeholder="Enter your name…"
          value={name}
          onChange={(event) => {
            onNameChange(event.target.value);
            if (submitted) onSubmitted(null);
          }}
          autoComplete="name"
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <Button type="submit">Continue</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onNameChange('');
              onSubmitted(null);
            }}
          >
            Reset
          </Button>
        </div>
      </form>
      {submitted ? (
        <p
          role="status"
          style={{
            margin: '0.875rem 0 0',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--lr-color-primary)',
          }}
        >
          Hello, {submitted}. Welcome to laRose UI.
        </p>
      ) : name.trim() ? (
        <p
          style={{
            margin: '0.875rem 0 0',
            fontSize: '0.85rem',
            color: 'var(--lr-color-text-muted)',
          }}
        >
          Live value: <code>{name}</code>
        </p>
      ) : null}
    </Card>
  );
}


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
          Start with a small public surface — UI + optional runtime. Styles include design tokens in one
          CSS import. Add intelligence packages only when you need them.
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
            React needs only {uiPkg} (styles include tokens). Vue / Svelte also add{' '}
            <code>@larose-ui/styles</code>. Full runtime adds {runtimePkg} for toast, network, offline,
            and i18n.
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
                ? `Adds ${uiPkg} plus ${runtimePkg}. One CSS import covers tokens + component styles.`
                : `Adds ${uiPkg}. One CSS import covers tokens + component styles.`}
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
              One stylesheet is enough — tokens ship inside{' '}
              <code>@larose-ui/react/styles.css</code> or <code>@larose-ui/styles/styles.css</code>.
              For full platform features, wrap the root with the runtime provider.
            </p>
            <FrameworkCodeTabs showSelector={false} snippets={snippets.css} title="CSS" />
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
            <p className="docs-gs__step-hint" style={{ marginTop: '0.75rem' }}>
              Interactive React preview below — try typing and clicking Continue.
            </p>
            <PreviewFrame title="Live result">
              <GettingStartedLiveDemo />
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
