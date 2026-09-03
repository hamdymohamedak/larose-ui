import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Dialog } from '@larose-ui/react';

const meta: Meta<typeof Dialog> = {
  title: 'Foundation/Dialog',
  component: Dialog,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const ConfirmDelete: Story = {
  render: function ConfirmDeleteDialog() {
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
  render: function LoadingDialog() {
    return (
      <Dialog
        open
        onClose={() => undefined}
        title="Saving Changes"
        description="Please wait while we save your changes."
        confirmLabel="Save"
        onConfirm={() => undefined}
        loading
      />
    );
  },
};
