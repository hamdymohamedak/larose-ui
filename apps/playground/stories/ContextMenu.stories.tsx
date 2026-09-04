import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  ContextMenu,
  List,
  ListRow,
  ListSection,
  Typography,
  formatContextMenuTitle,
  type ContextMenuEntry,
} from '@larose-ui/react';

function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" aria-hidden="true">
      <path d="M10 7 4 12l6 5M4 12h11a5 5 0 0 1 0 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" aria-hidden="true">
      <path d="M5 8h14M9 8V6h6v2M8 8l1 11h6l1-11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const mailEntries = (hasSelection: boolean): ContextMenuEntry[] => [
  { id: 'reply', label: 'Reply', icon: <ReplyIcon /> },
  { id: 'reply-all', label: 'Reply All', hidden: !hasSelection },
  {
    id: 'move',
    label: 'Move',
    type: 'submenu',
    items: [
      { id: 'inbox', label: 'Inbox' },
      { id: 'archive-folder', label: 'Archive' },
      { id: 'work', label: 'Work' },
    ],
  },
  { type: 'separator' },
  { id: 'copy', label: 'Copy', disabled: !hasSelection },
  { id: 'archive', label: 'Archive Message' },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', icon: <TrashIcon />, destructive: true },
];

const meta: Meta = {
  title: 'Foundation/Context Menus',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const MailMessage: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'contextMenu' } },
  args: { open: true, title: 'Message' },
  name: 'Mail message',
  render: function MailMessageDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click a message');

    return (
      <div style={{ maxWidth: '28rem' }}>
        <List aria-label="Inbox">
          <ListSection header="Inbox">
            <ContextMenu
              entries={mailEntries(true)}
              onEntrySelect={(entry) => setLastAction(entry.label)}
              preview={
                <div style={{ padding: '0.75rem' }}>
                  <strong>Nature Walks</strong>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
                    Notes from this morning&apos;s hike along the coast…
                  </p>
                </div>
              }
            >
              <ListRow
                title="Nature Walks"
                subtitle="Sara Ali — Notes from this morning's hike"
                onPress={() => undefined}
              />
            </ContextMenu>
            <ListRow title="Quarterly Plan" subtitle="Omar Hassan — Updated roadmap" onPress={() => undefined} />
          </ListSection>
        </List>
        <Typography role="footnote" muted>
          {lastAction}. Reply and Move are contextual; Print and Filter are intentionally omitted.
        </Typography>
      </div>
    );
  },
};

export const MultiSelectTitle: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'contextMenu' } },
  args: { open: true, title: '3 items' },
  name: 'Multi-select title',
  render: () => (
    <ContextMenu
      entries={mailEntries(true)}
      title={formatContextMenuTitle(3, 'Message')}
      open
      onOpenChange={() => undefined}
    >
      <div
        style={{
          padding: '1rem',
          borderRadius: 'var(--lr-radius-md)',
          border: '1px solid var(--lr-color-border)',
        }}
      >
        3 selected messages
      </div>
    </ContextMenu>
  ),
};

export const HiddenUnavailable: Story = {
  render: function HiddenDemo() {
    const [lastAction, setLastAction] = useState('');

    return (
      <>
        <ContextMenu
          entries={[
            { id: 'duplicate', label: 'Duplicate' },
            { id: 'rename', label: 'Rename', hidden: true },
            { type: 'separator' },
            { id: 'delete', label: 'Delete', destructive: true },
          ]}
          onEntrySelect={(entry) => setLastAction(entry.label)}
        >
          <button type="button" style={{ padding: '1rem', border: '1px dashed var(--lr-color-border)' }}>
            Control-click or right-click
          </button>
        </ContextMenu>
        {lastAction && (
          <Typography role="footnote" muted>
            Selected: {lastAction}. Unavailable items are hidden, not dimmed.
          </Typography>
        )}
      </>
    );
  },
};
