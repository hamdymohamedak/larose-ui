import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme } from '@larose-ui/themes';
import type { MotionSemanticPreset } from '@larose-ui/core';
import {
  Badge,
  Button,
  Card,
  Input,
  LaRoseProvider,
} from '@larose-ui/react';
import {
  ArrowRight,
  Box,
  Layers,
  Palette,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { docsComponents, docsGuides, docsPackages } from '@/data/catalog.generated';
import { PARITY_COMPONENTS } from '@/lib/frameworks';

interface Feature {
  Icon: LucideIcon;
  title: string;
  desc: string;
  wide?: boolean;
}

const FEATURES: Feature[] = [
  {
    Icon: Layers,
    title: '90+ production components',
    desc: 'Buttons, forms, modals, tables, and data grids — every surface your SaaS needs, designed with accessibility and polish built in.',
    wide: true,
  },
  {
    Icon: Palette,
    title: 'Token-driven design system',
    desc: 'Colors, spacing, typography, and motion defined once. Rebrand in minutes, not weeks.',
  },
  {
    Icon: Zap,
    title: 'React · Vue 3 · Svelte 5',
    desc: 'One API, three frameworks. Ship the same experience regardless of stack.',
  },
  {
    Icon: Sparkles,
    title: 'Liquid glass engine',
    desc: 'Displacement-mapped refraction for premium interfaces — TabBar, toggles, and overlays.',
    wide: true,
  },
];

const STEPS = [
  { title: 'Install', code: 'pnpm add @larose-ui/react' },
  { title: 'Wrap your app', code: '<LaRoseProvider theme="light">' },
  { title: 'Compose UI', code: '<Button variant="primary">Ship</Button>' },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const [customization, setCustomization] = useState(32);

  const themeConfig = useMemo(
    () =>
      createTheme({
        preset: 'refined',
        colors: {
          primary: mixColor('#007AFF', '#6C5CE7', customization / 100),
        },
        radius: {
          md: `${8 + Math.round((customization / 100) * 10)}px`,
        },
        typography: {
          fontFamily:
            customization > 60
              ? '"Avenir Next", system-ui, sans-serif'
              : 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        motion: {
          preset: (customization > 75 ? 'snappy' : 'smooth') as MotionSemanticPreset,
        },
      }),
    [customization],
  );

  return (
    <div className="docs-home-v3">
      <section className="docs-hero-v3">
        <div className="docs-hero-v3__glow docs-hero-v3__glow--a" aria-hidden />
        <div className="docs-hero-v3__glow docs-hero-v3__glow--b" aria-hidden />

        <div className="docs-hero-v3__grid">
          <div className="docs-hero-v3__copy">
            <div className="docs-hero-v3__eyebrow">
              <span className="docs-hero-v3__pulse" aria-hidden />
              <span>UI operating system for SaaS</span>
            </div>

            <h1 className="docs-hero-v3__title">
              Design systems that
              <em> ship</em>
              , not slow you down.
            </h1>

            <p className="docs-hero-v3__lead">
              laRose UI is a complete interface layer — components, tokens, motion, and a
              cross-framework runtime for teams building polished products at speed.
            </p>

            <div className="docs-hero-v3__chips">
              {['React', 'Vue 3', 'Svelte 5', 'TypeScript'].map((fw) => (
                <span key={fw} className="docs-hero-v3__chip">
                  {fw}
                </span>
              ))}
            </div>

            <div className="docs-hero-v3__actions">
              <Button size="lg" onClick={() => navigate('/docs/getting-started')}>
                Start building
                <ArrowRight size={16} aria-hidden />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/docs/components')}>
                Browse components
              </Button>
            </div>

            <p className="docs-hero-v3__meta">
              Open source · MIT · Monorepo with {docsPackages.length} packages
            </p>
          </div>

          <div className="docs-hero-v3__panel">
            <div className="docs-hero-v3__panel-header">
              <Badge variant="info">Live preview</Badge>
              <span>Drag to morph tokens</span>
            </div>

            <div className="docs-hero-v3__panel-body">
              <LaRoseProvider theme="light" themeConfig={themeConfig}>
                <Card title="Workspace" padding="md">
                  <Input label="Project" defaultValue="Acme Dashboard" />
                  <div className="docs-action-row">
                    <Button>Create</Button>
                    <Button variant="secondary">Cancel</Button>
                  </div>
                </Card>
              </LaRoseProvider>
            </div>

            <div className="docs-hero-v3__slider">
              <div className="docs-hero-v3__slider-labels">
                <span>Apple defaults</span>
                <span>Custom brand</span>
              </div>
              <input
                aria-label="Customization amount"
                type="range"
                min={0}
                max={100}
                value={customization}
                onChange={(e) => setCustomization(Number(e.target.value))}
              />
              <span className="docs-hero-v3__slider-value">{customization}% customized</span>
            </div>
          </div>
        </div>
      </section>

      <section className="docs-band-v3 docs-band-v3--features">
        <div className="docs-band-v3__inner">
          <header className="docs-band-v3__header">
            <p className="docs-band-v3__kicker">Platform</p>
            <h2>Everything you need to ship a credible product UI</h2>
            <p>
              Skip months of design decisions. Start from a system that already feels native on
              macOS, iOS, and the web.
            </p>
          </header>

          <div className="docs-bento-v3">
            {FEATURES.map(({ Icon, title, desc, wide }) => (
              <article
                key={title}
                className={`docs-bento-v3__card${wide ? ' docs-bento-v3__card--wide' : ''}`}
              >
                <div className="docs-bento-v3__icon">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="docs-band-v3 docs-band-v3--steps">
        <div className="docs-band-v3__inner">
          <header className="docs-band-v3__header">
            <p className="docs-band-v3__kicker">Quick start</p>
            <h2>Up and running in three steps</h2>
            <p>Install once, wrap your app, and compose with production-ready primitives.</p>
          </header>

          <ol className="docs-timeline-v3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="docs-timeline-v3__item">
                <div className="docs-timeline-v3__marker">{index + 1}</div>
                <div className="docs-timeline-v3__body">
                  <h3>{step.title}</h3>
                  <pre className="docs-timeline-v3__code">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </li>
            ))}
          </ol>

          <div className="docs-band-v3__cta">
            <Button onClick={() => navigate('/docs/getting-started')}>
              Read the full guide
              <ArrowRight size={16} aria-hidden />
            </Button>
            <FrameworkSelector />
          </div>
        </div>
      </section>

      <section className="docs-band-v3 docs-band-v3--stats">
        <div className="docs-band-v3__inner docs-stats-v3">
          <div className="docs-stats-v3__item">
            <span className="docs-stats-v3__value">{docsComponents.length}</span>
            <span className="docs-stats-v3__label">Components</span>
          </div>
          <div className="docs-stats-v3__divider" aria-hidden />
          <div className="docs-stats-v3__item">
            <span className="docs-stats-v3__value">{PARITY_COMPONENTS.size}</span>
            <span className="docs-stats-v3__label">Cross-framework</span>
          </div>
          <div className="docs-stats-v3__divider" aria-hidden />
          <div className="docs-stats-v3__item">
            <span className="docs-stats-v3__value">{docsPackages.length}</span>
            <span className="docs-stats-v3__label">Packages</span>
          </div>
          <div className="docs-stats-v3__divider" aria-hidden />
          <div className="docs-stats-v3__item">
            <span className="docs-stats-v3__value">{docsGuides.length}</span>
            <span className="docs-stats-v3__label">Guides</span>
          </div>
        </div>
      </section>

      <footer className="docs-footer-v3">
        <div className="docs-footer-v3__inner">
          <div className="docs-footer-v3__brand">
            <Box size={18} strokeWidth={1.75} aria-hidden />
            <span>laRose UI</span>
          </div>
          <nav className="docs-footer-v3__links" aria-label="Footer">
            <button type="button" onClick={() => navigate('/docs/getting-started')}>
              Getting started
            </button>
            <button type="button" onClick={() => navigate('/changelog')}>
              Changelog
            </button>
            <button
              type="button"
              onClick={() =>
                window.open('https://github.com/hamdymohamedak/larose-ui', '_blank', 'noopener')
              }
            >
              GitHub
            </button>
          </nav>
          <p className="docs-footer-v3__copy">Built for teams who care about craft.</p>
        </div>
      </footer>
    </div>
  );
}

function mixColor(start: string, end: string, amount: number) {
  const parse = (hex: string) => {
    const normalized = hex.replace('#', '');
    return [
      Number.parseInt(normalized.slice(0, 2), 16),
      Number.parseInt(normalized.slice(2, 4), 16),
      Number.parseInt(normalized.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(start);
  const [r2, g2, b2] = parse(end);
  const channel = (a: number, b: number) => Math.round(a + (b - a) * amount);
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(channel(r1 ?? 0, r2 ?? 0))}${toHex(channel(g1 ?? 0, g2 ?? 0))}${toHex(channel(b1 ?? 0, b2 ?? 0))}`;
}
