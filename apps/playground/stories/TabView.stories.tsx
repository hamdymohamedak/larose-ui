import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  Card,
  TabView,
  TabViewList,
  TabViewPanel,
  TabViewTab,
  Typography,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Tab Views',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Bordered: Story = {
  render: () => (
    <TabView defaultValue="general" variant="bordered" aria-label="Settings tabs">
      <TabViewList aria-label="Settings sections">
        <TabViewTab value="general" label="General" />
        <TabViewTab value="privacy" label="Privacy" />
        <TabViewTab value="notifications" label="Notifications" />
      </TabViewList>
      <TabViewPanel value="general">
        <Typography role="body">Choose your default appearance and update channel.</Typography>
      </TabViewPanel>
      <TabViewPanel value="privacy">
        <Typography role="body">Manage analytics, diagnostics, and data sharing preferences.</Typography>
      </TabViewPanel>
      <TabViewPanel value="notifications">
        <Typography role="body">Configure badges, sounds, and notification summaries.</Typography>
      </TabViewPanel>
    </TabView>
  ),
};

export const Bezeled: Story = {
  render: () => (
    <TabView defaultValue="slides" variant="bezeled">
      <TabViewList aria-label="Keynote panes">
        <TabViewTab value="slides" label="Slide Navigator" />
        <TabViewTab value="notes" label="Presenter Notes" />
        <TabViewTab value="inspector" label="Inspector" />
      </TabViewList>
      <TabViewPanel value="slides">
        <Typography role="body">Reorder slides and organize sections.</Typography>
      </TabViewPanel>
      <TabViewPanel value="notes">
        <Typography role="body">Speaker notes stay scoped to this pane only.</Typography>
      </TabViewPanel>
      <TabViewPanel value="inspector">
        <Typography role="body">Format the selected object without affecting other panes.</Typography>
      </TabViewPanel>
    </TabView>
  ),
};

export const BorderlessHiddenTabs: Story = {
  name: 'Borderless with hidden tabs',
  render: function HiddenTabsDemo() {
    const [value, setValue] = useState('accounts');

    return (
      <Card title="Accounts">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Button
            size="sm"
            variant={value === 'accounts' ? 'primary' : 'secondary'}
            onClick={() => setValue('accounts')}
          >
            Accounts
          </Button>
          <Button
            size="sm"
            variant={value === 'advanced' ? 'primary' : 'secondary'}
            onClick={() => setValue('advanced')}
          >
            Advanced
          </Button>
        </div>
        <TabView value={value} onValueChange={setValue} variant="borderless" showTabs={false} inset={false}>
          <TabViewList>
            <TabViewTab value="accounts" label="Accounts" />
            <TabViewTab value="advanced" label="Advanced" />
          </TabViewList>
          <TabViewPanel value="accounts">
            <Typography role="body">Manage Apple ID, iCloud, and internet accounts.</Typography>
          </TabViewPanel>
          <TabViewPanel value="advanced">
            <Typography role="body">Proxy settings, diagnostics, and reset options.</Typography>
          </TabViewPanel>
        </TabView>
      </Card>
    );
  },
};

export const SixTabLimit: Story = {
  name: 'Six tab guidance',
  render: () => (
    <TabView defaultValue="one">
      <TabViewList aria-label="Maximum recommended tabs">
        <TabViewTab value="one" label="General" />
        <TabViewTab value="two" label="Sharing" />
        <TabViewTab value="three" label="Shortcuts" />
        <TabViewTab value="four" label="Advanced" />
        <TabViewTab value="five" label="Profiles" />
        <TabViewTab value="six" label="About" />
      </TabViewList>
      <TabViewPanel value="one">
        <Typography role="footnote" muted>
          Tab views support up to six tabs comfortably; use a pop-up button for larger sets.
        </Typography>
      </TabViewPanel>
      <TabViewPanel value="two">
        <Typography role="body">Sharing settings</Typography>
      </TabViewPanel>
      <TabViewPanel value="three">
        <Typography role="body">Shortcuts settings</Typography>
      </TabViewPanel>
      <TabViewPanel value="four">
        <Typography role="body">Advanced settings</Typography>
      </TabViewPanel>
      <TabViewPanel value="five">
        <Typography role="body">Profiles settings</Typography>
      </TabViewPanel>
      <TabViewPanel value="six">
        <Typography role="body">About this app</Typography>
      </TabViewPanel>
    </TabView>
  ),
};
