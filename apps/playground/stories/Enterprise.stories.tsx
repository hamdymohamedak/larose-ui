import type { Meta, StoryObj } from '@storybook/react';
import { LaRoseProvider } from '@larose/runtime';
import { AuditProvider, AuditedInput, VersionProvider } from '@larose/enterprise';
import { Card } from '@larose/react';

function AuditDemo() {
  return (
    <LaRoseProvider permissions={['payroll.write']} tenantId="acme">
      <AuditProvider actor="Ahmed Hassan">
        <Card title="Salary adjustment" padding="md">
          <AuditedInput field="salary" label="Salary" defaultValue="10000" resourceId="emp-42" />
        </Card>
      </AuditProvider>
    </LaRoseProvider>
  );
}

const meta: Meta<typeof AuditDemo> = {
  title: 'Enterprise/Audit',
  component: AuditDemo,
};

export default meta;
type Story = StoryObj<typeof AuditDemo>;

export const AuditedSalary: Story = {};

function VersionDemo() {
  return (
    <LaRoseProvider>
      <VersionProvider frontend="3.0.0" backend="1.0.0" minBackend="2.0.0">
        <Card title="Payroll module" padding="md">
          <p>This module requires backend API v2+.</p>
        </Card>
      </VersionProvider>
    </LaRoseProvider>
  );
}

export const VersionMismatch: StoryObj = {
  render: () => <VersionDemo />,
};
