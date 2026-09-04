import { useState } from 'react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Card } from '@larose-ui/react';

function ThemeDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <LaRoseProvider theme={theme} locale="en" tenantId="sandbox">
      <div className="sbx-stage-pad sbx-stack">
        <p className="sbx-muted">
          Provider root should expose <code>data-lr-theme=&quot;{theme}&quot;</code>.
        </p>
        <p data-sbx="theme-label">Current theme: {theme}</p>
        <button
          type="button"
          data-sbx="toggle-theme"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        >
          Toggle theme
        </button>
        <Card title="Themed surface">
          <p className="sbx-muted" style={{ margin: 0 }}>
            Card tokens follow the active theme.
          </p>
        </Card>
      </div>
    </LaRoseProvider>
  );
}

export function ThemeScenario() {
  return <ThemeDemo />;
}
