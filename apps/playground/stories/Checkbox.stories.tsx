import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@larose-ui/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Foundation/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    laRose: {
      crossFramework: 'checkbox',
    },
  },
  argTypes: {
    boxSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'I agree to the terms',
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    defaultChecked: true,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Send me product updates',
    hint: 'You can unsubscribe at any time',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'You must accept the terms to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Legacy feature access',
    disabled: true,
  },
};
