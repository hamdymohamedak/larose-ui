import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@larose-ui/react';

const meta: Meta<typeof Textarea> = {
  title: 'Foundation/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter details...',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add internal notes',
    hint: 'Visible to admins only',
  },
};

export const Required: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Tell us what you think',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    defaultValue: 'Too short',
    error: 'Description must be at least 20 characters',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Archived notes',
    defaultValue: 'This record is read-only.',
    disabled: true,
  },
};
