import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Card,
  DragDropList,
  DragDropProvider,
  Draggable,
  DropZone,
  Typography,
  type DragDropListItem,
  type DropResult,
} from '@larose-ui/react';

const photos = [
  { id: 'p1', label: 'Sunset over Cairo', type: 'photo' as const },
  { id: 'p2', label: 'Team offsite', type: 'photo' as const },
  { id: 'p3', label: 'Wireframes v2', type: 'photo' as const },
];

const meta: Meta = {
  title: 'Foundation/Drag and Drop',
  tags: ['autodocs', 'fw-react'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ReorderableList: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'dragDropList' } },

  render: function ReorderableListDemo() {
    const [items, setItems] = useState<DragDropListItem[]>([
      { id: '1', label: 'Review designs' },
      { id: '2', label: 'Update copy' },
      { id: '3', label: 'Ship release' },
    ]);

    return (
      <Card title="Tasks" padding="md">
        <Typography role="subheadline">
          Drag to reorder within the list. Hold Option (Alt) while dropping in the same container to
          copy instead of move.
        </Typography>
        <div style={{ marginTop: '1rem' }}>
          <DragDropList items={items} onReorder={setItems} />
        </div>
      </Card>
    );
  },
};

export const MoveAndCopy: Story = {
  render: function MoveAndCopyDemo() {
    const [source, setSource] = useState(photos);
    const [archive, setArchive] = useState<typeof photos>([]);

    const handleDrop =
      (zone: 'source' | 'archive') =>
      async (result: DropResult<(typeof photos)[0]>) => {
        const item = result.items[0]?.data;
        if (!item) return;

        if (result.operation === 'move') {
          setSource((current) => current.filter((entry) => entry.id !== item.id));
          setArchive((current) => current.filter((entry) => entry.id !== item.id));
        }

        if (zone === 'archive') {
          setArchive((current) =>
            result.operation === 'copy' || result.sourceId !== zone
              ? [...current.filter((entry) => entry.id !== item.id), item]
              : current,
          );
        } else {
          setSource((current) =>
            result.operation === 'copy' || result.sourceId !== zone
              ? [...current.filter((entry) => entry.id !== item.id), item]
              : current,
          );
        }
      };

    return (
      <DragDropProvider>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <DropZone id="source" accepts="photo" onDrop={handleDrop('source')}>
            <Card title="Source album" padding="md">
              {source.map((item) => (
                <Draggable
                  key={item.id}
                  id={item.id}
                  sourceId="source"
                  data={item}
                  type="photo"
                  label={item.label}
                  preview={item.label}
                >
                  <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--lr-color-border)' }}>
                    {item.label}
                  </div>
                </Draggable>
              ))}
            </Card>
          </DropZone>

          <DropZone id="archive" accepts="photo" onDrop={handleDrop('archive')}>
            <Card title="Archive (copy across containers)" padding="md">
              {archive.length === 0 ? (
                <Typography role="footnote" muted>
                  Drop photos here — cross-container drops copy by default.
                </Typography>
              ) : (
                archive.map((item) => (
                  <Draggable
                    key={item.id}
                    id={`archive-${item.id}`}
                    sourceId="archive"
                    data={item}
                    type="photo"
                    label={item.label}
                    preview={item.label}
                  >
                    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--lr-color-border)' }}>
                      {item.label}
                    </div>
                  </Draggable>
                ))
              )}
            </Card>
          </DropZone>
        </div>
      </DragDropProvider>
    );
  },
};

export const InvalidDestination: Story = {
  render: () => (
    <DragDropProvider>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <DropZone id="photos" accepts="photo" onDrop={() => undefined}>
          <Card title="Photos only" padding="md">
            <Draggable id="photo-1" sourceId="photos" data={photos[0]} type="photo" label="Photo">
              <div style={{ padding: '0.75rem 0' }}>Sunset over Cairo</div>
            </Draggable>
          </Card>
        </DropZone>
        <DropZone
          id="text-only"
          accepts="text"
          onDrop={() => undefined}
          canDrop={() => false}
        >
          <Card title="Text only zone" padding="md">
            <Typography role="footnote" muted>
              Drag the photo here to see the invalid destination indicator.
            </Typography>
          </Card>
        </DropZone>
      </div>
    </DragDropProvider>
  ),
};
