import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Input, Modal } from '@larose-ui/react';

const meta: Meta<typeof Modal> = {
  title: 'Foundation/Modal',
  component: Modal,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: function DefaultModal() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Edit employee"
          description="Update profile details for this team member."
        >
          <Input label="Full name" defaultValue="Ahmed Mohamed" />
          <Input label="Email" defaultValue="ahmed@company.com" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithoutDescription: Story = {
  render: function SimpleModal() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show confirmation
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Changes saved">
          <p style={{ margin: 0 }}>Your updates were saved successfully.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const NoOverlayClose: Story = {
  render: function PersistentModal() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open persistent modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Review required"
          description="Use the action below to dismiss this dialog."
          closeOnOverlay={false}
        >
          <Button onClick={() => setOpen(false)}>Acknowledge</Button>
        </Modal>
      </>
    );
  },
};
