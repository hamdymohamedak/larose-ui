import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Drawer, Input } from '@larose-ui/react';

const meta: Meta<typeof Drawer> = {
  title: 'Foundation/Drawer',
  component: Drawer,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  render: function RightDrawer() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Employee details"
          description="Review and edit profile information."
          side="right"
        >
          <Input label="Full name" defaultValue="Ahmed Mohamed" />
          <Input label="Department" defaultValue="Engineering" />
          <Button onClick={() => setOpen(false)}>Save changes</Button>
        </Drawer>
      </>
    );
  },
};

export const Left: Story = {
  render: function LeftDrawer() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open navigation
        </Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="Navigation" side="left">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Employees</Button>
            <Button variant="ghost">Settings</Button>
          </nav>
        </Drawer>
      </>
    );
  },
};
