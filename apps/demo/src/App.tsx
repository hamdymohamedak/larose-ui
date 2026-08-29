import { useEffect, useState } from 'react';
import { LaRoseProvider, useToast } from '@larose/runtime';
import { Can } from '@larose/permissions';
import { DataView } from '@larose/data';
import { Form } from '@larose/forms';
import {
  Breadcrumb,
  Button,
  Card,
  CommandPalette,
  Header,
  HeaderActions,
  HeaderTitle,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  useCommandPaletteShortcut,
} from '@larose/react';
import { installEmployeeMock, resetEmployees, type Employee } from './employeeApi';

function DemoContent() {
  const { toast } = useToast();
  const [commandsOpen, setCommandsOpen] = useState(false);
  useCommandPaletteShortcut(() => setCommandsOpen(true));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar>
        <SidebarHeader>laRose</SidebarHeader>
        <SidebarNav>
          <SidebarItem href="#">Dashboard</SidebarItem>
          <SidebarItem active>Employees</SidebarItem>
          <SidebarItem href="#">Settings</SidebarItem>
        </SidebarNav>
      </Sidebar>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header>
          <HeaderTitle>Employees</HeaderTitle>
          <HeaderActions>
            <Button variant="outline" size="sm" onClick={() => setCommandsOpen(true)}>
              Commands
            </Button>
          </HeaderActions>
        </Header>

        <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem', width: '100%' }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Employees' },
            ]}
          />

          <p style={{ color: 'var(--lr-color-text-muted)' }}>
            Production-style Vite app using workspace packages — not Storybook.
          </p>

          <Can permission="employees.read">
            <Card title="Employees" padding="md">
              <DataView<Employee[]> url="/api/employees">
                {(employees) => (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {employees.map((e) => (
                      <li key={e.id}>
                        {e.name} — {e.role} ({e.department})
                      </li>
                    ))}
                  </ul>
                )}
              </DataView>
            </Card>
          </Can>

          <Can permission="employees.write">
            <Card title="Add employee" padding="md">
              <Form
                schema={{
                  id: 'demo-add',
                  fields: [
                    { name: 'name', type: 'text', label: 'Name', required: true },
                    { name: 'role', type: 'text', label: 'Role', required: true },
                    { name: 'department', type: 'text', label: 'Department' },
                  ],
                }}
                onSubmit={async (values) => {
                  await fetch('/api/employees', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                  });
                  toast({
                    title: 'Employee added',
                    message: `${values.name} was saved successfully.`,
                    variant: 'success',
                  });
                }}
                submitLabel="Add"
              />
            </Card>
          </Can>

          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </main>
      </div>

      <CommandPalette
        open={commandsOpen}
        onOpenChange={setCommandsOpen}
        items={[
          {
            id: 'refresh',
            label: 'Refresh page',
            onSelect: () => window.location.reload(),
          },
          {
            id: 'toast',
            label: 'Show sample toast',
            onSelect: () =>
              toast({ title: 'Command palette', message: 'Shortcut works.', variant: 'info' }),
          },
        ]}
      />
    </div>
  );
}

export function App() {
  useEffect(() => {
    resetEmployees();
    return installEmployeeMock();
  }, []);

  return (
    <LaRoseProvider
      theme="light"
      locale="en"
      permissions={['employees.read', 'employees.write']}
      tenantId="demo"
      observabilityDebug
    >
      <DemoContent />
    </LaRoseProvider>
  );
}
