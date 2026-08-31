import { useMemo, useState, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Button,
  Header,
  HeaderActions,
  HeaderBrand,
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
import { filterNavigation, findDocsPageTitle } from '@/navigation';
import { useDocsTheme } from '@/theme/DocsThemeProvider';

export function DocsShell({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const { theme, toggleTheme } = useDocsTheme();
  const [query, setQuery] = useState('');
  const { open, setOpen, close } = useCommandPalette();
  const pageTitle = location.pathname === '/' ? 'Overview' : findDocsPageTitle(location.pathname);

  const sections = useMemo(() => filterNavigation(query), [query]);

  return (
    <div className="docs-shell">
      <Sidebar platform="macos" glass aria-label="Documentation sidebar">
        <SidebarHeader>laRose UI</SidebarHeader>
        <SidebarSearch
          placeholder="Filter sidebar"
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

      <div className="docs-main">
        <Header>
          {location.pathname === '/' ? (
            <HeaderBrand>laRose UI Docs</HeaderBrand>
          ) : (
            <HeaderTitle>{pageTitle}</HeaderTitle>
          )}
          <HeaderActions>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Search ⌘K
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('http://localhost:6006', '_blank', 'noopener,noreferrer')}
            >
              Storybook
            </Button>
            <Button
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
