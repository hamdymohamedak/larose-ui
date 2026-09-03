import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import {
  Card,
  OutlineView,
  OutlineViewToolbar,
  Typography,
  type OutlineNode,
} from '@larose-ui/react';

const finderData: OutlineNode[] = [
  {
    id: 'docs',
    label: 'Documents',
    values: {
      'Date Modified': 'Aug 28, 2026',
      Size: '—',
      Kind: 'Folder',
    },
    children: [
      {
        id: 'brief',
        label: 'Product Brief.pages',
        values: {
          'Date Modified': 'Aug 27, 2026',
          Size: '420 KB',
          Kind: 'Document',
        },
      },
      {
        id: 'assets',
        label: 'Assets',
        values: {
          'Date Modified': 'Aug 20, 2026',
          Size: '—',
          Kind: 'Folder',
        },
        children: [
          {
            id: 'hero',
            label: 'Hero.png',
            values: {
              'Date Modified': 'Aug 19, 2026',
              Size: '1.2 MB',
              Kind: 'PNG image',
            },
          },
          {
            id: 'logo',
            label: 'Brand-lockup-final-export-v2-long-name.svg',
            values: {
              'Date Modified': 'Aug 18, 2026',
              Size: '84 KB',
              Kind: 'SVG image',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    values: {
      'Date Modified': 'Aug 29, 2026',
      Size: '—',
      Kind: 'Folder',
    },
    children: [
      {
        id: 'installer',
        label: 'LaRose-Setup.dmg',
        values: {
          'Date Modified': 'Aug 29, 2026',
          Size: '128 MB',
          Kind: 'Disk image',
        },
      },
    ],
  },
];

const meta: Meta = {
  title: 'Foundation/Outline Views',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const FinderStyle: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'outlineView' } },
  name: 'Finder-style outline',
  render: function FinderOutlineDemo() {
    const [selectedId, setSelectedId] = useState('brief');
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState(finderData);
    const [lastAction, setLastAction] = useState('Select a row');

    const selected = useMemo(() => {
      const walk = (nodes: OutlineNode[]): OutlineNode | undefined => {
        for (const node of nodes) {
          if (node.id === selectedId) return node;
          const match = node.children ? walk(node.children) : undefined;
          if (match) return match;
        }
        return undefined;
      };
      return walk(data);
    }, [data, selectedId]);

    const updateNode = (
      nodes: OutlineNode[],
      nodeId: string,
      columnKey: string,
      value: string,
    ): OutlineNode[] =>
      nodes.map((node): OutlineNode => {
        if (node.id === nodeId) {
          if (columnKey === 'label') return { ...node, label: value };
          return { ...node, values: { ...node.values, [columnKey]: value } };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children, nodeId, columnKey, value) };
        }
        return node;
      });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Card padding="none" title="">
          <div style={{ border: '1px solid var(--lr-color-border)', borderRadius: 'var(--lr-list-radius)', overflow: 'hidden' }}>
            <OutlineViewToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <OutlineView
              data={data}
              storageKey="finder-outline-demo"
              defaultExpandedIds={['docs', 'assets']}
              selectedId={selectedId}
              onSelect={(node) => {
                setSelectedId(node.id);
                setLastAction(`Selected ${node.label}`);
              }}
              onRowDoubleClick={(node) => setLastAction(`Opened ${node.label}`)}
              columns={[
                { key: 'Date Modified', header: 'Date Modified' },
                { key: 'Size', header: 'Size' },
                { key: 'Kind', header: 'Kind' },
              ]}
              truncate="middle"
              editableColumns={['label']}
              onCellEdit={(nodeId, columnKey, value) => {
                setData((current) => updateNode(current, nodeId, columnKey, value));
                setLastAction(`Renamed to ${value}`);
              }}
              searchQuery={searchQuery}
              aria-label="Documents outline"
            />
          </div>
        </Card>
        <Typography role="footnote" muted>
          {lastAction}. Single-click a name to rename; double-click a row to open. Option-click a
          disclosure triangle to expand all subfolders. Column headings sort at each hierarchy level.
        </Typography>
        {selected && (
          <Typography role="callout">
            Preview: {selected.label} · {selected.values?.Kind ?? 'Item'}
          </Typography>
        )}
      </div>
    );
  },
};

export const SplitViewCompanion: Story = {
  name: 'Split view companion',
  render: function SplitViewDemo() {
    const [selectedId, setSelectedId] = useState('hero');

    const selected = useMemo(() => {
      const walk = (nodes: OutlineNode[]): OutlineNode | undefined => {
        for (const node of nodes) {
          if (node.id === selectedId) return node;
          const match = node.children ? walk(node.children) : undefined;
          if (match) return match;
        }
        return undefined;
      };
      return walk(finderData);
    }, [selectedId]);

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(16rem, 1fr) minmax(12rem, 0.75fr)',
          minHeight: '20rem',
          border: '1px solid var(--lr-color-border)',
          borderRadius: 'var(--lr-list-radius)',
          overflow: 'hidden',
        }}
      >
        <OutlineView
          data={finderData}
          defaultExpandedIds={['docs', 'assets']}
          selectedId={selectedId}
          onSelect={(node) => setSelectedId(node.id)}
          columns={['Size', 'Kind']}
          aria-label="Project files"
        />
        <div
          style={{
            padding: '1rem',
            borderLeft: '1px solid var(--lr-color-border)',
            background: 'var(--lr-color-surface-elevated)',
          }}
        >
          <Typography role="headline">Preview</Typography>
          {selected ? (
            <>
              <Typography role="body">{selected.label}</Typography>
              <Typography role="footnote" muted>
                {selected.values?.Kind} · {selected.values?.Size}
              </Typography>
            </>
          ) : (
            <Typography role="body" muted>
              Select an item in the outline view.
            </Typography>
          )}
        </div>
      </div>
    );
  },
};

export const BasicOutline: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'outlineView' } },
  render: () => (
    <OutlineView
      data={finderData}
      defaultExpandedIds={['docs']}
      columns={['Kind', 'Size']}
    />
  ),
};
