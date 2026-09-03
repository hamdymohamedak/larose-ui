import type { Meta, StoryObj } from '@storybook/react';
import { Button, Popover } from '@larose-ui/react';

const meta: Meta<typeof Popover> = {
  title: 'Foundation/Popover',
  component: Popover,
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'centered' },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  name: 'Default',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'popover' } },
  args: {
    side: 'bottom',
    open: true,
    triggerLabel: 'Show info',
    contentText: 'Popovers present supplementary content anchored to a trigger.',
    trigger: <Button variant="outline">Show info</Button>,
    content: (
      <p style={{ margin: 0, maxWidth: 220 }}>
        Popovers present supplementary content anchored to a trigger.
      </p>
    ),
  } as never,
};

export const Top: Story = {
  name: 'Top',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'popover' } },
  args: {
    side: 'top',
    open: true,
    triggerLabel: 'Top popover',
    contentText: 'Appears above the trigger.',
    trigger: <Button variant="secondary">Top popover</Button>,
    content: <p style={{ margin: 0 }}>Appears above the trigger.</p>,
  } as never,
};

export const WithActions: Story = {
  tags: ['fw-react'],
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
