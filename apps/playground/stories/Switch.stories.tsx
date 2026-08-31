import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@larose-ui/react';

const meta: Meta<typeof Switch> = {
  title: 'Foundation/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    switchSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Email notifications',
  },
};

export const Checked: Story = {
  args: {
    label: 'Push notifications',
    defaultChecked: true,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Marketing emails',
    hint: 'Receive occasional product announcements',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Beta features',
    disabled: true,
  },
};

export const SettingsStyle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 360 }}>
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Compact density" />
      <Switch label="Show keyboard hints" defaultChecked hint="Recommended for power users" />
    </div>
  ),
};
