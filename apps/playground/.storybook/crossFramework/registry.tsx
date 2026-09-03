import { useEffect, type ComponentProps } from 'react';
import {
  Alert,
  AlertDialog,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AsyncButton,
  Badge,
  Box,
  Breadcrumb,
  Button,
  Card,
  Chart,
  Checkbox,
  CommandPalette,
  DataTable,
  DatePicker,
  DateRangePicker,
  Dialog,
  DisclosureTriangle,
  Drawer,
  EmptyState,
  FileUpload,
  HomeScreenQuickActions,
  ImageView,
  Input,
  Label,
  LiquidGlass,
  LiquidGlassButton,
  LiquidGlassCheckbox,
  LiquidGlassProgress,
  LiquidGlassRange,
  LiquidGlassSwitch,
  LiquidGlassTabBar,
  LiquidGlassTopBar,
  List,
  ListRow,
  ListSection,
  Menu,
  MenuBar,
  Modal,
  Monogram,
  Ornament,
  OutlineView,
  Pagination,
  PathControl,
  Picker,
  PopUpButton,
  Progress,
  PullDownButton,
  Radio,
  SearchField,
  SecureField,
  Select,
  ShareButton,
  Skeleton,
  Spinner,
  Switch,
  TabView,
  TabViewList,
  TabViewPanel,
  TabViewTab,
  Textarea,
  TextView,
  TimePicker,
  TokenField,
  Toolbar,
  Tooltip,
  Typography,
  ActivityView,
  ContextMenu,
  DockBar,
  DockMenu,
  DragDropList,
  EditMenu,
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
import type { CrossFrameworkComponentDefinition, CrossFrameworkRenderArgs } from './types';

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

function slotFromArgs(args: CrossFrameworkRenderArgs, fallback: string): string {
  if (typeof args.label === 'string' && args.label) return args.label;
  if (typeof args.children === 'string' && args.children) return args.children;
  return fallback;
}

/** Drop React nodes / functions that break Vue & Svelte mounts. */
function serializableProps(args: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value == null) {
      out[key] = value;
      continue;
    }
    const t = typeof value;
    if (t === 'function' || t === 'symbol') continue;
    if (t === 'object') {
      // Allow plain data (options arrays, chart points). Skip React elements.
      if ((value as { $$typeof?: unknown }).$$typeof != null) continue;
    }
    out[key] = value;
  }
  return out;
}

const DEFAULT_TAB_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'search', label: 'Search' },
  { key: 'profile', label: 'Profile' },
];

const DEFAULT_CHART_DATA = [
  { x: 'Mon', y: 40 },
  { x: 'Tue', y: 65 },
  { x: 'Wed', y: 52 },
  { x: 'Thu', y: 80 },
  { x: 'Fri', y: 58 },
];

const DEFAULT_COMMANDS = [
  { id: 'new', label: 'New document', group: 'File', keywords: ['create'] },
  { id: 'open', label: 'Open…', group: 'File', keywords: ['import'] },
  { id: 'save', label: 'Save', group: 'File' },
  { id: 'undo', label: 'Undo', group: 'Edit', keywords: ['revert'] },
  { id: 'find', label: 'Find in page', group: 'Edit', keywords: ['search'] },
  { id: 'theme', label: 'Toggle theme', group: 'View' },
];

const DEFAULT_POPUP_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Every Day' },
  { value: 'weekly', label: 'Every Week' },
  { value: 'monthly', label: 'Every Month' },
];

const DEFAULT_PULLDOWN_ENTRIES = [
  { id: 'note', label: 'New Note' },
  { id: 'checklist', label: 'New Checklist' },
  { id: 'scan', label: 'Scan Document' },
];

const DEFAULT_PATH_SEGMENTS = [
  { id: 'disk', label: 'Macintosh HD' },
  { id: 'users', label: 'Users' },
  { id: 'me', label: 'me' },
  { id: 'docs', label: 'Documents' },
  { id: 'file', label: 'HIG Design.pages' },
];

const DEFAULT_TABLE_ROWS = [
  { id: '1', name: 'Ahmed Mohamed', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Sara Ali', role: 'Designer', status: 'Active' },
  { id: '3', name: 'Omar Hassan', role: 'Manager', status: 'On Leave' },
];

const DEFAULT_TABLE_COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

const DEFAULT_PICKER_COLUMNS = [
  {
    id: 'country',
    label: 'Country',
    options: [
      { value: 'eg', label: 'Egypt' },
      { value: 'de', label: 'Germany' },
      { value: 'us', label: 'United States' },
    ],
  },
];

const DEFAULT_MENU_ENTRIES = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { type: 'separator' },
  { id: 'select-all', label: 'Select All' },
];

const DEFAULT_QUICK_ACTIONS = [
  { id: 'inbox', label: 'All Inboxes' },
  { id: 'compose', label: 'New Message' },
  { id: 'vip', label: 'VIP' },
];

const DEFAULT_CONTEXT_ENTRIES = [
  { id: 'reply', label: 'Reply' },
  { id: 'forward', label: 'Forward' },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', destructive: true },
];

const DEFAULT_OUTLINE_NODES = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'notes', label: 'Notes' },
      { id: 'reports', label: 'Reports' },
    ],
  },
  { id: 'downloads', label: 'Downloads' },
];

const DEFAULT_ACTIVITIES = [
  { id: 'messages', title: 'Messages', kind: 'share' as const },
  { id: 'mail', title: 'Mail', kind: 'share' as const },
  { id: 'copy', title: 'Copy', kind: 'action' as const },
];

const DEFAULT_TOKENS = [
  { id: 'design', label: 'Design' },
  { id: 'eng', label: 'Engineering' },
];

const DEFAULT_DRAG_ITEMS = [
  { id: '1', label: 'Review designs' },
  { id: '2', label: 'Update copy' },
  { id: '3', label: 'Ship release' },
];

const DEFAULT_SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0071e3"/><stop offset="1" stop-color="#af52de"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="520" cy="90" r="48" fill="rgb(255 255 255 / 0.35)"/></svg>`,
  );

export const crossFrameworkRegistry: Record<string, CrossFrameworkComponentDefinition> = {
  badge: {
    id: 'badge',
    displayName: 'Badge',
    componentName: 'Badge',
    frameworks: [...ALL],
    mapArgs: ({ label, children, variant, ...rest }) => ({
      props: { variant, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Draft'),
    }),
    argTypes: {
      label: { control: 'text' },
      variant: {
        control: 'select',
        options: ['default', 'info', 'success', 'warning', 'error'],
      },
    },
    renderReact: (props, slotText) => (
      <Badge variant={props.variant as never}>{slotText ?? 'Draft'}</Badge>
    ),
  },

  button: {
    id: 'button',
    displayName: 'Button',
    componentName: 'Button',
    frameworks: [...ALL],
    mapArgs: ({ label, children, variant, size, buttonRole, loading, disabled, ...rest }) => ({
      props: {
        variant,
        size,
        buttonRole,
        loading,
        disabled,
        ...serializableProps(rest),
      },
      slotText: slotFromArgs({ label, children }, 'Save'),
    }),
    argTypes: {
      label: { control: 'text' },
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      },
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
      buttonRole: {
        control: 'select',
        options: ['normal', 'primary', 'cancel', 'destructive'],
      },
      loading: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props, slotText) => (
      <Button {...(props as unknown as ComponentProps<typeof Button>)}>{slotText ?? 'Save'}</Button>
    ),
  },

  label: {
    id: 'label',
    displayName: 'Label',
    componentName: 'Label',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Email', importance, htmlFor, ...rest }) => ({
      props: { importance, htmlFor, ...serializableProps(rest) },
      slotText: typeof label === 'string' ? label : 'Email',
    }),
    argTypes: {
      label: { control: 'text' },
      importance: { control: 'select', options: ['primary', 'secondary'] },
      htmlFor: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Label {...(props as unknown as ComponentProps<typeof Label>)}>{slotText ?? 'Email'}</Label>
    ),
  },

  spinner: {
    id: 'spinner',
    displayName: 'Spinner',
    componentName: 'Spinner',
    frameworks: [...ALL],
    mapArgs: ({ size, ...rest }) => ({ props: { size, ...serializableProps(rest) } }),
    argTypes: {
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
    renderReact: (props) => <Spinner {...(props as unknown as ComponentProps<typeof Spinner>)} />,
  },

  input: {
    id: 'input',
    displayName: 'Input',
    componentName: 'Input',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Email', value = '', placeholder, disabled, error, hint, ...rest }) => ({
      props: {
        label,
        value,
        modelValue: value,
        placeholder,
        disabled,
        error,
        hint,
        ...serializableProps(rest),
      },
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      placeholder: { control: 'text' },
      disabled: { control: 'boolean' },
      error: { control: 'text' },
      hint: { control: 'text' },
    },
    renderReact: (props) => <Input {...(props as unknown as ComponentProps<typeof Input>)} />,
  },

  textarea: {
    id: 'textarea',
    displayName: 'Textarea',
    componentName: 'Textarea',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Notes', value = '', rows, disabled, ...rest }) => ({
      props: { label, value, rows, disabled, ...serializableProps(rest) },
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      rows: { control: 'number' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Textarea {...(props as unknown as ComponentProps<typeof Textarea>)} />,
  },

  checkbox: {
    id: 'checkbox',
    displayName: 'Checkbox',
    componentName: 'Checkbox',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Accept terms', checked, disabled, ...rest }) => ({
      props: { label, checked, disabled, ...serializableProps(rest) },
    }),
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Checkbox {...(props as unknown as ComponentProps<typeof Checkbox>)} />,
  },

  radio: {
    id: 'radio',
    displayName: 'Radio',
    componentName: 'Radio',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Option A',
      name = 'demo',
      value = 'a',
      checked,
      disabled,
      ...rest
    }) => ({
      props: { label, name, value, checked, disabled, ...serializableProps(rest) },
    }),
    argTypes: {
      label: { control: 'text' },
      name: { control: 'text' },
      value: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Radio {...(props as unknown as ComponentProps<typeof Radio>)} />,
  },

  switch: {
    id: 'switch',
    displayName: 'Switch',
    componentName: 'Switch',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Notifications', checked, disabled, ...rest }) => ({
      props: { label, checked, disabled, ...serializableProps(rest) },
    }),
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Switch {...(props as unknown as ComponentProps<typeof Switch>)} />,
  },

  select: {
    id: 'select',
    displayName: 'Select',
    componentName: 'Select',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Country',
      value = 'us',
      disabled,
      options = [
        { value: 'us', label: 'United States' },
        { value: 'de', label: 'Germany' },
        { value: 'eg', label: 'Egypt' },
      ],
      ...rest
    }) => ({
      props: { label, value, disabled, options, ...serializableProps(rest) },
    }),
    argTypes: {
      label: { control: 'text' },
      value: { control: 'text' },
      disabled: { control: 'boolean' },
    },
    renderReact: (props) => <Select {...(props as unknown as ComponentProps<typeof Select>)} />,
  },

  progress: {
    id: 'progress',
    displayName: 'Progress',
    componentName: 'Progress',
    frameworks: [...ALL],
    mapArgs: ({ value = 40, max = 100, variant, label, ...rest }) => ({
      props: { value, max, variant, label, ...serializableProps(rest) },
    }),
    argTypes: {
      value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
      max: { control: 'number' },
      variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
      label: { control: 'text' },
    },
    renderReact: (props) => <Progress {...(props as unknown as ComponentProps<typeof Progress>)} />,
  },

  alert: {
    id: 'alert',
    displayName: 'Alert',
    componentName: 'Alert',
    frameworks: [...ALL],
    mapArgs: ({ label, children, variant, title, ...rest }) => ({
      props: { variant, title, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Something went wrong'),
    }),
    argTypes: {
      label: { control: 'text' },
      title: { control: 'text' },
      variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    },
    renderReact: (props, slotText) => (
      <Alert {...(props as unknown as ComponentProps<typeof Alert>)}>{slotText ?? 'Alert'}</Alert>
    ),
  },

  card: {
    id: 'card',
    displayName: 'Card',
    componentName: 'Card',
    frameworks: [...ALL],
    mapArgs: ({ label, children, title, description }) => ({
      props: { title, description },
      slotText: slotFromArgs({ label, children }, 'Card body content'),
    }),
    argTypes: {
      label: { control: 'text' },
      title: { control: 'text' },
      description: { control: 'text' },
    },
    renderReact: (props, slotText) => (
      <Card {...(props as unknown as ComponentProps<typeof Card>)}>{slotText ?? 'Card body'}</Card>
    ),
  },

  skeleton: {
    id: 'skeleton',
    displayName: 'Skeleton',
    componentName: 'Skeleton',
    frameworks: [...ALL],
    mapArgs: ({ width = 200, height, variant, lines, ...rest }) => ({
      props: { width, height, variant, lines, ...serializableProps(rest) },
    }),
    argTypes: {
      width: { control: 'number' },
      height: { control: 'number' },
      variant: { control: 'select', options: ['text', 'circular', 'rectangular'] },
      lines: { control: 'number' },
    },
    renderReact: (props) => <Skeleton {...(props as unknown as ComponentProps<typeof Skeleton>)} />,
  },

  emptyState: {
    id: 'emptyState',
    displayName: 'EmptyState',
    componentName: 'EmptyState',
    frameworks: [...ALL],
    mapArgs: ({
      title = 'No results',
      description = 'Try adjusting your filters.',
      actionLabel,
      state,
      ...rest
    }) => ({
      props: {
        title,
        description,
        actionLabel,
        state,
        ...serializableProps(rest),
      },
    }),
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      actionLabel: { control: 'text' },
      state: { control: 'select', options: ['empty', 'offline', 'unauthorized', 'error'] },
    },
    renderReact: (props) => (
      <EmptyState {...(props as unknown as ComponentProps<typeof EmptyState>)} onAction={() => undefined} />
    ),
  },

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

  chart: {
    id: 'chart',
    displayName: 'Chart',
    componentName: 'Chart',
    frameworks: [...ALL],
    mapArgs: ({
      mark = 'bar',
      title = 'Activity',
      subtitle,
      data = DEFAULT_CHART_DATA,
      showPoints,
      ...rest
    }) => ({
      props: {
        mark,
        title,
        subtitle,
        data,
        showPoints,
        ...serializableProps(rest),
      },
    }),
    argTypes: {
      mark: { control: 'select', options: ['bar', 'line', 'point'] },
      title: { control: 'text' },
      subtitle: { control: 'text' },
      showPoints: { control: 'boolean' },
    },
    renderReact: (props) => <Chart {...(props as unknown as ComponentProps<typeof Chart>)} />,
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

  asyncButton: {
    id: 'asyncButton',
    displayName: 'AsyncButton',
    componentName: 'AsyncButton',
    frameworks: [...ALL],
    mapArgs: ({ label, children, ...rest }) => ({
      props: serializableProps(rest),
      slotText: slotFromArgs({ label, children }, 'Save'),
    }),
    renderReact: (props, slotText) => (
      <AsyncButton {...(props as unknown as ComponentProps<typeof AsyncButton>)}>
        {slotText ?? 'Save'}
      </AsyncButton>
    ),
  },

  typography: {
    id: 'typography',
    displayName: 'Typography',
    componentName: 'Typography',
    frameworks: [...ALL],
    mapArgs: ({ label, children, variant, ...rest }) => ({
      props: { variant, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Typography'),
    }),
    renderReact: (props, slotText) => (
      <Typography {...(props as unknown as ComponentProps<typeof Typography>)}>
        {slotText ?? 'Typography'}
      </Typography>
    ),
  },

  liquidGlass: {
    id: 'liquidGlass',
    displayName: 'LiquidGlass',
    componentName: 'LiquidGlass',
    frameworks: [...ALL],
    mapArgs: ({ label, children, ...rest }) => ({
      props: {
        width: 280,
        height: 120,
        ...serializableProps(rest),
      },
      slotText: slotFromArgs({ label, children }, 'Liquid glass'),
    }),
    renderReact: (props, slotText) => (
      <LiquidGlass
        {...(props as unknown as ComponentProps<typeof LiquidGlass>)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600,
          ...(typeof props.style === 'object' && props.style && !Array.isArray(props.style)
            ? (props.style as object)
            : {}),
        }}
      >
        {slotText}
      </LiquidGlass>
    ),
  },

  liquidGlassButton: {
    id: 'liquidGlassButton',
    displayName: 'LiquidGlassButton',
    componentName: 'LiquidGlassButton',
    frameworks: [...ALL],
    mapArgs: ({ label, children, ...rest }) => ({
      props: serializableProps(rest),
      slotText: slotFromArgs({ label, children }, 'Continue'),
    }),
    renderReact: (props, slotText) => (
      <LiquidGlassButton {...(props as unknown as ComponentProps<typeof LiquidGlassButton>)}>
        {slotText ?? 'Continue'}
      </LiquidGlassButton>
    ),
  },

  liquidGlassSwitch: {
    id: 'liquidGlassSwitch',
    displayName: 'LiquidGlassSwitch',
    componentName: 'LiquidGlassSwitch',
    frameworks: [...ALL],
    mapArgs: ({ checked, defaultChecked = true, ...rest }) => ({
      props: {
        checked: checked ?? defaultChecked,
        defaultChecked,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <LiquidGlassSwitch {...(props as unknown as ComponentProps<typeof LiquidGlassSwitch>)} />
    ),
  },

  liquidGlassCheckbox: {
    id: 'liquidGlassCheckbox',
    displayName: 'LiquidGlassCheckbox',
    componentName: 'LiquidGlassCheckbox',
    frameworks: [...ALL],
    mapArgs: ({ checked, defaultChecked = false, ...rest }) => ({
      props: {
        checked: checked ?? defaultChecked,
        defaultChecked,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <LiquidGlassCheckbox {...(props as unknown as ComponentProps<typeof LiquidGlassCheckbox>)} />
    ),
  },

  liquidGlassProgress: {
    id: 'liquidGlassProgress',
    displayName: 'LiquidGlassProgress',
    componentName: 'LiquidGlassProgress',
    frameworks: [...ALL],
    mapArgs: ({ value = 62, max = 100, ...rest }) => ({
      props: { value, max, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <LiquidGlassProgress {...(props as unknown as ComponentProps<typeof LiquidGlassProgress>)} />
    ),
  },

  liquidGlassRange: {
    id: 'liquidGlassRange',
    displayName: 'LiquidGlassRange',
    componentName: 'LiquidGlassRange',
    frameworks: [...ALL],
    mapArgs: ({ value, defaultValue = 50, ...rest }) => ({
      props: {
        value: value ?? defaultValue,
        defaultValue,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <LiquidGlassRange {...(props as unknown as ComponentProps<typeof LiquidGlassRange>)} />
    ),
  },

  liquidGlassTabBar: {
    id: 'liquidGlassTabBar',
    displayName: 'LiquidGlassTabBar',
    componentName: 'LiquidGlassTabBar',
    frameworks: [...ALL],
    mapArgs: ({ items = DEFAULT_TAB_ITEMS, defaultActiveKey = 'home', ...rest }) => ({
      props: {
        items,
        defaultActiveKey,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <LiquidGlassTabBar {...(props as unknown as ComponentProps<typeof LiquidGlassTabBar>)} />
    ),
  },

  liquidGlassTopBar: {
    id: 'liquidGlassTopBar',
    displayName: 'LiquidGlassTopBar',
    componentName: 'LiquidGlassTopBar',
    frameworks: [...ALL],
    mapArgs: ({
      items = DEFAULT_TAB_ITEMS,
      defaultActiveKey = 'home',
      title = 'laRose',
      ...rest
    }) => ({
      props: {
        items,
        defaultActiveKey,
        title,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <LiquidGlassTopBar {...(props as unknown as ComponentProps<typeof LiquidGlassTopBar>)} />
    ),
  },

  datePicker: {
    id: 'datePicker',
    displayName: 'DatePicker',
    componentName: 'DatePicker',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Start date', value = '2026-08-29', hint, error, ...rest }) => ({
      props: {
        label,
        value,
        modelValue: value,
        hint,
        error,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <DatePicker {...(props as unknown as ComponentProps<typeof DatePicker>)} />
    ),
  },

  timePicker: {
    id: 'timePicker',
    displayName: 'TimePicker',
    componentName: 'TimePicker',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Meeting time', value = '09:30', ...rest }) => ({
      props: { label, value, modelValue: value, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <TimePicker {...(props as unknown as ComponentProps<typeof TimePicker>)} />
    ),
  },

  dateRangePicker: {
    id: 'dateRangePicker',
    displayName: 'DateRangePicker',
    componentName: 'DateRangePicker',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Reporting period',
      value = { startDate: '2026-08-01', endDate: '2026-08-29' },
      hint,
      ...rest
    }) => ({
      props: { label, value, modelValue: value, hint, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <DateRangePicker {...(props as unknown as ComponentProps<typeof DateRangePicker>)} />
    ),
  },

  commandPalette: {
    id: 'commandPalette',
    displayName: 'CommandPalette',
    componentName: 'CommandPalette',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      placeholder = 'Search commands…',
      emptyMessage = 'No commands found',
      ariaLabel = 'Command palette',
      items,
      itemCount,
      showGroups = true,
      ...rest
    }) => {
      const base = (items as typeof DEFAULT_COMMANDS | undefined) ?? DEFAULT_COMMANDS;
      const sliced =
        typeof itemCount === 'number' ? base.slice(0, Math.max(0, itemCount)) : base;
      const withGroups = showGroups
        ? sliced
        : sliced.map(({ group: _group, ...item }) => item);
      return {
        props: {
          open,
          placeholder,
          emptyMessage,
          ariaLabel,
          items: withGroups.map((item) => ({ ...item, onSelect: () => undefined })),
          ...serializableProps(rest),
        },
      };
    },
    renderReact: (props) => (
      <CommandPalette
        {...(props as unknown as ComponentProps<typeof CommandPalette>)}
        onOpenChange={() => undefined}
      />
    ),
  },

  popUpButton: {
    id: 'popUpButton',
    displayName: 'PopUpButton',
    componentName: 'PopUpButton',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Repeat',
      value = 'never',
      options = DEFAULT_POPUP_OPTIONS,
      ...rest
    }) => ({
      props: { label, value, modelValue: value, options, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <PopUpButton {...(props as unknown as ComponentProps<typeof PopUpButton>)} />
    ),
  },

  pullDownButton: {
    id: 'pullDownButton',
    displayName: 'PullDownButton',
    componentName: 'PullDownButton',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Add',
      entries = DEFAULT_PULLDOWN_ENTRIES,
      ...rest
    }) => ({
      props: { label, entries, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <PullDownButton {...(props as unknown as ComponentProps<typeof PullDownButton>)} />
    ),
  },

  fileUpload: {
    id: 'fileUpload',
    displayName: 'FileUpload',
    componentName: 'FileUpload',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Import document',
      hint = 'PDF, Pages, or Numbers',
      buttonLabel,
      ...rest
    }) => ({
      props: { label, hint, buttonLabel, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <FileUpload {...(props as unknown as ComponentProps<typeof FileUpload>)} />
    ),
  },

  textView: {
    id: 'textView',
    displayName: 'TextView',
    componentName: 'TextView',
    frameworks: [...ALL],
    mapArgs: ({
      value = 'Selectable reference text',
      selectable = true,
      editable = false,
      maxHeight = '12rem',
      ...rest
    }) => ({
      props: {
        value,
        modelValue: value,
        selectable,
        editable,
        maxHeight,
        ...serializableProps(rest),
      },
      slotText: typeof value === 'string' ? value : undefined,
    }),
    renderReact: (props) => (
      <TextView {...(props as unknown as ComponentProps<typeof TextView>)} />
    ),
  },

  searchField: {
    id: 'searchField',
    displayName: 'SearchField',
    componentName: 'SearchField',
    frameworks: [...ALL],
    mapArgs: ({ value = '', placeholder, suggestions = [], ...rest }) => ({
      props: {
        value,
        modelValue: value,
        placeholder,
        suggestions,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <SearchField {...(props as unknown as ComponentProps<typeof SearchField>)} />
    ),
  },

  pathControl: {
    id: 'pathControl',
    displayName: 'PathControl',
    componentName: 'PathControl',
    frameworks: [...ALL],
    mapArgs: ({
      segments = DEFAULT_PATH_SEGMENTS,
      selectedId = 'file',
      variant = 'standard',
      ...rest
    }) => ({
      props: {
        segments,
        selectedId,
        modelValue: selectedId,
        variant,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <PathControl {...(props as unknown as ComponentProps<typeof PathControl>)} />
    ),
  },

  imageView: {
    id: 'imageView',
    displayName: 'ImageView',
    componentName: 'ImageView',
    frameworks: [...ALL],
    mapArgs: ({
      src = DEFAULT_SAMPLE_IMAGE,
      alt = 'Sample image',
      fit = 'contain',
      ...rest
    }) => ({
      props: { src, alt, fit, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <div style={{ height: '10rem', width: '16rem' }}>
        <ImageView {...(props as unknown as ComponentProps<typeof ImageView>)} />
      </div>
    ),
  },

  pagination: {
    id: 'pagination',
    displayName: 'Pagination',
    componentName: 'Pagination',
    frameworks: [...ALL],
    mapArgs: ({ page = 1, totalPages = 12, ...rest }) => ({
      props: { page, totalPages, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Pagination
        {...(props as unknown as ComponentProps<typeof Pagination>)}
        onPageChange={() => undefined}
      />
    ),
  },

  breadcrumb: {
    id: 'breadcrumb',
    displayName: 'Breadcrumb',
    componentName: 'Breadcrumb',
    frameworks: [...ALL],
    mapArgs: ({
      items = [
        { label: 'Home', href: '#' },
        { label: 'Employees', href: '#' },
        { label: 'Ahmed', current: true },
      ],
      ...rest
    }) => ({
      props: { items, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Breadcrumb {...(props as unknown as ComponentProps<typeof Breadcrumb>)} />
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

  secureField: {
    id: 'secureField',
    displayName: 'SecureField',
    componentName: 'SecureField',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Password', value = '', ...rest }) => ({
      props: { label, value, modelValue: value, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <SecureField {...(props as unknown as ComponentProps<typeof SecureField>)} />
    ),
  },

  monogram: {
    id: 'monogram',
    displayName: 'Monogram',
    componentName: 'Monogram',
    frameworks: [...ALL],
    mapArgs: ({ name = 'Sara Ali', imageUrl, ...rest }) => ({
      props: { name, imageUrl, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Monogram {...(props as unknown as ComponentProps<typeof Monogram>)} />
    ),
  },

  disclosureTriangle: {
    id: 'disclosureTriangle',
    displayName: 'DisclosureTriangle',
    componentName: 'DisclosureTriangle',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Advanced options', expanded = false, ...rest }) => ({
      props: { label, expanded, defaultExpanded: expanded, ...serializableProps(rest) },
      slotText: 'Hidden details go here.',
    }),
    renderReact: (props, slotText) => (
      <DisclosureTriangle
        {...(props as unknown as ComponentProps<typeof DisclosureTriangle>)}
        onExpandedChange={() => undefined}
      >
        {slotText}
      </DisclosureTriangle>
    ),
  },

  picker: {
    id: 'picker',
    displayName: 'Picker',
    componentName: 'Picker',
    frameworks: [...ALL],
    mapArgs: ({
      label = 'Country',
      columns = DEFAULT_PICKER_COLUMNS,
      value = { country: 'eg' },
      appearance = 'wheels',
      ...rest
    }) => ({
      props: {
        label,
        columns,
        value,
        modelValue: value,
        appearance,
        style: appearance,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <Picker {...(props as unknown as ComponentProps<typeof Picker>)} />
    ),
  },

  menu: {
    id: 'menu',
    displayName: 'Menu',
    componentName: 'Menu',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Actions',
      entries = DEFAULT_MENU_ENTRIES,
      layout = 'large',
      label,
      children,
      ...rest
    }) => ({
      props: {
        open,
        title,
        entries,
        layout,
        ...serializableProps(rest),
      },
      slotText: slotFromArgs({ label, children }, 'Open menu'),
    }),
    renderReact: (props, slotText) => (
      <Menu
        {...(props as unknown as ComponentProps<typeof Menu>)}
        onOpenChange={() => undefined}
      >
        <button type="button">{slotText ?? 'Open menu'}</button>
      </Menu>
    ),
  },

  homeScreenQuickActions: {
    id: 'homeScreenQuickActions',
    displayName: 'HomeScreenQuickActions',
    componentName: 'HomeScreenQuickActions',
    frameworks: [...ALL],
    mapArgs: ({
      appName = 'Mail',
      open = true,
      actions = DEFAULT_QUICK_ACTIONS,
      ...rest
    }) => ({
      props: {
        appName,
        open,
        actions: (actions as { id: string; label: string }[]).map((action) => ({
          ...action,
          onSelect: () => undefined,
        })),
        ...serializableProps(rest),
      },
      slotText: appName.slice(0, 1),
    }),
    renderReact: (props) => (
      <HomeScreenQuickActions
        {...(props as unknown as ComponentProps<typeof HomeScreenQuickActions>)}
      />
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

  toolbar: {
    id: 'toolbar',
    displayName: 'Toolbar',
    componentName: 'Toolbar',
    frameworks: [...ALL],
    mapArgs: ({ title = 'Notes', platform = 'macos', largeTitle = false, ...rest }) => ({
      props: { title, platform, largeTitle, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <Toolbar {...(props as unknown as ComponentProps<typeof Toolbar>)} />
    ),
  },

  dockMenu: {
    id: 'dockMenu',
    displayName: 'DockMenu',
    componentName: 'DockMenu',
    frameworks: [...ALL],
    mapArgs: ({
      appName = 'Safari',
      isRunning = true,
      open = true,
      openWindows = [{ id: '1', title: 'Apple' }],
      ...rest
    }) => ({
      props: {
        appName,
        isRunning,
        open,
        openWindows,
        ...serializableProps(rest),
      },
      slotText: appName.slice(0, 1),
    }),
    renderReact: (props, slotText) => (
      <DockMenu
        {...(props as unknown as ComponentProps<typeof DockMenu>)}
        icon={<span>{slotText ?? 'S'}</span>}
      />
    ),
  },

  dockBar: {
    id: 'dockBar',
    displayName: 'DockBar',
    componentName: 'DockBar',
    frameworks: [...ALL],
    mapArgs: ({ label, children, ...rest }) => ({
      props: serializableProps(rest),
      slotText: slotFromArgs({ label, children }, 'Dock apps'),
    }),
    renderReact: (_props, slotText) => (
      <DockBar>
        <span style={{ padding: '0.5rem 1rem' }}>{slotText}</span>
      </DockBar>
    ),
  },

  contextMenu: {
    id: 'contextMenu',
    displayName: 'ContextMenu',
    componentName: 'ContextMenu',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      title = 'Message',
      entries = DEFAULT_CONTEXT_ENTRIES,
      label,
      children,
      ...rest
    }) => ({
      props: { open, title, entries, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Right-click me'),
    }),
    renderReact: (props, slotText) => (
      <ContextMenu {...(props as unknown as ComponentProps<typeof ContextMenu>)}>
        <button type="button">{slotText ?? 'Right-click me'}</button>
      </ContextMenu>
    ),
  },

  editMenu: {
    id: 'editMenu',
    displayName: 'EditMenu',
    componentName: 'EditMenu',
    frameworks: [...ALL],
    mapArgs: ({
      open = true,
      context = { hasSelection: true, canPaste: true, isEditable: true },
      variant = 'compact',
      label,
      children,
      ...rest
    }) => ({
      props: { open, context, variant, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Selected text'),
    }),
    renderReact: (props, slotText) => (
      <EditMenu {...(props as unknown as ComponentProps<typeof EditMenu>)}>
        <span>{slotText ?? 'Selected text'}</span>
      </EditMenu>
    ),
  },

  ornament: {
    id: 'ornament',
    displayName: 'Ornament',
    componentName: 'Ornament',
    frameworks: [...ALL],
    mapArgs: ({ label, children, ...rest }) => ({
      props: serializableProps(rest),
      slotText: slotFromArgs({ label, children }, 'Now Playing'),
    }),
    renderReact: (_props, slotText) => <Ornament>{slotText ?? 'Now Playing'}</Ornament>,
  },

  outlineView: {
    id: 'outlineView',
    displayName: 'OutlineView',
    componentName: 'OutlineView',
    frameworks: [...ALL],
    mapArgs: ({
      data = DEFAULT_OUTLINE_NODES,
      primaryColumnHeader = 'Name',
      defaultExpandedIds = ['docs'],
      ...rest
    }) => ({
      props: {
        data,
        primaryColumnHeader,
        defaultExpandedIds,
        ...serializableProps(rest),
      },
    }),
    renderReact: (props) => (
      <OutlineView {...(props as unknown as ComponentProps<typeof OutlineView>)} />
    ),
  },

  shareButton: {
    id: 'shareButton',
    displayName: 'ShareButton',
    componentName: 'ShareButton',
    frameworks: [...ALL],
    mapArgs: ({ label = 'Share', ...rest }) => ({
      props: { label, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <ShareButton {...(props as unknown as ComponentProps<typeof ShareButton>)} />
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

  tokenField: {
    id: 'tokenField',
    displayName: 'TokenField',
    componentName: 'TokenField',
    frameworks: [...ALL],
    mapArgs: ({
      value = DEFAULT_TOKENS,
      tokens,
      suggestions = DEFAULT_TOKENS,
      placeholder = 'Add…',
      ...rest
    }) => {
      const resolved = (tokens as typeof DEFAULT_TOKENS | undefined) ?? (value as typeof DEFAULT_TOKENS);
      return {
        props: {
          tokens: resolved,
          value: resolved,
          modelValue: resolved,
          suggestions,
          placeholder,
          ...serializableProps(rest),
        },
      };
    },
    renderReact: (props) => (
      <TokenField {...(props as unknown as ComponentProps<typeof TokenField>)} />
    ),
  },

  menuBar: {
    id: 'menuBar',
    displayName: 'MenuBar',
    componentName: 'MenuBar',
    frameworks: [...ALL],
    mapArgs: ({ appName = 'laRose', revealed = true, platform = 'macos', ...rest }) => ({
      props: { appName, revealed, platform, ...serializableProps(rest) },
    }),
    renderReact: (props) => (
      <MenuBar {...(props as unknown as ComponentProps<typeof MenuBar>)} />
    ),
  },

  box: {
    id: 'box',
    displayName: 'Box',
    componentName: 'Box',
    frameworks: [...ALL],
    mapArgs: ({
      title = 'Export options',
      variant = 'secondary',
      label,
      children,
      ...rest
    }) => ({
      props: { title, variant, ...serializableProps(rest) },
      slotText: slotFromArgs({ label, children }, 'Box content'),
    }),
    renderReact: (props, slotText) => (
      <Box {...(props as unknown as ComponentProps<typeof Box>)}>{slotText ?? 'Box content'}</Box>
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
};

export function getCrossFrameworkDefinition(
  id: string | undefined,
): CrossFrameworkComponentDefinition | undefined {
  if (!id) return undefined;
  return crossFrameworkRegistry[id];
}
