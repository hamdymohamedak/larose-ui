import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@larose-ui/react';

const stepsData = [
  { x: 'Mon', y: 6420, accessibilityLabel: 'Monday, 6,420 steps' },
  { x: 'Tue', y: 9100, accessibilityLabel: 'Tuesday, 9,100 steps' },
  { x: 'Wed', y: 7800, accessibilityLabel: 'Wednesday, 7,800 steps' },
  { x: 'Thu', y: 11200, accessibilityLabel: 'Thursday, 11,200 steps' },
  { x: 'Fri', y: 8600, accessibilityLabel: 'Friday, 8,600 steps' },
  { x: 'Sat', y: 5400, accessibilityLabel: 'Saturday, 5,400 steps' },
  { x: 'Sun', y: 7200, accessibilityLabel: 'Sunday, 7,200 steps' },
];

const stockData = [
  { x: 'Jan', y: 142 },
  { x: 'Mar', y: 156 },
  { x: 'May', y: 149 },
  { x: 'Jul', y: 171 },
  { x: 'Sep', y: 183 },
  { x: 'Nov', y: 178 },
];

const meta: Meta<typeof Chart> = {
  title: 'Foundation/Chart',
  component: Chart,
  tags: ['autodocs', 'fw-react', 'fw-vue', 'fw-svelte'],
  argTypes: {
    mark: { control: 'select', options: ['bar', 'line', 'point'] },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

export const BarChart: Story = {
  args: {
    mark: 'bar',
    title: 'Steps',
    subtitle: 'You averaged 8,102 steps per day this week.',
    accessibilitySummary:
      'Bar chart showing daily steps for seven days. Highest on Thursday with 11,200 steps.',
    data: stepsData,
    yAxis: { min: 0, tickCount: 4 },
    interactive: true,
  },
};

export const LineChart: Story = {
  args: {
    mark: 'line',
    title: 'Stock performance',
    subtitle: 'Five-year trend for AAPL.',
    data: stockData,
    showPoints: true,
    interactive: true,
  },
};

export const PointChart: Story = {
  render: () => (
    <Chart
      mark="point"
      title="Blood pressure readings"
      subtitle="Morning readings over two weeks — circle: systolic, diamond: diastolic."
      accessibilitySummary="Point chart comparing systolic and diastolic blood pressure readings."
      series={[
        {
          id: 'systolic',
          label: 'Systolic',
          pointShape: 'circle',
          data: [
            { x: 1, y: 118 },
            { x: 3, y: 122 },
            { x: 5, y: 120 },
            { x: 7, y: 125 },
            { x: 9, y: 119 },
          ],
        },
        {
          id: 'diastolic',
          label: 'Diastolic',
          pointShape: 'diamond',
          color: 'var(--lr-chart-series-4)',
          data: [
            { x: 1, y: 76 },
            { x: 3, y: 80 },
            { x: 5, y: 78 },
            { x: 7, y: 82 },
            { x: 9, y: 77 },
          ],
        },
      ]}
      yAxis={{ min: 60, max: 140, tickCount: 4 }}
    />
  ),
};

export const StackedBar: Story = {
  render: () => (
    <Chart
      mark="bar"
      stacked
      title="Storage"
      subtitle="Space used on this device."
      accessibilitySummary="Stacked bar showing storage used by apps, photos, and system files."
      series={[
        {
          id: 'apps',
          label: 'Apps',
          data: [{ x: 'Used', y: 42 }],
        },
        {
          id: 'photos',
          label: 'Photos',
          data: [{ x: 'Used', y: 28 }],
        },
        {
          id: 'system',
          label: 'System',
          data: [{ x: 'Used', y: 18 }],
        },
      ]}
      yAxis={{ min: 0, max: 100, formatValue: (v) => `${v}%` }}
    />
  ),
};

export const FixedRange: Story = {
  args: {
    mark: 'line',
    title: 'Battery',
    subtitle: 'Charge level over the last 24 hours.',
    data: [
      { x: '12a', y: 88 },
      { x: '6a', y: 72 },
      { x: '12p', y: 54 },
      { x: '6p', y: 38 },
      { x: 'Now', y: 24 },
    ],
    yAxis: { min: 0, max: 100, formatValue: (v) => `${v}%` },
    showPoints: true,
  },
};
