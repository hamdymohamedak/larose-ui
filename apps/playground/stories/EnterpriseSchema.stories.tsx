import type { Meta, StoryObj } from '@storybook/react';
import { LaRoseProvider } from '@larose-ui/runtime';
import { SchemaRenderer, SensitiveAction, SessionGuard, notifySessionExpired } from '@larose-ui/enterprise';
import { Button, Card } from '@larose-ui/react';

const employeeSchema = {
  type: 'form' as const,
  id: 'employee-onboard',
  title: 'Onboard Employee',
  permission: 'employees.write',
  fields: [
    { type: 'text' as const, name: 'employeeName', label: 'Employee Name', required: true },
    { type: 'date' as const, name: 'joiningDate', label: 'Joining Date', required: true },
    { type: 'text' as const, name: 'department', label: 'Department' },
  ],
};

function SchemaDemo() {
  return (
    <LaRoseProvider permissions={['employees.write']}>
      <Card title="UI Schema (IaC)" padding="md">
        <SchemaRenderer schema={employeeSchema} onSubmit={async () => undefined} />
      </Card>
    </LaRoseProvider>
  );
}

const meta: Meta<typeof SchemaDemo> = {
  title: 'Enterprise/Schema',
  component: SchemaDemo,
};

export default meta;
type Story = StoryObj<typeof SchemaDemo>;

export const FormFromSchema: Story = {};

function SecurityDemo() {
  return (
    <LaRoseProvider environment="production" permissions={['employees.delete']}>
      <SessionGuard loginUrl="/login">
        <Card title="Security patterns" padding="md">
          <SensitiveAction
            label="Delete all records"
            description="Permanently delete all employee records."
            onConfirm={async () => undefined}
          />
          <div style={{ marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => notifySessionExpired()}>
              Simulate session expiry
            </Button>
          </div>
        </Card>
      </SessionGuard>
    </LaRoseProvider>
  );
}

export const SensitiveActionAndSession: StoryObj = {
  render: () => <SecurityDemo />,
};
