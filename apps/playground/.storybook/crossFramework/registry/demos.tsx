import { useEffect, type ComponentProps } from 'react';
import {
  AlertDialog,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActivityShareButton,
  Button,
  ButtonGroup,
  Card,
  CollaborationPopover,
  CollaborationButton,
  ColumnView,
  DataTable,
  Dialog,
  DisclosureButton,
  DisclosureGroup,
  DisclosureList,
  Drawer,
  Input,
  List,
  ListRow,
  ListSection,
  Modal,
  Select,
  ShareSheet,
  ShareToolbar,
  SquareButton,
  Table,
  TabView,
  TabViewList,
  TabViewPanel,
  TabViewTab,
  Tooltip,
  ActivityView,
  DragDropList,
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderTitle,
  Popover,
  Sidebar,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SplitView,
  SplitViewPane,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  ToastProvider,
  useToast,
} from '@larose-ui/react';
import type { CrossFrameworkComponentDefinition } from '../types';
import { serializableProps, slotFromArgs } from '../defineParity';
import {
  DEFAULT_ACTIVITIES,
  DEFAULT_COLLABORATORS,
  DEFAULT_COLUMN_HIERARCHY,
  DEFAULT_DISCLOSURE_LIST_ITEMS,
  DEFAULT_DRAG_ITEMS,
  DEFAULT_TABLE_COLUMNS,
  DEFAULT_TABLE_ROWS,
} from './defaults';

const ALL = ['react', 'vue', 'svelte'] as const;

function ToastReactBody({
  autoTitle,
  autoMessage,
  buttonLabel,
}: {
  autoTitle: string;
  autoMessage: string;
  buttonLabel: string;
}) {
  const { toast } = useToast();
  useEffect(() => {
    toast({ title: autoTitle, message: autoMessage, variant: 'info' });
  }, [toast, autoTitle, autoMessage]);
  return (
    <Button
      onClick={() =>
        toast({ title: 'Saved', message: 'Employee record updated.', variant: 'success' })
      }
    >
      {buttonLabel}
    </Button>
  );
}

export const demoRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  modal: {
    id: 'modal',
    displayName: 'Modal',
    componentName: 'Modal',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Edit employee',
      description = 'Update profile details.',
      label,
      children,
      ...rest
    }) => ({
      props: { open, title, description, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Modal body'),
    }),
    argTypes: {
      open: { control: 'boolean' },
      title: { control: 'text' },
      description: { control: 'text' },
      label: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Modal
        {...(props as unknown as ComponentProps<typeof Modal>)}
        onClose={() => undefined}
      >
        {slotText}
      </Modal>
    ),
  },

  dialog: {
    id: 'dialog',
    displayName: 'Dialog',
    componentName: 'Dialog',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Confirm',
      description = 'Are you sure?',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'default',
      loading,
      ...rest
    }) => ({
      props: {
        open,
        title,
        description,
        confirmLabel,
        cancelLabel,
        variant,
        loading,
        ...serializableProps(rest),
      },
    }),
    argTypes: {
      open: { control: 'boolean' },
      title: { control: 'text' },
      description: { control: 'text' },
      confirmLabel: { control: 'text' },
      cancelLabel: { control: 'text' },
      variant: { control: 'select', options: ['default', 'destructive'] },
      loading: { control: 'boolean' },
    },
    renderReact: (props) => (
      <Dialog
        {...(props as unknown as ComponentProps<typeof Dialog>)}
        onClose={() => undefined}
        onConfirm={() => undefined}
      />
    ),
  },

  drawer: {
    id: 'drawer',
    displayName: 'Drawer',
    componentName: 'Drawer',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Details',
      description,
      side = 'right',
      label,
      children,
      ...rest
    }) => ({
      props: { open, title, description, side, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Drawer content'),
    }),
    argTypes: {
      open: { control: 'boolean' },
      title: { control: 'text' },
      description: { control: 'text' },
      side: { control: 'select', options: ['left', 'right'] },
      label: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Drawer
        {...(props as unknown as ComponentProps<typeof Drawer>)}
        onClose={() => undefined}
      >
        {slotText}
      </Drawer>
    ),
  },

  tooltip: {
    id: 'tooltip',
    displayName: 'Tooltip',
    componentName: 'Tooltip',
    frameworks: [...ALL],
    mapArgs: ({ content = 'Tooltip', side = 'top', label, children, ...rest }) => ({
      props: {
        content: typeof content === 'string' ? content : 'Tooltip',
        side,
        ...serializableProps(rest),
      },
      slotText: slotFromArgs({ label, children }, 'Hover me'),
    }),
    argTypes: {
      content: { control: 'text' },
      side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
      label: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Tooltip {...(props as unknown as ComponentProps<typeof Tooltip>)}>
        <Button variant="outline">{slotText ?? 'Hover me'}</Button>
      </Tooltip>
    ),
  },

  alertDialog: {
    id: 'alertDialog',
    displayName: 'AlertDialog',
    componentName: 'AlertDialog',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Delete this note?',
      message = 'This cannot be undone.',
      presentation = 'compact',
      showCautionIcon,
      actions = [
        { id: 'delete', label: 'Delete', role: 'destructive' },
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
      ],
      ...rest
    }) => ({
      props: {
        open,
        title,
        message,
        presentation,
        showCautionIcon,
        actions,
        ...serializableProps(rest),
      },
    }),
    argTypes: {
      open: { control: 'boolean' },
      title: { control: 'text' },
      message: { control: 'text' },
      presentation: { control: 'select', options: ['compact', 'tablet', 'desktop'] },
      showCautionIcon: { control: 'boolean' },
    },
    renderReact: (props) => (
      <AlertDialog
        {...(props as unknown as ComponentProps<typeof AlertDialog>)}
        onOpenChange={() => undefined}
      />
    ),
  },

  dataTable: {
    id: 'dataTable',
    displayName: 'DataTable',
    componentName: 'DataTable',
    frameworks: [...ALL],
    mapArgs: ({
      data = DEFAULT_TABLE_ROWS,
      caption = 'Employees',
      striped = true,
      loading = false,
      columns,
      ...rest
    }) => {
      const cols =
        (columns as { key: string; header: string }[] | undefined) ??
        DEFAULT_TABLE_COLUMNS.map(({ key, header }) => ({ key, header }));
      return {
        props: {
          data,
          caption,
          striped,
          loading,
          columns: cols.map((col) => ({
            ...col,
            accessor: (row: Record<string, unknown>) => row[col.key],
          })),
          keyExtractor: (row: Record<string, unknown>) => String(row.id ?? row.key ?? ''),
          ...serializableProps(rest),
        },
      };
    },
    renderReact: (props) => (
      <DataTable {...(props as unknown as ComponentProps<typeof DataTable>)} />
    ),
  },

  tabView: {
    id: 'tabView',
    displayName: 'TabView',
    componentName: 'TabViewDemo',
    frameworks: [...ALL],
    mapArgs: ({
      variant = 'bordered',
      defaultValue = 'general',
      showTabs = true,
      inset = true,
      ...rest
    }) => ({
      props: { variant, defaultValue, showTabs, inset, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <TabView
        variant={props.variant as never}
        defaultValue={String(props.defaultValue ?? 'general')}
        showTabs={props.showTabs !== false}
        inset={props.inset !== false}
        aria-label="Settings tabs"
      >
        <TabViewList aria-label="Settings sections">
          <TabViewTab value="general" label="General" />
          <TabViewTab value="privacy" label="Privacy" />
          <TabViewTab value="notifications" label="Notifications" />
        </TabViewList>
        <TabViewPanel value="general">Choose appearance and update channel.</TabViewPanel>
        <TabViewPanel value="privacy">Manage analytics and data sharing.</TabViewPanel>
        <TabViewPanel value="notifications">Configure badges and sounds.</TabViewPanel>
      </TabView>
    ),
  },

  activityView: {
    id: 'activityView',
    displayName: 'ActivityView',
    componentName: 'ActivityView',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Share',
      activities = DEFAULT_ACTIVITIES,
      presentation = 'sheet',
      ...rest
    }) => ({
      props: {
        open,
        title,
        presentation,
        activities: (activities as { id: string; title: string; kind?: string }[]).map(
          (activity) => ({ ...activity, onSelect: () => undefined }),
        ),
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <ActivityView
        {...(props as unknown as ComponentProps<typeof ActivityView>)}
        onClose={() => undefined}
      />
    ),
  },

  list: {
    id: 'list',
    displayName: 'List',
    componentName: 'ListDemo',
    frameworks: [...ALL],
    mapArgs: ({ variant = 'grouped', ...rest }) => ({
      props: { variant, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <List variant={props.variant as never} aria-label="Settings">
        <ListSection header="Account" footer="Changes sync across your devices.">
          <ListRow title="Apple ID" subtitle="sara@icloud.com" accessory="disclosure" />
          <ListRow title="iCloud" subtitle="5 GB of 5 GB used" accessory="disclosure" />
        </ListSection>
        <ListSection header="Notifications">
          <ListRow title="Allow Notifications" accessory="checkmark" selected />
          <ListRow title="Sounds" accessory="disclosure" />
        </ListSection>
      </List>
    ),
  },

  splitView: {
    id: 'splitView',
    displayName: 'SplitView',
    componentName: 'SplitViewDemo',
    frameworks: [...ALL],
    mapArgs: ({
      orientation = 'horizontal',
      leftLabel = 'Sidebar',
      rightLabel = 'Detail content',
      ...rest
    }) => ({
      props: { orientation, leftLabel, rightLabel, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <div
        style={{
          minHeight: '16rem',
          border: '1px solid var(--lr-color-border, #e4e4e7)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}
      >
        <SplitView
          orientation={props.orientation as never}
          storageKey="storybook-split-demo"
          aria-label="Split view demo"
        >
          <SplitViewPane id="sidebar" label="Sidebar" defaultSize={32} minSize={140}>
            <div style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                {String(props.leftLabel ?? 'Sidebar')}
              </strong>
              <p style={{ margin: 0, opacity: 0.75 }}>Drag the divider to resize panes.</p>
            </div>
          </SplitViewPane>
          <SplitViewPane id="content" label="Content" defaultSize={68} minSize={180}>
            <div style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                {String(props.rightLabel ?? 'Detail content')}
              </strong>
              <p style={{ margin: 0, opacity: 0.75 }}>Secondary pane updates with Storybook controls.</p>
            </div>
          </SplitViewPane>
        </SplitView>
      </div>
    ),
  },

  dragDropList: {
    id: 'dragDropList',
    displayName: 'DragDropList',
    componentName: 'DragDropList',
    frameworks: [...ALL],
    mapArgs: ({ items = DEFAULT_DRAG_ITEMS, ...rest }) => ({
      props: {
        items,
        onReorder: () => undefined,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <DragDropList
        {...(props as unknown as ComponentProps<typeof DragDropList>)}
        onReorder={() => undefined}
      />
    ),
  },

  popover: {
    id: 'popover',
    displayName: 'Popover',
    componentName: 'PopoverDemo',
    frameworks: [...ALL],
    mapArgs: ({
      side = 'bottom',
      open = true,
      triggerLabel = 'Show info',
      contentText = 'Popovers present supplementary content anchored to a trigger.',
      ...rest
    }) => ({
      props: { side, open, triggerLabel, contentText, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Popover
        open={Boolean(props.open)}
        side={props.side as never}
        onOpenChange={() => undefined}
        trigger={<Button variant="outline">{String(props.triggerLabel ?? 'Show info')}</Button>}
        content={
          <p style={{ margin: 0, maxWidth: 220 }}>{String(props.contentText ?? '')}</p>
        }
      />
    ),
  },

  tabs: {
    id: 'tabs',
    displayName: 'Tabs',
    componentName: 'TabsDemo',
    frameworks: [...ALL],
    mapArgs: ({ defaultValue = 'profile', ...rest }) => ({
      props: { defaultValue, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Tabs defaultValue={String(props.defaultValue ?? 'profile')}>
        <TabsList aria-label="Employee sections">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsPanel value="profile">Profile details and contact info.</TabsPanel>
        <TabsPanel value="permissions">Role and permission assignments.</TabsPanel>
        <TabsPanel value="activity">Recent audit events.</TabsPanel>
      </Tabs>
    ),
  },

  toast: {
    id: 'toast',
    displayName: 'Toast',
    componentName: 'ToastDemo',
    frameworks: [...ALL],
    mapArgs: ({
      autoTitle = 'Welcome',
      autoMessage = 'laRose toast notifications are ready.',
      buttonLabel = 'Show toast',
      ...rest
    }) => ({
      props: { autoTitle, autoMessage, buttonLabel, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <ToastProvider>
        <ToastReactBody
          autoTitle={String(props.autoTitle ?? 'Welcome')}
          autoMessage={String(props.autoMessage ?? 'laRose toast notifications are ready.')}
          buttonLabel={String(props.buttonLabel ?? 'Show toast')}
        />
      </ToastProvider>
    ),
  },

  accordion: {
    id: 'accordion',
    displayName: 'Accordion',
    componentName: 'AccordionDemo',
    frameworks: [...ALL],
    mapArgs: ({
      type = 'single',
      collapsible = true,
      defaultValue = ['profile'],
      ...rest
    }) => ({
      props: { type, collapsible, defaultValue, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Accordion
        type={(props.type as 'single' | 'multiple') ?? 'single'}
        collapsible={Boolean(props.collapsible ?? true)}
        defaultValue={(props.defaultValue as string[]) ?? ['profile']}
      >
        <AccordionItem value="profile">
          <AccordionTrigger>Profile</AccordionTrigger>
          <AccordionContent>Name, email, and department settings.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="security">
          <AccordionTrigger>Security</AccordionTrigger>
          <AccordionContent>Password, MFA, and active sessions.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="notifications">
          <AccordionTrigger>Notifications</AccordionTrigger>
          <AccordionContent>Email and in-app notification preferences.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },

  sidebar: {
    id: 'sidebar',
    displayName: 'Sidebar',
    componentName: 'SidebarDemo',
    frameworks: [...ALL],
    mapArgs: ({ brand = 'laRose', ...rest }) => ({
      props: { brand, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <div
        style={{
          display: 'flex',
          minHeight: 320,
          border: '1px solid var(--lr-color-border)',
        }}
      >
        <Sidebar>
          <SidebarHeader>{String(props.brand ?? 'laRose')}</SidebarHeader>
          <SidebarNav>
            <SidebarGroup label="Workspace">
              <SidebarItem active>Dashboard</SidebarItem>
              <SidebarItem>Employees</SidebarItem>
              <SidebarItem>Reports</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Settings">
              <SidebarItem>Profile</SidebarItem>
              <SidebarItem disabled>Billing</SidebarItem>
            </SidebarGroup>
          </SidebarNav>
        </Sidebar>
        <div style={{ flex: 1, padding: '1rem' }}>Main content</div>
      </div>
    ),
  },

  header: {
    id: 'header',
    displayName: 'Header',
    componentName: 'HeaderDemo',
    frameworks: [...ALL],
    mapArgs: ({ title = 'Employees', brand = 'laRose', ...rest }) => ({
      props: { title, brand, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Header>
        <HeaderBrand>{String(props.brand ?? 'laRose')}</HeaderBrand>
        <HeaderTitle>{String(props.title ?? 'Employees')}</HeaderTitle>
        <HeaderActions>
          <Button size="sm">Action</Button>
        </HeaderActions>
      </Header>
    ),
  },

  squareButton: {
    id: 'squareButton',
    displayName: 'SquareButton',
    componentName: 'SquareButtonsDemo',
    frameworks: [...ALL],
    mapArgs: () => ({ props: {} }),
    renderReact: () => (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <SquareButton icon="+" aria-label="Add row" tooltip="Add row" />
        <SquareButton icon="−" aria-label="Remove row" tooltip="Remove row" />
      </div>
    ),
  },

  buttonGroup: {
    id: 'buttonGroup',
    displayName: 'ButtonGroup',
    componentName: 'ButtonGroupDemo',
    frameworks: [...ALL],
    mapArgs: ({
      orientation = 'horizontal',
      fullWidth = false,
      ariaLabel = 'Save options',
      ...rest
    }) => ({
      props: { orientation, fullWidth, ariaLabel, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <ButtonGroup
        orientation={props.orientation as 'horizontal' | 'vertical'}
        fullWidth={Boolean(props.fullWidth)}
        aria-label={String(props.ariaLabel ?? 'Save options')}
      >
        <Button variant="primary" buttonRole="primary" fullWidth={Boolean(props.fullWidth)}>
          Save
        </Button>
        <Button variant="secondary" fullWidth={Boolean(props.fullWidth)}>
          Save As…
        </Button>
        <Button variant="secondary" buttonRole="cancel" fullWidth={Boolean(props.fullWidth)}>
          Cancel
        </Button>
      </ButtonGroup>
    ),
  },

  columnView: {
    id: 'columnView',
    displayName: 'ColumnView',
    componentName: 'ColumnView',
    frameworks: [...ALL],
    mapArgs: ({
      data = DEFAULT_COLUMN_HIERARCHY,
      root = DEFAULT_COLUMN_HIERARCHY,
      initialPath = ['icloud', 'design'],
      modelValue = ['icloud', 'design'],
      path = ['icloud', 'design'],
      ...rest
    }) => ({
      props: { data, root, initialPath, modelValue, path, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <ColumnView
        data={(props.data as typeof DEFAULT_COLUMN_HIERARCHY) ?? DEFAULT_COLUMN_HIERARCHY}
        initialPath={(props.initialPath as string[]) ?? ['icloud', 'design']}
      />
    ),
  },

  shareSheet: {
    id: 'shareSheet',
    displayName: 'ShareSheet',
    componentName: 'ShareSheet',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Share Note',
      settings = { audience: 'invited', permission: 'edit' },
      ...rest
    }) => ({
      props: {
        open,
        title,
        settings,
        onClose: () => undefined,
        onSettingsChange: () => undefined,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <ShareSheet
        {...(props as unknown as ComponentProps<typeof ShareSheet>)}
        onClose={() => undefined}
        onSettingsChange={() => undefined}
      />
    ),
  },

  collaborationPopover: {
    id: 'collaborationPopover',
    displayName: 'CollaborationPopover',
    componentName: 'CollaborationPopoverDemo',
    frameworks: [...ALL],
    mapArgs: ({
      defaultOpen = true,
      collaborators = DEFAULT_COLLABORATORS,
      ...rest
    }) => ({
      props: { defaultOpen, collaborators, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 1rem 18rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <CollaborationPopover
          trigger={
            <CollaborationButton
              collaborators={
                (props.collaborators as typeof DEFAULT_COLLABORATORS) ?? DEFAULT_COLLABORATORS
              }
            />
          }
          collaborators={
            (props.collaborators as typeof DEFAULT_COLLABORATORS) ?? DEFAULT_COLLABORATORS
          }
          actions={[
            {
              id: 'updates',
              label: 'Recent updates',
              description: 'Sara edited the introduction 5 minutes ago',
            },
            {
              id: 'activity',
              label: 'View all activity',
              description: 'See the full collaboration timeline',
            },
          ]}
          defaultOpen={Boolean(props.defaultOpen ?? true)}
        />
      </div>
    ),
  },

  shareToolbar: {
    id: 'shareToolbar',
    displayName: 'ShareToolbar',
    componentName: 'ShareToolbar',
    frameworks: [...ALL],
    mapArgs: ({
      shareTitle = 'Share Quarterly Plan',
      collaborating = true,
      collaborators = DEFAULT_COLLABORATORS,
      ...rest
    }) => ({
      props: {
        shareTitle,
        collaborating,
        collaborators: collaborating ? collaborators : [],
        collaborationActions: [
          {
            id: 'updates',
            label: 'Recent updates',
            description: '3 changes in the last hour',
          },
        ],
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <ShareToolbar {...(props as unknown as ComponentProps<typeof ShareToolbar>)} />
    ),
  },

  activityShareButton: {
    id: 'activityShareButton',
    displayName: 'ActivityShareButton',
    componentName: 'ActivityShareButton',
    frameworks: [...ALL],
    mapArgs: ({
      activities = DEFAULT_ACTIVITIES,
      label = 'Share',
      title = 'Share',
      ...rest
    }) => ({
      props: {
        activities: (activities as { id: string; title: string; kind?: string }[]).map(
          (activity) => ({ ...activity, onSelect: () => undefined }),
        ),
        label,
        title,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <ActivityShareButton
        {...(props as unknown as ComponentProps<typeof ActivityShareButton>)}
      />
    ),
  },

  disclosureButton: {
    id: 'disclosureButton',
    displayName: 'DisclosureButton',
    componentName: 'DisclosureButtonDemo',
    frameworks: [...ALL],
    mapArgs: ({ defaultExpanded = false, label = 'Save document', ...rest }) => ({
      props: { defaultExpanded, label, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Card title="Save document" padding="md">
        <DisclosureButton
          defaultExpanded={Boolean(props.defaultExpanded)}
          aria-label="Show save locations"
          detail={
            <Select
              label="Location"
              defaultValue="docs"
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
    ),
  },

  disclosureGroup: {
    id: 'disclosureGroup',
    displayName: 'DisclosureGroup',
    componentName: 'DisclosureGroupDemo',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Delivery details',
      defaultExpanded = true,
      ...rest
    }) => ({
      props: { label, defaultExpanded, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <DisclosureGroup
        label={String(props.label ?? 'Delivery details')}
        defaultExpanded={Boolean(props.defaultExpanded ?? true)}
      >
        <Input label="Recipient" defaultValue="sara@company.com" />
        <Input label="Notes" defaultValue="Leave at front desk" />
      </DisclosureGroup>
    ),
  },

  disclosureList: {
    id: 'disclosureList',
    displayName: 'DisclosureList',
    componentName: 'DisclosureList',
    frameworks: [...ALL],
    mapArgs: ({
      items = DEFAULT_DISCLOSURE_LIST_ITEMS,
      defaultExpandedIds = ['work'],
      ...rest
    }) => ({
      props: { items, defaultExpandedIds, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <DisclosureList
        items={(props.items as typeof DEFAULT_DISCLOSURE_LIST_ITEMS) ?? DEFAULT_DISCLOSURE_LIST_ITEMS}
        defaultExpandedIds={(props.defaultExpandedIds as string[]) ?? ['work']}
      />
    ),
  },

  table: {
    id: 'table',
    displayName: 'Table',
    componentName: 'TableDemo',
    frameworks: [...ALL],
    mapArgs: ({ caption = 'Team directory', selectedKey = '1', ...rest }) => ({
      props: { caption, selectedKey, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Table
        caption={String(props.caption ?? 'Team directory')}
        data={DEFAULT_TABLE_ROWS}
        keyExtractor={(row) => row.id}
        selectionMode="navigation"
        selectedKey={String(props.selectedKey ?? '1')}
        onSelectRow={() => undefined}
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
            sortValue: (row) => row.name,
            render: (row) => row.name,
          },
          {
            key: 'role',
            header: 'Role',
            sortable: true,
            sortValue: (row) => row.role,
            render: (row) => row.role,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => row.status,
          },
        ]}
      />
    ),
  },

  shortcutLab: {
    id: 'shortcutLab',
    displayName: 'Foundation/Accelerators',
    componentName: 'ShortcutLabDemo',
    frameworks: [...ALL],
    mapArgs: () => ({ props: {} }),
    renderReact: () => null,
  },
};
