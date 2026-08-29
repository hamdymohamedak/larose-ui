import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@larose-ui/react';

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Save Employee', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary' },
};

export const Loading: Story = {
  args: { children: 'Saving...', loading: true },
};

export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
};

export const Error: Story = {
  args: { children: 'Retry Save', error: 'Failed to save' },
};

export const Destructive: Story = {
  args: { children: 'Delete Employee', variant: 'destructive' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};
