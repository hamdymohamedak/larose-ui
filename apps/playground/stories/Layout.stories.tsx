import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Box,
  Collection,
  ColumnView,
  Switch,
  Typography,
  type ColumnViewNode,
} from '@larose-ui/react';

const sampleImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#0071e3"/><text x="50%" y="54%" text-anchor="middle" fill="white" font-family="system-ui" font-size="20">Photo</text></svg>`,
  );

const photos = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  label: `Album ${index + 1}`,
  imageUrl: sampleImage,
}));

const hierarchy: ColumnViewNode[] = [
  {
    id: 'icloud',
    label: 'iCloud Drive',
    children: [
      {
        id: 'design',
        label: 'Design',
        children: [
          {
            id: 'hero',
            label: 'Hero.png',
            meta: {
              Kind: 'PNG image',
              Size: '1.2 MB',
              Modified: 'Aug 29, 2026',
            },
          },
          {
            id: 'logo',
            label: 'Logo.svg',
            meta: { Kind: 'SVG image', Size: '24 KB', Modified: 'Aug 20, 2026' },
          },
        ],
      },
      {
        id: 'docs',
        label: 'Documents',
        children: [{ id: 'brief', label: 'Brief.pages', meta: { Kind: 'Document', Size: '420 KB' } }],
      },
    ],
  },
  {
    id: 'local',
    label: 'On My Mac',
    children: [{ id: 'downloads', label: 'Downloads' }],
  },
];

const metaDef: Meta = {
  title: 'Foundation/Layout',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default metaDef;
type Story = StoryObj;

export const BoxSecondary: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'box' } },
  args: { title: 'Export options', variant: 'secondary' },
  render: () => (
    <Box title="Delivery options" variant="secondary">
      <Typography role="body">Express shipping arrives tomorrow.</Typography>
      <Typography role="footnote" muted>
        Use padding and alignment for subgroups — avoid nested boxes.
      </Typography>
    </Box>
  ),
};

export const BoxSettingsStyle: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'box' } },
  args: { title: 'Sound', variant: 'secondary', settingsStyle: true },
  render: () => (
    <Box title="Notifications" titlePosition="above" settingsStyle variant="tertiary">
      <Switch label="Product updates" defaultChecked />
      <Switch label="Security alerts" defaultChecked />
    </Box>
  ),
};

export const CollectionGrid: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'collection' } },
  args: { layout: 'grid', columns: 4 },
  render: function CollectionGridDemo() {
    const [selectedId, setSelectedId] = useState('1');
    return (
      <Collection items={photos} layout="grid" columns={4} selectedId={selectedId} onSelect={(item) => setSelectedId(item.id)} />
    );
  },
};

export const CollectionRow: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'collection' } },
  args: { layout: 'row' },
  render: () => (
    <Collection items={photos.slice(0, 5)} layout="row" ariaLabel="Recent albums" />
  ),
};

export const ColumnViewBrowser: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'columnView' } },
  args: { initialPath: ['icloud', 'design'] },
  render: () => <ColumnView data={hierarchy} initialPath={['icloud', 'design']} />,
};
