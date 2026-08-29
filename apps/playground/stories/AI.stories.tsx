import type { Meta, StoryObj } from '@storybook/react';
import { LaRoseProvider } from '@larose/runtime';
import { SmartTable, SmartForm } from '@larose/ai';
import { Card } from '@larose/react';

const employees = [
  { id: '1', name: 'Sara Ali', department: 'Engineering', lateCount: 5 },
  { id: '2', name: 'Omar Hassan', department: 'HR', lateCount: 1 },
  { id: '3', name: 'Lina Koch', department: 'Engineering', lateCount: 4 },
];

function SmartTableDemo() {
  return (
    <LaRoseProvider permissions={['employees.read']}>
      <Card title="Smart Table" padding="md">
        <SmartTable
          data={employees}
          keyExtractor={(row) => row.id}
          columns={[
            { key: 'name', header: 'Name', priority: 'high' },
            { key: 'department', header: 'Department', priority: 'medium' },
            { key: 'lateCount', header: 'Late (times)', priority: 'medium' },
          ]}
        />
      </Card>
    </LaRoseProvider>
  );
}

const meta: Meta<typeof SmartTableDemo> = {
  title: 'AI/SmartTable',
  component: SmartTableDemo,
};

export default meta;
type Story = StoryObj<typeof SmartTableDemo>;

export const NaturalLanguageFilter: Story = {};

function SmartFormDemo() {
  const schema = {
    id: 'smart-employee',
    title: 'New Employee',
    fields: [
      { name: 'name', type: 'text' as const, label: 'Full Name', required: true },
      { name: 'role', type: 'text' as const, label: 'Role' },
      { name: 'department', type: 'text' as const, label: 'Department' },
    ],
  };

  return (
    <LaRoseProvider permissions={['employees.write']}>
      <Card title="Smart Form" padding="md">
        <SmartForm schema={schema} onSubmit={async () => undefined} />
      </Card>
    </LaRoseProvider>
  );
}

export const NaturalLanguagePopulate: StoryObj = {
  render: () => <SmartFormDemo />,
};
