import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@larose-ui/react';

const meta: Meta<typeof Skeleton> = {
  title: 'Foundation/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = { args: { width: 200 } };
export const Multiline: Story = { args: { lines: 3 } };
export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
};
