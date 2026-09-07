import { useNavigate } from 'react-router-dom';
import { Button } from '@larose-ui/react';
import {
  ArrowRight,
  Box,
  Layers,
  Package,
  Palette,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { docsComponents, docsGuides } from '@/data/catalog.generated';
import { publicDocsPackages } from '@/lib/packages';
import { getInstallCommand, PARITY_COMPONENTS } from '@/lib/frameworks';
import { useDocsFramework } from '@/theme/FrameworkProvider';

interface Feature {
  Icon: LucideIcon;
  title: string;
  desc: string;
  wide?: boolean;
}

const FEATURES: Feature[] = [
  {
    Icon: Package,
    title: 'Modular packages, clear installs',
    desc: 'Install your UI adapter (styles include tokens), then add runtime or intelligence packages only when you need them — no mega-bundle.',
    wide: true,
  },
  {
    Icon: Layers,
    title: '140+ production components',
    desc: 'Buttons, forms, navigation, data display, and the LiquidGlass family — accessibility and polish built in.',
  },
  {
    Icon: Palette,
    title: 'Token-driven design system',
    desc: 'Colors, spacing, typography, and motion defined once. Rebrand in minutes, not weeks.',
  },
  {
    Icon: Zap,
    title: 'React · Vue 3 · Svelte 5',
    desc: 'Shared cores with thin adapters. Ship the same experience regardless of stack.',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { framework } = useDocsFramework();
  const install = getInstallCommand(framework, undefined, 'runtime');
  const publicPackageCount = publicDocsPackages().length;
  const stylesImport =
    framework === 'react'
      ? "import '@larose-ui/react/styles.css';"
      : "import '@larose-ui/styles/styles.css';";

  const stats = [
    { value: docsComponents.length, label: 'Components' },
    { value: PARITY_COMPONENTS.size, label: 'Cross-framework' },
    { value: publicPackageCount, label: 'Packages' },
    { value: docsGuides.length, label: 'Guides' },
  ] as const;

  return (
    <div className="docs-home-v3">
      <section className="docs-hero-v3 docs-hero-v3--centered docs-hero-v3--simple">
        <div className="docs-hero-v3__mesh" aria-hidden />
        <div className="docs-hero-v3__glow docs-hero-v3__glow--a" aria-hidden />
        <div className="docs-hero-v3__glow docs-hero-v3__glow--b" aria-hidden />

        <div className="docs-hero-v3__inner">
          <p className="docs-hero-v3__brand">laRose UI</p>

          <h1 className="docs-hero-v3__title">
            A UI platform that
            <em> ships</em>.
          </h1>

          <p className="docs-hero-v3__lead">
            React, Vue, and Svelte components with one CSS import and optional runtime packs.
          </p>

          <div className="docs-hero-v3__actions">
            <Button
              size="lg"
              shape="capsule"
              rightIcon={<ArrowRight size={16} aria-hidden />}
              onClick={() => navigate('/docs/getting-started')}
            >
              Start building
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/docs/packages')}>
              Explore packages
            </Button>
          </div>

          <div className="docs-hero-v3__stats" role="list" aria-label="Platform stats">
            {stats.map((stat) => (
              <div key={stat.label} className="docs-stats-v3__item" role="listitem">
                <span className="docs-stats-v3__value">{stat.value}</span>
                <span className="docs-stats-v3__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="docs-band-v3 docs-band-v3--features">
        <div className="docs-band-v3__inner">
          <header className="docs-band-v3__header">
            <p className="docs-band-v3__kicker">Platform</p>
            <h2>Everything you need to ship a credible product UI</h2>
            <p>
              Skip months of design decisions. Start from a system that already feels native — then
              layer optional packages for data, forms, AI, and enterprise.
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
            <h2>Pick a framework, install a stack</h2>
            <p>Commands update with the framework selector. Full details live in Getting started and Packages.</p>
          </header>

          <div className="docs-band-v3__cta" style={{ marginBottom: '1.25rem' }}>
            <FrameworkSelector />
          </div>

          <ol className="docs-timeline-v3">
            <li className="docs-timeline-v3__item">
              <div className="docs-timeline-v3__marker">1</div>
              <div className="docs-timeline-v3__body">
                <h3>Install</h3>
                <pre className="docs-timeline-v3__code">
                  <code>{install}</code>
                </pre>
              </div>
            </li>
            <li className="docs-timeline-v3__item">
              <div className="docs-timeline-v3__marker">2</div>
              <div className="docs-timeline-v3__body">
                <h3>Import CSS + wrap</h3>
                <pre className="docs-timeline-v3__code">
                  <code>{stylesImport}</code>
                </pre>
              </div>
            </li>
            <li className="docs-timeline-v3__item">
              <div className="docs-timeline-v3__marker">3</div>
              <div className="docs-timeline-v3__body">
                <h3>Compose UI</h3>
                <pre className="docs-timeline-v3__code">
                  <code>{'<Button variant="primary">Ship</Button>'}</code>
                </pre>
              </div>
            </li>
          </ol>

          <div className="docs-band-v3__cta">
            <Button onClick={() => navigate('/docs/getting-started')}>
              Read the full guide
              <ArrowRight size={16} aria-hidden />
            </Button>
            <Button variant="outline" onClick={() => navigate('/docs/packages')}>
              All package installs
            </Button>
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
            <button type="button" onClick={() => navigate('/docs/packages')}>
              Packages
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
          <p className="docs-footer-v3__copy">
            Built by 
              <a href="https://github.com/hamdymohamedak/larose-ui" target="_blank" rel="noopener noreferrer">
                hamdymohamedak
              </a>
              . The source code is available on 
              <a href="https://github.com/hamdymohamedak/larose-ui" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              .
          </p>
        </div>
      </footer>
    </div>
  );
}
