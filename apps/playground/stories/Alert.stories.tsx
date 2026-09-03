import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '@larose-ui/react';

const meta: Meta<typeof Alert> = {
  title: 'Foundation/Notice',
  component: Alert,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    laRose: {
      crossFramework: 'alert',
    },
    docs: {
      description: {
        component:
          'Inline contextual notices for non-interruptive feedback. Modal **alerts** live under **Foundation/Alert**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'Payroll period closes in 3 days.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Saved',
    children: 'Employee record updated successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'This action affects 12 employees.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    children: 'Unable to connect to payroll service.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    children: 'This notice can be dismissed.',
    onDismiss: () => undefined,
  },
};
