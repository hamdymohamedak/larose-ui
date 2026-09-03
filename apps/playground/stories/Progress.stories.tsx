import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '@larose-ui/react';

const meta: Meta<typeof Progress> = {
  title: 'Foundation/Progress',
  component: Progress,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    laRose: {
      crossFramework: 'progress',
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'error'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 65,
    label: 'Profile completion',
    showValue: true,
  },
};

export const Success: Story = {
  args: {
    value: 100,
    label: 'Upload complete',
    variant: 'success',
    showValue: true,
  },
};

export const Error: Story = {
  args: {
    value: 35,
    label: 'Sync failed',
    variant: 'error',
    showValue: true,
  },
};

export const Loading: Story = {
  args: {
    value: 45,
    label: 'Importing employees',
    showValue: true,
    state: 'loading',
  },
};
