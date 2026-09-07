import { useEffect, useId, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const go = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className={`docs-overview-nav${menuOpen ? ' docs-overview-nav--open' : ''}`}>
      <div className="docs-overview-nav__inner">
        <button
          type="button"
          className="docs-overview-nav__brand"
          onClick={() => go('/')}
        >
          laRose<span>UI</span>
        </button>

        <nav className="docs-overview-nav__links" aria-label="Documentation">
          {LINKS.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              className="docs-overview-nav__link"
              onClick={() => go(path)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="docs-overview-nav__actions">
          <DocsThemeSwitch labelVariant="short" />
          <Button
            variant="outline"
            size="sm"
            className="docs-overview-nav__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </Button>
          <Button size="sm" className="docs-overview-nav__cta" onClick={() => go('/docs/getting-started')}>
            Get started
          </Button>
        </div>
      </div>

      <div
        id={menuId}
        className="docs-overview-nav__drawer"
        hidden={!menuOpen}
      >
        <nav aria-label="Documentation menu">
          {LINKS.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              className="docs-overview-nav__drawer-link"
              onClick={() => go(path)}
            >
              {label}
            </button>
          ))}
          <Button size="sm" className="docs-overview-nav__drawer-cta" onClick={() => go('/docs/getting-started')}>
            Get started
          </Button>
        </nav>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="docs-overview-nav__backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </header>
  );
}
