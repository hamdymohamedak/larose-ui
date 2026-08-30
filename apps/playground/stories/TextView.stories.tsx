import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, TextView, Typography } from '@larose-ui/react';

const longCopy = `Release notes

Autosave now preserves edits while you switch apps.
Share sheets respect permission changes immediately.

Serial: LR-2026-0830-A1F9
IP: 192.168.1.42`;

const meta: Meta = {
  title: 'Foundation/Text Views',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ReadOnlySelectable: Story = {
  render: () => (
    <Card title="Selectable reference text" padding="md">
      <TextView selectable value={longCopy} maxHeight="12rem" />
      <Typography role="footnote" muted>
        Select serial numbers or addresses to copy elsewhere.
      </Typography>
    </Card>
  ),
};

export const Editable: Story = {
  render: function EditableDemo() {
    const [value, setValue] = useState('Write a longer note here…');

    return (
      <Card title="Editable text view" padding="md">
        <TextView
          editable
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxHeight="14rem"
          inputMode="text"
        />
      </Card>
    );
  },
};

export const RichDisplay: Story = {
  render: () => (
    <Card title="Styled display content" padding="md">
      <TextView selectable maxHeight="12rem">
        <Typography role="headline" as="div">
          Meeting summary
        </Typography>
        <Typography role="body" as="p">
          The team aligned on shipping the refined design language with Dynamic Type-friendly text
          views and selectable diagnostics.
        </Typography>
        <Typography role="footnote" as="p" muted>
          Error code: E-1042 · Copy supported
        </Typography>
      </TextView>
    </Card>
  ),
};
