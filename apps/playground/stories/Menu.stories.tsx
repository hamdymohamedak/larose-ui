import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { Button, Menu, Typography, type MenuEntry } from '@larose-ui/react';
import { DEMO_ACCELERATORS } from './demoAccelerators';

function CenteredCanvas({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        width: '100%',
        minHeight: '70vh',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

function BoldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M7 5h6a4 4 0 0 1 0 8H7V5zm0 10h7a4 4 0 0 1 0 8H7v-8z" fill="currentColor" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M10 5h8M6 19h8M14 5l-4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M6 5v6a6 6 0 0 0 12 0V5M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StrikeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path d="M4 12h16M7 7h7a3 3 0 0 1 0 6H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const formatEntries: MenuEntry[] = [
  { id: 'bold', label: 'Bold', icon: <BoldIcon /> },
  { id: 'italic', label: 'Italic', icon: <ItalicIcon /> },
  { id: 'underline', label: 'Underline', icon: <UnderlineIcon /> },
  { id: 'strike', label: 'Strikethrough', icon: <StrikeIcon /> },
  { type: 'separator' },
  { id: 'plain', label: 'Plain Text' },
];

const meta: Meta = {
  title: 'Foundation/Menus',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <CenteredCanvas>
        <Story />
      </CenteredCanvas>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const LargeLayout: Story = {
  name: 'Large (default)',
  render: function LargeMenuDemo() {
    const [lastAction, setLastAction] = useState('Open the menu, then try ⇧⌘N or ⇧⌘O');

    return (
      <>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <Typography role="caption" muted>
          Storybook uses browser-safe shortcuts (Shift/Alt variants) so chords like ⌘N do not open a
          new browser window.
        </Typography>
        <Menu
          entries={[
            {
              id: 'new',
              label: 'New Document',
              accelerator: DEMO_ACCELERATORS.newDocument,
              onSelect: () => setLastAction('New Document'),
            },
            {
              id: 'open',
              label: 'Open…',
              accelerator: DEMO_ACCELERATORS.open,
              onSelect: () => setLastAction('Open…'),
            },
            { type: 'separator' },
            {
              id: 'share',
              label: 'Share',
              accelerator: DEMO_ACCELERATORS.share,
              onSelect: () => setLastAction('Share'),
            },
            { id: 'delete', label: 'Delete', destructive: true },
          ]}
          onEntrySelect={(entry) => setLastAction(entry.label)}
        >
          <Button variant="secondary">File</Button>
        </Menu>
      </>
    );
  },
};

export const MediumLayout: Story = {
  name: 'Medium layout',
  render: function MediumMenuDemo() {
    return (
      <Menu
        layout="medium"
        open
        onOpenChange={() => undefined}
        entries={[
          { id: 'scan', label: 'Scan', icon: <BoldIcon /> },
          { id: 'lock', label: 'Lock', icon: <ItalicIcon /> },
          { id: 'pin', label: 'Pin', icon: <UnderlineIcon /> },
          { type: 'separator' },
          { id: 'share', label: 'Share Note' },
          { id: 'move', label: 'Move…' },
        ]}
      />
    );
  },
};

export const SmallLayout: Story = {
  name: 'Small layout',
  render: function SmallMenuDemo() {
    return (
      <Menu layout="small" open onOpenChange={() => undefined} entries={formatEntries} />
    );
  },
};

export const SubmenuAndToggles: Story = {
  name: 'Submenus and toggles',
  render: function SubmenuDemo() {
    const [lastAction, setLastAction] = useState('Hover “Sort By” to reveal its submenu');

    return (
      <>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <Menu
          open
          onOpenChange={() => undefined}
          entries={[
            {
              type: 'submenu',
              id: 'sort',
              label: 'Sort By',
              items: [
                { id: 'date', label: 'Date', selected: true },
                { id: 'score', label: 'Score' },
                { id: 'time', label: 'Time' },
              ],
            },
            { type: 'separator' },
            { id: 'hdr', label: 'HDR On', selected: true },
            {
              id: 'plain',
              label: 'Plain',
              accelerator: DEMO_ACCELERATORS.plainText,
              onSelect: () => setLastAction('Plain'),
            },
          ]}
          onEntrySelect={(entry) => setLastAction(entry.label)}
        />
      </>
    );
  },
};

export const UnavailableItems: Story = {
  name: 'Unavailable items',
  render: function UnavailableDemo() {
    return (
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[
          {
            id: 'copy',
            label: 'Copy',
            accelerator: DEMO_ACCELERATORS.copy,
            disabled: true,
          },
          {
            id: 'paste',
            label: 'Paste',
            accelerator: DEMO_ACCELERATORS.paste,
          },
          { id: 'delete', label: 'Delete', disabled: true, destructive: true },
        ]}
      />
    );
  },
};
