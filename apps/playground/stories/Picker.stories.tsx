import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Picker,
  DateTimePicker,
  WheelPicker,
  type DateTimeValue,
  type PickerValue,
} from '@larose-ui/react';

const countries = [
  { value: 'eg', label: 'Egypt' },
  { value: 'de', label: 'Germany' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
  { value: 'ae', label: 'United Arab Emirates' },
];

const meta: Meta = {
  title: 'Foundation/Pickers',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const WheelStyle: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'picker' } },
  args: {
    label: "Country",
    appearance: "wheels",
    value: {"country": "eg"},
  },

  name: 'Wheels (multipart)',
  render: function WheelPickerDemo() {
    const [value, setValue] = useState<PickerValue>({ country: 'eg' });

    return (
      <Picker
        label="Country"
        style="wheels"
        columns={[{ id: 'country', label: 'Country', options: countries }]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const CompactStyle: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'picker' } },
  args: {
    label: "Country",
    appearance: "compact",
    value: {"country": "de"},
  },

  name: 'Compact (popover)',
  render: function CompactPickerDemo() {
    const [value, setValue] = useState<PickerValue>({ country: 'de' });

    return (
      <Picker
        label="Country"
        style="compact"
        columns={[{ id: 'country', label: 'Country', options: countries }]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const DateWheels: Story = {
  name: 'Date (wheels)',
  render: function DateWheelsDemo() {
    const [value, setValue] = useState<DateTimeValue>({ date: '2026-08-31' });

    return (
      <DateTimePicker
        label="Due date"
        mode="date"
        style="wheels"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const DateCompact: Story = {
  name: 'Date (compact calendar)',
  render: function DateCompactDemo() {
    const [value, setValue] = useState<DateTimeValue>({ date: '2026-08-31' });

    return (
      <DateTimePicker
        label="Event date"
        mode="date"
        style="compact"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const DateInline: Story = {
  name: 'Date (inline calendar)',
  render: function DateInlineDemo() {
    const [value, setValue] = useState<DateTimeValue>({ date: '2026-08-31' });

    return (
      <DateTimePicker
        label="Trip date"
        mode="date"
        style="inline"
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const TimeWheels: Story = {
  name: 'Time (wheels)',
  render: function TimeWheelsDemo() {
    const [value, setValue] = useState<DateTimeValue>({ time: '09:30' });

    return (
      <DateTimePicker
        label="Meeting time"
        mode="time"
        style="wheels"
        minuteInterval={15}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const DateAndTimeCompact: Story = {
  name: 'Date and time (compact)',
  render: function DateTimeCompactDemo() {
    const [value, setValue] = useState<DateTimeValue>({
      date: '2026-08-31',
      time: '14:00',
    });

    return (
      <DateTimePicker
        label="Appointment"
        mode="datetime"
        style="compact"
        minuteInterval={5}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const CountdownTimer: Story = {
  name: 'Countdown timer',
  render: function CountdownDemo() {
    const [value, setValue] = useState<DateTimeValue>({ countdownMinutes: 90 });

    return (
      <DateTimePicker
        label="Timer"
        mode="countdown"
        style="wheels"
        minuteInterval={1}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const LowLevelWheelPicker: Story = {
  name: 'WheelPicker (low-level)',
  render: function LowLevelDemo() {
    const [value, setValue] = useState<PickerValue>({ month: '7', day: '31', year: '2026' });

    return (
      <WheelPicker
        aria-label="Custom wheels"
        columns={[
          {
            id: 'month',
            label: 'Month',
            options: [
              { value: '6', label: 'July' },
              { value: '7', label: 'August' },
              { value: '8', label: 'September' },
            ],
          },
          {
            id: 'day',
            label: 'Day',
            options: Array.from({ length: 31 }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            })),
          },
          {
            id: 'year',
            label: 'Year',
            options: [
              { value: '2025', label: '2025' },
              { value: '2026', label: '2026' },
              { value: '2027', label: '2027' },
            ],
          },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};
