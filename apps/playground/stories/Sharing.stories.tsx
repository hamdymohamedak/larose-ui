import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Card,
  CollaborationButton,
  CollaborationPopover,
  Header,
  HeaderActions,
  HeaderTitle,
  ShareButton,
  ShareSheet,
  ShareToolbar,
  Typography,
  formatSharePermissionSummary,
  type ShareSettings,
} from '@larose-ui/react';

const collaborators = [
  { id: '1', name: 'Sara Ali', initials: 'SA' },
  { id: '2', name: 'Omar Hassan', initials: 'OH' },
  { id: '3', name: 'Lina Koch', initials: 'LK' },
  { id: '4', name: 'Alex Kim', initials: 'AK' },
];

const meta: Meta = {
  title: 'Foundation/Collaboration & Sharing',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ShareButtonOnly: Story = {
  render: () => <ShareButton />,
};

export const CollaborationButtonStory: Story = {
  name: 'Collaboration Button',
  render: () => <CollaborationButton collaborators={collaborators} />,
};

export const ShareSheetStory: Story = {
  name: 'Share Sheet',
  render: function ShareSheetDemo() {
    const [open, setOpen] = useState(true);
    const [settings, setSettings] = useState<ShareSettings>({
      audience: 'invited',
      permission: 'edit',
    });

    return (
      <>
        <ShareButton onClick={() => setOpen(true)} />
        <ShareSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Share Note"
          settings={settings}
          onSettingsChange={setSettings}
        />
        <p style={{ marginTop: '1rem', color: 'var(--lr-color-text-muted)', fontSize: '0.875rem' }}>
          Summary: {formatSharePermissionSummary(settings.audience, settings.permission)}
        </p>
      </>
    );
  },
};

export const CollaborationPopoverStory: Story = {
  name: 'Collaboration Popover',
  parameters: { layout: 'centered' },
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 1rem 24rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <CollaborationPopover
      trigger={<CollaborationButton collaborators={collaborators} />}
      collaborators={collaborators}
      actions={[
        {
          id: 'updates',
          label: 'Recent updates',
          description: 'Sara edited the introduction 5 minutes ago',
        },
        {
          id: 'activity',
          label: 'View all activity',
          description: 'See the full collaboration timeline',
        },
      ]}
      onMessage={() => undefined}
      onVideo={() => undefined}
      onManage={() => undefined}
      defaultOpen
      />
    </div>
  ),
};

export const DocumentToolbar: Story = {
  render: function DocumentToolbarDemo() {
    const [collaborating, setCollaborating] = useState(false);

    return (
      <Card padding="none" title="">
        <Header>
          <HeaderTitle>Quarterly Plan</HeaderTitle>
          <HeaderActions>
            <ShareToolbar
              shareTitle="Share Quarterly Plan"
              collaborating={collaborating}
              collaborators={collaborating ? collaborators : []}
              collaborationActions={[
                {
                  id: 'updates',
                  label: 'Recent updates',
                  description: '3 changes in the last hour',
                },
              ]}
              onManageSharedFile={() => undefined}
              onMessage={() => undefined}
            />
          </HeaderActions>
        </Header>
        <div style={{ padding: 'var(--lr-space-4)' }}>
          <Typography role="body">
            Place the Share button in a convenient toolbar location. Start collaborating to reveal
            the Collaboration button beside it.
          </Typography>
          <button
            type="button"
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--lr-color-primary)',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => setCollaborating(true)}
          >
            Start collaboration
          </button>
        </div>
      </Card>
    );
  },
};
