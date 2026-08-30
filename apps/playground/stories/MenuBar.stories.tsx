import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  MenuBar,
  Typography,
  type MenuBarDocumentContext,
  type MenuBarExtraConfig,
} from '@larose-ui/react';

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" aria-hidden="true">
      <path
        d="M12 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7.05 13.05a7 7 0 0 1 9.9 0M4.22 10.22a11 11 0 0 1 15.56 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta: Meta = {
  title: 'Foundation/Menu Bar',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const MacOSStandard: Story = {
  name: 'macOS standard menus',
  render: function MacOSMenuBarDemo() {
    const [lastAction, setLastAction] = useState('Choose a menu item');
    const [context, setContext] = useState<MenuBarDocumentContext>({
      isDocumentOpen: true,
      isDirty: true,
      hasTabs: true,
      toolbarVisible: true,
      sidebarVisible: false,
      canUndo: true,
      canRedo: false,
      hasSelection: true,
      canPaste: true,
    });

    const extras: MenuBarExtraConfig[] = [
      {
        id: 'wifi',
        label: 'Wi-Fi status',
        icon: <WifiIcon />,
        entries: [
          { id: 'network-1', label: 'Home Network', selected: true },
          { id: 'network-2', label: 'Office Network' },
          { type: 'separator' },
          { id: 'network-settings', label: 'Network Settings…' },
        ],
      },
    ];

    return (
      <div style={{ minHeight: '20rem' }}>
        <MenuBar
          appName="Safari"
          standardOptions={{
            context,
            handlers: {
              save: () => setLastAction('Saved document'),
              undo: () => setLastAction('Undo'),
              copy: () => setLastAction('Copied selection'),
            },
            openWindows: ['Reading List', 'Start Page', 'apple.com'],
            recentDocuments: ['Quarterly Report.pages', 'Design Spec.pdf'],
          }}
          appSpecificMenus={[
            {
              id: 'history',
              title: 'History',
              entries: [
                { id: 'back', label: 'Back', shortcut: '⌘[' },
                { id: 'forward', label: 'Forward', shortcut: '⌘]' },
                { type: 'separator' },
                { id: 'clear', label: 'Clear History…', destructive: true },
              ],
            },
            {
              id: 'bookmarks',
              title: 'Bookmarks',
              entries: [
                { id: 'add', label: 'Add Bookmark…', shortcut: '⌘D' },
                { id: 'show', label: 'Show Bookmarks' },
              ],
            },
          ]}
          extras={extras}
          platform="macos"
          onMenuAction={(menuId, entryId) => setLastAction(`${menuId} › ${entryId}`)}
        />
        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem', maxWidth: '40rem' }}>
          <Typography variant="body">
            Hold <strong>Option</strong> while a menu is open to reveal dynamic items such as Close
            All, Minimize All, and Quit and Keep Windows.
          </Typography>
          <Typography variant="caption">Last action: {lastAction}</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button type="button" onClick={() => setContext((c) => ({ ...c, canUndo: !c.canUndo }))}>
              Toggle undo
            </button>
            <button
              type="button"
              onClick={() => setContext((c) => ({ ...c, toolbarVisible: !c.toolbarVisible }))}
            >
              Toggle toolbar label
            </button>
            <button
              type="button"
              onClick={() => setContext((c) => ({ ...c, sidebarVisible: !c.sidebarVisible }))}
            >
              Toggle sidebar label
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export const IPadOSHiddenUntilRevealed: Story = {
  name: 'iPadOS reveal at top edge',
  render: function IPadOSMenuBarDemo() {
    const [revealed, setRevealed] = useState(false);

    return (
      <div style={{ minHeight: '16rem', position: 'relative' }}>
        <Typography variant="caption" style={{ padding: '1rem', display: 'block' }}>
          Move the pointer to the top edge to reveal the centered menu bar.
        </Typography>
        <MenuBar
          appName="Mail"
          platform="ipados"
          revealed={revealed}
          onRevealChange={setRevealed}
          showAppleMenu={false}
          standardOptions={{
            context: { isDocumentOpen: true, hasSelection: true, canPaste: true },
          }}
          appSpecificMenus={[
            {
              id: 'mailbox',
              title: 'Mailbox',
              entries: [{ id: 'new', label: 'New Mailbox…' }],
            },
          ]}
        />
      </div>
    );
  },
};

export const DisabledNotHidden: Story = {
  name: 'Unavailable items stay visible',
  render: () => (
    <MenuBar
      appName="TextEdit"
      platform="macos"
      showAppleMenu={false}
      standardOptions={{
        context: {
          isDocumentOpen: false,
          canUndo: false,
          hasSelection: false,
          canPaste: false,
        },
      }}
    />
  ),
};
