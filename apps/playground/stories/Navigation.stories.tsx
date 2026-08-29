import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, Button, Drawer, Popover } from '@larose/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Foundation/Navigation',
  tags: ['autodocs'],
};

export default meta;

export const BreadcrumbDefault: StoryObj = {
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#' },
        { label: 'Employees', href: '#' },
        { label: 'Ahmed Mohamed' },
      ]}
    />
  ),
};

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Employee filters"
        description="Refine the list"
      >
        <p style={{ margin: 0, color: 'var(--lr-color-text-muted)' }}>
          Drawer content goes here.
        </p>
      </Drawer>
    </>
  );
}

export const DrawerDefault: StoryObj = {
  render: () => <DrawerDemo />,
};

export const PopoverDefault: StoryObj = {
  render: () => (
    <Popover
      trigger={<Button variant="outline">Actions</Button>}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button type="button">Export CSV</button>
          <button type="button">Archive</button>
        </div>
      }
    />
  ),
};
