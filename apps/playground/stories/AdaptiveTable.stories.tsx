import type { Meta, StoryObj } from '@storybook/react';
import { AdaptiveTable, useI18n, useNetwork, useBreakpoint } from '@larose-ui/runtime-react';
import { Badge } from '@larose-ui/react';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: string;
}

const employees: Employee[] = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
];

function RuntimeDemo() {
  const { t, locale, dir } = useI18n();
  const network = useNetwork();
  const { breakpoint } = useBreakpoint();

  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <Badge variant="info">Locale: {locale} ({dir})</Badge>
        <Badge variant={network.online ? 'success' : 'warning'}>
          Network: {network.condition}
        </Badge>
        <Badge>Breakpoint: {breakpoint}</Badge>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--lr-color-text-muted)', marginBottom: '1rem' }}>
        {t('common.loading')} — Resize viewport to see AdaptiveTable switch table → cards.
      </p>
      <AdaptiveTable
        data={employees}
        keyExtractor={(e) => e.id}
        columns={[
          { key: 'name', header: 'Name', render: (e) => e.name, priority: 'high' },
          { key: 'role', header: 'Role', render: (e) => e.role, priority: 'medium' },
          { key: 'status', header: 'Status', render: (e) => e.status, priority: 'low' },
        ]}
      />
    </div>
  );
}

const meta: Meta = {
  tags: ['fw-react'],
  title: 'Runtime/AdaptiveTable',
  component: RuntimeDemo,
  parameters: { layout: 'padded', laRose: { runtime: true } },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <RuntimeDemo />,
};

export const Loading: Story = {
  render: () => (
    <AdaptiveTable
      data={[]}
      loading
      keyExtractor={() => ''}
      columns={[{ key: 'name', header: 'Name', render: () => null }]}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <AdaptiveTable
      data={[]}
      keyExtractor={() => ''}
      columns={[{ key: 'name', header: 'Name', render: () => null }]}
    />
  ),
};
