import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@larose-ui/react';

const meta: Meta<typeof Input> = {
  title: 'Foundation/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Employee Name', placeholder: 'Enter name' },
};

export const WithHint: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    hint: 'Work email address',
  },
};

export const Loading: Story = {
  args: { label: 'Department', loading: true, placeholder: 'Loading...' },
};

export const Error: Story = {
  args: {
    label: 'Salary',
    error: 'Must be a positive number',
    defaultValue: '-100',
  },
};

export const Disabled: Story = {
  args: { label: 'Employee ID', disabled: true, defaultValue: 'EMP-001' },
};

export const ReadOnly: Story = {
  args: { label: 'Created At', readOnly: true, defaultValue: '2026-08-29' },
};
