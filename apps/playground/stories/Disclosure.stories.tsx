import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Box,
  Card,
  DisclosureButton,
  DisclosureGroup,
  DisclosureList,
  DisclosureTriangle,
  Input,
  Label,
  Select,
  Switch,
} from '@larose-ui/react';

const meta: Meta = {
  title: 'Foundation/Disclosure & Labels',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const DisclosureTriangleStory: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'disclosureTriangle' } },
  args: {
    label: 'Advanced options',
    expanded: false,
  },

  name: 'Disclosure triangle',
  render: function TriangleDemo() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Box title="Export presentation" variant="secondary">
        <DisclosureTriangle
          label="Advanced options"
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          <Select
            label="File format"
            options={[
              { label: 'PDF', value: 'pdf' },
              { label: 'PowerPoint', value: 'pptx' },
            ]}
          />
          <Switch label="Include presenter notes" />
        </DisclosureTriangle>
      </Box>
    );
  },
};

export const DisclosureButtonStory: Story = {
  name: 'Disclosure button',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'disclosureButton' } },
  args: { defaultExpanded: false, label: 'Save document' },
  render: function ButtonDemo() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Card title="Save document" padding="md">
        <DisclosureButton
          expanded={expanded}
          onExpandedChange={setExpanded}
          aria-label="Show save locations"
          detail={
            <Select
              label="Location"
              options={[
                { label: 'Documents', value: 'docs' },
                { label: 'Desktop', value: 'desktop' },
                { label: 'iCloud Drive', value: 'icloud' },
              ]}
            />
          }
        >
          <Input label="Save As" defaultValue="Quarterly Report" />
        </DisclosureButton>
      </Card>
    );
  },
};

export const DisclosureGroupStory: Story = {
  name: 'Disclosure group',
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'disclosureGroup' } },
  args: { label: 'Delivery details', defaultExpanded: true },
  render: () => (
    <DisclosureGroup label="Delivery details" defaultExpanded>
      <Input label="Recipient" defaultValue="sara@company.com" />
      <Input label="Notes" defaultValue="Leave at front desk" />
    </DisclosureGroup>
  ),
};

export const FinderStyleList: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'disclosureList' } },
  render: () => (
    <DisclosureList
      defaultExpandedIds={['work']}
      items={[
        {
          id: 'work',
          label: 'Work',
          children: [
            { id: 'brief', label: 'Brief.pages' },
            { id: 'assets', label: 'Assets', children: [{ id: 'hero', label: 'Hero.png' }] },
          ],
        },
        { id: 'personal', label: 'Personal' },
      ]}
    />
  ),
};

export const LabelImportance: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'label' } },
  args: { label: 'Primary information', importance: 'primary' },
  render: () => (
    <Card title="System label colors" padding="md">
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Label importance="primary">Primary information</Label>
        <Label importance="secondary">Secondary subheading or supplemental text</Label>
        <Label importance="tertiary">Tertiary unavailable item description</Label>
        <Label importance="quaternary">Quaternary watermark text</Label>
      </div>
    </Card>
  ),
};

export const SelectableLabel: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'label' } },
  args: {
    label: 'Error E-1042 · IP 192.168.1.42 · Serial LR-2026-0830',
    importance: 'secondary',
    selectable: true,
    mono: true,
  },
  render: () => (
    <Card title="Diagnostics" padding="md">
      <Label importance="secondary" selectable mono>
        Error E-1042 · IP 192.168.1.42 · Serial LR-2026-0830
      </Label>
    </Card>
  ),
};
