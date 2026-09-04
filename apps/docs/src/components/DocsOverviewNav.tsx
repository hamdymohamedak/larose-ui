import { useNavigate } from 'react-router-dom';
import { Button } from '@larose-ui/react';
import { DocsThemeSwitch } from '@/components/DocsThemeSwitch';

const LINKS = [
  { label: 'Components', path: '/docs/components' },
  { label: 'Packages', path: '/docs/packages' },
  { label: 'Guides', path: '/docs/guides' },
  { label: 'Design', path: '/docs/design/tokens' },
  { label: 'Playground', path: '/docs/playground' },
] as const;

export function DocsOverviewNav() {
  const navigate = useNavigate();

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
          <DocsThemeSwitch labelVariant="short" />
          <Button size="sm" onClick={() => navigate('/docs/getting-started')}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
