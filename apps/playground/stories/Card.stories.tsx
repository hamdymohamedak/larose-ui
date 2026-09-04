import type { Meta, StoryObj } from '@storybook/react';
import { Card, Button, Badge } from '@larose-ui/react';

type CardStoryArgs = React.ComponentProps<typeof Card> & {
  footerLabel?: string;
};

const meta: Meta<CardStoryArgs> = {
  title: 'Foundation/Card',
  component: Card,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    laRose: {
      crossFramework: 'card',
    },
  },
  argTypes: {
    footerLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CardStoryArgs>;

export const Default: Story = {
  args: {
    title: 'Employee Profile',
    description: 'Manage employee information',
    children: 'Ahmed Mohamed — Software Engineer',
    footerLabel: 'Edit',
  },
  render: ({ footerLabel, footer, children, ...cardProps }) => (
    <Card
      {...cardProps}
      footer={footerLabel ? <Button size="sm">{footerLabel}</Button> : footer}
    >
      {children}
    </Card>
  ),
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
