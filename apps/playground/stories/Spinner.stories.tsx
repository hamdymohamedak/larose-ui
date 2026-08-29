import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@larose/react';

const meta: Meta<typeof Spinner> = {
  title: 'Foundation/Spinner',
  component: Spinner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };
