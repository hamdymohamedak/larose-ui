import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DockBar,
  DockMenu,
  HomeScreenQuickActions,
  Typography,
  type DockWindow,
} from '@larose-ui/react';

function AppIcon({ label, color }: { label: string; color: string }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={color} />
      <text x="32" y="38" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">
        {label}
      </text>
    </svg>
  );
}

const safariWindows: DockWindow[] = [
  { id: 'apple', title: 'Apple' },
  { id: 'developer', title: 'Apple Developer' },
];

const meta: Meta = {
  title: 'Foundation/Dock Menus',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const SafariRunning: Story = {
  name: 'Safari (running)',
  render: function SafariRunningDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click the Safari icon in the Dock');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <DockBar>
          <DockMenu
            appName="Safari"
            icon={<AppIcon label="S" color="#007AFF" />}
            isRunning
            openWindows={safariWindows}
            runningEntries={[{ id: 'new-window', label: 'New Window' }]}
            onWindowSelect={(window) => setLastAction(`Show window: ${window.title}`)}
            onEntrySelect={(entry) => setLastAction(entry.label)}
          />
          <DockMenu
            appName="Mail"
            icon={<AppIcon label="M" color="#007AFF" />}
            isRunning={false}
            closedEntries={[{ id: 'open', label: 'Open' }]}
          />
        </DockBar>
      </div>
    );
  },
};

export const MailRunning: Story = {
  name: 'Mail (running)',
  render: function MailRunningDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click the Mail icon');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <DockBar aria-label="Dock with Mail">
          <DockMenu
            appName="Mail"
            icon={<AppIcon label="M" color="#007AFF" />}
            isRunning
            openWindows={[
              { id: 'inbox', title: 'Inbox — 3 unread' },
              { id: 'compose', title: 'New Message' },
            ]}
            runningEntries={[
              { id: 'get-mail', label: 'Get New Mail' },
              { id: 'compose', label: 'Compose New Message' },
            ]}
            onEntrySelect={(entry) => setLastAction(entry.label)}
            onWindowSelect={(window) => setLastAction(`Show window: ${window.title}`)}
          />
        </DockBar>
      </div>
    );
  },
};

export const AppNotRunning: Story = {
  name: 'App not running',
  render: function AppNotRunningDemo() {
    const [lastAction, setLastAction] = useState('Secondary-click a quit app icon');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <DockBar>
          <DockMenu
            appName="Xcode"
            icon={<AppIcon label="X" color="#147EFB" />}
            isRunning={false}
            closedEntries={[{ id: 'open', label: 'Open' }]}
            onEntrySelect={(entry) => setLastAction(entry.label)}
          />
        </DockBar>
      </div>
    );
  },
};

export const HomeScreenQuickActionsStory: Story = {
  name: 'Home Screen quick actions',
  render: function QuickActionsDemo() {
    const [lastAction, setLastAction] = useState('See Foundation/Home Screen Quick Actions for full demos');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <HomeScreenQuickActions
          appName="Maps"
          icon={<AppIcon label="Maps" color="#34C759" />}
          actions={[
            { id: 'directions', label: 'Directions Home' },
            { id: 'mark', label: 'Mark My Location' },
          ]}
          onActionSelect={(action) => setLastAction(action.label)}
        />
      </div>
    );
  },
};
