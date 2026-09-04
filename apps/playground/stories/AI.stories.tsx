import type { Meta, StoryObj } from '@storybook/react';
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { AIProvider, SmartTable, SmartForm } from '@larose-ui/ai-react';
import { Card } from '@larose-ui/react';

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
            { key: 'name', header: 'Name', render: (row) => row.name, priority: 'high' },
            { key: 'department', header: 'Department', render: (row) => row.department, priority: 'medium' },
            { key: 'lateCount', header: 'Late (times)', render: (row) => row.lateCount, priority: 'medium' },
          ]}
        />
      </Card>
    </LaRoseProvider>
  );
}

const meta: Meta<typeof SmartTableDemo> = {
  tags: ['fw-react'],
  title: 'AI/SmartTable',
  component: SmartTableDemo,
  parameters: { laRose: { standalone: true } },
};

export default meta;
type Story = StoryObj<typeof SmartTableDemo>;

export const NaturalLanguageFilter: Story = {};

export const PermissionDenied: Story = {
  render: () => (
    <LaRoseProvider permissions={[]}>
      <Card title="Smart Table (no permission)" padding="md">
        <SmartTable
          data={employees}
          keyExtractor={(row) => row.id}
          columns={[
            { key: 'name', header: 'Name', render: (row) => row.name, priority: 'high' },
            { key: 'department', header: 'Department', render: (row) => row.department, priority: 'medium' },
            { key: 'lateCount', header: 'Late (times)', render: (row) => row.lateCount, priority: 'medium' },
          ]}
        />
      </Card>
    </LaRoseProvider>
  ),
};

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
