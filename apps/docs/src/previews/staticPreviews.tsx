/* eslint-disable @typescript-eslint/ban-ts-comment */
// Preview demos prioritize runnable examples over strict prop typing.
// @ts-nocheck

import type { ReactNode } from 'react';
import {
  ActivityShareButton,
  ActivityView,
  Alert,
  AsyncButton,
  Badge,
  Box,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Chart,
  Checkbox,
  CollaborationButton,
  CollaborationPopover,
  Collection,
  ColumnView,
  ContextMenu,
  DataTable,
  DatePicker,
  DateRangePicker,
  DisclosureButton,
  DisclosureGroup,
  DockBar,
  DockMenu,
  DocumentLauncher,
  DocumentToolbar,
  DragDropList,
  DragDropProvider,
  Draggable,
  DropZone,
  EditMenu,
  EditMenuSelection,
  EmptyState,
  FileBrowser,
  FilePreview,
  FileUpload,
  FormContinue,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderTitle,
  HelpButton,
  HomeScreenQuickActions,
  ImageButton,
  ImageOverlay,
  ImageView,
  ImageWell,
  Input,
  Label,
  LaRoseProvider,
  List,
  ListRow,
  ListSection,
  Lockup,
  Menu,
  MenuBar,
  MenuBarExtra,
  MorePullDownButton,
  Ornament,
  OrnamentButton,
  OrnamentWindow,
  OutlineView,
  OutlineViewToolbar,
  Pagination,
  PathControl,
  Popover,
  PopUpButton,
  Progress,
  PullDownButton,
  Radio,
  SecureField,
  Select,
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  Skeleton,
  Spinner,
  SplitViewToolbar,
  SquareButton,
  Switch,
  Table,
  Textarea,
  TextView,
  TimePicker,
  TokenField,
  Tooltip,
  Typography,
  UnsavedIndicator,
  WebView,
  WebViewNavigation,
  WebViewShell,
} from '@larose-ui/react';
import { PreviewFrame } from '@/components/PreviewFrame';

const employees = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', department: 'Platform' },
  { id: '2', name: 'Sara Ali', role: 'Designer', department: 'Product' },
];

const outlineData = [
  {
    id: 'eng',
    label: 'Engineering',
    children: [
      { id: 'eng-fe', label: 'Frontend' },
      { id: 'eng-be', label: 'Backend' },
    ],
  },
  { id: 'design', label: 'Design' },
];

const files = [
  { id: 'f1', name: 'Employees.csv', size: 2048, modifiedAt: Date.now(), syncStatus: 'synced' as const },
  { id: 'f2', name: 'Report.pdf', size: 4096, modifiedAt: Date.now(), syncStatus: 'synced' as const },
];

const menuEntries = [
  { type: 'item' as const, id: 'edit', label: 'Edit' },
  { type: 'item' as const, id: 'duplicate', label: 'Duplicate' },
  { type: 'separator' as const, id: 'sep' },
  { type: 'item' as const, id: 'delete', label: 'Delete', destructive: true },
];

export const STATIC_PREVIEWS: Record<string, () => ReactNode> = {
  ActivityShareButton: () => (
    <PreviewFrame title="Activity share">
      <ActivityShareButton aria-label="Share activity" onClick={() => undefined} />
    </PreviewFrame>
  ),
  ActivityView: () => (
    <PreviewFrame layout="block" title="Activity view">
      <ActivityView
        title="Recent activity"
        activities={[
          { id: '1', title: 'Ahmed edited profile', timestamp: '2h ago' },
          { id: '2', title: 'Sara exported report', timestamp: '5h ago' },
        ]}
      />
    </PreviewFrame>
  ),
  Alert: () => (
    <PreviewFrame layout="block" title="Alert">
      <Alert title="Saved" variant="success">
        Employee profile was updated successfully.
      </Alert>
    </PreviewFrame>
  ),
  AsyncButton: () => (
    <PreviewFrame title="Async button">
      <AsyncButton
        onClick={async () => {
          await new Promise((resolve) => setTimeout(resolve, 900));
        }}
      >
        Save changes
      </AsyncButton>
    </PreviewFrame>
  ),
  Badge: () => (
    <PreviewFrame title="Badge">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </PreviewFrame>
  ),
  Box: () => (
    <PreviewFrame title="Box">
      <Box title="Team overview" subtitle="3 members">
        <Typography muted>Grouped content container.</Typography>
      </Box>
    </PreviewFrame>
  ),
  Breadcrumb: () => (
    <PreviewFrame layout="block" title="Breadcrumb">
      <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Employees' }]} />
    </PreviewFrame>
  ),
  Button: () => (
    <PreviewFrame title="Button">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Plain</Button>
      <Button variant="destructive">Destructive</Button>
    </PreviewFrame>
  ),
  ButtonGroup: () => (
    <PreviewFrame title="Button group">
      <ButtonGroup aria-label="Save options">
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
      </ButtonGroup>
    </PreviewFrame>
  ),
  Card: () => (
    <PreviewFrame layout="block" title="Card">
      <Card title="Employee profile" padding="md">
        <Typography muted>Ahmed Mohamed — Engineering</Typography>
      </Card>
    </PreviewFrame>
  ),
  Chart: () => (
    <PreviewFrame layout="block" title="Chart">
      <Chart
        mark="bar"
        data={[
          { x: 'Jan', y: 12 },
          { x: 'Feb', y: 18 },
          { x: 'Mar', y: 9 },
        ]}
        aria-label="Monthly hires"
      />
    </PreviewFrame>
  ),
  Checkbox: () => (
    <PreviewFrame title="Checkbox">
      <Checkbox label="Accept terms" defaultChecked />
    </PreviewFrame>
  ),
  CollaborationButton: () => (
    <PreviewFrame title="Collaboration">
      <CollaborationButton label="Share" onClick={() => undefined} />
    </PreviewFrame>
  ),
  CollaborationPopover: () => (
    <PreviewFrame title="Collaboration popover">
      <CollaborationPopover
        trigger={<Button variant="outline">Collaborate</Button>}
        participants={[{ id: '1', name: 'Ahmed' }, { id: '2', name: 'Sara' }]}
      />
    </PreviewFrame>
  ),
  Collection: () => (
    <PreviewFrame layout="block" title="Collection">
      <Collection aria-label="Shortcuts">
        <Button variant="secondary">New employee</Button>
        <Button variant="secondary">Import CSV</Button>
      </Collection>
    </PreviewFrame>
  ),
  ColumnView: () => (
    <PreviewFrame layout="block" title="Column view">
      <ColumnView
        aria-label="Departments"
        tree={[
          { id: 'all', label: 'All staff', children: [{ id: 'eng', label: 'Engineering' }] },
        ]}
        selectedPath={['all', 'eng']}
        detail={<Typography muted>Engineering team details</Typography>}
      />
    </PreviewFrame>
  ),
  ContextMenu: () => (
    <PreviewFrame title="Context menu">
      <ContextMenu entries={menuEntries}>
        <Button variant="outline">Right-click or long-press</Button>
      </ContextMenu>
    </PreviewFrame>
  ),
  DataTable: () => (
    <PreviewFrame layout="block" title="Data table">
      <DataTable
        data={employees}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name', accessor: (row) => row.name },
          { key: 'role', header: 'Role', accessor: (row) => row.role },
        ]}
        aria-label="Employees"
      />
    </PreviewFrame>
  ),
  DatePicker: () => (
    <PreviewFrame title="Date picker">
      <DatePicker label="Start date" defaultValue="2026-01-15" />
    </PreviewFrame>
  ),
  DateRangePicker: () => (
    <PreviewFrame title="Date range">
      <DateRangePicker label="Reporting period" />
    </PreviewFrame>
  ),
  DisclosureButton: () => (
    <PreviewFrame title="Disclosure button">
      <DisclosureButton label="Advanced options" defaultExpanded={false}>
        <Input label="Internal notes" placeholder="Optional" />
      </DisclosureButton>
    </PreviewFrame>
  ),
  DisclosureTriangle: () => (
    <PreviewFrame title="Disclosure">
      <DisclosureGroup label="Filters" defaultExpanded>
        <Input label="Search" placeholder="Filter employees" />
      </DisclosureGroup>
    </PreviewFrame>
  ),
  DisclosureGroup: () => (
    <PreviewFrame title="Disclosure">
      <DisclosureGroup label="Filters" defaultExpanded>
        <Input label="Search" placeholder="Filter employees" />
      </DisclosureGroup>
    </PreviewFrame>
  ),
  DockBar: () => (
    <PreviewFrame layout="block" title="Dock bar">
      <DockBar windows={[{ id: 'main', label: 'Employees' }]} activeWindowId="main" />
    </PreviewFrame>
  ),
  DockMenu: () => (
    <PreviewFrame title="Dock menu">
      <DockMenu
        trigger={<Button variant="outline">Window menu</Button>}
        entries={[
          { type: 'item', id: 'minimize', label: 'Minimize' },
          { type: 'item', id: 'close', label: 'Close window' },
        ]}
      />
    </PreviewFrame>
  ),
  DocumentLauncher: () => (
    <PreviewFrame title="Document launcher">
      <DocumentLauncher
        documents={[
          { id: 'd1', title: 'Employee handbook' },
          { id: 'd2', title: 'Q1 report' },
        ]}
        onOpen={() => undefined}
      />
    </PreviewFrame>
  ),
  DocumentToolbar: () => (
    <PreviewFrame layout="block" title="Document toolbar">
      <DocumentToolbar title="Employees.csv" modified unsaved />
    </PreviewFrame>
  ),
  DragDropList: () => (
    <PreviewFrame layout="block" title="Drag and drop">
      <DragDropList
        items={[
          { id: '1', label: 'Review applications' },
          { id: '2', label: 'Schedule interviews' },
        ]}
        onReorder={() => undefined}
      />
    </PreviewFrame>
  ),
  Draggable: () => (
    <PreviewFrame layout="block" title="Draggable">
      <DragDropProvider>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Draggable id="task-1" sourceId="board" data={{ title: 'Task' }} type="task">
            <Button variant="outline">Drag me</Button>
          </Draggable>
          <DropZone id="board" accepts={['task']} onDrop={() => undefined}>
            <div style={{ padding: '1rem', border: '1px dashed var(--lr-color-border)', borderRadius: '8px' }}>
              Drop here
            </div>
          </DropZone>
        </div>
      </DragDropProvider>
    </PreviewFrame>
  ),
  DropZone: () => (
    <PreviewFrame layout="block" title="Drop zone">
      <DragDropProvider>
        <DropZone id="drop" accepts={['task']} onDrop={() => undefined}>
          <div style={{ padding: '1rem', border: '1px dashed var(--lr-color-border)', borderRadius: '8px' }}>
            Drop here
          </div>
        </DropZone>
      </DragDropProvider>
    </PreviewFrame>
  ),
  EditMenu: () => (
    <PreviewFrame title="Edit menu">
      <EditMenu trigger={<Button variant="outline">Edit</Button>} context={{ canCopy: true, canPaste: true }} />
    </PreviewFrame>
  ),
  EditMenuSelection: () => (
    <PreviewFrame title="Edit menu selection">
      <EditMenuSelection label="3 items selected" />
    </PreviewFrame>
  ),
  EmptyState: () => (
    <PreviewFrame layout="block" title="Empty state">
      <EmptyState
        title="No employees yet"
        description="Add your first team member to get started."
        actionLabel="Add employee"
        onAction={() => undefined}
      />
    </PreviewFrame>
  ),
  FileBrowser: () => (
    <PreviewFrame layout="block" title="File browser">
      <FileBrowser files={files} selectedId="f1" onSelect={() => undefined} />
    </PreviewFrame>
  ),
  FilePreview: () => (
    <PreviewFrame layout="block" title="File preview">
      <FilePreview source={{ type: 'text', content: 'Employee,Role\nAhmed,Engineer' }} fileName="Employees.csv" />
    </PreviewFrame>
  ),
  FileUpload: () => (
    <PreviewFrame layout="block" title="File upload">
      <FileUpload label="Attachments" hint="PDF or CSV up to 10 MB" accept=".pdf,.csv" />
    </PreviewFrame>
  ),
  FormContinue: () => (
    <PreviewFrame title="Form continue">
      <FormContinue label="Continue to payment" onClick={() => undefined} />
    </PreviewFrame>
  ),
  HelpButton: () => (
    <PreviewFrame title="Help button">
      <HelpButton helpTopic="Learn about employee roles" onClick={() => undefined} />
    </PreviewFrame>
  ),
  HomeScreenQuickActions: () => (
    <PreviewFrame title="Quick actions">
      <HomeScreenQuickActions
        actions={[
          { id: 'new', label: 'New employee', onSelect: () => undefined },
          { id: 'scan', label: 'Scan badge', onSelect: () => undefined },
        ]}
      />
    </PreviewFrame>
  ),
  ImageButton: () => (
    <PreviewFrame title="Image button">
      <ImageButton label="Profile photo" src="https://placehold.co/96x96" alt="Profile" />
    </PreviewFrame>
  ),
  ImageOverlay: () => (
    <PreviewFrame layout="block" title="Image overlay">
      <ImageOverlay label="Team photo" caption="Annual retreat 2026">
        <img src="https://placehold.co/320x180" alt="Team" style={{ width: '100%', borderRadius: '8px' }} />
      </ImageOverlay>
    </PreviewFrame>
  ),
  ImageView: () => (
    <PreviewFrame layout="block" title="Image view">
      <ImageView src="https://placehold.co/280x160" alt="Preview" caption="Employee badge photo" />
    </PreviewFrame>
  ),
  ImageWell: () => (
    <PreviewFrame title="Image well">
      <ImageWell label="Avatar" src="https://placehold.co/80x80" alt="Avatar" />
    </PreviewFrame>
  ),
  Input: () => (
    <PreviewFrame layout="block" title="Input">
      <Input label="Email" placeholder="username@company.com" hint="Work email address" />
    </PreviewFrame>
  ),
  Label: () => (
    <PreviewFrame title="Label">
      <Label importance="primary">Primary label</Label>
      <Label importance="secondary">Secondary label</Label>
    </PreviewFrame>
  ),
  LaRoseProvider: () => (
    <PreviewFrame title="Provider">
      <LaRoseProvider themeConfig={{ colors: { primary: '#6C5CE7' } }}>
        <Button>Branded action</Button>
      </LaRoseProvider>
    </PreviewFrame>
  ),
  List: () => (
    <PreviewFrame layout="block" title="List">
      <List aria-label="Employees">
        <ListRow title="Ahmed Mohamed" subtitle="Engineering" accessory="disclosure" />
        <ListRow title="Sara Ali" subtitle="Design" accessory="disclosure" />
      </List>
    </PreviewFrame>
  ),
  ListRow: () => (
    <PreviewFrame layout="block" title="List row">
      <ListRow title="Ahmed Mohamed" subtitle="Engineering" accessory="disclosure" />
    </PreviewFrame>
  ),
  ListSection: () => (
    <PreviewFrame layout="block" title="List section">
      <ListSection title="Active">
        <ListRow title="Ahmed Mohamed" subtitle="Engineering" />
      </ListSection>
    </PreviewFrame>
  ),
  Lockup: () => (
    <PreviewFrame title="Lockup">
      <Lockup header="Team member" footer="Last active today">
        Ahmed Mohamed
      </Lockup>
    </PreviewFrame>
  ),
  Menu: () => (
    <PreviewFrame title="Menu">
      <Menu
        entries={menuEntries}
        open
        onOpenChange={() => undefined}
      />
    </PreviewFrame>
  ),
  MenuBar: () => (
    <PreviewFrame layout="block" title="Menu bar">
      <MenuBar
        menus={[
          { id: 'file', label: 'File', entries: [{ type: 'item', id: 'new', label: 'New' }] },
          { id: 'edit', label: 'Edit', entries: [{ type: 'item', id: 'undo', label: 'Undo' }] },
        ]}
      />
    </PreviewFrame>
  ),
  MenuBarExtra: () => (
    <PreviewFrame title="Menu bar extra">
      <MenuBarExtra items={[{ id: 'sync', label: 'Sync now', onSelect: () => undefined }]} />
    </PreviewFrame>
  ),
  MorePullDownButton: () => (
    <PreviewFrame title="More menu">
      <MorePullDownButton
        entries={[
          { id: 'export', label: 'Export' },
          { id: 'archive', label: 'Archive' },
        ]}
      />
    </PreviewFrame>
  ),
  Ornament: () => (
    <PreviewFrame title="Ornament">
      <Ornament label="Inspector">
        <Typography muted>Accessory panel content</Typography>
      </Ornament>
    </PreviewFrame>
  ),
  OrnamentButton: () => (
    <PreviewFrame title="Ornament button">
      <OrnamentButton aria-label="Show inspector" onClick={() => undefined} />
    </PreviewFrame>
  ),
  OrnamentWindow: () => (
    <PreviewFrame layout="block" title="Ornament window">
      <OrnamentWindow title="Inspector" ornaments={[{ id: 'info', label: 'Info' }]}>
        <Typography muted>Main content with ornaments.</Typography>
      </OrnamentWindow>
    </PreviewFrame>
  ),
  OutlineView: () => (
    <PreviewFrame layout="block" title="Outline view">
      <OutlineView data={outlineData} aria-label="Organization" />
    </PreviewFrame>
  ),
  OutlineViewToolbar: () => (
    <PreviewFrame layout="block" title="Outline toolbar">
      <OutlineViewToolbar title="Employees" itemCount={12} />
    </PreviewFrame>
  ),
  Pagination: () => (
    <PreviewFrame title="Pagination">
      <Pagination page={2} totalPages={8} onPageChange={() => undefined} />
    </PreviewFrame>
  ),
  PathControl: () => (
    <PreviewFrame layout="block" title="Path control">
      <PathControl
        segments={[
          { id: 'home', label: 'Home' },
          { id: 'employees', label: 'Employees' },
        ]}
      />
    </PreviewFrame>
  ),
  Popover: () => (
    <PreviewFrame title="Popover">
      <Popover
        trigger={<Button variant="outline">Show info</Button>}
        content={<Typography muted>Supplementary content anchored to the trigger.</Typography>}
      />
    </PreviewFrame>
  ),
  PopUpButton: () => (
    <PreviewFrame title="Pop-up button">
      <PopUpButton
        label="Sort by"
        options={[
          { value: 'name', label: 'Name' },
          { value: 'date', label: 'Date' },
        ]}
        defaultValue="name"
      />
    </PreviewFrame>
  ),
  Progress: () => (
    <PreviewFrame layout="block" title="Progress">
      <Progress value={62} label="Uploading…" />
    </PreviewFrame>
  ),
  PullDownButton: () => (
    <PreviewFrame title="Pull-down button">
      <PullDownButton
        label="Actions"
        entries={[
          { id: 'edit', label: 'Edit' },
          { id: 'share', label: 'Share' },
        ]}
      />
    </PreviewFrame>
  ),
  Radio: () => (
    <PreviewFrame title="Radio">
      <Radio name="docs-plan" label="Pro" defaultChecked />
      <Radio name="docs-plan" label="Enterprise" />
    </PreviewFrame>
  ),
  SecureField: () => (
    <PreviewFrame layout="block" title="Secure field">
      <SecureField label="Password" placeholder="Enter password" />
    </PreviewFrame>
  ),
  Select: () => (
    <PreviewFrame layout="block" title="Select">
      <Select
        label="Department"
        options={[
          { value: 'eng', label: 'Engineering' },
          { value: 'sales', label: 'Sales' },
        ]}
      />
    </PreviewFrame>
  ),
  Skeleton: () => (
    <PreviewFrame layout="block" title="Skeleton">
      <Skeleton lines={3} />
    </PreviewFrame>
  ),
  Spinner: () => (
    <PreviewFrame title="Spinner">
      <Spinner label="Loading employees…" />
    </PreviewFrame>
  ),
  SplitViewToolbar: () => (
    <PreviewFrame layout="block" title="Split view toolbar">
      <SplitViewToolbar title="Employees" subtitle="12 records" />
    </PreviewFrame>
  ),
  SquareButton: () => (
    <PreviewFrame title="Square button">
      <SquareButton icon="+" aria-label="Add row" tooltip="Add row" onClick={() => undefined} />
    </PreviewFrame>
  ),
  Switch: () => (
    <PreviewFrame title="Switch">
      <Switch label="Enable notifications" defaultChecked />
    </PreviewFrame>
  ),
  Table: () => (
    <PreviewFrame layout="block" title="Table">
      <Table
        data={employees}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name', accessor: (row) => row.name },
          { key: 'department', header: 'Department', accessor: (row) => row.department },
        ]}
        aria-label="Employees table"
      />
    </PreviewFrame>
  ),
  Textarea: () => (
    <PreviewFrame layout="block" title="Textarea">
      <Textarea label="Notes" placeholder="Add details…" />
    </PreviewFrame>
  ),
  TextView: () => (
    <PreviewFrame layout="block" title="Text view">
      <TextView label="Bio" defaultValue="Senior engineer focused on design systems." />
    </PreviewFrame>
  ),
  TimePicker: () => (
    <PreviewFrame title="Time picker">
      <TimePicker label="Shift start" defaultValue="09:00" />
    </PreviewFrame>
  ),
  TokenField: () => (
    <PreviewFrame layout="block" title="Token field">
      <TokenField
        label="Tags"
        tokens={[{ id: '1', label: 'Engineering' }]}
        suggestions={['Design', 'Product', 'Sales']}
      />
    </PreviewFrame>
  ),
  Tooltip: () => (
    <PreviewFrame title="Tooltip">
      <Tooltip content="Export employees as CSV">
        <Button variant="outline">Export</Button>
      </Tooltip>
    </PreviewFrame>
  ),
  Typography: () => (
    <PreviewFrame layout="block" title="Typography">
      <Typography role="title">Employee profile</Typography>
      <Typography muted>Secondary supporting text for the section.</Typography>
    </PreviewFrame>
  ),
  UnsavedIndicator: () => (
    <PreviewFrame title="Unsaved indicator">
      <UnsavedIndicator label="Employees.csv" />
    </PreviewFrame>
  ),
  WebView: () => (
    <PreviewFrame layout="block" title="Web view">
      <WebView src="https://example.com" title="Example" style={{ minHeight: 160, width: '100%' }} />
    </PreviewFrame>
  ),
  WebViewNavigation: () => (
    <PreviewFrame layout="block" title="Web view navigation">
      <WebViewNavigation canGoBack canGoForward onBack={() => undefined} onForward={() => undefined} />
    </PreviewFrame>
  ),
  WebViewShell: () => (
    <PreviewFrame layout="block" title="Web view shell">
      <WebViewShell title="Documentation" url="https://example.com/docs">
        <Typography muted>Embedded web content area</Typography>
      </WebViewShell>
    </PreviewFrame>
  ),
  Header: () => (
    <PreviewFrame layout="block" title="Header">
      <Header>
        <HeaderBrand>laRose</HeaderBrand>
        <HeaderTitle>Employees</HeaderTitle>
        <HeaderActions>
          <Button size="sm">New</Button>
        </HeaderActions>
      </Header>
    </PreviewFrame>
  ),
  Sidebar: () => (
    <PreviewFrame layout="block" title="Sidebar">
      <div style={{ display: 'flex', minHeight: 180 }}>
        <Sidebar>
          <SidebarHeader>laRose</SidebarHeader>
          <SidebarNav>
            <SidebarGroup label="Workspace">
              <SidebarItem active>Employees</SidebarItem>
              <SidebarItem>Reports</SidebarItem>
            </SidebarGroup>
          </SidebarNav>
        </Sidebar>
      </div>
    </PreviewFrame>
  ),
};

