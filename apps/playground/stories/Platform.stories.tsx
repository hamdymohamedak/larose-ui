import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { LaRoseProvider, Feature } from '@larose-ui/runtime-react';
import { Can } from '@larose-ui/permissions-react';
import { DataView } from '@larose-ui/data-react';
import { Form } from '@larose-ui/forms-react';
import { SmartTable } from '@larose-ui/ai-react';
import {
  AuditProvider,
  AuditedInput,
  VersionProvider,
  SensitiveAction,
  SessionGuard,
} from '@larose-ui/enterprise-react';
import { DevToolsProvider } from '@larose-ui/devtools-react';
import { useObservability } from '@larose-ui/observability-react';
import { Card, Badge } from '@larose-ui/react';
import {
  installEmployeeMock,
  resetEmployees,
  type Employee,
} from './mocks/employeeApi';

function MetricsBadge() {
  const { collector } = useObservability();
  const count = collector.getEvents().length;
  return <Badge variant="info">{count} events tracked</Badge>;
}

function PlatformDemo() {
  useEffect(() => {
    resetEmployees();
    return installEmployeeMock();
  }, []);

  return (
    <LaRoseProvider
      theme="light"
      locale="en"
      environment="staging"
      permissions={['employees.read', 'employees.write', 'employees.delete', 'payroll.write']}
      tenantId="acme-corp"
      features={{ 'smart-table': true }}
    >
      <VersionProvider frontend="1.0.0" backend="2.0.0" minBackend="2.0.0" showBanner={false}>
        <AuditProvider actor="Platform Demo User">
          <SessionGuard loginUrl="/login">
            <DevToolsProvider>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <Card title="laRose Platform Demo" padding="md">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ margin: 0, color: 'var(--lr-color-text-muted)' }}>
                      Full stack: runtime, permissions, data, forms, observability, enterprise, AI,
                      and devtools — composed in one page with zero boilerplate.
                    </p>
                    <MetricsBadge />
                  </div>
                </Card>

                <Feature name="smart-table">
                  <Card title="Smart Employee Table" padding="md">
                    <DataView<Employee[]> url="/api/employees">
                      {(employees) => (
                        <SmartTable
                          data={employees}
                          keyExtractor={(e) => e.id}
                          columns={[
                            { key: 'name', header: 'Name', render: (e) => e.name, priority: 'high' },
                            { key: 'role', header: 'Role', render: (e) => e.role, priority: 'medium' },
                            { key: 'department', header: 'Department', render: (e) => e.department, priority: 'medium' },
                          ]}
                        />
                      )}
                    </DataView>
                  </Card>
                </Feature>

                <Can permission="payroll.write">
                  <Card title="Audited Salary Field" padding="md">
                    <AuditedInput
                      field="salary"
                      label="Monthly salary"
                      defaultValue="10000"
                      resourceId="emp-1"
                    />
                  </Card>
                </Can>

                <Card title="Schema Form" padding="md">
                  <Form
                    schema={{
                      id: 'quick-add',
                      title: 'Quick add',
                      fields: [
                        { name: 'name', type: 'text', label: 'Name', required: true },
                        { name: 'department', type: 'text', label: 'Department' },
                      ],
                    }}
                    onSubmit={async (values) => {
                      await fetch('/api/employees', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values),
                      });
                    }}
                  />
                </Card>

                <Can permission="employees.delete" fallback="hidden">
                  <Card title="Sensitive action" padding="md">
                    <SensitiveAction
                      label="Purge demo data"
                      description="Remove all demo employees from the mock API."
                      onConfirm={async () => resetEmployees()}
                    />
                  </Card>
                </Can>
              </div>
            </DevToolsProvider>
          </SessionGuard>
        </AuditProvider>
      </VersionProvider>
    </LaRoseProvider>
  );
}

const meta: Meta<typeof PlatformDemo> = {
  tags: ['fw-react'],
  title: 'Platform/Full Demo',
  component: PlatformDemo,
  parameters: { layout: 'padded', laRose: { standalone: true } },
};

export default meta;
type Story = StoryObj<typeof PlatformDemo>;

export const AllLayers: Story = {};
