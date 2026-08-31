import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme } from '@larose-ui/themes';
import type { MotionSemanticPreset } from '@larose-ui/core';
import {
  Button,
  Card,
  Input,
  LaRoseProvider,
  Typography,
} from '@larose-ui/react';
import { docsComponents, docsGuides, docsPackages } from '@/data/catalog.generated';

export function HomePage() {
  const navigate = useNavigate();
  const [customization, setCustomization] = useState(35);

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
    <div className="docs-home">
      <section className="docs-home-hero">
        <Typography as="p" role="footnote" muted>
          One Design System. Infinite Visual Languages.
        </Typography>
        <Typography as="h1" role="largeTitle" className="docs-home-title">
          Beautiful by default. Customizable by design.
        </Typography>
        <Typography muted className="docs-home-lede">
          Apple-inspired by default. Customize 10%, 50%, or 90% — never fork the library. webDocs is
          built with laRose and demonstrates the real theme architecture live.
        </Typography>

        <div className="docs-customization-demo">
          <div className="docs-customization-labels">
            <span>Apple-inspired</span>
            <span>Fully custom</span>
          </div>
          <input
            aria-label="Customization amount"
            type="range"
            min={0}
            max={100}
            value={customization}
            onChange={(event) => setCustomization(Number(event.target.value))}
          />
          <Typography muted>{customization}% customized</Typography>
          <LaRoseProvider theme="light" themeConfig={themeConfig}>
            <Card title="Live customization" padding="md">
              <Input label="Team name" defaultValue="laRose HR" />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
            </Card>
          </LaRoseProvider>
        </div>

        <div className="docs-home-actions">
          <Button onClick={() => navigate('/docs/getting-started')}>Get started</Button>
          <Button variant="outline" onClick={() => navigate('/docs/design/theme-builder')}>
            Theme builder
          </Button>
          <Button variant="outline" onClick={() => navigate('/docs/playground')}>
            Playground
          </Button>
        </div>
      </section>

      <div className="docs-home-grid">
        <Card title="Components" padding="md">
          <Typography muted className="docs-card-copy">
            {docsComponents.length} components with API reference, playgrounds, examples, and live previews.
          </Typography>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/docs/components')}>
              Open component catalog
            </Button>
          </div>
        </Card>

        <Card title="Design system" padding="md">
          <Typography muted className="docs-card-copy">
            Theme builder, token explorer, motion playground, and customization guides.
          </Typography>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/docs/design/tokens')}>
              Explore tokens
            </Button>
          </div>
        </Card>

        <Card title="Platform" padding="md">
          <Typography muted className="docs-card-copy">
            {docsPackages.length} packages · {docsGuides.length} guides · architecture · migration · changelog
          </Typography>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate('/docs/architecture')}>
              View architecture
            </Button>
          </div>
        </Card>
      </div>
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
