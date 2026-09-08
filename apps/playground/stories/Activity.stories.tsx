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
      <>
      <Activity {...args} />
      </>

  ),
};
