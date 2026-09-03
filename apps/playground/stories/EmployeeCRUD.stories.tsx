import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { LaRoseProvider, AdaptiveTable, Feature } from '@larose-ui/runtime';
import { Can } from '@larose-ui/permissions';
import { DataView, useUndo, UndoToast } from '@larose-ui/data';
import { Form } from '@larose-ui/forms';
import { Button, Card, Dialog } from '@larose-ui/react';
import {
  installEmployeeMock,
  resetEmployees,
  type Employee,
} from './mocks/employeeApi';

function EmployeeCrudDemo() {
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { actions, register, executeUndo, dismiss } = useUndo();

  useEffect(() => {
    resetEmployees();
    return installEmployeeMock();
  }, []);

  const employeeSchema = {
    id: 'create-employee',
    title: 'New Employee',
    fields: [
      { name: 'name', type: 'text' as const, label: 'Full Name', required: true },
      { name: 'role', type: 'text' as const, label: 'Role', required: true },
      {
        name: 'country',
        type: 'select' as const,
        label: 'Country',
        options: [
          { label: 'Egypt', value: 'Egypt' },
          { label: 'Germany', value: 'Germany' },
        ],
      },
      {
        name: 'governorate',
        type: 'text' as const,
        label: 'Governorate',
        showWhen: { field: 'country', equals: 'Egypt' },
      },
      { name: 'department', type: 'text' as const, label: 'Department', required: true },
    ],
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const snapshot = { ...deleteTarget };
    await fetch(`/api/employees/${snapshot.id}`, { method: 'DELETE' });
    setRefreshKey((k) => k + 1);
    register(`Employee ${snapshot.name} deleted`, snapshot, async () => {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      });
      setRefreshKey((k) => k + 1);
    });
    setDeleteTarget(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Employees</h2>
        <Can permission="employees.create">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Employee'}
          </Button>
        </Can>
      </div>

      <Feature name="new-employee-form">
        {showForm && (
          <div style={{ marginBottom: '1rem' }}>
            <Card title="Create Employee">
              <Form
                schema={employeeSchema}
                onSubmit={async (values) => {
                  await fetch('/api/employees', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                  });
                  setShowForm(false);
                  setRefreshKey((k) => k + 1);
                }}
                submitLabel="Create"
              />
            </Card>
          </div>
        )}
      </Feature>

      <DataView<Employee[]>
        key={refreshKey}
        url="/api/employees"
        permission="employees.read"
        empty={<p>No employees yet. Create one to get started.</p>}
      >
        {(data) => (
          <AdaptiveTable
            data={data}
            keyExtractor={(e) => e.id}
            columns={[
              { key: 'name', header: 'Name', render: (e) => e.name, priority: 'high' },
              { key: 'role', header: 'Role', render: (e) => e.role, priority: 'medium' },
              {
                key: 'department',
                header: 'Department',
                render: (e) => e.department,
                priority: 'low',
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (e) => (
                  <Can permission="employees.delete" fallback="disabled">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(e)}
                    >
                      Delete
                    </Button>
                  </Can>
                ),
                priority: 'high',
              },
            ]}
          />
        )}
      </DataView>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
        description={
          deleteTarget
            ? `Remove ${deleteTarget.name} from the directory?`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => void handleDelete()}
      />

      <UndoToast actions={actions} onUndo={(id) => void executeUndo(id)} onDismiss={dismiss} />
    </div>
  );
}

const meta: Meta = {
  tags: ['fw-react'],
  title: 'Intelligence/Employee CRUD',
  component: EmployeeCrudDemo,
  parameters: {
    layout: 'padded',
    laRose: {
      runtime: true,
      provider: {
        permissions: ['employees.read', 'employees.create', 'employees.delete'],
        features: { 'new-employee-form': true },
        enableToasts: false,
        observabilityDebug: false,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <EmployeeCrudDemo />,
};

export const ReadOnly: Story = {
  parameters: { laRose: { standalone: true } },
  decorators: [
    (Story) => (
      <LaRoseProvider permissions={['employees.read']}>
        <Story />
      </LaRoseProvider>
    ),
  ],
  render: () => <EmployeeCrudDemo />,
};

export const ServerError: Story = {
  parameters: { laRose: { standalone: true } },
  render: () => (
    <LaRoseProvider permissions={['employees.read']}>
      <DataView url="/api/error" permission="employees.read">
        {() => null}
      </DataView>
    </LaRoseProvider>
  ),
};
