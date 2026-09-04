import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PopUpButton, Typography } from '@larose-ui/react';

const repeatOptions = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Every Day' },
  { value: 'weekly', label: 'Every Week' },
  { value: 'monthly', label: 'Every Month' },
  { value: 'yearly', label: 'Every Year' },
];

const meta: Meta = {
  title: 'Foundation/Pop-up Buttons',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const CalendarRepeat: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'popUpButton' } },
  args: {
    label: "Repeat",
    value: "never",
  },

  name: 'Calendar repeat',
  render: function CalendarRepeatDemo() {
    const [repeat, setRepeat] = useState('never');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
        <Typography role="body" muted>
          Selected: {repeat}
        </Typography>
        <PopUpButton
          label="Repeat"
          options={repeatOptions}
          value={repeat}
          onValueChange={setRepeat}
          defaultValue="never"
          customOption={{ value: 'custom', label: 'Custom…' }}
          explanatoryText="Custom intervals can include specific days or frequencies."
        />
      </div>
    );
  },
};

export const WithDefault: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'popUpButton' } },
  args: {
    label: "Priority",
    value: "medium",
    defaultValue: "medium",
    options: [{"value": "low", "label": "Low"}, {"value": "medium", "label": "Medium"}, {"value": "high", "label": "High"}],
  },

  name: 'Default selection',
  render: function DefaultDemo() {
    return (
      <PopUpButton
        label="Priority"
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        defaultValue="medium"
      />
    );
  },
};

export const DisabledOption: Story = {
  name: 'Unavailable option',
  render: function DisabledDemo() {
    const [value, setValue] = useState('standard');

    return (
      <PopUpButton
        label="Shipping"
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express', disabled: true },
          { value: 'overnight', label: 'Overnight' },
        ]}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};
