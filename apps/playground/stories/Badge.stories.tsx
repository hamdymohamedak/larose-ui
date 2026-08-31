import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@larose-ui/react';

const meta: Meta<typeof Badge> = {
  title: 'Foundation/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Draft' },
};

export const Info: Story = {
  args: { children: 'Beta', variant: 'info' },
};

export const Success: Story = {
  args: { children: 'Active', variant: 'success' },
};

export const Warning: Story = {
  args: { children: 'Pending', variant: 'warning' },
};

export const Error: Story = {
  args: { children: 'Suspended', variant: 'error' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge>Default</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};
