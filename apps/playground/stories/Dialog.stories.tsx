import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Dialog } from '@larose/react';

const meta: Meta<typeof Dialog> = {
  title: 'Foundation/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const ConfirmDelete: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Employee
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete Employee"
          description="This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="destructive"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Loading: Story = {
  args: {
    open: true,
    onClose: () => undefined,
    title: 'Saving Changes',
    description: 'Please wait while we save your changes.',
    confirmLabel: 'Save',
    onConfirm: () => undefined,
    loading: true,
  },
};
