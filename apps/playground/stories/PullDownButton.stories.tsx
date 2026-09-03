import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  MorePullDownButton,
  PullDownButton,
  Typography,
  type MenuItemConfig,
} from '@larose-ui/react';

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const meta: Meta = {
  title: 'Foundation/Pull-down Buttons',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const AddMenu: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'pullDownButton' } },
  args: {
    label: "Add",
  },

  name: 'Add',
  render: function AddMenuDemo() {
    const [lastAction, setLastAction] = useState('Choose an add action');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <PullDownButton
          label="Add"
          icon={<AddIcon />}
          entries={[
            { id: 'note', label: 'New Note' },
            { id: 'checklist', label: 'New Checklist' },
            { id: 'scan', label: 'Scan Document' },
          ]}
          onAction={(entry: MenuItemConfig) => setLastAction(entry.label)}
        />
      </div>
    );
  },
};

export const SortMenu: Story = {
  name: 'Sort',
  render: function SortMenuDemo() {
    const [lastAction, setLastAction] = useState('Choose a sort attribute');

    return (
      <PullDownButton
        label="Sort"
        entries={[
          {
            type: 'submenu',
            id: 'sort-by',
            label: 'Sort By',
            items: [
              { id: 'date', label: 'Date' },
              { id: 'title', label: 'Title' },
              { id: 'size', label: 'Size' },
            ],
          },
          { type: 'separator' },
          { id: 'ascending', label: 'Ascending' },
          { id: 'descending', label: 'Descending' },
        ]}
        onAction={(entry) => setLastAction(entry.label)}
      />
    );
  },
};

export const MoreMenu: Story = {
  name: 'More (Notes)',
  render: function MoreMenuDemo() {
    const [lastAction, setLastAction] = useState('Tap More for additional actions');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end', maxWidth: '24rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Typography role="headline">Nature Walks</Typography>
          <MorePullDownButton
            aria-label="More"
            entries={[
              { id: 'pin', label: 'Pin Note' },
              { id: 'lock', label: 'Lock Note' },
              { id: 'share', label: 'Share' },
              { type: 'separator' },
              { id: 'delete', label: 'Delete Note', destructive: true },
            ]}
            onAction={(entry) => setLastAction(entry.label)}
          />
        </div>
      </div>
    );
  },
};

export const DestructiveConfirmation: Story = {
  name: 'Destructive confirmation',
  render: function DestructiveDemo() {
    const [lastAction, setLastAction] = useState('Choose Delete Note to confirm');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <PullDownButton
          label="Actions"
          entries={[
            { id: 'duplicate', label: 'Duplicate' },
            { id: 'move', label: 'Move to Folder…' },
            { id: 'delete', label: 'Delete Note', destructive: true },
          ]}
          onAction={(entry) => setLastAction(`Confirmed: ${entry.label}`)}
        />
      </div>
    );
  },
};
