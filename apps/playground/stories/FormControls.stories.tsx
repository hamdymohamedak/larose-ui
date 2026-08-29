import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Progress, Radio, Select, Switch, Textarea } from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Form Controls',
  tags: ['autodocs'],
};

export default meta;

export const TextareaDefault: StoryObj = {
  render: () => <Textarea label="Description" placeholder="Enter details..." />,
};

export const SelectDefault: StoryObj = {
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
  render: () => <Checkbox label="I agree to the terms" hint="Required before submitting" />,
};

export const RadioGroup: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Radio name="plan" label="Starter" value="starter" defaultChecked />
      <Radio name="plan" label="Pro" value="pro" />
      <Radio name="plan" label="Enterprise" value="enterprise" />
    </div>
  ),
};

export const SwitchDefault: StoryObj = {
  render: () => <Switch label="Email notifications" defaultChecked hint="Receive product updates" />,
};

export const ProgressDefault: StoryObj = {
  render: () => <Progress value={65} label="Profile completion" showValue />,
};

export const ProgressSuccess: StoryObj = {
  render: () => <Progress value={100} label="Upload complete" variant="success" showValue />,
};
