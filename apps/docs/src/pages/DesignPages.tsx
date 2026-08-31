import { useMemo, useState } from 'react';
import { createTheme } from '@larose-ui/themes';
import type { MotionSemanticPreset } from '@larose-ui/core';
import {
  Button,
  Card,
  Input,
  Select,
  Typography,
} from '@larose-ui/react';
import { LaRoseProvider } from '@larose-ui/runtime';
import { CodeBlock } from '@/components/CodeBlock';
import { CopyButton } from '@/components/CopyButton';
import { PropsPlayground } from '@/components/PropsPlayground';
import { playgroundControls } from '@/data/playground.generated';
import { docsTokenGroups } from '@/data/searchIndex.generated';

const DEFAULT_THEME = {
  primary: '#007AFF',
  radiusMd: '10px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  density: 'comfortable' as const,
  motionPreset: 'refined' as const,
};

export function ThemeBuilderPage() {
  const [primary, setPrimary] = useState(DEFAULT_THEME.primary);
  const [radiusMd, setRadiusMd] = useState(DEFAULT_THEME.radiusMd);
  const [fontFamily, setFontFamily] = useState(DEFAULT_THEME.fontFamily);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>(DEFAULT_THEME.density);
  const [motionPreset, setMotionPreset] = useState<MotionSemanticPreset>('smooth');

  const themeConfig = useMemo(
    () =>
      createTheme({
        preset: 'refined',
        colors: { primary },
        radius: { md: radiusMd },
        typography: { fontFamily },
        motion: { preset: motionPreset },
      }),
    [fontFamily, motionPreset, primary, radiusMd],
  );

  const exportCode = `import { createTheme } from '@larose-ui/themes';
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button, Card, Input } from '@larose-ui/react';

const theme = createTheme({
  preset: 'refined',
  colors: {
    primary: '${primary}',
  },
  radius: {
    md: '${radiusMd}',
  },
  typography: {
    fontFamily: '${fontFamily}',
  },
  motion: {
    preset: '${motionPreset}',
  },
});

export function App() {
  return (
    <LaRoseProvider theme="light" density="${density}" themeConfig={theme}>
      <Card title="Theme preview">
        <Input label="Email" placeholder="you@company.com" />
        <Button>Save changes</Button>
      </Card>
    </LaRoseProvider>
  );
}`;

  return (
    <div className="docs-content docs-theme-builder">
      <h1>Theme builder</h1>
      <p>
        Customize laRose using the real <code>createTheme</code> architecture. Changes apply to the
        preview and can be exported as TypeScript.
      </p>

      <div className="docs-theme-builder-grid">
        <Card title="Controls" padding="md">
          <Input label="Primary color" type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
          <Input label="Radius (md)" value={radiusMd} onChange={(e) => setRadiusMd(e.target.value)} />
          <Input label="Font family" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} />
          <Select
            label="Density"
            value={density}
            onChange={(e) => setDensity(e.target.value as typeof density)}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'spacious', label: 'Spacious' },
            ]}
          />
          <Select
            label="Motion preset"
            value={motionPreset}
            onChange={(e) => setMotionPreset(e.target.value as typeof motionPreset)}
            options={[
              { value: 'smooth', label: 'Smooth' },
              { value: 'snappy', label: 'Snappy' },
              { value: 'gentle', label: 'Gentle' },
            ]}
          />
          <Button variant="outline" onClick={() => {
            setPrimary(DEFAULT_THEME.primary);
            setRadiusMd(DEFAULT_THEME.radiusMd);
            setFontFamily(DEFAULT_THEME.fontFamily);
            setDensity(DEFAULT_THEME.density);
            setMotionPreset('smooth');
          }}>
            Reset
          </Button>
        </Card>

        <LaRoseProvider theme="light" density={density} themeConfig={themeConfig}>
          <Card title="Live preview" padding="md">
            <Typography muted>Apple-inspired by default. Fully customizable by architecture.</Typography>
            <Input label="Workspace name" defaultValue="Acme HR" />
            <div className="docs-action-row">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
          </Card>
        </LaRoseProvider>
      </div>

      <div className="docs-code-toolbar">
        <Typography as="h2" role="title">
          Export theme
        </Typography>
        <CopyButton value={exportCode} label="Copy export" />
      </div>
      <CodeBlock code={exportCode} language="tsx" title="Export" />
    </div>
  );
}

export function TokenExplorerPage() {
  const categories = Object.entries(docsTokenGroups).filter(([, items]) => items.length > 0);

  return (
    <div className="docs-content">
      <h1>Design tokens</h1>
      <p>Tokens generated from <code>@larose-ui/tokens</code> at build time.</p>
      {categories.map(([category, tokens]) => (
        <section key={category} className="docs-token-category">
          <h2>{category}</h2>
          <div className="docs-api-table-wrap">
            <table className="docs-api-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>CSS variable</th>
                  <th>Value</th>
                  <th>Used by</th>
                </tr>
              </thead>
              <tbody>
                {tokens.slice(0, 40).map((token) => (
                  <tr key={token.cssVariable}>
                    <td><code>{token.name}</code></td>
                    <td><code>{token.cssVariable}</code></td>
                    <td>{token.value}</td>
                    <td>{token.relatedComponents?.join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export function MotionPlaygroundPage() {
  const [preset, setPreset] = useState<MotionSemanticPreset>('smooth');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [open, setOpen] = useState(false);

  const themeConfig = useMemo(
    () =>
      createTheme({
        motion: {
          preset,
          reducedMotion: reducedMotion ? 'always' : 'system',
        },
      }),
    [preset, reducedMotion],
  );

  return (
    <LaRoseProvider theme="light" themeConfig={themeConfig}>
      <div className="docs-content">
        <h1>Motion playground</h1>
        <p>Experiment with laRose motion presets. Reduced motion always takes priority.</p>
        <Card title="Motion controls" padding="md">
          <Select
            label="Motion preset"
            value={preset}
            onChange={(e) => setPreset(e.target.value as typeof preset)}
            options={[
              { value: 'smooth', label: 'Smooth' },
              { value: 'snappy', label: 'Snappy' },
              { value: 'gentle', label: 'Gentle' },
            ]}
          />
          <label className="docs-checkbox-row">
            <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
            Force reduced motion
          </label>
          <Button onClick={() => setOpen(true)}>Open modal demo</Button>
        </Card>
        {open ? (
          <Card title="Motion demo surface" padding="md">
            <Typography>Modal, Drawer, Toast, and Collapse use the same motion system.</Typography>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </Card>
        ) : null}
      </div>
    </LaRoseProvider>
  );
}

export function PlaygroundPage() {
  const controls = playgroundControls.Button!;
  return (
    <div className="docs-content">
      <h1>Interactive playground</h1>
      <p>Explore laRose customization without Storybook. Start with Button and expand from props controls.</p>
      <PropsPlayground componentName="Button" controls={controls} />
    </div>
  );
}
