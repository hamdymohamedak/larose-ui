import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  CommandPalette,
  Menu,
  MenuBar,
  Typography,
  useAccelerator,
  useCommandPaletteShortcut,
  detectPlatform,
  formatAccelerator,
  type MenuBarMenuConfig,
  type MenuEntry,
} from '@larose-ui/react';
import { DEMO_ACCELERATORS } from './demoAccelerators';

const meta: Meta = {
  title: 'Foundation/Accelerators',
  tags: ['autodocs', 'fw-react'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive keyboard shortcut lab. Storybook demos use browser-safe chords (Shift/Alt variants) so shortcuts are not stolen by the browser. Focus the page, then try the shortcuts below.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function modLabel(): string {
  return detectPlatform() === 'macos' ? '⌘' : 'Ctrl';
}

function formatDemo(accel: (typeof DEMO_ACCELERATORS)[keyof typeof DEMO_ACCELERATORS]): string {
  return formatAccelerator(accel);
}

function ActionLog({ events }: { events: string[] }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '36rem',
        border: '1px solid var(--lr-color-border)',
        borderRadius: 'var(--lr-radius-md)',
        background: 'var(--lr-color-surface-elevated)',
        padding: '0.75rem 1rem',
        fontFamily: 'var(--lr-font-family-mono)',
        fontSize: 'var(--lr-font-size-xs)',
        maxHeight: '12rem',
        overflow: 'auto',
      }}
    >
      {events.length === 0 ? (
        <span style={{ color: 'var(--lr-color-text-muted)' }}>No shortcuts fired yet…</span>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {events.map((event, index) => (
            <li key={`${event}-${index}`}>{event}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ShortcutInstructions() {
  const platform = detectPlatform();
  const mod = modLabel();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '36rem',
        color: 'var(--lr-color-text-muted)',
        fontSize: 'var(--lr-font-size-sm)',
      }}
    >
      <Typography role="caption">
        Detected platform: <strong>{platform}</strong> — primary modifier:{' '}
        <strong>{mod}</strong>
      </Typography>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        <li>
          <strong>{formatDemo(DEMO_ACCELERATORS.save)}</strong> — Save (global on Menu Bar story)
        </li>
        <li>
          <strong>{mod}+K</strong> — Command palette
        </li>
        <li>
          <strong>{formatDemo(DEMO_ACCELERATORS.customPanel)}</strong> — Custom global panel
          (Shortcut Lab only)
        </li>
        <li>
          Open File menu → <strong>{formatDemo(DEMO_ACCELERATORS.newDocument)}</strong>, type-ahead
          letters, Enter to confirm
        </li>
        {platform !== 'macos' && (
          <li>
            <strong>Alt</strong> — reveal underlined mnemonics; <strong>Alt+F</strong> opens File
          </li>
        )}
        {platform === 'macos' && (
          <li>
            Hold <strong>Option</strong> while a menu is open for alternate items
          </li>
        )}
      </ul>
    </div>
  );
}

function useActionLog() {
  const [events, setEvents] = useState<string[]>([]);

  const log = useCallback((message: string) => {
    const stamp = new Date().toLocaleTimeString();
    setEvents((current) => [`${stamp} — ${message}`, ...current].slice(0, 12));
  }, []);

  return { events, log };
}

export const ShortcutLab: Story = {
  name: 'Shortcut lab',
  render: function ShortcutLabDemo() {
    const { events, log } = useActionLog();
    const [menuOpen, setMenuOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);

    useCommandPaletteShortcut(() => {
      setPaletteOpen(true);
      log('Command palette opened (mod+K)');
    });

    useAccelerator(DEMO_ACCELERATORS.customPanel, () => {
      setPanelOpen(true);
      log(`Custom global shortcut (${formatDemo(DEMO_ACCELERATORS.customPanel)})`);
    });

    const fileEntries: MenuEntry[] = useMemo(
      () => [
        {
          id: 'new',
          label: 'New Document',
          accelerator: DEMO_ACCELERATORS.newDocument,
          onSelect: () => log('Menu: New Document'),
        },
        {
          id: 'open',
          label: 'Open…',
          accelerator: DEMO_ACCELERATORS.open,
          onSelect: () => log('Menu: Open'),
        },
        { type: 'separator' },
        {
          id: 'save',
          label: 'Save',
          accelerator: DEMO_ACCELERATORS.save,
          onSelect: () => log('Menu: Save'),
        },
        {
          id: 'save-as',
          label: 'Save As…',
          accelerator: DEMO_ACCELERATORS.saveAs,
          onSelect: () => log('Menu: Save As'),
        },
        { type: 'separator' },
        {
          id: 'copy',
          label: 'Copy',
          accelerator: DEMO_ACCELERATORS.copy,
          disabled: true,
          onSelect: () => log('Menu: Copy (should not fire)'),
        },
        {
          id: 'paste',
          label: 'Paste',
          accelerator: DEMO_ACCELERATORS.paste,
          onSelect: () => log('Menu: Paste'),
        },
        {
          id: 'find',
          label: '&Find…',
          mnemonic: 'f',
          accelerator: DEMO_ACCELERATORS.find,
          onSelect: () => log('Menu: Find'),
        },
      ],
      [log],
    );

    const saveDisplay = formatAccelerator(DEMO_ACCELERATORS.save);

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        <Typography role="headline">Keyboard shortcut lab</Typography>
        <ShortcutInstructions />
        <ActionLog events={events} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <Menu
            entries={fileEntries}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onEntrySelect={(entry) => log(`Selected: ${entry.label}`)}
          >
            <Button variant="secondary">File</Button>
          </Menu>
          <Button variant="outline" onClick={() => setMenuOpen(true)}>
            Open menu
          </Button>
          <Button variant="outline" onClick={() => setPaletteOpen(true)}>
            Command palette ({modLabel()}+K)
          </Button>
        </div>

        <Typography role="caption" muted>
          With the menu open, type <strong>s</strong> for type-ahead, then <strong>Enter</strong>.
          Save displays as <strong>{saveDisplay}</strong> on this platform.
        </Typography>

        {panelOpen && (
          <div
            role="dialog"
            aria-label="Custom panel"
            style={{
              padding: '1rem 1.25rem',
              border: '1px solid var(--lr-color-border)',
              borderRadius: 'var(--lr-radius-lg)',
              background: 'var(--lr-color-surface-elevated)',
              boxShadow: 'var(--lr-shadow-md)',
            }}
          >
            <Typography role="body">
              Custom panel opened via {formatDemo(DEMO_ACCELERATORS.customPanel)}
            </Typography>
            <Button size="sm" onClick={() => setPanelOpen(false)} style={{ marginTop: '0.75rem' }}>
              Close
            </Button>
          </div>
        )}

        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          items={[
            {
              id: 'goto-dashboard',
              label: 'Go to Dashboard',
              group: 'Navigation',
              onSelect: () => log('Palette: Go to Dashboard'),
            },
            {
              id: 'toggle-theme',
              label: 'Toggle Theme',
              group: 'Preferences',
              onSelect: () => log('Palette: Toggle Theme'),
            },
          ]}
        />
      </div>
    );
  },
};

export const MenuBarGlobalShortcuts: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'menuBar' } },
  args: { appName: 'laRose', revealed: true },

  name: 'Menu bar (global shortcuts)',
  render: function MenuBarShortcutDemo() {
    const { events, log } = useActionLog();

    const demoMenus: MenuBarMenuConfig[] = useMemo(
      () => [
        {
          id: 'file',
          title: 'File',
          entries: [
            {
              id: 'new',
              label: 'New',
              accelerator: DEMO_ACCELERATORS.newDocument,
              onSelect: () => log('Global/File › New'),
            },
            {
              id: 'save',
              label: 'Save',
              accelerator: DEMO_ACCELERATORS.save,
              onSelect: () => log('Global/File › Save'),
            },
          ],
        },
        {
          id: 'edit',
          title: 'Edit',
          entries: [
            {
              id: 'copy',
              label: 'Copy',
              accelerator: DEMO_ACCELERATORS.copy,
              onSelect: () => log('Global/Edit › Copy'),
            },
            {
              id: 'undo',
              label: 'Undo',
              accelerator: DEMO_ACCELERATORS.undo,
              onSelect: () => log('Global/Edit › Undo'),
            },
          ],
        },
      ],
      [log],
    );

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MenuBar
          appName="Notes"
          platform="macos"
          showAppleMenu={false}
          menus={demoMenus}
          enableGlobalShortcuts
          enableTypeAhead
          onMenuAction={(menuId, entryId) => log(`Menu action: ${menuId} › ${entryId}`)}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem',
          }}
        >
          <Typography role="headline">Menu bar global shortcuts</Typography>
          <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
            <Typography role="body" muted>
              Try <strong>{formatDemo(DEMO_ACCELERATORS.save)}</strong>,{' '}
              <strong>{formatDemo(DEMO_ACCELERATORS.copy)}</strong>, or{' '}
              <strong>{formatDemo(DEMO_ACCELERATORS.undo)}</strong> without opening any menu. Open
              File or Edit to test type-ahead and menu-local shortcuts.
            </Typography>
          </div>
          <ActionLog events={events} />
        </div>
      </div>
    );
  },
};

export const MenuAlwaysOpen: Story = {
  tags: ['fw-react', 'fw-vue', 'fw-svelte'],
  parameters: { laRose: { crossFramework: 'menu' } },
  args: { open: true, layout: 'large', title: 'Edit' },

  name: 'Menu (always open)',
  render: function MenuOpenDemo() {
    const { events, log } = useActionLog();

    const entries: MenuEntry[] = [
      {
        id: 'cut',
        label: 'Cut',
        accelerator: DEMO_ACCELERATORS.cut,
        onSelect: () => log('Cut'),
      },
      {
        id: 'copy',
        label: 'Copy',
        accelerator: DEMO_ACCELERATORS.copy,
        onSelect: () => log('Copy'),
      },
      {
        id: 'paste',
        label: 'Paste',
        accelerator: DEMO_ACCELERATORS.paste,
        onSelect: () => log('Paste'),
      },
      {
        type: 'submenu',
        id: 'export',
        label: 'Export',
        items: [
          {
            id: 'pdf',
            label: 'PDF',
            accelerator: DEMO_ACCELERATORS.exportPdf,
            onSelect: () => log('Export PDF (submenu only)'),
          },
          {
            id: 'csv',
            label: 'CSV',
            onSelect: () => log('Export CSV'),
          },
        ],
      },
    ];

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
        }}
      >
        <Typography role="headline">Menu shortcuts (open)</Typography>
        <Typography role="caption" muted>
          Hover Export to open submenu, then try {formatDemo(DEMO_ACCELERATORS.exportPdf)}.
          Type-ahead: press <strong>c</strong> then <strong>Enter</strong>.
        </Typography>
        <ActionLog events={events} />
        <Menu
          open
          onOpenChange={() => undefined}
          entries={entries}
          onEntrySelect={(entry) => log(`Selected: ${entry.label}`)}
        />
      </div>
    );
  },
};
