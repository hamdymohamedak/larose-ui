import type { Meta, StoryObj } from '@storybook/react';
import { Button, Popover } from '@larose-ui/react';

const meta: Meta<typeof Popover> = {
  title: 'Foundation/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Show info</Button>,
    content: (
      <p style={{ margin: 0, maxWidth: 220 }}>
        Popovers present supplementary content anchored to a trigger.
      </p>
    ),
  },
};

export const Top: Story = {
  args: {
    side: 'top',
    trigger: <Button variant="secondary">Top popover</Button>,
    content: <p style={{ margin: 0 }}>Appears above the trigger.</p>,
  },
};

export const WithActions: Story = {
  render: () => (
    <Popover
      trigger={<Button>Share</Button>}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 180 }}>
          <p style={{ margin: 0 }}>Share this employee record</p>
          <Button size="sm">Copy link</Button>
          <Button size="sm" variant="secondary">
            Export PDF
          </Button>
        </div>
      }
    />
  ),
};
