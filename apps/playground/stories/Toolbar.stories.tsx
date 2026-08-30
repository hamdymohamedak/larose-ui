import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Toolbar,
  Typography,
  ComposeIcon,
  ShareIcon,
  SidebarIcon,
  type MenuEntry,
} from '@larose-ui/react';

const documentMenuEntries: MenuEntry[] = [
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'rename', label: 'Rename…' },
  { id: 'move', label: 'Move To…' },
  { id: 'export', label: 'Export As…' },
];

const moreEntries: MenuEntry[] = [
  { id: 'pin', label: 'Pin Note' },
  { id: 'scan', label: 'Scan Document' },
  { id: 'password', label: 'Lock Note' },
];

const meta: Meta = {
  title: 'Foundation/Toolbars',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const MacNotesStyle: Story = {
  name: 'macOS Notes (standard + More)',
  render: function MacToolbarDemo() {
    const [query, setQuery] = useState('');
    const [sidebar, setSidebar] = useState(true);
    const [lastAction, setLastAction] = useState('Interact with the toolbar');

    return (
      <div style={{ minHeight: '18rem' }}>
        <Toolbar platform="macos" aria-label="Notes toolbar">
          <Toolbar.Leading>
            <Toolbar.Group>
              <Toolbar.Item
                label={sidebar ? 'Hide Sidebar' : 'Show Sidebar'}
                icon={<SidebarIcon />}
                onClick={() => setSidebar((value) => !value)}
              />
            </Toolbar.Group>
            <Toolbar.Title>Meeting Notes</Toolbar.Title>
            <Toolbar.DocumentMenu
              entries={documentMenuEntries}
              onAction={(id) => setLastAction(`Document › ${id}`)}
            />
          </Toolbar.Leading>
          <Toolbar.Center>
            <Toolbar.Group>
              <Toolbar.Item label="Bold" icon={<span style={{ fontWeight: 700 }}>B</span>} />
              <Toolbar.Item label="Italic" icon={<span style={{ fontStyle: 'italic' }}>I</span>} />
              <Toolbar.Item label="Underline" icon={<span style={{ textDecoration: 'underline' }}>U</span>} />
              <Toolbar.Item label="List" icon={<span>≡</span>} />
              <Toolbar.Item label="Checklist" icon={<span>☑</span>} />
              <Toolbar.Item label="Table" icon={<span>▦</span>} />
            </Toolbar.Group>
          </Toolbar.Center>
          <Toolbar.Trailing>
            <Toolbar.Search value={query} onChange={setQuery} placeholder="Search" />
            <Toolbar.Spacer />
            <Toolbar.Group>
              <Toolbar.Item
                label="Compose"
                icon={<ComposeIcon />}
                onClick={() => setLastAction('Compose')}
              />
              <Toolbar.Item
                label="Share"
                icon={<ShareIcon />}
                onClick={() => setLastAction('Share')}
              />
            </Toolbar.Group>
            <Toolbar.More
              entries={moreEntries}
              onAction={(id) => setLastAction(`More › ${id}`)}
            />
          </Toolbar.Trailing>
        </Toolbar>
        <div style={{ padding: '1.5rem', display: 'grid', gap: '0.75rem' }}>
          <Typography role="body">
            Resize the window to see center formatting controls collapse into the system overflow
            menu. Leading and trailing items remain visible.
          </Typography>
          <Typography role="caption">Last action: {lastAction}</Typography>
        </div>
      </div>
    );
  },
};

export const IOSMailNavigation: Story = {
  name: 'iOS navigation bar',
  render: () => (
    <Toolbar platform="ios" largeTitle aria-label="Inbox toolbar">
      <Toolbar.Leading>
        <Toolbar.Back onClick={() => undefined} />
        <Toolbar.Title large>Inbox</Toolbar.Title>
      </Toolbar.Leading>
      <Toolbar.Trailing>
        <Toolbar.Item label="Compose" icon={<ComposeIcon />} />
      </Toolbar.Trailing>
    </Toolbar>
  ),
};

export const VisionOSBottomBar: Story = {
  name: 'visionOS bottom toolbar',
  render: () => (
    <div style={{ minHeight: '16rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <Toolbar platform="visionos" placement="bottom" aria-label="Notes toolbar">
        <Toolbar.Leading>
          <Toolbar.Back companionLabel="Back" />
        </Toolbar.Leading>
        <Toolbar.Center>
          <Toolbar.Group>
            <Toolbar.Item label="Bold" icon={<span style={{ fontWeight: 700 }}>B</span>} />
            <Toolbar.Item label="Italic" icon={<span style={{ fontStyle: 'italic' }}>I</span>} />
          </Toolbar.Group>
        </Toolbar.Center>
        <Toolbar.Trailing>
          <Toolbar.Prominent onClick={() => undefined}>Done</Toolbar.Prominent>
        </Toolbar.Trailing>
      </Toolbar>
    </div>
  ),
};

export const TrailingProminentAction: Story = {
  name: 'Primary Done action',
  render: () => (
    <Toolbar platform="ipados" aria-label="Editor toolbar">
      <Toolbar.Leading>
        <Toolbar.Close />
        <Toolbar.Title>Canvas</Toolbar.Title>
      </Toolbar.Leading>
      <Toolbar.Trailing>
        <Toolbar.Item label="Share" icon={<ShareIcon />} />
        <Toolbar.Prominent>Done</Toolbar.Prominent>
      </Toolbar.Trailing>
    </Toolbar>
  ),
};

export const SeparateTextAndSymbolGroups: Story = {
  name: 'Separate text and symbol buttons',
  render: () => (
    <Toolbar platform="ios" aria-label="Actions toolbar">
      <Toolbar.Trailing>
        <Toolbar.Group>
          <Toolbar.Item label="Edit" showLabel onClick={() => undefined} />
        </Toolbar.Group>
        <Toolbar.Spacer />
        <Toolbar.Group>
          <Toolbar.Item label="Share" icon={<ShareIcon />} />
          <Toolbar.More entries={moreEntries} />
        </Toolbar.Group>
      </Toolbar.Trailing>
    </Toolbar>
  ),
};
