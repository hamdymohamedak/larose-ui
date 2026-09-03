import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  ActivityShareButton,
  ActivityView,
  Card,
  Header,
  HeaderActions,
  HeaderTitle,
  ShareButton,
  Typography,
  createDefaultActivities,
  createPhotoActivities,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Activity Views',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const NotesShareSheet: Story = {
  name: 'Notes share sheet',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'activityView' } },
  args: { open: true, title: 'Share Note', presentation: 'sheet' },
  render: function NotesShareDemo() {
    const [lastAction, setLastAction] = useState('Choose an activity');

    const activities = createDefaultActivities({
      copy: () => setLastAction('Copied note link'),
      print: () => setLastAction('Opened print dialog'),
      markup: () => setLastAction('Opened markup'),
    });

    return (
      <Card padding="none" title="">
        <Header>
          <HeaderTitle>Nature Walks</HeaderTitle>
          <HeaderActions>
            <ActivityShareButton
              activities={activities}
              excludedActivityIds={['airplay']}
              onActivitySelect={(activity) => setLastAction(activity.title)}
            />
          </HeaderActions>
        </Header>
        <div style={{ padding: 'var(--lr-space-4)' }}>
          <Typography role="body">
            Use the Share button in the toolbar to open the activity view. AirPlay is excluded because
            it does not apply to this note.
          </Typography>
          <div style={{ marginTop: '0.75rem' }}>
            <Typography role="footnote" muted>
              Last action: {lastAction}
            </Typography>
          </div>
        </div>
      </Card>
    );
  },
};

export const PhotoAppActivities: Story = {
  name: 'App-specific activities',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'activityView' } },
  args: { open: true, title: 'Share Photo', presentation: 'sheet' },
  render: function PhotoActivitiesDemo() {
    const [open, setOpen] = useState(true);
    const activities = createPhotoActivities();

    return (
      <>
        <ShareButton onClick={() => setOpen(true)} />
        <ActivityView
          open={open}
          onClose={() => setOpen(false)}
          activities={activities}
          excludedActivityIds={['print']}
        />
        <div style={{ marginTop: '0.75rem' }}>
          <Typography role="footnote" muted>
            App-specific actions like Copy Photo appear before system actions such as Add to Files.
          </Typography>
        </div>
      </>
    );
  },
};

export const CustomActionTitle: Story = {
  name: 'Custom action title',
  render: function CustomPrintDemo() {
    const [open, setOpen] = useState(true);

    const activities = [
      {
        id: 'print-transaction',
        title: 'Print Transaction',
        kind: 'app' as const,
        icon: createDefaultActivities().find((item) => item.id === 'print')?.icon,
      },
      ...createDefaultActivities().filter((item) => item.id !== 'print'),
    ];

    return (
      <ActivityView
        open={open}
        onClose={() => setOpen(false)}
        activities={activities}
        title="Share Statement"
      />
    );
  },
};

export const SheetPresentation: Story = {
  render: function SheetDemo() {
    const [open, setOpen] = useState(true);
    return (
      <ActivityView
        open={open}
        onClose={() => setOpen(false)}
        activities={createDefaultActivities()}
        presentation="sheet"
      />
    );
  },
};
