import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MenuBar, Typography } from '@larose-ui/react';
import { DEMO_ACCELERATORS } from './demoAccelerators';

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
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const MacOSStandard: Story = {
  name: 'macOS standard menus',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'menuBar' } },
  args: { appName: 'laRose', platform: 'macos', revealed: true },
  render: function MacOSMenuBarDemo() {
    const [lastAction, setLastAction] = useState('Choose a menu item');
    const [context, setContext] = useState({
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
    const extras = [
      {
        id: 'wifi',
        label: 'Wi-Fi status',
        icon: <WifiIcon />,
        entries: [
          { id: 'network-1', label: 'Home Network', selected: true },
          { id: 'network-2', label: 'Office Network' },
          { type: 'separator' as const },
          { id: 'network-settings', label: 'Network Settings…' },
        ],
      },
    ];

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MenuBar
          appName="Safari"
          standardOptions={{
            appName: 'Safari',
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
                {
                  id: 'back',
                  label: 'Back',
                  accelerator: DEMO_ACCELERATORS.back,
                  onSelect: () => setLastAction('History › back'),
                },
                {
                  id: 'forward',
                  label: 'Forward',
                  accelerator: DEMO_ACCELERATORS.forward,
                  onSelect: () => setLastAction('History › forward'),
                },
                { type: 'separator' },
                { id: 'clear', label: 'Clear History…', destructive: true },
              ],
            },
            {
              id: 'bookmarks',
              title: 'Bookmarks',
              entries: [
                {
                  id: 'add',
                  label: 'Add Bookmark…',
                  accelerator: DEMO_ACCELERATORS.addBookmark,
                  onSelect: () => setLastAction('Bookmarks › add'),
                },
                { id: 'show', label: 'Show Bookmarks' },
              ],
            },
          ]}
          extras={extras}
          platform="macos"
          onMenuAction={(menuId, entryId) => setLastAction(`${menuId} › ${entryId}`)}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '1rem',
            maxWidth: '40rem',
            margin: '0 auto',
          }}
        >
          <Typography role="body">
            Hold <strong>Option</strong> while a menu is open to reveal dynamic items such as Close
            All, Minimize All, and Quit and Keep Windows. Custom History/Bookmarks items use
            browser-safe accelerators; standard File/Edit labels still follow macOS HIG.
          </Typography>
          <Typography role="caption">Last action: {lastAction}</Typography>
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
    const [revealed, setRevealed] = useState(true);

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MenuBar
          appName="Mail"
          platform="ipados"
          revealed={revealed}
          onRevealChange={setRevealed}
          showAppleMenu={false}
          standardOptions={{
            appName: 'Mail',
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
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <Typography role="caption">
            The menu bar is revealed at the top. Open <strong>Edit</strong> and hover items such as{' '}
            <strong>Find</strong> or <strong>Speech</strong> to see nested submenus.
          </Typography>
          <button type="button" onClick={() => setRevealed((value) => !value)}>
            {revealed ? 'Hide menu bar' : 'Show menu bar'}
          </button>
        </div>
      </div>
    );
  },
};

export const DisabledNotHidden: Story = {
  name: 'Unavailable items stay visible',
  render: () => (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MenuBar
        appName="TextEdit"
        platform="macos"
        showAppleMenu={false}
        standardOptions={{
          appName: 'TextEdit',
          context: {
            isDocumentOpen: false,
            canUndo: false,
            hasSelection: false,
            canPaste: false,
          },
        }}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <Typography role="caption" muted>
          Unavailable commands remain visible but dimmed — open File or Edit to compare.
        </Typography>
      </div>
    </div>
  ),
};
