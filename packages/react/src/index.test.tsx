import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button/Button';
import { HelpButton } from './Button/HelpButton';
import { ContextMenu } from './ContextMenu/ContextMenu';
import { DockMenu, DockBar } from './DockMenu/DockMenu';
import { HomeScreenQuickActions } from './QuickActions/HomeScreenQuickActions';
import { Menu } from './Menu/Menu';
import { OrnamentWindow, OrnamentButton } from './Ornament/Ornament';
import { PopUpButton } from './PopUpButton/PopUpButton';
import { PullDownButton, MorePullDownButton } from './PullDownButton/PullDownButton';
import { MenuBar } from './MenuBar/MenuBar';
import { Toolbar } from './Toolbar/Toolbar';
import { ComposeIcon } from './Toolbar/icons';
import { PathControl } from './PathControl/PathControl';
import { SearchField } from './SearchField/SearchField';
import { TabBar, TabBarList, TabBarItem } from './TabBar/TabBar';
import { TokenField } from './TokenField/TokenField';
import { AlertDialog } from './AlertDialog/AlertDialog';
import { EditMenu, EditMenuSelection } from './EditMenu/EditMenu';
import { Chart } from './Chart/Chart';
import { Drawer } from './Drawer/Drawer';
import { Popover } from './Popover/Popover';
import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion/Accordion';
import { Pagination } from './Pagination/Pagination';
import { DataTable } from './DataTable/DataTable';
import { FileUpload } from './FileUpload/FileUpload';
import {
  Sidebar,
  SidebarDisclosureSection,
  SidebarHeader,
  SidebarNav,
  SidebarItem,
} from './Sidebar/Sidebar';
import { Header, HeaderTitle, HeaderActions } from './Header/Header';
import { CommandPalette } from './CommandPalette/CommandPalette';
import { DatePicker } from './DatePicker/DatePicker';
import { TimePicker } from './TimePicker/TimePicker';
import { DateRangePicker } from './DateRangePicker/DateRangePicker';
import { Picker, DateTimePicker } from './Picker';
import { Input } from './Input/Input';
import { Textarea } from './Textarea/Textarea';
import { TextView } from './TextView/TextView';
import { WebView } from './WebView/WebView';
import { Box } from './Layout/Box';
import { Collection } from './Layout/Collection';
import { Label } from './Label/Label';
import { DisclosureTriangle } from './Disclosure/DisclosureTriangle';
import { ListRow } from './ListTable/ListRow';
import { Lockup } from './Lockup/Lockup';
import { Monogram } from './Lockup/LockupVariants';
import { OutlineView } from './ListTable/OutlineView';
import { SplitView, SplitViewPane } from './SplitView/SplitView';
import { TabView, TabViewList, TabViewPanel, TabViewTab } from './TabView/TabView';
import { ActivityView } from './Sharing/ActivityView';
import { ImageView } from './ImageView/ImageView';
import { Select } from './Select/Select';
import { Checkbox } from './Checkbox/Checkbox';
import { Switch } from './Switch/Switch';
import { Progress } from './Progress/Progress';
import { Alert } from './Alert/Alert';
import { Tooltip } from './Tooltip/Tooltip';
import { ToastProvider, useToast } from './Toast/Toast';
import { Tabs, TabsList, TabsTrigger, TabsPanel } from './Tabs/Tabs';
import { LaRoseProvider } from './provider/LaRoseProvider';

function renderWithProvider(ui: React.ReactElement) {
  return render(<LaRoseProvider>{ui}</LaRoseProvider>);
}

describe('Button', () => {
  it('renders children', () => {
    renderWithProvider(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProvider(<Button loading>Saving</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('handles click when not disabled', async () => {
    const onClick = vi.fn();
    renderWithProvider(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('appends ellipsis when opening another view', () => {
    renderWithProvider(<Button opensAnotherView>Edit</Button>);
    expect(screen.getByRole('button', { name: 'Edit…' })).toBeInTheDocument();
  });
});

describe('HelpButton', () => {
  it('renders help affordance', () => {
    renderWithProvider(<HelpButton aria-label="Help" />);
    expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
  });
});

describe('ContextMenu', () => {
  it('opens on context menu gesture', async () => {
    renderWithProvider(
      <ContextMenu
        entries={[
          { id: 'reply', label: 'Reply' },
          { id: 'delete', label: 'Delete', destructive: true },
        ]}
      >
        <button type="button">Message</button>
      </ContextMenu>,
    );

    expect(screen.queryByRole('menuitem', { name: 'Reply' })).not.toBeInTheDocument();
    await userEvent.pointer({ keys: '[MouseRight>]', target: screen.getByRole('button', { name: 'Message' }) });
    expect(screen.getByRole('menuitem', { name: 'Reply' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('hides unavailable entries', () => {
    renderWithProvider(
      <ContextMenu
        open
        onOpenChange={() => undefined}
        entries={[
          { id: 'keep', label: 'Keep' },
          { id: 'hidden', label: 'Hidden', hidden: true },
        ]}
      >
        <button type="button">Item</button>
      </ContextMenu>,
    );
    expect(screen.getByRole('menuitem', { name: 'Keep' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Hidden' })).not.toBeInTheDocument();
  });
});

describe('DockMenu', () => {
  it('opens on secondary click with window list', async () => {
    renderWithProvider(
      <DockBar>
        <DockMenu
          appName="Safari"
          icon={<span>S</span>}
          isRunning
          openWindows={[{ id: '1', title: 'Apple' }]}
          runningEntries={[{ id: 'new', label: 'New Window' }]}
        />
      </DockBar>,
    );

    expect(screen.queryByRole('menuitem', { name: 'Apple' })).not.toBeInTheDocument();
    await userEvent.pointer({
      keys: '[MouseRight>]',
      target: screen.getByRole('button', { name: 'Safari' }),
    });
    expect(screen.getByRole('menuitem', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'New Window' })).toBeInTheDocument();
  });

  it('shows closed entries when app is not running', async () => {
    renderWithProvider(
      <DockMenu
        appName="Xcode"
        icon={<span>X</span>}
        isRunning={false}
        closedEntries={[{ id: 'open', label: 'Open' }]}
        open
        onOpenChange={() => undefined}
      />,
    );
    expect(screen.getByRole('menuitem', { name: 'Open' })).toBeInTheDocument();
  });
});

describe('HomeScreenQuickActions', () => {
  it('renders quick action menu with title and subtitle', () => {
    renderWithProvider(
      <HomeScreenQuickActions
        appName="Mail"
        icon={<span>M</span>}
        actions={[
          { id: 'inbox', label: 'Open Inbox', subtitle: '3 unread messages' },
        ]}
        open
        onOpenChange={() => undefined}
      />,
    );
    expect(screen.getByRole('menuitem', { name: /Open Inbox/i })).toBeInTheDocument();
    expect(screen.getByText('3 unread messages')).toBeInTheDocument();
  });

  it('includes system actions by default', () => {
    renderWithProvider(
      <HomeScreenQuickActions
        appName="Maps"
        icon={<span>M</span>}
        actions={[{ id: 'directions', label: 'Directions Home' }]}
        open
        onOpenChange={() => undefined}
      />,
    );
    expect(screen.getByRole('menuitem', { name: 'Remove App' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit Home Screen' })).toBeInTheDocument();
  });
});

describe('Menu', () => {
  it('opens from trigger click', async () => {
    renderWithProvider(
      <Menu entries={[{ id: 'copy', label: 'Copy', shortcut: '⌘C' }]}>
        <button type="button">Actions</button>
      </Menu>,
    );
    expect(screen.queryByRole('menuitem', { name: /Copy/i })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitem', { name: /Copy/i })).toBeInTheDocument();
  });

  it('shows checkmark for selected items', () => {
    renderWithProvider(
      <Menu
        open
        onOpenChange={() => undefined}
        entries={[{ id: 'hdr', label: 'HDR On', selected: true }]}
      />,
    );
    expect(screen.getByRole('menuitem', { name: 'HDR On' })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('OrnamentWindow', () => {
  it('renders ornament toolbar on window edge', () => {
    renderWithProvider(
      <OrnamentWindow ornament={<OrnamentButton>Play</OrnamentButton>}>
        <div>Content</div>
      </OrnamentWindow>,
    );
    expect(screen.getByRole('toolbar', { name: 'Ornament' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('hides ornament during immersive automatic mode', () => {
    renderWithProvider(
      <OrnamentWindow
        visibility="automatic"
        immersive
        ornament={<OrnamentButton>Play</OrnamentButton>}
      >
        <div>Video</div>
      </OrnamentWindow>,
    );
    expect(screen.queryByRole('toolbar', { name: 'Ornament' })).not.toBeInTheDocument();
  });
});

describe('PopUpButton', () => {
  it('opens mutually exclusive options', async () => {
    renderWithProvider(
      <PopUpButton
        label="Repeat"
        options={[
          { value: 'never', label: 'Never' },
          { value: 'daily', label: 'Every Day' },
        ]}
        defaultValue="never"
      />,
    );
    await userEvent.click(screen.getByLabelText('Repeat'));
    expect(screen.getByRole('option', { name: 'Every Day' })).toBeInTheDocument();
  });

  it('updates label after selection', async () => {
    renderWithProvider(
      <PopUpButton
        options={[
          { value: 'never', label: 'Never' },
          { value: 'daily', label: 'Every Day' },
        ]}
        defaultValue="never"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Never' }));
    await userEvent.click(screen.getByRole('option', { name: 'Every Day' }));
    expect(screen.getByRole('button', { name: /Every Day/i })).toBeInTheDocument();
  });
});

describe('PullDownButton', () => {
  it('opens action menu from trigger click', async () => {
    renderWithProvider(
      <PullDownButton
        label="Add"
        entries={[
          { id: 'note', label: 'New Note' },
          { id: 'checklist', label: 'New Checklist' },
          { id: 'scan', label: 'Scan Document' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByRole('menuitem', { name: 'New Note' })).toBeInTheDocument();
  });

  it('performs action and closes menu', async () => {
    const onAction = vi.fn();
    renderWithProvider(
      <PullDownButton
        label="Add"
        entries={[
          { id: 'note', label: 'New Note' },
          { id: 'checklist', label: 'New Checklist' },
          { id: 'scan', label: 'Scan Document' },
        ]}
        onAction={onAction}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'New Note' }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ label: 'New Note' }));
    expect(screen.queryByRole('menuitem', { name: 'New Note' })).not.toBeInTheDocument();
  });

  it('asks for confirmation on destructive actions', async () => {
    renderWithProvider(
      <PullDownButton
        label="Actions"
        entries={[
          { id: 'duplicate', label: 'Duplicate' },
          { id: 'move', label: 'Move to Folder…' },
          { id: 'delete', label: 'Delete Note', destructive: true },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete Note' }));
    expect(screen.getByRole('dialog', { name: 'Delete Note?' })).toBeInTheDocument();
  });

  it('renders More variant with accessible name', async () => {
    renderWithProvider(
      <MorePullDownButton
        aria-label="More"
        entries={[
          { id: 'pin', label: 'Pin Note' },
          { id: 'lock', label: 'Lock Note' },
          { id: 'share', label: 'Share' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('menuitem', { name: 'Pin Note' })).toBeInTheDocument();
  });
});

describe('MenuBar', () => {
  it('renders standard menus in HIG order', () => {
    renderWithProvider(
      <MenuBar appName="Safari" platform="macos" showAppleMenu={false} />,
    );
    const menubar = screen.getByRole('menubar', { name: 'Safari menu bar' });
    expect(menubar).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Safari' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'File' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
  });

  it('opens a menu and keeps disabled items visible', async () => {
    renderWithProvider(
      <MenuBar
        appName="Notes"
        platform="macos"
        showAppleMenu={false}
        standardOptions={{
          appName: 'Notes',
          context: { canUndo: false, hasSelection: false },
        }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const undo = screen.getByRole('menuitem', { name: /Undo/ });
    expect(undo).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: /Copy/ })).toBeDisabled();
  });

  it('fires onMenuAction when an item is chosen', async () => {
    const onMenuAction = vi.fn();
    renderWithProvider(
      <MenuBar
        appName="Pages"
        platform="macos"
        showAppleMenu={false}
        standardOptions={{
          appName: 'Pages',
          context: { isDocumentOpen: true, isDirty: true },
          handlers: { save: () => undefined },
        }}
        onMenuAction={onMenuAction}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'File' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Save ⌘S' }));
    expect(onMenuAction).toHaveBeenCalledWith('file', 'save');
  });
});

describe('Toolbar', () => {
  it('renders leading, center, and trailing sections', () => {
    renderWithProvider(
      <Toolbar platform="macos" aria-label="Demo toolbar">
        <Toolbar.Leading>
          <Toolbar.Title>Notes</Toolbar.Title>
        </Toolbar.Leading>
        <Toolbar.Center>
          <Toolbar.Item label="Bold" icon={<span>B</span>} />
        </Toolbar.Center>
        <Toolbar.Trailing>
          <Toolbar.Item label="Share" icon={<ComposeIcon />} />
        </Toolbar.Trailing>
      </Toolbar>,
    );

    expect(screen.getByRole('toolbar', { name: 'Demo toolbar' })).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
  });

  it('opens the More menu from the trailing edge', async () => {
    renderWithProvider(
      <Toolbar platform="macos">
        <Toolbar.Trailing>
          <Toolbar.More
            entries={[
              { id: 'pin', label: 'Pin Note' },
              { id: 'lock', label: 'Lock Note' },
            ]}
          />
        </Toolbar.Trailing>
      </Toolbar>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('menuitem', { name: 'Pin Note' })).toBeInTheDocument();
  });

  it('renders a prominent trailing action', () => {
    renderWithProvider(
      <Toolbar platform="ipados">
        <Toolbar.Trailing>
          <Toolbar.Prominent>Done</Toolbar.Prominent>
        </Toolbar.Trailing>
      </Toolbar>,
    );
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });
});

describe('Navigation and search', () => {
  it('renders a standard path control', () => {
    renderWithProvider(
      <PathControl
        segments={[
          { id: 'a', label: 'Macintosh HD' },
          { id: 'b', label: 'Users' },
          { id: 'c', label: 'Documents' },
        ]}
        variant="standard"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Path' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Documents/ })).toBeInTheDocument();
  });

  it('searches with scope bar', async () => {
    const onChange = vi.fn();
    renderWithProvider(
      <SearchField
        defaultValue=""
        onChange={onChange}
        scope={{
          value: 'all',
          onChange: () => undefined,
          options: [
            { id: 'all', label: 'All' },
            { id: 'current', label: 'Current' },
          ],
        }}
      />,
    );
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'design');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
  });

  it('renders tab bar items including disabled tabs', () => {
    renderWithProvider(
      <TabBar defaultValue="home" platform="ios">
        <TabBarList>
          <TabBarItem value="home" label="Home" icon={<ComposeIcon />} />
          <TabBarItem value="settings" label="Settings" disabled />
        </TabBarList>
      </TabBar>,
    );
    expect(screen.getByRole('tab', { name: 'Home' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeDisabled();
  });

  it('commits token field input on comma', async () => {
    const onTokensChange = vi.fn();
    renderWithProvider(<TokenField onTokensChange={onTokensChange} />);
    const input = screen.getByRole('textbox', { name: 'Token input' });
    await userEvent.type(input, 'Ada Lovelace,{Enter}');
    expect(onTokensChange).toHaveBeenCalledWith([expect.objectContaining({ label: 'Ada Lovelace' })]);
  });
});

describe('EditMenu', () => {
  it('opens context menu on secondary click', async () => {
    renderWithProvider(
      <EditMenu
        context={{ hasSelection: true, canPaste: true, isEditable: true, contentType: 'text' }}
        variant="context"
      >
        <EditMenuSelection selected>Selected text</EditMenuSelection>
      </EditMenu>,
    );

    expect(screen.queryByRole('menuitem', { name: 'Copy' })).not.toBeInTheDocument();
    await userEvent.pointer({
      keys: '[MouseRight>]',
      target: screen.getByText('Selected text'),
    });
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Cut' })).toBeInTheDocument();
  });

  it('shows only paste and select when nothing is selected', () => {
    renderWithProvider(
      <EditMenu
        context={{ hasSelection: false, canPaste: true, isEditable: true }}
        variant="context"
        open
        onOpenChange={() => undefined}
      >
        <EditMenuSelection>Body text</EditMenuSelection>
      </EditMenu>,
    );
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Select' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Copy' })).not.toBeInTheDocument();
  });

  it('includes translate for address selections', () => {
    renderWithProvider(
      <EditMenu
        context={{
          hasSelection: true,
          canPaste: false,
          allowsCopy: true,
          contentType: 'address',
        }}
        variant="context"
        open
        onOpenChange={() => undefined}
      >
        <EditMenuSelection selected>1 Infinite Loop</EditMenuSelection>
      </EditMenu>,
    );
    expect(screen.getByRole('menuitem', { name: 'Translate' })).toBeInTheDocument();
  });
});

describe('Chart', () => {
  it('renders title and summary for accessibility', () => {
    renderWithProvider(
      <Chart
        title="Steps"
        subtitle="Daily average 8,100 steps"
        accessibilitySummary="Bar chart of daily steps"
        data={[
          { x: 'Mon', y: 8000 },
          { x: 'Tue', y: 9000 },
        ]}
      />,
    );
    expect(screen.getByText('Steps')).toBeInTheDocument();
    expect(screen.getByText('Daily average 8,100 steps')).toBeInTheDocument();
    expect(screen.getByText('Bar chart of daily steps')).toBeInTheDocument();
  });
});

describe('Input', () => {
  it('associates label with input', () => {
    renderWithProvider(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows loading spinner inside the field', () => {
    renderWithProvider(<Input label="Department" loading placeholder="Loading..." />);
    expect(screen.getByLabelText('Department')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('shows error message', () => {
    renderWithProvider(<Input label="Name" error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Alert', () => {
  it('renders with role alert', () => {
    renderWithProvider(<Alert variant="success">Saved successfully</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Saved successfully');
  });
});

describe('AlertDialog', () => {
  it('renders a modal alert with title and actions', () => {
    renderWithProvider(
      <AlertDialog
        open
        onOpenChange={() => undefined}
        title="Delete this note?"
        message="This action cannot be undone."
        actions={[
          { id: 'delete', label: 'Delete', role: 'destructive' },
          { id: 'cancel', label: 'Cancel', role: 'cancel' },
        ]}
      />,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Delete this note?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('invokes destructive action and closes', async () => {
    const onOpenChange = vi.fn();
    const onDelete = vi.fn();
    renderWithProvider(
      <AlertDialog
        open
        onOpenChange={onOpenChange}
        title="Delete file?"
        actions={[
          { id: 'delete', label: 'Delete', role: 'destructive', onSelect: onDelete },
          { id: 'cancel', label: 'Cancel', role: 'cancel' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports secure text fields', () => {
    renderWithProvider(
      <AlertDialog
        open
        onOpenChange={() => undefined}
        presentation="desktop"
        title="Enter password"
        textField={{ label: 'Password', secure: true }}
        actions={[
          { id: 'cancel', label: 'Cancel', role: 'cancel' },
          { id: 'ok', label: 'Continue', role: 'default' },
        ]}
      />,
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });
});

describe('Textarea', () => {
  it('associates label with textarea', () => {
    renderWithProvider(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });
});

describe('TextView', () => {
  it('renders selectable read-only content', () => {
    renderWithProvider(<TextView value="Selectable diagnostics text" />);
    expect(screen.getByText('Selectable diagnostics text')).toBeInTheDocument();
  });

  it('renders editable textarea', () => {
    renderWithProvider(<TextView editable defaultValue="Editable note" aria-label="Notes" />);
    expect(screen.getByDisplayValue('Editable note')).toBeInTheDocument();
  });
});

describe('ImageView', () => {
  it('renders image with alt text', () => {
    renderWithProvider(<ImageView src="/sample.png" alt="Sample photo" />);
    expect(screen.getByRole('img', { name: 'Sample photo' })).toBeInTheDocument();
  });
});

describe('WebView', () => {
  it('renders embedded html in an iframe', () => {
    renderWithProvider(<WebView html="<p>Hello</p>" title="Message body" />);
    expect(screen.getByTitle('Message body')).toBeInTheDocument();
  });
});

describe('Box', () => {
  it('renders titled grouped content', () => {
    renderWithProvider(
      <Box title="Delivery options">
        <span>Content</span>
      </Box>,
    );
    expect(screen.getByText('Delivery options')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('Collection', () => {
  it('renders selectable items', async () => {
    const onSelect = vi.fn();
    renderWithProvider(
      <Collection
        items={[{ id: '1', label: 'Album 1', imageUrl: '/a.png' }]}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole('listitem'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('Label', () => {
  it('renders with importance levels', () => {
    renderWithProvider(<Label importance="secondary">Supplemental text</Label>);
    expect(screen.getByText('Supplemental text')).toHaveAttribute('data-importance', 'secondary');
  });
});

describe('DisclosureTriangle', () => {
  it('toggles expanded state', async () => {
    renderWithProvider(
      <DisclosureTriangle label="Advanced options" defaultExpanded={false}>
        Hidden content
      </DisclosureTriangle>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Advanced options/i }));
    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });
});

describe('ListRow', () => {
  it('renders accessory rows', () => {
    renderWithProvider(<ListRow title="Inbox" accessory="disclosure" onPress={() => undefined} />);
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });
});

describe('Lockup', () => {
  it('renders header, content, and footer', () => {
    renderWithProvider(
      <Lockup header="Header" footer="Footer" aria-label="Sample lockup">
        Content
      </Lockup>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sample lockup' })).toBeInTheDocument();
  });
});

describe('Monogram', () => {
  it('shows initials when no image is provided', () => {
    renderWithProvider(<Monogram name="Sara Ali" role="Director" />);
    expect(screen.getByText('SA')).toBeInTheDocument();
    expect(screen.getByText('Sara Ali')).toBeInTheDocument();
    expect(screen.getByText('Director')).toBeInTheDocument();
  });
});

describe('OutlineView', () => {
  const data = [
    {
      id: 'docs',
      label: 'Documents',
      values: { Kind: 'Folder', Size: '—' },
      children: [
        {
          id: 'brief',
          label: 'Product Brief.pages',
          values: { Kind: 'Document', Size: '420 KB' },
        },
      ],
    },
  ];

  it('renders hierarchical rows with column headings', () => {
    renderWithProvider(
      <OutlineView
        data={data}
        defaultExpandedIds={['docs']}
        columns={['Kind', 'Size']}
        aria-label="Finder"
      />,
    );
    expect(screen.getByRole('table', { name: 'Finder' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByText('Product Brief.pages')).toBeInTheDocument();
    expect(screen.getByText('420 KB')).toBeInTheDocument();
  });

  it('expands nested containers from disclosure control', async () => {
    renderWithProvider(<OutlineView data={data} columns={['Kind', 'Size']} />);
    expect(screen.queryByText('Product Brief.pages')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Expand Documents/i }));
    expect(screen.getByText('Product Brief.pages')).toBeInTheDocument();
  });
});

describe('SplitView', () => {
  it('renders adjacent panes', () => {
    renderWithProvider(
      <SplitView aria-label="Test split">
        <SplitViewPane id="left">Left pane</SplitViewPane>
        <SplitViewPane id="right">Right pane</SplitViewPane>
      </SplitView>,
    );
    expect(screen.getByRole('group', { name: 'Test split' })).toBeInTheDocument();
    expect(screen.getByText('Left pane')).toBeInTheDocument();
    expect(screen.getByText('Right pane')).toBeInTheDocument();
  });
});

describe('TabView', () => {
  it('switches mutually exclusive panes', async () => {
    renderWithProvider(
      <TabView defaultValue="one" inset={false}>
        <TabViewList>
          <TabViewTab value="one" label="One" />
          <TabViewTab value="two" label="Two" />
        </TabViewList>
        <TabViewPanel value="one">First pane</TabViewPanel>
        <TabViewPanel value="two">Second pane</TabViewPanel>
      </TabView>,
    );
    expect(screen.getByText('First pane')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Second pane')).toBeInTheDocument();
  });
});

describe('ActivityView', () => {
  it('renders share destinations and actions', () => {
    renderWithProvider(
      <ActivityView
        open
        onClose={() => undefined}
        activities={[
          { id: 'messages', title: 'Messages', kind: 'share' },
          { id: 'copy', title: 'Copy', kind: 'action', system: true },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: /Messages/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
  });

  it('excludes activities that do not apply', () => {
    renderWithProvider(
      <ActivityView
        open
        onClose={() => undefined}
        activities={[
          { id: 'copy', title: 'Copy', kind: 'action' },
          { id: 'print', title: 'Print', kind: 'action' },
        ]}
        excludedActivityIds={['print']}
      />,
    );
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Print' })).not.toBeInTheDocument();
  });
});

describe('Select', () => {
  it('renders options', () => {
    renderWithProvider(
      <Select
        label="Department"
        options={[
          { label: 'Engineering', value: 'eng' },
          { label: 'Design', value: 'design' },
        ]}
      />,
    );
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Engineering' })).toBeInTheDocument();
  });
});

describe('Checkbox', () => {
  it('renders labeled checkbox', () => {
    renderWithProvider(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });
});

describe('Switch', () => {
  it('toggles via click', async () => {
    const onCheckedChange = vi.fn();
    renderWithProvider(
      <Switch label="Notifications" onCheckedChange={onCheckedChange} />,
    );
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toggle);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('respects defaultChecked in uncontrolled mode', async () => {
    renderWithProvider(<Switch label="Product updates" defaultChecked />);
    const toggle = screen.getByRole('switch', { name: 'Product updates' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Progress', () => {
  it('exposes progressbar semantics', () => {
    renderWithProvider(<Progress value={40} label="Upload" showValue />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});

describe('Tooltip', () => {
  it('shows tooltip on hover', async () => {
    renderWithProvider(
      <Tooltip content="More info">
        <Button>Help</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.hover(screen.getByRole('button', { name: 'Help' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('More info');
  });
});

describe('Tabs', () => {
  it('switches panels', async () => {
    renderWithProvider(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsPanel value="one">Panel one</TabsPanel>
        <TabsPanel value="two">Panel two</TabsPanel>
      </Tabs>,
    );
    expect(screen.getByText('Panel one')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Panel two')).toBeInTheDocument();
  });
});

function ToastProbe({ message }: { message: string }) {
  const { toast } = useToast();
  useEffect(() => {
    toast({ message, variant: 'success' });
  }, [message, toast]);
  return null;
}

describe('Toast', () => {
  it('renders toast from provider', () => {
    render(
      <LaRoseProvider>
        <ToastProvider>
          <ToastProbe message="Saved" />
        </ToastProvider>
      </LaRoseProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });
});

describe('Drawer', () => {
  it('renders when open', () => {
    renderWithProvider(
      <Drawer open title="Filters" onClose={() => undefined}>
        Filter content
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
  });
});

describe('Popover', () => {
  it('opens on trigger click', async () => {
    renderWithProvider(
      <Popover trigger={<Button>Menu</Button>} content="Popover body" />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Popover body');
  });
});

describe('Breadcrumb', () => {
  it('marks current page', () => {
    renderWithProvider(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Employees', href: '/employees' },
          { label: 'Ahmed', current: true },
        ]}
      />,
    );
    expect(screen.getByText('Ahmed')).toHaveAttribute('aria-current', 'page');
  });

  it('does not render javascript: href links', () => {
    renderWithProvider(
      <Breadcrumb
        items={[
          { label: 'Unsafe', href: 'javascript:alert(1)' },
          { label: 'Current', current: true },
        ]}
      />,
    );
    expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument();
    expect(screen.getByText('Unsafe')).toBeInTheDocument();
  });
});

describe('Accordion', () => {
  it('expands panel on trigger click', async () => {
    renderWithProvider(
      <Accordion defaultValue={['details']} collapsible>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>Hidden content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Hidden content')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByText('Hidden content')).not.toBeVisible();
  });
});

describe('Pagination', () => {
  it('changes page on click', async () => {
    const onPageChange = vi.fn();
    renderWithProvider(
      <Pagination page={2} totalPages={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('DataTable', () => {
  it('renders rows', () => {
    renderWithProvider(
      <DataTable
        caption="Employees"
        data={[
          { id: '1', name: 'Ahmed', role: 'Engineer' },
          { id: '2', name: 'Sara', role: 'Designer' },
        ]}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name', accessor: (row) => row.name },
          { key: 'role', header: 'Role', accessor: (row) => row.role },
        ]}
      />,
    );
    expect(screen.getByRole('table', { name: 'Employees' })).toBeInTheDocument();
    expect(screen.getByText('Ahmed')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    renderWithProvider(
      <DataTable
        data={[]}
        keyExtractor={() => 'x'}
        columns={[{ key: 'name', header: 'Name', accessor: () => '' }]}
        emptyTitle="No employees"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No employees');
  });
});

describe('FileUpload', () => {
  it('renders labeled upload control', () => {
    renderWithProvider(<FileUpload label="Attachments" buttonLabel="Upload files" />);
    expect(screen.getByText('Attachments')).toBeInTheDocument();
    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('marks active navigation item', () => {
    renderWithProvider(
      <Sidebar>
        <SidebarHeader>laRose</SidebarHeader>
        <SidebarNav>
          <SidebarItem active>Dashboard</SidebarItem>
          <SidebarItem>Employees</SidebarItem>
        </SidebarNav>
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  });

  it('falls back to button when href is unsafe', () => {
    renderWithProvider(
      <Sidebar>
        <SidebarNav>
          <SidebarItem href="javascript:alert(1)">Danger</SidebarItem>
        </SidebarNav>
      </Sidebar>,
    );
    expect(screen.queryByRole('link', { name: 'Danger' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Danger' })).toBeInTheDocument();
  });

  it('uses viewport height and scrollable navigation region', () => {
    renderWithProvider(
      <Sidebar>
        <SidebarHeader>laRose</SidebarHeader>
        <SidebarNav>
          <SidebarItem>Dashboard</SidebarItem>
        </SidebarNav>
      </Sidebar>,
    );
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar.tagName).toBe('ASIDE');
    expect(sidebar.className).toMatch(/sidebar/);
    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();
  });

  it('toggles disclosure sections with sidebar chevrons', async () => {
    renderWithProvider(
      <Sidebar>
        <SidebarNav>
          <SidebarDisclosureSection label="Packages" defaultExpanded={false}>
            <SidebarItem>React</SidebarItem>
          </SidebarDisclosureSection>
        </SidebarNav>
      </Sidebar>,
    );
    expect(screen.queryByRole('button', { name: 'React' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Packages' }));
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
  });
});

describe('Header', () => {
  it('renders app header', () => {
    renderWithProvider(
      <Header>
        <HeaderTitle>Employees</HeaderTitle>
        <HeaderActions>
          <Button size="sm">Add</Button>
        </HeaderActions>
      </Header>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
  });
});

describe('CommandPalette', () => {
  it('filters commands', async () => {
    const onSelect = vi.fn();
    renderWithProvider(
      <CommandPalette
        open
        onOpenChange={() => undefined}
        items={[
          { id: 'add', label: 'Add employee', onSelect },
          { id: 'export', label: 'Export CSV', onSelect },
        ]}
      />,
    );
    await userEvent.type(screen.getByRole('searchbox'), 'export');
    expect(screen.getByRole('option', { name: 'Export CSV' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Add employee' })).not.toBeInTheDocument();
  });
});

describe('Picker', () => {
  it('renders wheel columns for multipart selection', () => {
    renderWithProvider(
      <Picker
        label="Country"
        style="wheels"
        columns={[
          {
            id: 'country',
            label: 'Country',
            options: [
              { value: 'eg', label: 'Egypt' },
              { value: 'de', label: 'Germany' },
            ],
          },
        ]}
        value={{ country: 'eg' }}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByRole('listbox', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Egypt' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders compact date picker trigger', () => {
    renderWithProvider(
      <DateTimePicker
        label="Due date"
        mode="date"
        style="compact"
        value={{ date: '2026-08-31' }}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByRole('button', { name: /Due date|Aug/i })).toBeInTheDocument();
  });
});

describe('DatePicker', () => {
  it('associates label with date input', () => {
    renderWithProvider(<DatePicker label="Start date" value="2026-08-29" onChange={() => undefined} />);
    expect(screen.getByLabelText('Start date')).toHaveAttribute('type', 'date');
  });
});

describe('TimePicker', () => {
  it('associates label with time input', () => {
    renderWithProvider(<TimePicker label="Meeting time" value="09:30" onChange={() => undefined} />);
    expect(screen.getByLabelText('Meeting time')).toHaveAttribute('type', 'time');
  });
});

describe('DateRangePicker', () => {
  it('renders start and end date inputs', async () => {
    const onChange = vi.fn();
    renderWithProvider(
      <DateRangePicker
        label="Reporting period"
        value={{ startDate: '2026-08-01', endDate: '2026-08-29' }}
        onChange={onChange}
      />,
    );
    expect(screen.getByLabelText('Start date')).toHaveValue('2026-08-01');
    await userEvent.clear(screen.getByLabelText('End date'));
    await userEvent.type(screen.getByLabelText('End date'), '2026-08-15');
    expect(onChange).toHaveBeenCalled();
  });
});
