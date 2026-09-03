import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Progress, Radio, Select, Switch, Textarea } from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Form Controls',
  tags: ['autodocs', 'fw-react'],
};

export default meta;

export const TextareaDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'textarea' } },
  args: { label: 'Description', placeholder: 'Enter details...' },
  render: () => <Textarea label="Description" placeholder="Enter details..." />,
};

export const SelectDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'select' } },
  args: {
    label: 'Department',
    options: [
      { label: 'Engineering', value: 'eng' },
      { label: 'Design', value: 'design' },
      { label: 'Operations', value: 'ops' },
    ],
  },
  render: () => (
    <Select
      label="Department"
      options={[
        { label: 'Engineering', value: 'eng' },
        { label: 'Design', value: 'design' },
        { label: 'Operations', value: 'ops' },
      ]}
    />
  ),
};

export const CheckboxDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'checkbox' } },
  args: { label: 'I agree to the terms', hint: 'Required before submitting' },
  render: () => <Checkbox label="I agree to the terms" hint="Required before submitting" />,
};

export const RadioGroup: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'radio' } },
  args: { label: 'Starter', name: 'plan', value: 'starter', defaultChecked: true },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Radio name="plan" label="Starter" value="starter" defaultChecked />
      <Radio name="plan" label="Pro" value="pro" />
      <Radio name="plan" label="Enterprise" value="enterprise" />
    </div>
  ),
};

export const SwitchDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'switch' } },
  args: { label: 'Email notifications', checked: true, hint: 'Receive product updates' },
  render: () => <Switch label="Email notifications" defaultChecked hint="Receive product updates" />,
};

export const ProgressDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'progress' } },
  args: { value: 65, label: 'Profile completion', showValue: true },
  render: () => <Progress value={65} label="Profile completion" showValue />,
};

export const ProgressSuccess: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'progress' } },
  args: { value: 100, label: 'Upload complete', variant: 'success', showValue: true },
  render: () => <Progress value={100} label="Upload complete" variant="success" showValue />,
};
