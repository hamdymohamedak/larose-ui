import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useMemo, useState } from 'react';
import { CommandPalette, type CommandPaletteItem } from '@larose-ui/react';

const SAMPLE_ITEMS: CommandPaletteItem[] = [
  { id: 'new', label: 'New document', group: 'File', keywords: ['create'], onSelect: () => {} },
  { id: 'open', label: 'Open…', group: 'File', keywords: ['import'], onSelect: () => {} },
  { id: 'save', label: 'Save', group: 'File', onSelect: () => {} },
  { id: 'undo', label: 'Undo', group: 'Edit', keywords: ['revert'], onSelect: () => {} },
  { id: 'redo', label: 'Redo', group: 'Edit', onSelect: () => {} },
  { id: 'find', label: 'Find in page', group: 'Edit', keywords: ['search'], onSelect: () => {} },
  { id: 'theme', label: 'Toggle theme', group: 'View', onSelect: () => {} },
  { id: 'palette', label: 'Command palette', group: 'View', onSelect: () => {} },
];

type CommandPalettePlaygroundArgs = {
  open: boolean;
  placeholder: string;
  emptyMessage: string;
  ariaLabel: string;
  itemCount: number;
  showGroups: boolean;
};

const meta: Meta<CommandPalettePlaygroundArgs> = {
  title: 'Foundation/CommandPalette',
  tags: ['autodocs', 'fw-react'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
  },
  argTypes: {
    open: { control: 'boolean', table: { category: 'State' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    emptyMessage: { control: 'text', table: { category: 'Content' } },
    ariaLabel: { control: 'text', table: { category: 'Accessibility' } },
    itemCount: {
      control: { type: 'range', min: 0, max: SAMPLE_ITEMS.length, step: 1 },
      table: { category: 'Data' },
    },
    showGroups: { control: 'boolean', table: { category: 'Data' } },
  },
  args: {
    open: true,
    placeholder: 'Search commands…',
    emptyMessage: 'No commands found',
    ariaLabel: 'Command palette',
    itemCount: SAMPLE_ITEMS.length,
    showGroups: true,
  },
};

export default meta;
type Story = StoryObj<CommandPalettePlaygroundArgs>;

export const Playground: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'commandPalette' } },

  render: function CommandPalettePlayground(args) {
    const [open, setOpen] = useState(args.open);
    useEffect(() => {
      setOpen(args.open);
    }, [args.open]);

    const items = useMemo(() => {
      const slice = SAMPLE_ITEMS.slice(0, args.itemCount);
      if (args.showGroups) return slice;
      return slice.map(({ group: _group, ...item }) => item);
    }, [args.itemCount, args.showGroups]);

    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at 20% 30%, rgb(224 231 255), transparent 40%), linear-gradient(160deg, #f8fafc, #e2e8f0)',
        }}
      >
        <p style={{ padding: '1rem', margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
          Use Controls to toggle <code>open</code>, edit copy, and change item count. Interact with the palette
          normally — arrow keys, Enter, Escape.
        </p>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={items}
          placeholder={args.placeholder}
          emptyMessage={args.emptyMessage}
          aria-label={args.ariaLabel}
        />
      </div>
    );
  },
};

export const Closed: Story = {
  args: { open: false },
  render: Playground.render,
};
