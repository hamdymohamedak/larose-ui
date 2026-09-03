import type { Meta, StoryObj } from '@storybook/react';
import { Card, Button, Badge } from '@larose-ui/react';

const meta: Meta<typeof Card> = {
  title: 'Foundation/Card',
  component: Card,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    laRose: {
      crossFramework: 'card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Employee Profile',
    description: 'Manage employee information',
    children: 'Ahmed Mohamed — Software Engineer',
    footer: <Button size="sm">Edit</Button>,
  },
};

export const WithBadge: Story = {
  tags: ['fw-react'],
  render: () => (
    <Card
      title="Payroll Status"
      description="August 2026"
      footer={
        <>
          <Badge variant="success">Approved</Badge>
          <Button size="sm" variant="outline">
            View
          </Button>
        </>
      }
    >
      Total: EGP 45,000
    </Card>
  ),
};
