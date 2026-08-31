import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from '../Menu/Menu';
import { LaRoseProvider } from '../provider/LaRoseProvider';
import { useCommandPaletteShortcut } from '../CommandPalette/CommandPalette';
import { collectMenuAccelerators } from './collectMenuAccelerators';
import { collectGlobalMenuAccelerators } from './collectGlobalMenuAccelerators';
import { resolveMenuShortcut } from './resolveMenuShortcut';
import { MenuBar } from '../MenuBar/MenuBar';
import { MnemonicLabel } from './MnemonicLabel';

/** Fire a platform-correct mod+key chord in tests (Ctrl on Linux/Windows, Meta on macOS). */
async function pressModKey(user: ReturnType<typeof userEvent.setup>, key: string) {
  const isMac =
    typeof navigator !== 'undefined' && /mac/i.test(navigator.platform ?? '');
  if (isMac) {
    await user.keyboard(`{Meta>}${key}{/Meta}`);
  } else {
    await user.keyboard(`{Control>}${key}{/Control}`);
  }
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<LaRoseProvider>{ui}</LaRoseProvider>);
}

describe('resolveMenuShortcut', () => {
  it('uses accelerator for behavior and explicit shortcut for display', () => {
    const resolved = resolveMenuShortcut({
      accelerator: { mod: true, key: 'c' },
      shortcut: 'Copy',
    });
    expect(resolved.display).toBe('Copy');
    expect(resolved.accelerator).toEqual({ mod: true, key: 'c' });
    expect(resolved.ariaKeyshortcuts).toBe('Meta+C');
  });

  it('auto-formats display when only accelerator is provided', () => {
    const resolved = resolveMenuShortcut({
      accelerator: { mod: true, key: 's' },
    }, { platform: 'macos' });
    expect(resolved.display).toBe('⌘S');
  });

  it('parses legacy shortcut strings for behavior', () => {
    const resolved = resolveMenuShortcut({ shortcut: '⌘C' });
    expect(resolved.accelerator).toEqual({ mod: true, key: 'c' });
    expect(resolved.display).toBe('⌘C');
  });

  it('uses alternate accelerator when Option is held', () => {
    const resolved = resolveMenuShortcut(
      {
        accelerator: { mod: true, key: 'q' },
        alternateAccelerator: { mod: true, alt: true, key: 'q' },
        shortcut: '⌘Q',
        alternateShortcut: '⌥⌘Q',
      },
      { optionKey: true },
    );
    expect(resolved.accelerator).toEqual({ mod: true, alt: true, key: 'q' });
    expect(resolved.display).toBe('⌥⌘Q');
  });
});

describe('collectMenuAccelerators', () => {
  it('includes top-level items and active submenu items only', () => {
    const bindings = collectMenuAccelerators(
      [
        { id: 'save', label: 'Save', accelerator: { mod: true, key: 's' } },
        {
          type: 'submenu',
          id: 'export',
          label: 'Export',
          items: [
            { id: 'pdf', label: 'PDF', accelerator: { mod: true, key: 'p' } },
          ],
        },
      ],
      'export',
    );

    expect(bindings.map((b) => b.item.id)).toEqual(['save', 'pdf']);
  });

  it('excludes items in closed submenus', () => {
    const bindings = collectMenuAccelerators(
      [
        {
          type: 'submenu',
          id: 'export',
          label: 'Export',
          items: [
            { id: 'pdf', label: 'PDF', accelerator: { mod: true, key: 'p' } },
          ],
        },
      ],
      null,
    );

    expect(bindings).toHaveLength(0);
  });

  it('ignores disabled and hidden items', () => {
    const bindings = collectMenuAccelerators(
      [
        { id: 'save', label: 'Save', disabled: true, accelerator: { mod: true, key: 's' } },
        { id: 'copy', label: 'Copy', hidden: true, accelerator: { mod: true, key: 'c' } },
      ],
      null,
    );
    expect(bindings).toHaveLength(0);
  });
});

describe('Menu keyboard shortcuts', () => {
  it('activates item via accelerator when menu is open', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithProvider(
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[
          {
            id: 'save',
            label: 'Save',
            accelerator: { mod: true, key: 's' },
            onSelect,
          },
        ]}
      />,
    );

    await pressModKey(user, 's');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('does not activate disabled items via accelerator', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithProvider(
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[
          {
            id: 'save',
            label: 'Save',
            disabled: true,
            accelerator: { mod: true, key: 's' },
            onSelect,
          },
        ]}
      />,
    );

    await pressModKey(user, 's');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('exposes aria-keyshortcuts on menu items', () => {
    renderWithProvider(
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[{ id: 'save', label: 'Save', accelerator: { mod: true, key: 's' } }]}
      />,
    );
    expect(screen.getByRole('menuitem', { name: /Save/i })).toHaveAttribute(
      'aria-keyshortcuts',
      'Meta+S',
    );
  });

  it('does not intercept shortcuts when focus is in an input', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithProvider(
      <>
        <input aria-label="Name" />
        <Menu
          open
          onOpenChange={() => undefined}
          entries={[
            { id: 'save', label: 'Save', accelerator: { mod: true, key: 's' }, onSelect },
          ]}
        />
      </>,
    );

    screen.getByLabelText('Name').focus();
    await pressModKey(user, 's');
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('collectGlobalMenuAccelerators', () => {
  it('includes only top-level item accelerators', () => {
    const bindings = collectGlobalMenuAccelerators([
      { id: 'save', label: 'Save', accelerator: { mod: true, key: 's' } },
      {
        type: 'submenu',
        id: 'export',
        label: 'Export',
        items: [{ id: 'pdf', label: 'PDF', accelerator: { mod: true, key: 'p' } }],
      },
    ]);
    expect(bindings.map((b) => b.item.id)).toEqual(['save']);
  });
});

describe('MnemonicLabel', () => {
  it('underlines access key when visible', () => {
    const { container } = render(<MnemonicLabel label="&File" showAccessKey />);
    expect(container.textContent).toBe('File');
    expect(container.querySelector('span span')?.textContent).toBe('F');
  });
});

describe('MenuBar global shortcuts', () => {
  it('fires save via accelerator when File menu is closed', async () => {
    const user = userEvent.setup();
    const onMenuAction = vi.fn();

    renderWithProvider(
      <MenuBar
        appName="Pages"
        platform="macos"
        showAppleMenu={false}
        enableGlobalShortcuts
        standardOptions={{
          appName: 'Pages',
          context: { isDocumentOpen: true, isDirty: true },
          handlers: { save: () => undefined },
        }}
        onMenuAction={onMenuAction}
      />,
    );

    await pressModKey(user, 's');
    expect(onMenuAction).toHaveBeenCalledWith('file', 'save');
  });
});

describe('Menu type-ahead', () => {
  it('highlights items matching typed prefix', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[
          { id: 'save', label: 'Save' },
          { id: 'save-as', label: 'Save As…' },
          { id: 'close', label: 'Close' },
        ]}
      />,
    );

    await user.keyboard('s');
    expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveAttribute(
      'data-typeahead-match',
      'true',
    );
  });

  it('activates highlighted item on Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithProvider(
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[
          { id: 'save', label: 'Save', onSelect },
          { id: 'close', label: 'Close' },
        ]}
      />,
    );

    await user.keyboard('s');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('useCommandPaletteShortcut', () => {
  it('opens command palette on mod+k', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    function TestApp() {
      useCommandPaletteShortcut(onOpen);
      return <input aria-label="Search" />;
    }

    renderWithProvider(<TestApp />);
    await pressModKey(user, 'k');
    expect(onOpen).toHaveBeenCalledOnce();
  });
});
