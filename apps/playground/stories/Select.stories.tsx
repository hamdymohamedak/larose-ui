import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@larose-ui/react';

const departmentOptions = [
  { label: 'Engineering', value: 'eng' },
  { label: 'Design', value: 'design' },
  { label: 'Operations', value: 'ops' },
  { label: 'Human Resources', value: 'hr' },
];

const meta: Meta<typeof Select> = {
  title: 'Foundation/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['idle', 'loading', 'disabled', 'error', 'readonly'] },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Department',
    options: departmentOptions,
    placeholder: 'Choose a department',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Department',
    options: departmentOptions,
    hint: 'Used for org chart and permissions',
  },
};

export const Required: Story = {
  args: {
    label: 'Department',
    options: departmentOptions,
    required: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Department',
    options: departmentOptions,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Department',
    options: departmentOptions,
    error: 'Department is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Department',
    options: departmentOptions,
    disabled: true,
    defaultValue: 'eng',
  },
};
