import { useNavigate } from 'react-router-dom';
import { Button } from '@larose-ui/react';
import { useDocsTheme } from '@/theme/DocsThemeProvider';

const LINKS = [
  { label: 'Components', path: '/docs/components' },
  { label: 'Guides', path: '/docs/guides' },
  { label: 'Design', path: '/docs/design/tokens' },
  { label: 'Playground', path: '/docs/playground' },
] as const;

export function DocsOverviewNav() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDocsTheme();

  return (
    <header className="docs-overview-nav">
      <div className="docs-overview-nav__inner">
        <button
          type="button"
          className="docs-overview-nav__brand"
          onClick={() => navigate('/')}
        >
          laRose<span>UI</span>
        </button>

        <nav className="docs-overview-nav__links" aria-label="Documentation">
          {LINKS.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              className="docs-overview-nav__link"
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="docs-overview-nav__actions">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          <Button size="sm" onClick={() => navigate('/docs/getting-started')}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
