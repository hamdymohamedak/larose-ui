import { LaRoseProvider } from '@larose-ui/runtime-react';
import {
  Breadcrumb,
  Button,
  Card,
  Header,
  HeaderActions,
  HeaderTitle,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
} from '@larose-ui/react';

export function NavigationScenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox">
      <div style={{ display: 'flex', minHeight: 420 }} data-sbx="navigation-root">
        <Sidebar>
          <SidebarHeader>Workspace</SidebarHeader>
          <SidebarNav>
            <SidebarItem href="#">Dashboard</SidebarItem>
            <SidebarItem active>Projects</SidebarItem>
            <SidebarItem href="#">Settings</SidebarItem>
          </SidebarNav>
        </Sidebar>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header>
            <HeaderTitle>Projects</HeaderTitle>
            <HeaderActions>
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">New project</Button>
            </HeaderActions>
          </Header>
          <main style={{ padding: '1.25rem' }} className="sbx-stack">
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Projects' }]} />
            <Card title="Active projects" description="Shell layout under a real provider tree.">
              <p className="sbx-muted" style={{ margin: 0 }}>
                Navigation scenario — same intent on Vue / Svelte sandboxes.
              </p>
            </Card>
          </main>
        </div>
      </div>
    </LaRoseProvider>
  );
}
