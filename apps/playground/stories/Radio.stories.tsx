import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@larose-ui/react';

const meta: Meta<typeof Radio> = {
  title: 'Foundation/Radio',
  component: Radio,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  parameters: {
    laRose: {
      crossFramework: 'radio',
    },
  },
  argTypes: {
    boxSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    name: 'plan',
    label: 'Starter plan',
    value: 'starter',
    defaultChecked: true,
  },
};

export const WithHint: Story = {
  args: {
    name: 'plan',
    label: 'Pro plan',
    value: 'pro',
    hint: 'Includes advanced analytics',
  },
};

export const WithError: Story = {
  args: {
    name: 'plan',
    label: 'Enterprise plan',
    value: 'enterprise',
    error: 'Select a plan to continue',
  },
};

export const Disabled: Story = {
  args: {
    name: 'plan',
    label: 'Legacy plan',
    value: 'legacy',
    disabled: true,
  },
};

export const Group: Story = {
  tags: ['fw-react'],
  render: () => (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Billing plan</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Radio name="billing-plan" label="Starter" value="starter" defaultChecked />
        <Radio name="billing-plan" label="Pro" value="pro" hint="Most popular" />
        <Radio name="billing-plan" label="Enterprise" value="enterprise" />
      </div>
    </fieldset>
  ),
};
