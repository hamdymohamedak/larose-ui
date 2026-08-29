import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@larose/react';

const meta: Meta<typeof EmptyState> = {
  title: 'Foundation/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoEmployees: Story = {
  args: {
    title: 'No employees found',
    description: 'Get started by creating your first employee record.',
    actionLabel: 'Add Employee',
    onAction: () => undefined,
  },
};

export const Offline: Story = {
  args: {
    title: 'You are offline',
    description: 'Changes will sync when you reconnect.',
    state: 'offline',
  },
};

export const Unauthorized: Story = {
  args: {
    title: 'Access denied',
    description: "You don't have permission to view this resource.",
    state: 'unauthorized',
    actionLabel: 'Go back',
    onAction: () => undefined,
  },
};
