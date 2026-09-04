import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  Card,
  DragDropProvider,
  Draggable,
  DropZone,
  OutlineView,
  SplitView,
  SplitViewPane,
  SplitViewToolbar,
  Typography,
  useSplitView,
  type OutlineNode,
} from '@larose-ui/react';

const mailboxes: OutlineNode[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    values: { Count: '12', Kind: 'Mailbox' },
    children: [
      { id: 'team', label: 'Team updates', values: { Count: '4', Kind: 'Smart mailbox' } },
      { id: 'personal', label: 'Personal', values: { Count: '8', Kind: 'Smart mailbox' } },
    ],
  },
  {
    id: 'drafts',
    label: 'Drafts',
    values: { Count: '2', Kind: 'Mailbox' },
  },
];

const messages = [
  { id: 'm1', subject: 'Quarterly planning', preview: 'Let’s align on roadmap priorities…' },
  { id: 'm2', subject: 'Design review', preview: 'Attached are the latest mockups…' },
  { id: 'm3', subject: 'Welcome to LaRose', preview: 'Thanks for trying the refined design language.' },
];

function InspectorToggle() {
  const { hidePane, showPane, hiddenPanes } = useSplitView();
  const hidden = hiddenPanes.some((pane) => pane.id === 'inspector');

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => (hidden ? showPane('inspector') : hidePane('inspector'))}
    >
      {hidden ? 'Show Inspector' : 'Hide Inspector'}
    </Button>
  );
}

const meta: Meta = {
  title: 'Foundation/Split Views',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const SidebarDetailInspector: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'splitView' } },
  args: { orientation: 'horizontal', leftLabel: 'Mailboxes', rightLabel: 'Message' },

  name: 'Sidebar · content · inspector',
  render: function ThreePaneDemo() {
    const [selectedMailbox, setSelectedMailbox] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState('m1');

    const message = messages.find((entry) => entry.id === selectedMessage);

    return (
      <Card padding="none" title="">
        <SplitView
          storageKey="mail-split-demo"
          aria-label="Mail split view"
          toolbar={
            <SplitViewToolbar actions={<InspectorToggle />} />
          }
        >
          <SplitViewPane id="sidebar" label="Sidebar" defaultSize={1} minSize={160}>
            <div style={{ padding: '0.5rem 0' }}>
              {mailboxes.map((mailbox) => (
                <button
                  key={mailbox.id}
                  type="button"
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background:
                      selectedMailbox === mailbox.id
                        ? 'var(--lr-column-view-row-selected)'
                        : 'transparent',
                    textAlign: 'start',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedMailbox(mailbox.id)}
                >
                  {mailbox.label}
                </button>
              ))}
            </div>
          </SplitViewPane>
          <SplitViewPane id="content" label="Message list" defaultSize={2} minSize={220}>
            <div>
              {messages.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderBottom: '1px solid var(--lr-color-border)',
                    background:
                      selectedMessage === entry.id
                        ? 'var(--lr-column-view-row-selected)'
                        : 'transparent',
                    textAlign: 'start',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedMessage(entry.id)}
                >
                  <strong style={{ display: 'block' }}>{entry.subject}</strong>
                  <span style={{ color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
                    {entry.preview}
                  </span>
                </button>
              ))}
            </div>
          </SplitViewPane>
          <SplitViewPane
            id="inspector"
            label="Inspector"
            defaultSize={1}
            minSize={180}
            collapsible
          >
            <div style={{ padding: '1rem' }}>
              <Typography role="headline">{message?.subject}</Typography>
              <Typography role="body" muted>
                {message?.preview}
              </Typography>
            </div>
          </SplitViewPane>
        </SplitView>
      </Card>
    );
  },
};

export const VerticalSplit: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'splitView' } },
  args: { orientation: 'vertical', leftLabel: 'Navigator', rightLabel: 'Editor' },

  render: () => (
    <SplitView orientation="vertical" aria-label="Notes split view">
      <SplitViewPane id="navigator" label="Navigator" defaultSize={1}>
        <OutlineView
          data={mailboxes}
          defaultExpandedIds={['inbox']}
          columns={['Count']}
          aria-label="Folders"
        />
      </SplitViewPane>
      <SplitViewPane id="editor" label="Editor" defaultSize={2}>
        <div style={{ padding: '1rem' }}>
          <Typography role="headline">Presenter notes</Typography>
          <Typography role="body" muted>
            Vertical splits work well for navigator and canvas regions in macOS-style layouts.
          </Typography>
        </div>
      </SplitViewPane>
    </SplitView>
  ),
};

export const DragBetweenPanes: Story = {
  name: 'Drag between panes',
  render: function DragSplitDemo() {
    const [inbox, setInbox] = useState(['Brief.pages', 'Hero.png']);
    const [archive, setArchive] = useState<string[]>(['Old draft.pdf']);

    return (
      <DragDropProvider>
        <SplitView aria-label="File drag split view">
          <SplitViewPane id="inbox" label="Inbox" defaultSize={1}>
            <DropZone
              id="inbox-zone"
              accepts="file"
              onDrop={(result) => {
                const names = result.items.map((item) => String(item.data));
                setInbox((current) => [...new Set([...current, ...names])]);
                setArchive((current) => current.filter((name) => !names.includes(name)));
              }}
            >
              <ul>
                {inbox.map((name) => (
                  <li key={name}>
                    <Draggable id={name} sourceId="inbox" type="file" data={name}>
                      {name}
                    </Draggable>
                  </li>
                ))}
              </ul>
            </DropZone>
          </SplitViewPane>
          <SplitViewPane id="archive" label="Archive" defaultSize={1}>
            <DropZone
              id="archive-zone"
              accepts="file"
              onDrop={(result) => {
                const names = result.items.map((item) => String(item.data));
                setArchive((current) => [...new Set([...current, ...names])]);
                setInbox((current) => current.filter((name) => !names.includes(name)));
              }}
            >
              <ul>
                {archive.map((name) => (
                  <li key={name}>
                    <Draggable id={name} sourceId="archive" type="file" data={name}>
                      {name}
                    </Draggable>
                  </li>
                ))}
              </ul>
            </DropZone>
          </SplitViewPane>
        </SplitView>
      </DragDropProvider>
    );
  },
};

export const CompactStack: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'splitView' } },
  args: { orientation: 'horizontal', leftLabel: 'Mailboxes', rightLabel: 'Message' },

  render: function CompactDemo() {
    const [selected, setSelected] = useState('inbox');
    const label = mailboxes.find((mailbox) => mailbox.id === selected)?.label ?? 'Mailbox';

    return (
      <div style={{ maxWidth: '24rem' }}>
        <SplitView compactMode="stack" aria-label="Compact mail split view">
          <SplitViewPane id="sidebar" defaultSize={1}>
            {mailboxes.map((mailbox) => (
              <button
                key={mailbox.id}
                type="button"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background:
                    selected === mailbox.id ? 'var(--lr-column-view-row-selected)' : 'transparent',
                  textAlign: 'start',
                }}
                onClick={() => setSelected(mailbox.id)}
              >
                {mailbox.label}
              </button>
            ))}
          </SplitViewPane>
          <SplitViewPane id="detail" defaultSize={2}>
            <div style={{ padding: '1rem' }}>
              <Typography role="headline">{label}</Typography>
              <Typography role="body" muted>
                In compact environments, stack panes instead of showing them side by side.
              </Typography>
            </div>
          </SplitViewPane>
        </SplitView>
      </div>
    );
  },
};
