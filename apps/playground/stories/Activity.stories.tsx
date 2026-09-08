import type { Meta, StoryObj } from '@storybook/react';
import { Activity } from '@larose-ui/react';

const meta: Meta<typeof Activity> = {
  title: 'Foundation/Activity',
  component: Activity,
  tags: ['autodocs', 'fw-react'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Activity>;

/** Dynamic Island-style activity preview — click to cycle idle → media → call. */
export const Default: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 280,
        padding: 24,
        background: '#1c1c1e',
        borderRadius: 16,
      }}
    >
      <Activity {...args} />
    </div>
  ),
};
