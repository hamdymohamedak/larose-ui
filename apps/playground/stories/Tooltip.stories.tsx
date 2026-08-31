import type { Meta, StoryObj } from '@storybook/react';
import { Button, Tooltip } from '@larose-ui/react';

const meta: Meta<typeof Tooltip> = {
  title: 'Foundation/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'Export employees as CSV',
    children: <Button variant="outline">Export</Button>,
  },
};

export const OnText: Story = {
  args: {
    content: 'Last updated 2 hours ago',
    children: <span style={{ textDecoration: 'underline dotted' }}>Employee count</span>,
  },
};

export const LongContent: Story = {
  args: {
    content: 'Keyboard shortcut: ⌘ + Shift + E',
    children: <Button variant="secondary">Quick export</Button>,
  },
};
