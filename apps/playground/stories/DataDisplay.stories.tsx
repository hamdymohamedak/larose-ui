import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  DataTable,
  Pagination,
  Breadcrumb,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/DataDisplay',
  tags: ['autodocs', 'fw-react'],
};

export default meta;

export const AccordionDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'accordion' } },
  args: { type: 'single', collapsible: true, defaultValue: ['profile'] },

  render: () => (
    <Accordion type="single" collapsible defaultValue={['profile']}>
      <AccordionItem value="profile">
        <AccordionTrigger>Profile</AccordionTrigger>
        <AccordionContent>Name, email, and department settings.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="security">
        <AccordionTrigger>Security</AccordionTrigger>
        <AccordionContent>Password, MFA, and active sessions.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>Email and in-app notification preferences.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

const employees = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
];

export const DataTableDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'dataTable' } },
  args: {
    caption: "Employees",
    striped: true,
  },

  render: () => (
    <DataTable
      caption="Employees"
      striped
      data={employees}
      keyExtractor={(row) => row.id}
      columns={[
        { key: 'name', header: 'Name', accessor: (row) => row.name },
        { key: 'role', header: 'Role', accessor: (row) => row.role },
        {
          key: 'status',
          header: 'Status',
          render: (row) => (
            <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge>
          ),
        },
      ]}
    />
  ),
};

export const DataTableLoading: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'dataTable' } },
  args: {
    loading: true,
    data: [],
  },

  render: () => (
    <DataTable
      loading
      data={[]}
      keyExtractor={() => ''}
      columns={[
        { key: 'name', header: 'Name', accessor: () => '' },
        { key: 'role', header: 'Role', accessor: () => '' },
      ]}
    />
  ),
};

export const DataTableEmpty: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'dataTable' } },
  args: {
    data: [],
    emptyTitle: "No employees",
  },

  render: () => (
    <DataTable
      data={[]}
      keyExtractor={() => ''}
      columns={[{ key: 'name', header: 'Name', accessor: () => '' }]}
      emptyTitle="No employees yet"
      emptyDescription="Add your first team member to get started."
    />
  ),
};

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ margin: 0, color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
        Page {page} of 12
      </p>
      <Pagination page={page} totalPages={12} onPageChange={setPage} />
    </div>
  );
}

export const PaginationDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'pagination' } },
  args: {
    page: 1,
    totalPages: 12,
  },

  render: () => <PaginationDemo />,
};


export const BreadcrumbDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'breadcrumb' } },
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Employees', href: '#' },
      { label: 'Ahmed', current: true },
    ],
  },
  render: (args) => <Breadcrumb items={args.items as never} />,
};
