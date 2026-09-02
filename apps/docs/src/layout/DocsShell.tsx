import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Button,
  Header,
  HeaderActions,
  HeaderTitle,
  Sidebar,
  SidebarDisclosureSection,
  SidebarGroup,
  SidebarHeader,
  SidebarNav,
  SidebarSearch,
} from '@larose-ui/react';
import { CommandSearch, useCommandPalette } from '@/components/CommandSearch';
import { DocsNavLink } from '@/components/DocsNavLink';
import { DocsErrorBoundary } from '@/components/DocsErrorBoundary';
import { DocsOverviewNav } from '@/components/DocsOverviewNav';
import { FrameworkSelector } from '@/components/FrameworkSelector';
import { filterNavigation, findDocsPageTitle } from '@/navigation';
import { useDocsTheme } from '@/theme/DocsThemeProvider';

export function DocsShell({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const isOverview = location.pathname === '/';
  const { theme, toggleTheme } = useDocsTheme();
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { open, setOpen, close } = useCommandPalette();
  const pageTitle = isOverview ? 'Overview' : findDocsPageTitle(location.pathname);

  const sections = useMemo(() => filterNavigation(query), [query]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.classList.remove('docs-sidebar-open');
      return undefined;
    }

    document.body.classList.add('docs-sidebar-open');

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('docs-sidebar-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen]);

  if (isOverview) {
    return (
      <div className="docs-shell docs-shell--overview">
        <DocsOverviewNav />
        <div className="docs-main docs-main--overview">
          <div className="docs-main-scroll docs-main-scroll--overview">
            <div className="docs-page docs-page--home">
              <DocsErrorBoundary>{children ?? <Outlet />}</DocsErrorBoundary>
            </div>
          </div>
        </div>
        <CommandSearch open={open} onClose={close} />
      </div>
    );
  }

  return (
    <div className={`docs-shell${sidebarOpen ? ' docs-shell--sidebar-open' : ''}`}>
      <button
        type="button"
        className="docs-sidebar-backdrop"
        aria-label="Close navigation"
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={() => setSidebarOpen(false)}
      />

      <div id="docs-sidebar" className="docs-sidebar-panel">
        <Sidebar platform="macos" glass className="docs-sidebar" aria-label="Documentation sidebar">
          <SidebarHeader>
            <span className="docs-sidebar-brand">laRose UI</span>
            <span className="docs-sidebar-brand-sub">Design System Docs</span>
          </SidebarHeader>
          <SidebarSearch
            placeholder="Search docs…"
            value={query}
            onChange={setQuery}
            aria-label="Filter sidebar navigation"
          />
          <SidebarNav aria-label="Documentation">
            {sections.map((section) => {
              const items = section.items.map((item) => (
                <DocsNavLink key={item.path} to={item.path} end={item.path === '/'}>
                  {item.label}
                </DocsNavLink>
              ));

              // "Start here" renders without a label header — cleaner for the top 2 items
              if (section.label === 'Start here') {
                return (
                  <div key={section.label} className="docs-sidebar-start-group">
                    {items}
                  </div>
                );
              }

              if (section.collapsible) {
                return (
                  <SidebarDisclosureSection key={section.label} label={section.label}>
                    {items}
                  </SidebarDisclosureSection>
                );
              }

              return (
                <SidebarGroup key={section.label} label={section.label}>
                  {items}
                </SidebarGroup>
              );
            })}
          </SidebarNav>
        </Sidebar>
      </div>

      <div className="docs-main">
        <Header className="docs-top-header">
          <div className="docs-header-leading">
            <Button
              variant="outline"
              size="sm"
              className="docs-nav-toggle"
              aria-expanded={sidebarOpen}
              aria-controls="docs-sidebar"
              onClick={() => setSidebarOpen((current) => !current)}
            >
              {sidebarOpen ? 'Close' : 'Menu'}
            </Button>
            <HeaderTitle>{pageTitle}</HeaderTitle>
          </div>
          <HeaderActions>
            <span className="docs-header-framework">
              <FrameworkSelector compact />
            </span>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              <span className="docs-header-search-full">Search ⌘K</span>
              <span className="docs-header-search-short">Search</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
              <span className="docs-header-theme-full">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
              <span className="docs-header-theme-short">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </Button>
            <Button
              className="docs-header-action--secondary"
              variant="outline"
              size="sm"
              onClick={() => window.open('http://localhost:6006', '_blank', 'noopener,noreferrer')}
            >
              Storybook
            </Button>
            <Button
              className="docs-header-action--secondary"
              size="sm"
              onClick={() =>
                window.open('https://github.com/hamdymohamedak/larose-ui', '_blank', 'noopener,noreferrer')
              }
            >
              GitHub
            </Button>
          </HeaderActions>
        </Header>

        <div className="docs-main-scroll">
          <div className="docs-page">
            <DocsErrorBoundary>{children ?? <Outlet />}</DocsErrorBoundary>
          </div>
        </div>
      </div>

      <CommandSearch open={open} onClose={close} />
    </div>
  );
}
