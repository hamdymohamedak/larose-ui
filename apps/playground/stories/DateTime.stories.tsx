import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker, DateRangePicker, TimePicker } from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/DateTime',
  tags: ['autodocs', 'fw-react'],
};

export default meta;

export const DatePickerDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'datePicker' } },
  args: {
    label: "Start date",
    value: "2026-08-29",
    hint: "Uses native date input with laRose tokens",
  },

  render: () => (
    <DatePicker
      label="Start date"
      hint="Uses native date input with laRose tokens"
      value="2026-08-29"
    />
  ),
};

export const TimePickerDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'timePicker' } },
  args: {
    label: "Meeting time",
    value: "09:30",
  },

  render: () => <TimePicker label="Meeting time" value="09:30" />,
};

function DateRangeDemo() {
  const [range, setRange] = useState({ startDate: '2026-08-01', endDate: '2026-08-29' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <DateRangePicker
        label="Reporting period"
        value={range}
        onChange={setRange}
        hint="End date cannot be before start date"
      />
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--lr-color-text-muted)' }}>
        Selected: {range.startDate || '—'} to {range.endDate || '—'}
      </p>
    </div>
  );
}

export const DateRangePickerDefault: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'dateRangePicker' } },
  args: {
    label: "Reporting period",
    value: {"startDate": "2026-08-01", "endDate": "2026-08-29"},
    hint: "End date cannot be before start date",
  },

  render: () => <DateRangeDemo />,
};

export const DatePickerError: StoryObj = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'datePicker' } },
  args: {
    label: "Due date",
    error: "Due date is required",
  },

  render: () => (
    <DatePicker label="Due date" error="Due date is required" inputSize="md" />
  ),
};
