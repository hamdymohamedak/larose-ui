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
  Typography,
} from '@larose-ui/react';
import { Layers, Palette, Zap, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { docsComponents, docsGuides, docsPackages } from '@/data/catalog.generated';
import { PARITY_COMPONENTS } from '@/lib/frameworks';

interface Feature {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    Icon: Layers,
    title: '90+ Ready-to-use Components',
    desc: 'Buttons, forms, modals, tables, data grids — every UI element your SaaS app needs, designed and built.',
  },
  {
    Icon: Palette,
    title: 'Complete Design System',
    desc: 'Colors, spacing, typography, and motion defined once as tokens. Change your brand in one place, update everywhere.',
  },
  {
    Icon: Zap,
    title: 'React · Vue 3 · Svelte 5',
    desc: 'The same component, the same API, the same look — across all three frameworks. Switch stacks without relearning.',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Customize 10% or 90%',
    desc: 'Use Apple-inspired defaults or go fully custom. Override tokens, extend components, or bring your own theme.',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [customization, setCustomization] = useState(30);

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
    <div className="docs-home-v2">
      {/* ══════════════ HERO — full viewport ══════════════ */}
      <section className="docs-hero-screen">
        <div className="docs-hero-content">
          {/* ── Left: copy ── */}
          <div className="docs-hero-copy">
            <div className="docs-hero-badge">
              <Badge variant="info">UI Operating System</Badge>
            </div>

            <h1 className="docs-hero-headline">
              <span className="docs-hero-brand">laRose</span>
              <span className="docs-hero-brand-ui">UI</span>
            </h1>

            <p className="docs-hero-tagline">
              Build production-ready SaaS interfaces, faster.
            </p>

            <p className="docs-hero-description">
              A complete UI design system — 90+ components, design tokens, and a runtime for
              React, Vue 3, and Svelte 5. Install once, ship confidently.
            </p>

            <div className="docs-hero-frameworks">
              <span className="docs-hero-fw">React</span>
              <span className="docs-hero-fw-sep">·</span>
              <span className="docs-hero-fw">Vue 3</span>
              <span className="docs-hero-fw-sep">·</span>
              <span className="docs-hero-fw">Svelte 5</span>
            </div>

            <div className="docs-hero-actions">
              <Button onClick={() => navigate('/docs/getting-started')}>
                Get started →
              </Button>
              <Button variant="outline" onClick={() => navigate('/docs/components')}>
                Browse components
              </Button>
            </div>
          </div>

          {/* ── Right: live demo ── */}
          <div className="docs-hero-demo">
            <div className="docs-hero-demo-label">Live theming preview</div>

            <LaRoseProvider theme="light" themeConfig={themeConfig}>
              <Card title="Team workspace" padding="md">
                <Input label="Project name" defaultValue="My SaaS App" />
                <div className="docs-action-row">
                  <Button>Create project</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </Card>
            </LaRoseProvider>

            <div className="docs-hero-slider">
              <div className="docs-hero-slider-labels">
                <span>Apple-inspired defaults</span>
                <span>Fully custom brand</span>
              </div>
              <input
                aria-label="Customization amount"
                type="range"
                min={0}
                max={100}
                value={customization}
                onChange={(e) => setCustomization(Number(e.target.value))}
              />
              <span className="docs-hero-slider-hint">
                {customization}% customized — drag to see live theming
              </span>
            </div>
          </div>
        </div>

        <div className="docs-hero-scroll-hint" aria-hidden="true">
          <span>Scroll to learn more</span>
          <div className="docs-hero-scroll-arrow" />
        </div>
      </section>

      {/* ══════════════ WHAT IS LAROSE UI? ══════════════ */}
      <section className="docs-section docs-section--what">
        <div className="docs-section-inner">
          <Typography as="h2" role="title" className="docs-section-heading">
            What is laRose UI?
          </Typography>
          <Typography muted className="docs-section-sub">
            Think of it as the complete UI foundation for your SaaS product — every component,
            style, and design decision you'd otherwise spend months building, ready to use today.
          </Typography>

          <div className="docs-features-grid">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="docs-feature-card">
                <div className="docs-feature-icon">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ UP IN 3 STEPS ══════════════ */}
      <section className="docs-section docs-section--start">
        <div className="docs-section-inner">
          <Typography as="h2" role="title" className="docs-section-heading">
            Up and running in 3 steps
          </Typography>
          <Typography muted className="docs-section-sub">
            No build configuration. No design decisions. Just install and start building.
          </Typography>

          <div className="docs-steps-row">
            <div className="docs-step">
              <div className="docs-step-num">1</div>
              <div>
                <h3>Install</h3>
                <code className="docs-step-code">npm install @larose-ui/react</code>
              </div>
            </div>
            <div className="docs-step-arrow">→</div>
            <div className="docs-step">
              <div className="docs-step-num">2</div>
              <div>
                <h3>Wrap your app</h3>
                <code className="docs-step-code">{'<LaRoseProvider>'}</code>
              </div>
            </div>
            <div className="docs-step-arrow">→</div>
            <div className="docs-step">
              <div className="docs-step-num">3</div>
              <div>
                <h3>Use components</h3>
                <code className="docs-step-code">{'<Button>Click me</Button>'}</code>
              </div>
            </div>
          </div>

          <div className="docs-section-cta">
            <Button onClick={() => navigate('/docs/getting-started')}>
              Full getting started guide →
            </Button>
            <FrameworkSelector />
          </div>
        </div>
      </section>

      {/* ══════════════ BY THE NUMBERS ══════════════ */}
      <section className="docs-section docs-section--stats">
        <div className="docs-section-inner">
          <div className="docs-stats-grid">
            <div className="docs-stat">
              <span className="docs-stat-value">{docsComponents.length}</span>
              <span className="docs-stat-label">Components</span>
            </div>
            <div className="docs-stat">
              <span className="docs-stat-value">{PARITY_COMPONENTS.size}</span>
              <span className="docs-stat-label">Parity components</span>
            </div>
            <div className="docs-stat">
              <span className="docs-stat-value">{docsPackages.length}</span>
              <span className="docs-stat-label">Packages</span>
            </div>
            <div className="docs-stat">
              <span className="docs-stat-value">{docsGuides.length}</span>
              <span className="docs-stat-label">Guides</span>
            </div>
          </div>
        </div>
      </section>
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
