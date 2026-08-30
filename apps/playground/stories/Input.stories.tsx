import type { Meta, StoryObj } from '@storybook/react';
import {
  Input,
  SecureField,
  combineValidators,
  createEmailValidator,
  createRequiredValidator,
} from '@larose-ui/react';

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
    placeholder: 'username@company.com',
    hint: 'Work email address',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'username@company.com',
    required: true,
  },
};

export const Validated: Story = {
  args: {
    label: 'Email',
    placeholder: 'username@company.com',
    required: true,
    validate: combineValidators(createRequiredValidator(), createEmailValidator()),
    validateOn: 'change',
  },
};

export const CurrencyFormat: Story = {
  args: {
    label: 'Salary',
    format: 'currency',
    defaultValue: '85000',
    hint: 'Formatted when the field loses focus',
  },
};

export const Secure: Story = {
  render: () => <SecureField label="Password" required hint="Never prepopulated" />,
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
