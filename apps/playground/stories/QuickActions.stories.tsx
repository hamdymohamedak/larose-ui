import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  HomeScreenQuickActions,
  Typography,
  type QuickActionItem,
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

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.375rem" height="1.375rem" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4zM4 10l4 3h8l4-3" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

function ComposeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.375rem" height="1.375rem" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const meta: Meta = {
  title: 'Foundation/Home Screen Quick Actions',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const MailActions: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'homeScreenQuickActions' } },
  args: { appName: 'Mail', open: true },
  name: 'Mail',
  render: function MailQuickActionsDemo() {
    const [lastAction, setLastAction] = useState('Touch and hold the Mail icon');

    const actions: QuickActionItem[] = [
      {
        id: 'inbox',
        label: 'Open Inbox',
        subtitle: '3 unread messages',
        icon: <InboxIcon />,
      },
      {
        id: 'vip',
        label: 'Open VIP',
        subtitle: '1 unread message',
        icon: <InboxIcon />,
      },
      { id: 'search', label: 'Search', icon: <ComposeIcon /> },
      { id: 'compose', label: 'New Message', icon: <ComposeIcon /> },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <HomeScreenQuickActions
          appName="Mail"
          icon={<AppIcon label="M" color="#007AFF" />}
          actions={actions}
          onActionSelect={(action) => setLastAction(action.label)}
        />
      </div>
    );
  },
};

export const MapsActions: Story = {
  name: 'Maps',
  render: function MapsQuickActionsDemo() {
    const [lastAction, setLastAction] = useState('Touch and hold the Maps icon');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <HomeScreenQuickActions
          appName="Maps"
          icon={<AppIcon label="Maps" color="#34C759" />}
          iconPlacement="trailing"
          actions={[
            { id: 'directions', label: 'Directions Home' },
            { id: 'mark', label: 'Mark My Location' },
            { id: 'search', label: 'Search Nearby' },
          ]}
          onActionSelect={(action) => setLastAction(action.label)}
        />
      </div>
    );
  },
};

export const DynamicMessages: Story = {
  name: 'Dynamic (Messages)',
  render: function DynamicMessagesDemo() {
    const [lastAction, setLastAction] = useState('Recent conversations update dynamically');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography role="body" muted>
          {lastAction}
        </Typography>
        <HomeScreenQuickActions
          appName="Messages"
          icon={<AppIcon label="Msg" color="#34C759" />}
          includeSystemActions
          open
          onOpenChange={() => undefined}
          actions={[
            { id: 'sara', label: 'Sara Ali', subtitle: 'See you at 9?' },
            { id: 'team', label: 'Design Team', subtitle: 'Mockups look great' },
            { id: 'alex', label: 'Alex Chen', subtitle: 'Running 5 min late' },
          ]}
          onActionSelect={(action) => setLastAction(`Open ${action.label}`)}
        />
      </div>
    );
  },
};

export const WithoutSystemActions: Story = {
  name: 'App actions only',
  render: function AppOnlyDemo() {
    return (
      <HomeScreenQuickActions
        appName="Notes"
        icon={<AppIcon label="N" color="#FFD60A" />}
        includeSystemActions={false}
        open
        onOpenChange={() => undefined}
        actions={[
          { id: 'new', label: 'New Note' },
          { id: 'scan', label: 'Scan Document' },
        ]}
      />
    );
  },
};
